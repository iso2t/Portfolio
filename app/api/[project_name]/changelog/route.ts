import { promises as filesystem } from "fs";
import path from "path";

type RouteContext = {
    params: Promise<{
        project_name: string;
    }>;
};

function isSafeProjectName(projectName: string): boolean {
    return /^[a-z0-9._-]+$/i.test(projectName);
}

export async function GET(_request: Request, context: RouteContext) {
    const { project_name } = await context.params;

    if (!isSafeProjectName(project_name)) {
        return new Response("Invalid project name", { status: 400 });
    }

    const changelogPath = path.join(
        process.cwd(),
        "content",
        "changelogs",
        `${project_name}.json`
    );

    try {
        const fileContents = await filesystem.readFile(changelogPath, "utf-8");
        const changelogJson = JSON.parse(fileContents);

        return new Response(JSON.stringify(changelogJson, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return Response.json(
                { error: "Invalid JSON format" },
                { status: 500 }
            )
        }

        return Response.json(
            { error: `No changelog found for '${project_name}'.` },
            { status: 404 }
        )
    }
}