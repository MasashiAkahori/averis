import { Project } from "@/types/project"
import { StatusBadge } from "./StatusBadge"
import { GitHubRepositoryInfo } from "./GitHubRepositoryInfo"

type ProjectRowProps = {
    project: Project
    onDelete: (id: string) => void
    onEdit: (onEditingProject: Project) => void
}

export function ProjectRow( { project, onDelete, onEdit }: ProjectRowProps) {
    function handleDelete() {
        onDelete(project.id)
    } 

    function handleEdit() {
        onEdit(project)
    }
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <p className="w-32">{ project.name }</p>
            <StatusBadge status={project.status}/>
            <div className="flex-auto min-w-0">
                
                {project.githubUrl ? (
                    <GitHubRepositoryInfo githubUrl={project.githubUrl}/>
                ): (
                    <p className="truncate">No Repository</p>
                )}
            </div>
            {/* <p className="text-gray-500"> { project.time }</p> */}
            <button className="text-gray-500 shrink-0" onClick={handleDelete}>Delete</button>
            <button className="text-gray-500 shrink-0" onClick={handleEdit}>Edit</button>
        </div>
    )
}
