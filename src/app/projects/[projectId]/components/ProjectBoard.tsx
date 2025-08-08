"use client";
import React, { useState } from "react";
import { Column } from "./Column";
import { ColumnData, Task } from "./types";
import { mockColumns } from "./mockData";

export function ProjectBoard() {
  const [columns, setColumns] = useState<ColumnData[]>(mockColumns);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  function openModal(columnId: string) {
    setTargetColumnId(columnId);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setNewTaskTitle("");
    setTargetColumnId(null);
  }

  function addTask() {
    if (!newTaskTitle.trim() || !targetColumnId) return;
    setColumns((prev) =>
      prev.map((c) =>
        c.id === targetColumnId
          ? {
              ...c,
              tasks: [
                ...c.tasks,
                {
                  id: `temp-${Date.now()}`,
                  title: newTaskTitle.trim(),
                  order: c.tasks.length,
                  columnId: c.id,
                } as Task,
              ],
            }
          : c,
      ),
    );
    closeModal();
  }

  return (
    <section
      className="flex flex-col gap-4"
      data-testid="project-board"
      aria-label="Project board mock data"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold" role="heading" aria-level={2}>
          Board
        </h2>
        <span className="badge badge-neutral badge-sm" aria-label="Mock data indicator">
          Mock
        </span>
      </div>
      <div className="overflow-x-auto pb-4" role="region" aria-label="Columns">
        <div className="flex gap-4 min-h-[300px]" role="list" aria-label="Column list">
          {columns
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((col) => (
              <div key={col.id} className="flex flex-col" role="listitem">
                <Column column={col} />
                <button
                  type="button"
                  className="btn btn-xs mt-2"
                  data-testid="add-task-btn"
                  onClick={() => openModal(col.id)}
                  aria-label={`Add task to ${col.name}`}
                >
                  + Task
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog open className="modal" data-testid="add-task-modal">
          <div className="modal-box space-y-4">
            <h3 className="font-semibold text-sm">Add Task</h3>
            <input
              autoFocus
              type="text"
              placeholder="Title"
              className="input input-bordered w-full"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
              >
                Add
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}
    </section>
  );
}
