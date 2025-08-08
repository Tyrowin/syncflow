import { Metadata } from "next";
import { notFound } from "next/navigation";

interface RouteParams {
  projectId: string;
}

interface ProjectPageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  return { title: `Project ${projectId} | SyncFlow` };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  if (!projectId) notFound();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Project Placeholder</h1>
      <p className="text-sm opacity-80">Project ID: {projectId}</p>
      <div className="alert alert-info max-w-md">
        This route is ready. Next step: render Kanban board.
      </div>
    </main>
  );
}
