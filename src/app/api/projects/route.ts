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

    const projects = await prisma.project.findMany({
        where: {
            userId: session.user.id
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

    const input: CreateProjectInput = await request.json()

    const createdProject = await prisma.project.create({
        data: {
            ...input,
            userId: session.user.id
        }
    })

    return Response.json(createdProject, {
        status: 201
    });
}
