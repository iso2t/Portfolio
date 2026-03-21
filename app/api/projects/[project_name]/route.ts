import { loadProjectBodyMarkdown, loadProjectMeta, isSafeProjectName } from "../projectContent";

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

    const meta = await loadProjectMeta(project_name);
    const bodyMarkdown = await loadProjectBodyMarkdown(project_name);

    if (!meta && !bodyMarkdown) {
        return Response.json({ error: `No project found for '${project_name}'.` }, { status: 404 });
    }

    return new Response(
        JSON.stringify(
            {
                project: {
                    name: project_name,
                    meta,
                    bodyMarkdown,
                },
            },
            null,
            2
        ),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        }
    );
}
