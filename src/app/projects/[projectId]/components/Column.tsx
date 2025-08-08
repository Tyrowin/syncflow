"use client";
import React from "react";
import { ColumnData } from "./types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnData;
}

export function Column({ column }: ColumnProps) {
  return (
    <section
      data-testid="column"
      aria-label={`Column ${column.name}`}
      className="w-72 flex-shrink-0 space-y-3"
    >
      <h3 className="font-semibold text-sm tracking-wide px-1" role="heading" aria-level={3}>
        {column.name}
      </h3>
      <ul className="space-y-3" role="list">
        {column.tasks.map((t) => (
          <li key={t.id} role="listitem">
            <TaskCard task={t} />
          </li>
        ))}
        {column.tasks.length === 0 && (
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
      </ul>
    </section>
  );
}
