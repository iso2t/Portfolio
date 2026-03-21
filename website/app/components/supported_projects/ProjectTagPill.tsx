import React from "react";

export default function ProjectTagPill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 text-xs font-medium text-black/80 dark:text-white/80 ring-1 ring-black/10 dark:ring-white/10">
            {label}
        </span>
    );
}
