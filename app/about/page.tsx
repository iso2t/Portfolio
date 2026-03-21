import { promises as filesystem } from "fs";
import path from "path";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function About() {
    const aboutPath = path.join(process.cwd(), "content", "pages", "about.md");

    let markdown: string | null = null;
    try {
        markdown = await filesystem.readFile(aboutPath, "utf-8");
    } catch {
        markdown = null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="ring-1 ring-foreground/10 rounded-lg p-4 bg-background">
                {markdown ? (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }: { children?: React.ReactNode }) => (
                                <h1 className="text-3xl font-bold mt-2 mb-4 text-foreground">{children}</h1>
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
                        {markdown}
                    </ReactMarkdown>
                ) : (
                    <p className="text-sm text-foreground/70">No about content found.</p>
                )}
            </div>
        </div>
    );
}