import { isSafeProjectName, loadProjectChangelog } from "../../projectContent";

type RouteContext = {
    params: Promise<{
        project_name: string;
    }>;
};

export async function GET(_request: Request, context: RouteContext) {
    const { project_name } = await context.params;

    if (!isSafeProjectName(project_name)) {
        return new Response("Invalid project name", { status: 400 });
    }

    try {
        const changelog = await loadProjectChangelog(project_name);

        if (!changelog) {
            return Response.json(
                { error: `No changelog found for '${project_name}'.` },
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(changelog, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return Response.json({ error: "Invalid JSON format" }, { status: 500 });
        }

        return Response.json(
            { error: `No changelog found for '${project_name}'.` },
            { status: 404 }
        );
    }
}
