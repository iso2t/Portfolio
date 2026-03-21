import {FaClipboardList, FaCodeBranch, FaGithub, FaSitemap} from "react-icons/fa";
import {IconType} from "react-icons";
import { SiCurseforge, SiModrinth } from "react-icons/si";

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
    description: string;
    versions: ProjectVersion[];
    dependencies: ProjectDependency[];
    tags: ProjectTags[];
    links: ProjectLink[];
}

export const Definitions = [
    {
        name: "Null",
        id: "null",
        description: "Null is a mod designed for late-game resource gathering and processing in Minecraft, built upon the NeoForge modding framework.",
        versions: [{
            latest: "1.0.0-1.21.1"
        }],
        dependencies: [
            {
                name: "NeoForge",
                version: "1.21.1"
            },
            {
                name: "Minecraft",
                version: "1.21.1"
            },
            {
                name: "GuideME",
                version: "21.1.10"
            }
        ],
        tags: [ProjectTags.MOD, ProjectTags.TECHNOLOGY],
        links: [
            {
                name: "GitHub",
                href: "https://github.com/iso2t/Null",
                icon: FaGithub
            },
            {
                name: "Website",
                href: "https://iso2t.com/null",
                icon: FaSitemap
            },
            {
                name: "Changelog",
                href: "https://iso2t.com/null/changelogs",
                icon: FaClipboardList
            },
            {
                name: "Issues",
                href: "https://github.com/iso2t/Null/issues",
                icon: FaCodeBranch
            }
        ],

    },
    {
        name: "Heavy Inventories",
        id: "hi",
        description: "A mod that adds heavy inventory systems to Minecraft.",
        versions: [{
            latest: "4.0.0b-1.21.1"
        }],
        dependencies: [
            {
                name: "NeoForge",
                version: "1.21.1"
            },
            {
                name: "Minecraft",
                version: "1.21.1"
            }
        ],
        tags: [ProjectTags.MOD, ProjectTags.TECHNOLOGY],
        links: [
            {
                name: "GitHub",
                href: "https://github.com/iso2t/Heavy-Inventories",
                icon: FaGithub
            },
            {
                name: "Website",
                href: "https://iso2t.com/hi",
                icon: FaSitemap
            },
            {
                name: "Changelog",
                href: "https://iso2t.com/hi/changelogs",
                icon: FaClipboardList
            },
            {
                name: "Issues",
                href: "https://github.com/iso2t/Heavy-Inventories/issues",
                icon: FaCodeBranch
            }
        ],
    },
    {
        name: "Hot Swap",
        downloadLinks: [
            {
                name: "CurseForge",
                href: "https://www.curseforge.com/minecraft/mc-mods/hot-swap",
                icon: SiCurseforge
            },
            {
                name: "Modrinth",
                href: "https://modrinth.com/mod/hot-swap",
                icon: SiModrinth
            }
        ],
        id: "hotswap",
        description: "Auto swap to the right tool.",
        versions: [{
            latest: "1.3.0-1.21.5"
        }],
        dependencies: [
            {
                name: "NeoForge",
                version: "1.21.5"
            },
            {
                name: "Minecraft",
                version: "1.21.5"
            }
        ],
        tags: [ProjectTags.MOD, ProjectTags.TECHNOLOGY],
        links: [
            {
                name: "GitHub",
                href: "https://github.com/iso2t/HotSwap",
                icon: FaGithub
            },
            {
                name: "Website",
                href: "https://iso2t.com/hotswap",
                icon: FaSitemap
            },
            {
                name: "Changelog",
                href: "https://iso2t.com/hotswap/changelogs",
                icon: FaClipboardList
            },
            {
                name: "Issues",
                href: "https://github.com/iso2t/Hot-Swap/issues",
                icon: FaCodeBranch
            }
        ],
    },
    {
        name: "Slumber",
        downloadLinks: [
            {
                name: "CurseForge",
                href: "https://www.curseforge.com/minecraft/mc-mods/slumber",
                icon: SiCurseforge
            },
            {
                name: "Modrinth",
                href: "https://modrinth.com/mod/slumbermod",
                icon: SiModrinth
            }
        ],
        id: "slumber",
        description: "Simulate your world while everyone sleeps...",
        versions: [{
            latest: "1.0.5-1.21.10"
        }],
        dependencies: [
            {
                name: "NeoForge",
                version: "1.21.10"
            },
            {
                name: "Minecraft",
                version: "1.21.10"
            }
        ],
        tags: [ProjectTags.MOD, ProjectTags.TECHNOLOGY],
        links: [
            {
                name: "GitHub",
                href: "https://github.com/iso2t/Slumber",
                icon: FaGithub
            },
            {
                name: "Website",
                href: "https://iso2t.com/slumber",
                icon: FaSitemap
            },
            {
                name: "Changelog",
                href: "https://iso2t.com/slumber/changelogs",
                icon: FaClipboardList
            },
            {
                name: "Issues",
                href: "https://github.com/iso2t/Slumber/issues",
                icon: FaCodeBranch
            }
        ],
    },
    {
        name: "Scrollable Tooltips",
        downloadLinks: [
            {
                name: "CurseForge",
                href: "https://www.curseforge.com/minecraft/mc-mods/scrollable-tooltips",
                icon: SiCurseforge
            },
            {
                name: "Modrinth",
                href: "https://modrinth.com/mod/scrollable-tooltips",
                icon: SiModrinth
            }
        ],
        id: "scrollable-tooltips",
        description: "Scrollable tooltips for Minecraft",
        versions: [{
            latest: "1.0.0-1.21.1"
        }],
        dependencies: [
            {
                name: "NeoForge",
                version: "1.21.1"
            },
            {
                name: "Minecraft",
                version: "1.21.1"
            }
        ],
        tags: [ProjectTags.MOD, ProjectTags.TECHNOLOGY],
        links: [
            {
                name: "GitHub",
                href: "https://github.com/iso2t/Scrollable-Tooltips",
                icon: FaGithub
            },
            {
                name: "Website",
                href: "https://iso2t.com/scrollable-tooltips",
                icon: FaSitemap
            },
            {
                name: "Changelog",
                href: "https://iso2t.com/scrollable-tooltips/changelogs",
                icon: FaClipboardList
            },
            {
                name: "Issues",
                href: "https://github.com/iso2t/Scrollable-Tooltips/issues",
                icon: FaCodeBranch
            }
        ],
    }
] satisfies ProjectDefinition[];