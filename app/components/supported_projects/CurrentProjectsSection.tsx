import React from "react";
import ProjectList from "@/app/components/supported_projects/ProjectList";
import { loadProjectDefinitionsFromContent } from "@/app/components/supported_projects/loadProjectDefinitions";

export default async function CurrentProjectsSection() {
    const projects = await loadProjectDefinitionsFromContent();

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground">Current Projects</h2>
                <p className="text-sm text-foreground/70">
                    A centralized list of what I’m actively building and maintaining.
                </p>
            </div>

            <ProjectList projects={projects} />
        </div>
    );
}
