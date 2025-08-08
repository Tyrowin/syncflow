"use client";
import React from "react";
import { Column } from "./Column";
import { useMutation, useQuery } from "convex/react";
import { api, type Id } from "@/convex";

interface ProjectBoardProps {
  projectId: string; // route param; we'll cast to Id<"projects">
  testColumns?: Array<{
    _id: Id<"columns"> | string;
    _creationTime?: number;
    name: string;
    order: number;
    projectId: Id<"projects"> | string;
  }>; // optional injection for tests
  testTasksByColumn?: Record<
    string,
    Array<{ _id: string; title: string; description?: string; order: number; columnId: string }>
  >;
}

// Type of a column document returned by columnsByProject query.
type ColumnRecord = {
  _id: Id<"columns"> | string;
  _creationTime: number;
  name: string;
  order: number;
  projectId: Id<"projects"> | string;
};

export function ProjectBoard({ projectId, testColumns, testTasksByColumn }: ProjectBoardProps) {
  if (testColumns !== undefined) {
    const columns: ColumnRecord[] = testColumns.map((c) => ({
      _id: c._id,
      _creationTime:
        typeof (c as { _creationTime?: number })._creationTime === "number"
          ? (c as { _creationTime?: number })._creationTime!
          : Date.now(),
      name: c.name,
      order: c.order,
      projectId: c.projectId,
    }));
    return (
      <BoardShell
        titleBadge="Live"
        columns={columns}
        renderColumn={(col) => (
          <Column
            columnId={col._id}
            name={col.name}
            testTasks={testTasksByColumn?.[String(col._id)] ?? []}
          />
        )}
        addingControls={
          <button className="btn btn-outline btn-sm" data-testid="add-column-btn">
            + Add Column
          </button>
        }
      />
    );
  }

  return <ProjectBoardLive projectId={projectId as Id<"projects">} />;
}

function ProjectBoardLive({ projectId }: { projectId: Id<"projects"> }) {
  const liveColumns = useQuery(api.columns.columnsByProject, { projectId });
  const columns = liveColumns as unknown as ColumnRecord[] | undefined;
  const createColumn = useMutation(api.columns.createColumn);
  const [newCol, setNewCol] = React.useState("");
  const [addingCol, setAddingCol] = React.useState(false);
  async function onAddColumn() {
    const name = newCol.trim();
    if (!name) return;
    try {
      await createColumn({ projectId, name });
      setNewCol("");
      setAddingCol(false);
    } catch {
      // no-op
    }
  }

  const isLoading = columns === undefined;
  const isEmpty = !isLoading && columns && columns.length === 0;

  return (
    <section className="flex flex-col gap-4" data-testid="project-board" aria-label="Project board">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold" role="heading" aria-level={2}>
          Board
        </h2>
        <span className="badge badge-primary badge-sm" aria-label="Live data indicator">
          Live
        </span>
      </div>
      <div className="overflow-x-auto pb-4" role="region" aria-label="Columns">
        <div className="mb-2">
          {addingCol ? (
            <div className="flex items-center gap-2">
              <input
                className="input input-bordered input-sm"
                placeholder="Column name"
                value={newCol}
                onChange={(e) => setNewCol(e.target.value)}
                data-testid="new-column-input"
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={onAddColumn}
                disabled={!newCol.trim()}
                data-testid="add-column-confirm"
              >
                Add Column
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setAddingCol(false);
                  setNewCol("");
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setAddingCol(true)}
              data-testid="add-column-btn"
            >
              + Add Column
            </button>
          )}
        </div>
        <div className="flex gap-4 min-h-[300px]" role="list" aria-label="Column list">
          {isLoading && (
            <div
              className="flex items-center gap-2 text-sm opacity-70"
              data-testid="loading-columns"
            >
              <span className="loading loading-spinner loading-sm" aria-hidden /> Loading columns...
            </div>
          )}
          {isEmpty && (
            <div className="italic text-sm opacity-60" data-testid="empty-board">
              No columns yet.
            </div>
          )}
          {!isLoading &&
            !isEmpty &&
            columns!.map((col: ColumnRecord) => (
              <div key={col._id} className="flex flex-col" role="listitem">
                <Column columnId={col._id} name={col.name} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function BoardShell({
  titleBadge,
  columns,
  renderColumn,
  addingControls,
}: {
  titleBadge?: string;
  columns: ColumnRecord[];
  renderColumn: (c: ColumnRecord) => React.ReactNode;
  addingControls?: React.ReactNode;
}) {
  const isLoading = false;
  const isEmpty = columns.length === 0;
  return (
    <section className="flex flex-col gap-4" data-testid="project-board" aria-label="Project board">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold" role="heading" aria-level={2}>
          Board
        </h2>
        {titleBadge && (
          <span className="badge badge-primary badge-sm" aria-label="Live data indicator">
            {titleBadge}
          </span>
        )}
      </div>
      <div className="overflow-x-auto pb-4" role="region" aria-label="Columns">
        <div className="mb-2">{addingControls}</div>
        <div className="flex gap-4 min-h-[300px]" role="list" aria-label="Column list">
          {isLoading && (
            <div
              className="flex items-center gap-2 text-sm opacity-70"
              data-testid="loading-columns"
            >
              <span className="loading loading-spinner loading-sm" aria-hidden /> Loading columns...
            </div>
          )}
          {isEmpty && (
            <div className="italic text-sm opacity-60" data-testid="empty-board">
              No columns yet.
            </div>
          )}
          {!isEmpty &&
            columns.map((col) => (
              <div key={col._id} className="flex flex-col" role="listitem">
                {renderColumn(col)}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
