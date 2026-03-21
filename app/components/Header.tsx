"use client";

import Link from "next/link";
import {HeaderNavigationLinks} from "@/app/components/links/NavLinks";
import {HeaderFont} from "@/app/components/Fonts";
import {useTheme} from "next-themes";
import {useMemo} from "react";
import {MdDarkMode, MdLightMode, MdSync} from "react-icons/md";

function HeaderTitle({subTitle}: { subTitle?: string }) {
    return (
        <Link className={`${HeaderFont.className} text-foreground text-3xl font-bold pl-3 shadow-2xl`} href="/">
            ISO2T<span
            className={`${HeaderFont.className} text-foreground font-bold text-3xl`}>{subTitle ? ` - ${subTitle}` : ""}</span>
        </Link>
    );
}

function ThemeToggleButton() {
    const {theme, resolvedTheme, setTheme} = useTheme();

    const label = useMemo(() => {
        const currentTheme = theme ?? "system";
        const currentResolved = resolvedTheme ?? "light";

        if (currentTheme === "system") {
            return `System (${currentResolved === "dark" ? "Dark" : "Light"})`;
        }

        return currentTheme === "dark" ? "Dark" : "Light";
    }, [resolvedTheme, theme]);

    function cycleTheme() {
        const current = theme ?? "system";
        const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
        setTheme(next);
    }

    const Icon = theme === "dark" ? MdDarkMode : theme === "light" ? MdLightMode : MdSync;

    return (
        <button
            type="button"
            onClick={cycleTheme}
            className="text-foreground/80 hover:text-foreground cursor-pointer"
            aria-label={`Toggle theme. Current: ${label}`}
            title={`Theme: ${label}`}
            suppressHydrationWarning
        >
            <Icon className="h-6 w-6"/>
        </button>
    );
}

export default function Header({subTitle}: { subTitle?: string }) {
    return (
        <header className="w-full bg-background text-foreground">
            <div className="flex justify-between items-center pt-1 isolate ring-1 ring-foreground/10">
                {HeaderTitle({subTitle: subTitle})}
                <div className="pr-3">
                    <nav>
                        <ul className={`${HeaderFont.className} flex flex-row justify-around gap-x-3 items-center`}>
                            {HeaderNavigationLinks.map((link) => (
                                <li key={link.name}>
                                    <a className="text-xl text-foreground/80 hover:text-foreground"
                                       href={link.href}>{link.name}</a>
                                </li>
                            ))}
                            <li>
                                <ThemeToggleButton/>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}