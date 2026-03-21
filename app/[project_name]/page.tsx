import { listProjectNames, loadProjectBodyMarkdown, loadProjectChangelog, loadProjectMeta } from "../api/projects/projectContent";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaGithub } from "react-icons/fa";
import { SiCurseforge, SiModrinth } from "react-icons/si";

import ProjectTabs from "./ProjectTabs";

type PageProps = {
    params: Promise<{ project_name: string }>;
};

export async function generateStaticParams() {
    const projectNames = await listProjectNames();
    return projectNames.map((project_name) => ({ project_name }));
}

export default async function ProjectPage(props: PageProps) {
    const { project_name } = await props.params;

    const knownProjects = await listProjectNames();
    if (!knownProjects.includes(project_name)) {
        notFound();
    }

    const meta = await loadProjectMeta(project_name);
    const bodyMarkdown = await loadProjectBodyMarkdown(project_name);
    const preloadedChangelog = await loadProjectChangelog(project_name);

    const title = meta?.name ?? project_name;

    const downloadButtonStyle = (name: string) => {
        const lowered = name.toLowerCase();

        if (lowered.includes("curseforge")) {
            return {
                className: "bg-[#f16436] text-white hover:opacity-90",
                icon: <SiCurseforge className="h-4 w-4" />,
            };
        }

        if (lowered.includes("modrinth")) {
            return {
                className: "bg-[#1bd96a] text-black hover:opacity-90",
                icon: <SiModrinth className="h-4 w-4" />,
            };
        }

        if (lowered.includes("github")) {
            return {
                className: "bg-foreground text-background hover:opacity-90",
                icon: <FaGithub className="h-4 w-4" />,
            };
        }

        return {
            className: "bg-foreground text-background hover:opacity-90",
            icon: null as React.ReactNode,
        };
    };

    const overview = (
        <div className="ring-1 ring-foreground/10 rounded-lg p-4 bg-background">
            {bodyMarkdown ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }: { children?: React.ReactNode }) => (
                            <h1 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h1>
                        ),
                        h2: ({ children }: { children?: React.ReactNode }) => (
                            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">{children}</h2>
                        ),
                        h3: ({ children }: { children?: React.ReactNode }) => (
                            <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">{children}</h3>
                        ),
                        p: ({ children }: { children?: React.ReactNode }) => (
                            <p className="text-sm leading-6 text-foreground/90 my-3">{children}</p>
                        ),
                        a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
                            <a
                                href={href}
                                className="text-foreground/80 hover:text-foreground underline underline-offset-4"
                            >
                                {children}
                            </a>
                        ),
                        ul: ({ children }: { children?: React.ReactNode }) => (
                            <ul className="list-disc pl-6 my-3 text-sm text-foreground/90">{children}</ul>
                        ),
                        ol: ({ children }: { children?: React.ReactNode }) => (
                            <ol className="list-decimal pl-6 my-3 text-sm text-foreground/90">{children}</ol>
                        ),
                        li: ({ children }: { children?: React.ReactNode }) => <li className="my-1">{children}</li>,
                        code: ({ children }: { children?: React.ReactNode }) => (
                            <code className="px-1 py-0.5 rounded bg-foreground/10 text-foreground text-[0.85em]">
                                {children}
                            </code>
                        ),
                        pre: ({ children }: { children?: React.ReactNode }) => (
                            <pre className="overflow-x-auto p-3 rounded-lg ring-1 ring-foreground/10 bg-background my-4 text-sm">
                                {children}
                            </pre>
                        ),
                        table: ({ children }: { children?: React.ReactNode }) => (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border border-foreground/10 text-sm">{children}</table>
                            </div>
                        ),
                        thead: ({ children }: { children?: React.ReactNode }) => (
                            <thead className="bg-foreground/5">{children}</thead>
                        ),
                        th: ({ children }: { children?: React.ReactNode }) => (
                            <th className="text-left px-3 py-2 border-b border-foreground/10 text-foreground">
                                {children}
                            </th>
                        ),
                        td: ({ children }: { children?: React.ReactNode }) => (
                            <td className="px-3 py-2 border-b border-foreground/10 text-foreground/90">{children}</td>
                        ),
                        blockquote: ({ children }: { children?: React.ReactNode }) => (
                            <blockquote className="border-l-2 border-foreground/20 pl-4 my-4 text-foreground/80">
                                {children}
                            </blockquote>
                        ),
                    }}
                >
                    {bodyMarkdown}
                </ReactMarkdown>
            ) : (
                <p className="text-sm text-foreground/70">No project page content found.</p>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6 ring-1 ring-foreground/10 rounded-xl p-5 bg-background">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                        {meta?.summary ? <p className="mt-2 text-foreground/70">{meta.summary}</p> : null}

                        {meta?.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {meta.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-1 rounded-md ring-1 ring-foreground/15 text-foreground/80"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                        {meta?.links?.map((link) => (
                            <a
                                key={`link:${link.name}:${link.href}`}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium rounded-lg ring-1 ring-foreground/15 text-foreground/80 hover:text-foreground"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="min-w-0">
                    <ProjectTabs
                        projectName={project_name}
                        overview={overview}
                        initialChangelog={preloadedChangelog ?? undefined}
                    />
                </div>

                <aside className="space-y-4">
                    <div className="ring-1 ring-foreground/10 rounded-lg p-4 bg-background">
                        <h2 className="text-sm font-semibold text-foreground mb-3">Project info</h2>

                        <div className="space-y-2 text-sm">
                            {meta?.versions?.latest ? (
                                <div className="flex justify-between gap-3">
                                    <span className="text-foreground/70">Latest</span>
                                    <span className="text-foreground font-mono">{meta.versions.latest}</span>
                                </div>
                            ) : null}

                            {meta?.versions?.minecraft ? (
                                <div className="flex justify-between gap-3">
                                    <span className="text-foreground/70">Minecraft</span>
                                    <span className="text-foreground font-mono">{meta.versions.minecraft}</span>
                                </div>
                            ) : null}

                            {meta?.versions?.loader ? (
                                <div className="flex justify-between gap-3">
                                    <span className="text-foreground/70">Loader</span>
                                    <span className="text-foreground font-mono">{meta.versions.loader}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {meta?.dependencies?.length ? (
                        <div className="ring-1 ring-foreground/10 rounded-lg p-4 bg-background">
                            <h2 className="text-sm font-semibold text-foreground mb-3">Dependencies</h2>
                            <div className="space-y-2">
                                {meta.dependencies.map((dep) => (
                                    <div key={dep.name} className="flex justify-between gap-3 text-sm">
                                        <span className="text-foreground/80">{dep.name}</span>
                                        <span className="text-foreground/70 font-mono">{dep.version ?? ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {meta?.downloadLinks?.length ? (
                        <div className="ring-1 ring-foreground/10 rounded-lg p-4 bg-background">
                            <h2 className="text-sm font-semibold text-foreground mb-3">Downloads</h2>
                            <div className="flex flex-col gap-2">
                                {meta.downloadLinks.map((link) => {
                                    const style = downloadButtonStyle(link.name);

                                    return (
                                        <a
                                            key={`download:${link.name}:${link.href}`}
                                            href={link.href}
                                            className={
                                                "w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg " +
                                                style.className
                                            }
                                        >
                                            {style.icon}
                                            <span>{link.name}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </aside>
            </div>
        </div>
    );
}
