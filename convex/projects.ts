import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    // Could add pagination later.
    return ctx.db.query("projects").collect();
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db.get(projectId);
  },
});

export const createProject = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return ctx.db.insert("projects", { name });
  },
});

export const updateProject = mutation({
  args: { projectId: v.id("projects"), name: v.optional(v.string()) },
  handler: async (ctx, { projectId, name }) => {
    const project = await ctx.db.get(projectId);
    if (!project) throw new Error("Project not found");
    await ctx.db.patch(projectId, { ...(name !== undefined ? { name } : {}) });
  },
});
