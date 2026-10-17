import { z } from "zod"

export const ProjectStatusSchema = z.enum([
    "Healthy",
    "Failed",
    "Building",
    "Paused"
])

export const CreateProjectSchema = z.object({
    name: z.string().trim().min(1),
    status: ProjectStatusSchema,
    time: z.string().trim().min(1),
    githubUrl: z.preprocess(
        (val) => (val === "") ? null : val,
        z.url().nullable().optional()
    )
})
