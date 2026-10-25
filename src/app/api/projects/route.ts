import { CreateProjectSchema } from "@/schemas/project"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
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
    } catch {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session) {
            return Response.json(
                { message: "Unauthorized"},
                { status: 401 }
            )
        }

        let body;

        try {
            body = await request.json();
        } catch {
            return Response.json(
                { message: "Invalid JSON." },
                { status: 400}
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

        const createdProject = await prisma.project.create({
            data: {
                ...result.data,
                userId: session.user.id
            }
        })

        return Response.json(createdProject, {
            status: 201
        });
    } catch {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
