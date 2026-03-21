import React from "react";
import ProjectCard from "@/app/components/supported_projects/ProjectCard";
import type { ProjectDefinition } from "@/app/components/supported_projects/ProjectDefinitions";

export default function ProjectList({ projects }: { projects: ProjectDefinition[] }) {
    return (
        <section className="w-full">
            <div className="flex flex-col gap-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}
