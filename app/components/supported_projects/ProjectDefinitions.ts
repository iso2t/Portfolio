import { IconType } from "react-icons";

export enum ProjectTags {
    MOD = "MOD",
    TECHNOLOGY = "TECHNOLOGY",
    RESOURCE_PACK = "RESOURCE_PACK",
}

export interface ProjectVersion {
    latest: string;
    recommended?: string;
    beta?: string;
    nightly?: string;
    all?: string[];
}

export interface ProjectDependency {
    name: string;
    version: string;
}

export interface ProjectLink {
    name: string;
    href: string;
    icon: IconType;
}

export interface ProjectImage {
    src: string;
    alt: string;
}

export interface ProjectDownloadLink {
    name: string;
    href: string;
    icon: IconType;
}

export interface ProjectDefinition {
    name: string;
    image?: ProjectImage[];
    downloadLinks?: ProjectDownloadLink[];
    id: string;
    slug: string;
    description: string;
    versions: ProjectVersion[];
    dependencies: ProjectDependency[];
    tags: ProjectTags[];
    links: ProjectLink[];
}