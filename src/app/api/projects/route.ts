import { CreateProjectInput } from "@/types/project";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function GET() {
    const session = await auth()

    if (!session) {
        return Response.json(
            { message: "Unauthorized"},
            { status: 401 }
        )
    }

    if (!session.user?.email) {
        return Response.json(
            { message: "Authenticated user email is unavailable" },
            { status: 401 }
        )
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!user) {
        return Response.json(
            { message: "User not found" },
            { status: 404 }
        )
    }

    const projects = await prisma.project.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return Response.json(projects)
}

export async function POST(request: Request) {
    const session = await auth()

    if (!session) {
        return Response.json(
            { message: "Unauthorized"},
            { status: 401 }
        )
    }

    if (!session.user?.email) {
        return Response.json(
            { message: "Authenticated user email is unavailable" },
            { status: 401 }
        )
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!user) {
        return Response.json(
            { message: "User not found" },
            { status: 404 }
        )
    }

    const input: CreateProjectInput = await request.json()

    const createdProject = await prisma.project.create({
        data: {
            ...input,
            userId: user.id
        }
    })

    return Response.json(createdProject, {
        status: 201
    });
}
