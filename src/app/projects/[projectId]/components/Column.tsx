"use client";
import React, { useState } from "react";
import { TaskCard } from "./TaskCard";
import { useMutation, useQuery } from "convex/react";
import { api, type Id, type Doc } from "@/convex";

export interface ColumnProps {
  columnId: Id<"columns"> | string; // Accept raw Id or serialized string
  name: string;
  testTasks?: Array<{
    _id: string;
    title: string;
    description?: string;
    order: number;
    columnId: string;
  }>;
}

export function Column({ columnId, name, testTasks }: ColumnProps) {
  if (testTasks !== undefined) {
    return (
      <section
        data-testid="column"
        aria-label={`Column ${name}`}
        className="w-72 flex-shrink-0 space-y-3"
      >
        <h3 className="font-semibold text-sm tracking-wide px-1" role="heading" aria-level={3}>
          {name}
        </h3>
        <ul className="space-y-3" role="list">
          {testTasks.length === 0 && (
            <li>
              <div
                className="text-xs italic opacity-60 px-1 py-2"
                data-testid="empty-column"
                aria-label="No tasks"
              >
                No tasks
              </div>
            </li>
          )}
          {testTasks.map((t) => (
            <li key={t._id} role="listitem">
              <TaskCard
                task={{
                  id: t._id,
                  title: t.title,
                  description: t.description,
                  order: t.order,
                  columnId: t.columnId,
                }}
              />
            </li>
          ))}
          <li>
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              aria-label={`Add task to ${name}`}
            >
              + Add Task
            </button>
          </li>
        </ul>
      </section>
    );
  }

  return <ColumnLive columnId={columnId as Id<"columns">} name={name} />;
}

function ColumnLive({ columnId, name }: { columnId: Id<"columns">; name: string }) {
  // Live tasks via Convex
  const tasks = useQuery(api.tasks.tasksByColumn, { columnId });
  const isLoading = tasks === undefined;
  const isEmpty = !isLoading && tasks && tasks.length === 0;

  // Create task UI
  const createTask = useMutation(api.tasks.createTask);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function onAddTask() {
    const title = newTitle.trim();
    if (!title) return;
    try {
      await createTask({ columnId, title });
      setNewTitle("");
      setAdding(false);
    } catch {
      // no-op for now; could add toast
    }
  }

  return (
    <section
      data-testid="column"
      aria-label={`Column ${name}`}
      className="w-72 flex-shrink-0 space-y-3"
    >
      <h3 className="font-semibold text-sm tracking-wide px-1" role="heading" aria-level={3}>
        {name}
      </h3>
      <ul className="space-y-3" role="list">
        {isLoading && (
          <li className="text-xs opacity-60" data-testid="loading-tasks">
            <span className="loading loading-spinner loading-xs" aria-hidden /> Loading...
          </li>
        )}
        {isEmpty && (
          <li>
            <div
              className="text-xs italic opacity-60 px-1 py-2"
              data-testid="empty-column"
              aria-label="No tasks"
            >
              No tasks
            </div>
          </li>
        )}
        {!isLoading &&
          !isEmpty &&
          tasks!.map((t: Doc<"tasks">) => (
            <li key={t._id} role="listitem">
              <TaskCard
                task={{
                  id: t._id,
                  title: t.title,
                  description: t.description,
                  order: t.order,
                  columnId: t.columnId as unknown as string,
                }}
              />
            </li>
          ))}
        {/* Add task inline form */}
        <li>
          {adding ? (
            <div className="flex items-center gap-2 px-1">
              <input
                className="input input-bordered input-xs w-full"
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                data-testid="new-task-input"
              />
              <button
                type="button"
                className="btn btn-primary btn-xs"
                onClick={onAddTask}
                disabled={!newTitle.trim()}
                data-testid="add-task-confirm"
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => {
                  setAdding(false);
                  setNewTitle("");
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setAdding(true)}
              aria-label={`Add task to ${name}`}
            >
              + Add Task
            </button>
          )}
        </li>
      </ul>
    </section>
  );
}
