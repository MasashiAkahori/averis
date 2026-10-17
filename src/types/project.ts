import { z } from "zod"
import { ProjectStatusSchema, CreateProjectSchema } from "@/schemas/project"

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>

export const PROJECT_STATUS = [
    "Healthy",
    "Failed",
    "Building",
    "Paused"
] as const;

export const PROJECT_SORT_OPTION = [
    "Created Date",
    "Name",
    "Status"
] as const;

export type ProjectSortOption = typeof PROJECT_SORT_OPTION[number];

export const STATUS_ORDER = {
    Healthy: 0,
    Building: 1,
    Paused: 2,
    Failed: 3
}

export type Project = {
    id: string
    name: string
    status: ProjectStatus
    time: string
    githubUrl: string | null
    createdAt: string
    userId: string | null
}

export type ProjectStatusFilter = "All" | ProjectStatus

export const FILTER_STATUS = [
    "Healthy",
    "Failed",
    "Building",
    "Paused",
    "All"
] as const;

export type FieldError = {
    field: string
    message: string
}
