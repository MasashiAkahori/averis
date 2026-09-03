import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { CreateProjectInput, Project } from "@/types/project";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const input: CreateProjectInput = await request.json()

    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: id
            },
            data: input
        })

        return Response.json(updatedProject, {
            status: 200
        })
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            )
        }

        throw error;
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params

    try {
        const deletedProject = await prisma.project.delete({
            where: {
                id: id
            }
        })

        return Response.json(deletedProject, {
            status: 200
        })
    } catch (error) {
        if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
        ) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            )
        }

        throw error;
    }
}
