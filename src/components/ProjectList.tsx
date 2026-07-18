import { ProjectRow } from "./ProjectRow";
import {
    Project,
    ProjectSortOption,
    ProjectStatusFilter,
    STATUS_ORDER
} from "@/types/project";

type ProjectListProps = {
    projects: Project[]
    onDelete: (id: string) => void
    onEdit: (project: Project) => void
    searchText: string
    statusFilter: ProjectStatusFilter
    sortOption: ProjectSortOption
}

export function ProjectList({
    projects,
    onDelete,
    onEdit,
    searchText,
    statusFilter,
    sortOption
}: ProjectListProps) {
    const filteredProjects = projects
    .filter(
        (project) => project.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(
        (project) => statusFilter === "All" ? true : project.status === statusFilter
    )

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No Projects
            </div>
        )
    }

    if (filteredProjects.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No Matching Project
            </div>
        )
    }

    const sortedProjects = [...filteredProjects]
    .sort((a, b) => {
        switch (sortOption) {
            case "Status":
                return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
            case "Name":
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }        
    })

    return (
        <div className="mt-8 border rounded-lg">
            {sortedProjects.map((project) => (
                <ProjectRow
                    key={project.id}
                    project={project}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}
