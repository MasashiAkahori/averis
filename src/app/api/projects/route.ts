import { projects } from "@/data/projects";
import { CreateProjectInput, Project } from "@/types/project";


export async function GET() {
    return Response.json(projects)
}

export async function POST(request: Request) {
    const input: CreateProjectInput = await request.json()

    const newProject: Project = {
        id: crypto.randomUUID(),
        ...input
    };

    projects.push(newProject)

    return Response.json(newProject, {
        status: 201
    });
}
