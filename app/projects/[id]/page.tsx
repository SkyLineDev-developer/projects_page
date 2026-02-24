import { projects } from "@/lib/projects.data";
import { notFound } from "next/navigation";
import ProjectPageClient from "@/components/ProjectPageClient";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return <ProjectPageClient project={project} />;
}