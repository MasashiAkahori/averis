"use client"

import { useState, SubmitEvent, useEffect } from "react"
import { Project, ProjectStatus, PROJECT_STATUS, CreateProjectInput } from "@/types/project"

type ProjectFormProps = {
    onAdd: (project: CreateProjectInput) => void;
    onUpdate: (project: Project) => void;
    editingProject: Project | null;
}

export function ProjectForm({
    onAdd,
    onUpdate,
    editingProject
}: ProjectFormProps) {
    const [name, setName] = useState("")
    const [status, setStatus] = useState<ProjectStatus>("Building")

    useEffect(() => {
        if (editingProject) {
            setName(editingProject.name);
            setStatus(editingProject.status);
        } else {
            setName("")
            setStatus("Building")
        }
    }, [editingProject]);

    function handleSubmit(
        e: SubmitEvent
    ) {
        e.preventDefault()
        if (editingProject) {
            onUpdate({
                id: editingProject.id,
                name,
                status,
                time: "Just Now"
            })
        } else {
            onAdd({
                name,
                status,
                time: "Just Now"
            })
        }
        setName("")
        setStatus("Building")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 sounded mt-8"
        >
            <input
                value={name}
                onChange={
                    e => setName(e.target.value)
                }
                placeholder="Project Name"
                className="border p-2"
            />
            <select
                value={status}
                onChange={
                    (e) => setStatus(e.target.value as ProjectStatus)
                }
            >
                {PROJECT_STATUS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>

            <button
                className="border p-2 ml-2"
            >
                Add
            </button>
        </form>
    )
}
