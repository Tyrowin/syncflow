import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

// Query: columns by project ordered.
export const columnsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db
      .query("columns")
      .withIndex("by_project_order", (q) => q.eq("projectId", projectId))
      .order("asc")
      .collect();
  },
});

async function nextColumnOrder(ctx: MutationCtx, projectId: Id<"projects">) {
  const last = await ctx.db
    .query("columns")
    .withIndex("by_project_order", (q) => q.eq("projectId", projectId))
    .order("desc")
    .first();
  return last ? last.order + 1 : 0;
}

export const createColumn = mutation({
  args: { projectId: v.id("projects"), name: v.string() },
  handler: async (ctx, { projectId, name }) => {
    const order = await nextColumnOrder(ctx, projectId);
    return ctx.db.insert("columns", { projectId, name, order });
  },
});

export const updateColumn = mutation({
  args: { columnId: v.id("columns"), name: v.optional(v.string()) },
  handler: async (ctx, { columnId, name }) => {
    const col = await ctx.db.get(columnId);
    if (!col) throw new Error("Column not found");
    await ctx.db.patch(columnId, { ...(name !== undefined ? { name } : {}) });
  },
});

// Move/reorder column within project.
export const moveColumn = mutation({
  args: {
    columnId: v.id("columns"),
    targetProjectId: v.id("projects"),
    targetOrder: v.optional(v.number()),
  },
  handler: async (ctx, { columnId, targetProjectId, targetOrder }) => {
    const col = await ctx.db.get(columnId);
    if (!col) throw new Error("Column not found");
    const sameProject = col.projectId === targetProjectId;

    const existing = await ctx.db
      .query("columns")
      .withIndex("by_project_order", (q) => q.eq("projectId", targetProjectId))
      .order("asc")
      .collect();
    const filtered = existing.filter((c) => c._id !== columnId);

    let insertIndex = targetOrder ?? filtered.length;
    if (insertIndex < 0) insertIndex = 0;
    if (insertIndex > filtered.length) insertIndex = filtered.length;

    filtered.splice(insertIndex, 0, { ...col, projectId: targetProjectId, _id: columnId });

    for (let i = 0; i < filtered.length; i++) {
      const c = filtered[i];
      if (c.order !== i || c.projectId !== targetProjectId) {
        await ctx.db.patch(c._id, { order: i, projectId: targetProjectId });
      }
    }

    if (!sameProject) {
      // Re-normalize source project columns.
      const sourceCols = await ctx.db
        .query("columns")
        .withIndex("by_project_order", (q) => q.eq("projectId", col.projectId))
        .order("asc")
        .collect();
      for (let i = 0; i < sourceCols.length; i++) {
        if (sourceCols[i].order !== i) {
          await ctx.db.patch(sourceCols[i]._id, { order: i });
        }
      }
    }
  },
});
