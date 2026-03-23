"use client";

import Link from "next/link";
import {HeaderNavigationLinks} from "@/app/components/links/NavLinks";
import {HeaderFont} from "@/app/components/Fonts";
import {useTheme} from "next-themes";
import {useEffect, useMemo, useState} from "react";
import {MdDarkMode, MdLightMode, MdSync} from "react-icons/md";

function HeaderTitle({subTitle}: { subTitle?: string }) {
    return (
        <Link className={`${HeaderFont.className} text-foreground text-3xl font-bold pl-3 shadow-2xl`} href="/">
            ISO2T<span className={`${HeaderFont.className} text-foreground font-bold text-3xl`}>{subTitle ? ` - ${subTitle}` : ""}</span>
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setMobileMenuOpen(false);
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mobileMenuOpen]);

    return (
        <header className="w-full bg-background text-foreground">
            <div className="relative flex justify-between items-center pt-1 isolate ring-1 ring-foreground/10">
                {HeaderTitle({subTitle: subTitle})}
                <div className="pr-3">
                    <nav aria-label="Header navigation">
                        <ul className={`${HeaderFont.className} hidden sm:flex flex-row justify-around gap-x-3 items-center`}>
                            {HeaderNavigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link className="text-xl text-foreground/80 hover:text-foreground" href={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <ThemeToggleButton/>
                            </li>
                        </ul>

                        <div className="sm:hidden flex items-center">
                            <button
                                type="button"
                                className="text-foreground/80 hover:text-foreground cursor-pointer"
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-header-menu"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                            >
                                <span className="text-2xl leading-none">{mobileMenuOpen ? "✕" : "☰"}</span>
                            </button>
                        </div>

                        {mobileMenuOpen ? (
                            <>
                                <button
                                    type="button"
                                    className="fixed inset-0 z-40 bg-black/20"
                                    aria-label="Close menu"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                                <div
                                    id="mobile-header-menu"
                                    className="absolute right-3 top-full mt-2 z-50 min-w-48 rounded-md bg-background ring-1 ring-foreground/10 shadow-lg"
                                >
                                    <ul className={`${HeaderFont.className} flex flex-col gap-y-2 p-3`}>
                                        {HeaderNavigationLinks.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    className="text-xl text-foreground/80 hover:text-foreground"
                                                    href={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className="pt-1">
                                            <ThemeToggleButton/>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : null}
                    </nav>
                </div>
            </div>
        </header>
    )
}