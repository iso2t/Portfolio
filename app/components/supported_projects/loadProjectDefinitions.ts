import { promises as filesystem } from "fs";
import path from "path";
import {
    type ProjectDefinition,
    type ProjectDependency,
    type ProjectDownloadLink,
    type ProjectLink,
    ProjectTags,
    type ProjectVersion,
} from "@/app/components/supported_projects/ProjectDefinitions";
import {
    FaClipboardList,
    FaCodeBranch,
    FaGithub,
    FaSitemap,
} from "react-icons/fa";
import { SiCurseforge, SiModrinth } from "react-icons/si";

type JsonLink = { name: string; href: string };

type ProjectJson = {
    id: string;
    name: string;
    description?: string;
    summary?: string;
    tags?: string[];
    image?: { src: string; alt?: string } | { src: string; alt?: string }[];
    versions?: ProjectVersion | ProjectVersion[] | Record<string, unknown>;
    dependencies?: ProjectDependency[];
    links?: JsonLink[];
    downloadLinks?: JsonLink[];
};

function projectPagesRoot(): string {
    return path.join(process.cwd(), "content", "project_pages");
}

function isSafeProjectName(projectName: string): boolean {
    return /^[a-z0-9._-]+$/i.test(projectName);
}

function toTag(tag: string): ProjectTags | null {
    const normalized = tag.toUpperCase().trim();
    if (normalized in ProjectTags) {
        return ProjectTags[normalized as keyof typeof ProjectTags];
    }

    return null;
}

function linkIcon(name: string) {
    const lowered = name.toLowerCase();

    if (lowered.includes("github")) return FaGithub;
    if (lowered.includes("website") || lowered.includes("site")) return FaSitemap;
    if (lowered.includes("changelog")) return FaClipboardList;
    if (lowered.includes("issues")) return FaCodeBranch;

    return FaSitemap;
}

function downloadIcon(name: string) {
    const lowered = name.toLowerCase();

    if (lowered.includes("curseforge")) return SiCurseforge;
    if (lowered.includes("modrinth")) return SiModrinth;
    if (lowered.includes("github")) return FaGithub;

    return FaGithub;
}

function normalizeVersions(versions: ProjectJson["versions"]): ProjectVersion[] {
    if (!versions) return [];

    if (Array.isArray(versions)) {
        return versions as ProjectVersion[];
    }

    if (typeof versions === "object") {
        const obj = versions as Record<string, unknown>;
        if (typeof obj.latest === "string") {
            const v: ProjectVersion = {
                latest: obj.latest,
                recommended: typeof obj.recommended === "string" ? obj.recommended : undefined,
                beta: typeof obj.beta === "string" ? obj.beta : undefined,
                nightly: typeof obj.nightly === "string" ? obj.nightly : undefined,
                all: Array.isArray(obj.all) ? (obj.all.filter((x) => typeof x === "string") as string[]) : undefined,
            };

            return [v];
        }
    }

    return [];
}

function normalizeImage(image: ProjectJson["image"]): { src: string; alt: string }[] | undefined {
    if (!image) return undefined;

    if (Array.isArray(image)) {
        return image.map((img) => ({ src: img.src, alt: img.alt ?? "" }));
    }

    return [{ src: image.src, alt: image.alt ?? "" }];
}

function withLinkIcons(links: JsonLink[] | undefined): ProjectLink[] {
    return (links ?? []).map((l) => ({ ...l, icon: linkIcon(l.name) }));
}

function withDownloadIcons(links: JsonLink[] | undefined): ProjectDownloadLink[] {
    return (links ?? []).map((l) => ({ ...l, icon: downloadIcon(l.name) }));
}

export async function loadProjectDefinitionsFromContent(): Promise<ProjectDefinition[]> {
    const root = projectPagesRoot();

    let entries;
    try {
        entries = await filesystem.readdir(root, { withFileTypes: true });
    } catch {
        return [];
    }

    const folders = entries
        .filter((e) => e.isDirectory())
        .map((e) => String(e.name))
        .filter((n) => isSafeProjectName(n));

    const defs: ProjectDefinition[] = [];

    for (const folder of folders) {
        const jsonPath = path.join(root, folder, "project.json");

        let raw: string;
        try {
            raw = await filesystem.readFile(jsonPath, "utf-8");
        } catch {
            continue;
        }

        let parsed: ProjectJson;
        try {
            parsed = JSON.parse(raw) as ProjectJson;
        } catch {
            continue;
        }

        const tags = (parsed.tags ?? []).map(toTag).filter((t): t is ProjectTags => t !== null);

        const definition: ProjectDefinition = {
            id: parsed.id ?? folder,
            name: parsed.name ?? folder,
            description: parsed.description ?? parsed.summary ?? "",
            versions: normalizeVersions(parsed.versions),
            dependencies: parsed.dependencies ?? [],
            tags,
            links: withLinkIcons(parsed.links),
            downloadLinks: parsed.downloadLinks ? withDownloadIcons(parsed.downloadLinks) : undefined,
            image: normalizeImage(parsed.image),
        };

        defs.push(definition);
    }

    return defs;
}
