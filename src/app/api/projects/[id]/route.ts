import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreateProjectInput } from "@/types/project";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const input: CreateProjectInput = await request.json()

    const project = await prisma.project.findFirst({
        where: {
            id: id,
            userId: user.id
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
        data: input
    })

    return Response.json(updatedProject, {
        status: 200
    })
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const session = await auth()

    // 1. auth()でSession確認
    if (!session) {
        return Response.json(
            { message: "Unauthorized"},
            { status: 401 }
        )
    }

    // 2. session.user.emailがあるか確認
    if (!session.user?.email) {
        return Response.json(
            { message: "Authenticated user email is unavailable" },
            { status: 401 }
        )
    }

    // 3. emailでUser取得
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

    // 4. paramsからProject id取得
    const { id } = await params

    // 5. id + user.id でProjectを検索
    const project = await prisma.project.findFirst({
            where: {
                id: id,
                userId: user.id
            }
    })

    // 6. 見つからなければ404
    if (!project) {
        return Response.json(
            { message: "Project not found" },
            { status: 404 }
        )
    }

    // 7. 見つかったProjectだけdelete
    const deletedProject = await prisma.project.delete({
        where: {
            id: id
        }
    })
    
    return Response.json(deletedProject, {
        status: 200
    })
}
