import { CreateProjectSchema } from "@/schemas/project"
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

    const body = await request.json()

    const result = CreateProjectSchema.safeParse(body)

    if (!result.success) {
        return Response.json(
            {
                message: "Invalid request",
                errors: result.error.issues
            },
            { status: 400 }
        )
    }

    const createdProject = await prisma.project.create({
        data: {
            ...result.data,
            userId: session.user.id
        }
    })

    return Response.json(createdProject, {
        status: 201
    });
}
