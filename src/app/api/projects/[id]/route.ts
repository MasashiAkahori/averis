import { projects } from "@/data/projects";
import { CreateProjectInput, Project } from "@/types/project";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params
    const index = projects.findIndex(
        project => project.id === id
    )
    const input: CreateProjectInput = await request.json()

    if (index === -1) {
        return Response.json(
            { message: "Project not found" },
            { status: 404 }
        )
    }

    const updateProject: Project = {
        id,
        ...input
    }

    projects[index] = updateProject

    return Response.json(
        updateProject,
        { status: 200 }
    )
}
