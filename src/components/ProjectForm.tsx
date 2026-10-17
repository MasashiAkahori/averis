"use client"

import { useState, SubmitEvent, useEffect } from "react"
import { Project, ProjectStatus, PROJECT_STATUS, CreateProjectInput, FieldError } from "@/types/project"

type ProjectFormProps = {
    onAdd: (project: CreateProjectInput) => Promise<boolean>;
    onUpdate: (project: Project) => Promise<boolean>;
    onClearErrors: () => void;
    editingProject: Project | null;
    errors: FieldError[]
    errorMessage: string | null
}

export function ProjectForm({
    onAdd,
    onUpdate,
    onClearErrors,
    editingProject,
    errors,
    errorMessage
}: ProjectFormProps) {
    const [name, setName] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("Building");
    const [githubUrl, setGithubUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameError = errors.find(error => error.field === "name");

    useEffect(() => {
        if (editingProject) {
            setName(editingProject.name);
            setGithubUrl(editingProject.githubUrl ?? "");
            setStatus(editingProject.status);
        } else {
            setName("");
            setGithubUrl("");
            setStatus("Building");
        }
    }, [editingProject]);

    async function handleSubmit(
        e: SubmitEvent
    ) {
        e.preventDefault()
        setIsSubmitting(true)

        let succeeded: boolean;

        try {
            if (editingProject) {
                succeeded = await onUpdate({
                    id: editingProject.id,
                    name,
                    status,
                    time: "Just Now",
                    githubUrl: githubUrl,
                    createdAt: editingProject.createdAt,
                    userId: editingProject.userId
                })
            } else {
                succeeded = await onAdd({
                    name,
                    status,
                    time: "Just Now",
                    githubUrl: githubUrl
                })
            }

            if (succeeded) {
                setName("");
                setGithubUrl("");
                setStatus("Building");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {errorMessage && (
                <p role="alert">
                    {errorMessage}
                </p>
            )}

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

                <input
                    value={githubUrl}
                    onChange={e => {
                        setGithubUrl(e.target.value);
                        onClearErrors();
                    }}
                    placeholder="GitHub Repository URL"
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
                    disabled={isSubmitting}
                    className="border p-2 ml-2"
                >
                    {isSubmitting
                        ? (editingProject ? "Updating..." : "Adding")
                        : (editingProject ? "Update" : "Add")
                    }
                </button>
            </form>
        </>
    )
}
