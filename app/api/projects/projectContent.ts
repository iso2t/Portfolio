import { promises as filesystem } from "fs";
import path from "path";

export function isSafeProjectName(projectName: string): boolean {
    return /^[a-z0-9._-]+$/i.test(projectName);
}

export type ProjectChangelog = unknown;

export type ProjectLink = { name: string; href: string };

export type ProjectDependency = {
    name: string;
    version?: string;
};

export type ProjectVersionInfo = {
    latest?: string;
    recommended?: string;
    beta?: string;
    nightly?: string;
    all?: string[];
    minecraft?: string;
    loader?: string;
};

export type ProjectMeta = {
    id: string;
    name?: string;
    summary?: string;
    links?: ProjectLink[];
    downloadLinks?: ProjectLink[];
    tags?: string[];
    image?: { src: string; alt?: string };

    versions?: ProjectVersionInfo;
    dependencies?: ProjectDependency[];
};

function projectPagesRoot(): string {
    return path.join(process.cwd(), "content", "project_pages");
}

export async function listProjectNames(): Promise<string[]> {
    const dirEntries = await filesystem.readdir(projectPagesRoot(), { withFileTypes: true });

    return dirEntries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => isSafeProjectName(name));
}

export async function loadProjectMeta(projectName: string): Promise<ProjectMeta | null> {
    if (!isSafeProjectName(projectName)) return null;

    const metaPath = path.join(projectPagesRoot(), projectName, "project.json");

    try {
        const metaRaw = await filesystem.readFile(metaPath, "utf-8");
        const meta = JSON.parse(metaRaw) as ProjectMeta;

        return {
            ...meta,
            id: meta.id ?? projectName,
        };
    } catch {
        return { id: projectName };
    }
}

export async function loadProjectBodyMarkdown(projectName: string): Promise<string | null> {
    if (!isSafeProjectName(projectName)) return null;

    const bodyPath = path.join(projectPagesRoot(), projectName, "page.md");

    try {
        return await filesystem.readFile(bodyPath, "utf-8");
    } catch {
        return null;
    }
}

export async function loadProjectChangelog(projectName: string): Promise<ProjectChangelog | null> {
    if (!isSafeProjectName(projectName)) return null;

    const newChangelogPath = path.join(projectPagesRoot(), projectName, "changelog.json");
    const legacyChangelogPath = path.join(process.cwd(), "content", "changelogs", `${projectName}.json`);

    const candidates = [newChangelogPath, legacyChangelogPath];

    for (const candidatePath of candidates) {
        try {
            const fileContents = await filesystem.readFile(candidatePath, "utf-8");
            return JSON.parse(fileContents) as ProjectChangelog;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw error;
            }
        }
    }

    return null;
}
