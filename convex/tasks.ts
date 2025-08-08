import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// Query: fetch tasks by columnId ordered by `order` asc.
export const tasksByColumn = query({
  args: { columnId: v.id("columns") },
  handler: async (ctx, { columnId }) => {
    return ctx.db
      .query("tasks")
      .withIndex("by_column_order", (q) => q.eq("columnId", columnId))
      .order("asc")
      .collect();
  },
});

// Helper to compute next order value within a column.
async function nextTaskOrder(
  ctx: QueryCtx | MutationCtx,
  columnId: Id<"columns">,
): Promise<number> {
  const last = await ctx.db
    .query("tasks")
    .withIndex("by_column_order", (q) => q.eq("columnId", columnId))
    .order("desc")
    .first();
  return last ? last.order + 1 : 0;
}

// Mutation: create task.
export const createTask = mutation({
  args: {
    columnId: v.id("columns"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { columnId, title, description }) => {
    const order = await nextTaskOrder(ctx, columnId);
    const id = await ctx.db.insert("tasks", { columnId, title, description, order });
    return id;
  },
});

// Mutation: update task (title, description)
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { taskId, title, description }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(taskId, {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    });
  },
});

// Helper: reorder tasks in a column after inserting/moving.
// (MutationCtx & QueryCtx imported above)

async function reorderColumn(ctx: MutationCtx, columnId: Id<"columns">) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_column_order", (q) => q.eq("columnId", columnId))
    .order("asc")
    .collect();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].order !== i) {
      await ctx.db.patch(tasks[i]._id, { order: i });
    }
  }
}

// Mutation: move task (update columnId and order). Supports reordering within or across columns.
// If targetOrder omitted, appends to end of target column. Re-normalizes order values to keep them dense.
export const moveTask = mutation({
  args: {
    taskId: v.id("tasks"),
    targetColumnId: v.id("columns"),
    targetOrder: v.optional(v.number()),
  },
  handler: async (ctx, { taskId, targetColumnId, targetOrder }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    const sameColumn = task.columnId === targetColumnId;

    // Collect tasks in target column excluding the moving task (if same column)
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_column_order", (q) => q.eq("columnId", targetColumnId))
      .order("asc")
      .collect();
    const filtered = existing.filter((t) => t._id !== taskId);

    let insertIndex = targetOrder ?? filtered.length; // append if undefined
    if (insertIndex < 0) insertIndex = 0;
    if (insertIndex > filtered.length) insertIndex = filtered.length;

    // Insert a lightweight representation of the task at position.
    filtered.splice(insertIndex, 0, {
      ...task,
      columnId: targetColumnId,
      _id: taskId,
    });

    // Apply sequential order values.
    for (let i = 0; i < filtered.length; i++) {
      const t = filtered[i];
      const needsUpdate = t.order !== i || t.columnId !== targetColumnId;
      if (needsUpdate) {
        await ctx.db.patch(t._id, { order: i, columnId: targetColumnId });
      }
    }

    // If moved across columns, re-normalize original column.
    if (!sameColumn) {
      await reorderColumn(ctx, task.columnId as Id<"columns">);
    }
  },
});
