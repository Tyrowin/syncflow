"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectAccess() {
  const [projectId, setProjectId] = useState("");
  const router = useRouter();

  function go() {
    if (!projectId.trim()) return;
    router.push(`/projects/${encodeURIComponent(projectId.trim())}`);
  }

  function useDemo() {
    router.push("/projects/demo-project");
  }

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm w-full max-w-md">
      <div className="card-body space-y-4">
        <h2 className="card-title text-lg">Open a Project</h2>
        <p className="text-sm opacity-70">
          Enter an existing project ID (mock for now) or jump into a demo.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="project-id"
            className="input input-bordered input-sm flex-1"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            aria-label="Project ID"
          />
          <button className="btn btn-sm btn-primary" onClick={go} disabled={!projectId.trim()}>
            Go
          </button>
        </div>
        <div className="divider my-1">or</div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={useDemo}
          aria-label="Open demo project"
        >
          Use Demo Project
        </button>
      </div>
    </div>
  );
}
