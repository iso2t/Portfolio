"use client";

import React, { useEffect, useMemo, useState } from "react";

type TabKey = "overview" | "changelog";

type ProjectTabsProps = {
    projectName: string;
    overview: React.ReactNode;
    initialChangelog?: unknown;
};

type LoadState =
    | { state: "idle" }
    | { state: "loading" }
    | { state: "loaded"; data: unknown }
    | { state: "error"; message: string };

function renderChangelog(data: unknown) {
    if (!data || typeof data !== "object") {
        return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>;
    }

    const maybe = data as Record<string, unknown>;
    const promos = (maybe.promos ?? null) as Record<string, unknown> | null;

    const versionKeys = Object.keys(maybe).filter((k) => k !== "homepage" && k !== "promos");

    return (
        <div className="space-y-4">
            {promos ? (
                <div className="ring-1 ring-foreground/10 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Promos</h3>
                    <pre className="whitespace-pre-wrap text-sm text-foreground/90">{JSON.stringify(promos, null, 2)}</pre>
                </div>
            ) : null}

            {versionKeys.length ? (
                <div className="space-y-3">
                    {versionKeys.map((gameVersion) => (
                        <div key={gameVersion} className="ring-1 ring-foreground/10 rounded-lg p-3">
                            <h3 className="text-sm font-semibold text-foreground mb-2">{gameVersion}</h3>
                            <pre className="whitespace-pre-wrap text-sm text-foreground/90">
                                {JSON.stringify(maybe[gameVersion], null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            ) : (
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
}

export default function ProjectTabs(props: ProjectTabsProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [changelog, setChangelog] = useState<LoadState>(() =>
        props.initialChangelog !== undefined ? { state: "loaded", data: props.initialChangelog } : { state: "idle" }
    );

    const tabs = useMemo(
        () => [
            { key: "overview" as const, label: "Overview" },
            { key: "changelog" as const, label: "Changelog" },
        ],
        []
    );

    useEffect(() => {
        if (activeTab !== "changelog") return;
        if (changelog.state === "loading" || changelog.state === "loaded") return;

        let cancelled = false;

        async function load() {
            try {
                setChangelog({ state: "loading" });
                const response = await fetch(`/api/projects/${props.projectName}/changelog`);

                const json = (await response.json()) as unknown;

                if (cancelled) return;

                if (!response.ok) {
                    const message =
                        json && typeof json === "object" && "error" in (json as Record<string, unknown>)
                            ? String((json as Record<string, unknown>).error)
                            : `Failed to load changelog (${response.status})`;
                    setChangelog({ state: "error", message });
                    return;
                }

                setChangelog({ state: "loaded", data: json });
            } catch (e) {
                if (cancelled) return;
                setChangelog({ state: "error", message: e instanceof Error ? e.message : "Failed to load changelog" });
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [activeTab, changelog.state, props.projectName]);

    return (
        <div>
            <div className="flex gap-2 border-b border-foreground/10 mb-4">
                {tabs.map((tab) => {
                    const isActive = tab.key === activeTab;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={
                                "px-3 py-2 text-sm font-medium border-b-2 -mb-px " +
                                (isActive
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-foreground/70 hover:text-foreground")
                            }
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "overview" ? props.overview : null}

            {activeTab === "changelog" ? (
                <div>
                    {changelog.state === "idle" || changelog.state === "loading" ? (
                        <p className="text-sm text-foreground/70">Loading changelog...</p>
                    ) : changelog.state === "error" ? (
                        <p className="text-sm text-foreground/70">{changelog.message}</p>
                    ) : (
                        renderChangelog(changelog.data)
                    )}
                </div>
            ) : null}
        </div>
    );
}
