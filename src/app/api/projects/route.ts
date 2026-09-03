import { CreateProjectInput, Project } from "@/types/project";
import prisma from "@/lib/prisma";


export async function GET() {
    const projects = await prisma.project.findMany()

    return Response.json(projects)
}

export async function POST(request: Request) {
    const input: CreateProjectInput = await request.json()

    // ① PrismaでProjectを作成
    const createdProject = await prisma.project.create({
        data: input
    })

    // ② 作成されたProjectを201で返す
    return Response.json(createdProject, {
        status: 201
    });
}
