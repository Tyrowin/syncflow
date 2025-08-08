import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Schema for SyncFlow Kanban board.
// Task 2.1: projects, columns, tasks.
// Notes:
// - We include ordering fields (order) to allow deterministic sorting.
// - Indexes support common query patterns (by project, by column, by ordering within parent).
export default defineSchema({
  projects: defineTable({
    name: v.string(),
  })
    // Future: maybe add ownerId / createdBy, etc.
    .index("by_name", ["name"]),

  columns: defineTable({
    name: v.string(),
    projectId: v.id("projects"),
    order: v.number(),
  })
    .index("by_project", ["projectId"]) // fetch columns for a project
    .index("by_project_order", ["projectId", "order"]), // ordered columns

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    columnId: v.id("columns"),
    order: v.number(),
  })
    .index("by_column", ["columnId"]) // fetch tasks for a column
    .index("by_column_order", ["columnId", "order"]), // ordered tasks per column
});
