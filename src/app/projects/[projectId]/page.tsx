import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectBoard } from "./components/ProjectBoard";

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
    <main className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Project {projectId}</h1>
        <p className="text-xs opacity-70">(Mock board phase)</p>
      </header>
      <ProjectBoard />
    </main>
  );
}
