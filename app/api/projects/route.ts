import { listProjectNames } from "./projectContent";

export async function GET() {
    try {
        const projects = await listProjectNames();

        return new Response(JSON.stringify({ projects }, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch {
        return new Response(JSON.stringify({ projects: [] }, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    }
}
