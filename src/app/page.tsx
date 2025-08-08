import { ProjectAccess } from "./ProjectAccess";

export default function Home() {
  return (
    <main className="p-8 space-y-10 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">SyncFlow</h1>
        <p className="text-sm opacity-70 max-w-prose">
          Real-time, type-safe Kanban board prototype. Phase 3 mock UI in place; next we will
          connect live Convex data and add drag-and-drop.
        </p>
      </header>
      <section className="flex flex-col md:flex-row gap-8 items-start">
        <ProjectAccess />
        <div className="space-y-4 max-w-sm">
          <h2 className="text-lg font-semibold">Current Status</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Mock board & components built</li>
            <li>Accessible semantic markup</li>
            <li>Tests passing (Bun + RTL)</li>
            <li>Next step: real Convex data</li>
          </ul>
          <div className="alert alert-info text-xs leading-relaxed">
            Enter any string or click the demo button to view the mock board.
          </div>
        </div>
      </section>
    </main>
  );
}
