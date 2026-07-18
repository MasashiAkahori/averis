import { Project } from "@/types/project"
import { StatusBadge } from "./ StatusBadge"

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
        <div className="grid grid-cols-1 md:grid-cols-5 p-4 border-b">
            <p>{ project.name }</p>
            <StatusBadge status={project.status}/>
            {/* <p>{ project.status }</p> */}
            <p className="text-gray-500"> { project.time }</p>
            <button className="text-gray-500" onClick={handleDelete}>Delete</button>
            <button className="text-gray-500" onClick={handleEdit}>Edit</button>
        </div>
    )
}
