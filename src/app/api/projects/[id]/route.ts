import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreateProjectSchema } from "@/schemas/project";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session) {
            return Response.json(
                { message: "Unauthorized"},
                { status: 401 }
            )
        }

        const { id } = await params

        let body;
        try {
            body = await request.json()
        } catch {
            return Response.json(
                { message: "Invalid JSON." },
                { status: 400 }
            );
        }

        const result = CreateProjectSchema.safeParse(body)

        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: String(issue.path[0]),
                message: issue.message
            }))

            return Response.json(
                { message: "Invalid request", errors },
                { status: 400 }
            )
        }

        const project = await prisma.project.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!project) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            )
        }

        const updatedProject = await prisma.project.update({
            where: {
                id: id
            },
            data: result.data
        })

        return Response.json(updatedProject, {
            status: 200
        })
    } catch {
        return Response.json(
            { message: "Internal server error." },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    try {
        const session = await auth()

        if (!session) {
            return Response.json(
                { message: "Unauthorized"},
                { status: 401 }
            )
        }

        const { id } = await params

        const project = await prisma.project.findFirst({
                where: {
                    id: id,
                    userId: session.user.id
                }
        })

        if (!project) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            )
        }

        const deletedProject = await prisma.project.delete({
            where: {
                id: id
            }
        })
        
        return Response.json(deletedProject, {
            status: 200
        })
    } catch {
        return Response.json(
            { message: "Internal server error." },
            { status: 500 }
        )
    }
}
