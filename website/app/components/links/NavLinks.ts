import React from 'react';
import {FaDiscord, FaGithub} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";

export type SocialMediaIconProps = {
    name: string,
    href: string,
    icon: React.ElementType;
}

export const HeaderNavigationLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Maven",
        href: "/maven",
    },
    {
        name: "Docs",
        href: "/docs",
    },
    {
        name: "Changelogs",
        href: "/changelogs",
    }
]

export const SocialMediaLinks = [
    {
        name: "GitHub",
        href: "https://github.com/iso2t/",
        icon: FaGithub,
    },
    {
        name: "Discord",
        href: "https://discord.gg/iso2t",
        icon: FaDiscord,
    },
    {
        name: "Twitter",
        href: "https://twitter.com/iso2t_",
        icon: FaXTwitter,
    }
]