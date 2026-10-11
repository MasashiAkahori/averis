"use client"

import { useState, SubmitEvent, useEffect } from "react"
import { Project, ProjectStatus, PROJECT_STATUS, CreateProjectInput, FieldError } from "@/types/project"

type ProjectFormProps = {
    onAdd: (project: CreateProjectInput) => Promise<boolean>;
    onUpdate: (project: Project) => Promise<boolean>;
    onClearErrors: () => void;
    editingProject: Project | null;
    errors: FieldError[]
}

export function ProjectForm({
    onAdd,
    onUpdate,
    onClearErrors,
    editingProject,
    errors
}: ProjectFormProps) {
    const [name, setName] = useState("")
    const [status, setStatus] = useState<ProjectStatus>("Building")

    const nameError = errors.find(error => error.field === "name")

    useEffect(() => {
        if (editingProject) {
            setName(editingProject.name);
            setStatus(editingProject.status);
        } else {
            setName("")
            setStatus("Building")
        }
    }, [editingProject]);

    async function handleSubmit(
        e: SubmitEvent
    ) {
        e.preventDefault()

        let succeeded: boolean;

        if (editingProject) {
            succeeded = await onUpdate({
                id: editingProject.id,
                name,
                status,
                time: "Just Now",
                createdAt: editingProject.createdAt,
                userId: editingProject.userId
            })
        } else {
            succeeded = await onAdd({
                name,
                status,
                time: "Just Now"
            })
        }

        if (succeeded) {
            setName("")
            setStatus("Building")
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 sounded mt-8"
        >
            <input
                value={name}
                onChange={e => {
                    setName(e.target.value);
                    onClearErrors();
                }}
                placeholder="Project Name"
                className="border p-2"
            />

            {nameError && (
                <p>{nameError.message}</p>
            )}

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
                {editingProject ? "Update" : "Add"}
            </button>
        </form>
    )
}
