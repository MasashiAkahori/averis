export const PROJECT_STATUS = [
    "Healthy",
    "Failed",
    "Building",
    "Paused"
] as const;

export const PROJECT_SORT_OPTION = [
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

export type ProjectStatus = typeof PROJECT_STATUS[number];

export type Project = {
    id: string
    name: string
    status: ProjectStatus
    time: string
}

export type ProjectStatusFilter = "All" | ProjectStatus

export const FILTER_STATUS = [
    "Healthy",
    "Failed",
    "Building",
    "Paused",
    "All"
] as const;

export const LOCAL_STORAGE_KEY = "projects"
