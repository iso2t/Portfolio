import React from "react";
import ProjectTagPill from "@/app/components/supported_projects/ProjectTagPill";
import type { ProjectDefinition, ProjectLink, ProjectTags } from "@/app/components/supported_projects/ProjectDefinitions";
import Image from "next/image";
import Link from "next/link";

function ProjectIcon({ project }: { project: ProjectDefinition }) {
    const image = project.image?.[0];

    if (image) {
        return (
            <Image
                src={image.src}
                alt={image.alt}
                className="h-14 w-14 rounded-lg object-cover ring-1 ring-foreground/10"
            />
        );
    }

    return (
        <div className="h-14 w-14 rounded-lg bg-foreground/5 ring-1 ring-foreground/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-foreground/70">
                {project.name.slice(0, 1).toUpperCase()}
            </span>
        </div>
    );
}

function PrimaryLink({ project }: { project: ProjectDefinition }) {
    return (
        <Link
            href={`/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-3 py-1.5 text-sm font-semibold hover:opacity-90"
        >
            <span>View</span>
        </Link>
    );
}

function SmallLinkButton({ link }: { link: ProjectLink }) {
    const Icon = link.icon;

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-foreground/80 hover:bg-foreground/5 ring-1 ring-foreground/10"
            aria-label={link.name}
            title={link.name}
        >
            <Icon className="text-base" />
            <span className="hidden sm:inline">{link.name}</span>
        </a>
    );
}

function VersionBadge({ label, value }: { label: string; value?: string }) {
    if (!value) return null;

    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-foreground/5 px-2 py-0.5 text-xs text-foreground/80 ring-1 ring-foreground/10">
            <span className="opacity-70">{label}</span>
            <span className="font-semibold">{value}</span>
        </span>
    );
}

function formatTag(tag: ProjectTags) {
    return tag
        .toLowerCase()
        .split("_")
        .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function ProjectCard({ project }: { project: ProjectDefinition }) {
    const firstVersion = project.versions?.[0];

    return (
        <article
            className="w-full rounded-xl ring-1 ring-foreground/10 bg-background/60 hover:bg-background/80 transition-colors"
        >
            <div className="p-4 flex flex-col gap-3">
                <div className="flex gap-4">
                    <ProjectIcon project={project} />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-foreground truncate">{project.name}</h3>
                                <p className="text-sm text-foreground/70 overflow-hidden text-ellipsis" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {project.description}
                                </p>
                            </div>

                            <div className="shrink-0">
                                <PrimaryLink project={project} />
                            </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {project.tags.map((t) => (
                                <ProjectTagPill key={t} label={formatTag(t)} />
                            ))}
                            <div className="flex-1" />
                            <VersionBadge label="Latest" value={firstVersion?.latest} />
                            <VersionBadge label="Rec" value={firstVersion?.recommended} />
                            <VersionBadge label="Beta" value={firstVersion?.beta} />
                            <VersionBadge label="Nightly" value={firstVersion?.nightly} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-xs text-foreground/60">
                        <span className="font-semibold">Dependencies:</span> {project.dependencies.length}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:flex-1">
                        {project.links.map((link) => (
                            <SmallLinkButton key={link.href} link={link} />
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
