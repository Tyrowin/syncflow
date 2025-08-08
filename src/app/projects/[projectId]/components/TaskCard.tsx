"use client";
import { Task } from "./types";
import React from "react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article
      data-testid="task-card"
      aria-label={`Task: ${task.title}`}
      className="card bg-base-100 shadow-sm border border-base-200"
    >
      <div className="card-body p-4">
        <h4 className="card-title text-sm font-semibold leading-snug" role="heading" aria-level={4}>
          {task.title}
        </h4>
        {task.description && (
          <p
            className="text-xs opacity-70 line-clamp-3 whitespace-pre-wrap"
            aria-label="Description"
          >
            {task.description}
          </p>
        )}
      </div>
    </article>
  );
}
