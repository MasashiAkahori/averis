"use client"

import { useState, useEffect } from "react"
import {
    CreateProjectInput,
    FieldError,
    Project,
    ProjectSortOption,
    ProjectStatusFilter
} from "@/types/project"
import { Sidebar } from "@/components/Sidebar"
import { MetricCard } from "@/components/MetricCard"
import { ProjectList } from "@/components/ProjectList"
import { ProjectForm } from "@/components/ProjectForm"
import { SearchBar } from "@/components/SearchBar"
import { StatusFilter } from "@/components/StatusFilter"
import { SortFilter } from "@/components/SortFilter"

export default function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("All");
    const [sortOption, setSortOption] = useState<ProjectSortOption>("Created Date");
    const [errors, setErrors] = useState<FieldError[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch("/api/projects");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects.");
                }

                const data: Project[] = await response.json();
                setProjects(data);
            } catch {
                setErrorMessage(
                    "Could not load projects. Please try again later."
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchProjects()
    }, [])

    async function addProject(input: CreateProjectInput): Promise<boolean> {
        try {
            setErrors([]);
            setErrorMessage(null);
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                const errorResponse = await response.json()
                if (response.status === 400 && errorResponse.errors) {
                    setErrors(errorResponse.errors);
                } else {
                    setErrors([]);
                    setErrorMessage(
                        "Could not add the project. Please try again later."
                    );
                }
                return false;
            }

            const createdProject: Project = await response.json();

            setProjects(prev => [
                createdProject,
                ...prev
            ]);

            setErrors([]);
            setErrorMessage(null);
            return true;
        } catch (error) {
            setErrorMessage("Could not add the project. Check your internet connection.");
            return false;
        }
    }

    async function handleEdit(project: Project) {
        setEditingProject(project)
    }

    async function updateProject(input: Project): Promise<boolean> {
        const { id, ...projectInfo } = input
        try {
            setErrors([]);
            setErrorMessage(null);
            const response = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projectInfo)
            })

            if (!response.ok) {
                const errorResponse = await response.json()
                if (response.status === 400 && errorResponse.errors) {
                    setErrors(errorResponse.errors);
                } else {
                    setErrors([]);
                    setErrorMessage(
                        "Could not update the project. Please try again later."
                    );
                }
                return false;
            }

            const updatedProject: Project = await response.json()

            setProjects(prev =>
                prev.map(project =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            )
            setEditingProject(null);
            setErrors([]);
            setErrorMessage(null);
            return true;
        } catch (error) {
            setErrorMessage("Could not edit the project. Check your internet connection.");
            return false;
        }
    }

    async function deleteProject(id: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                setErrors([]);
                setErrorMessage(
                    "Could not delete the project. Please try again later."
                );
                return false;
            }

            const deletedProject: Project = await response.json()
            setProjects(prev => prev.filter((project) => project.id !== deletedProject.id))

            setErrors([]);
            setErrorMessage(null);
            return true;
        } catch {
            setErrorMessage("Could not delete the project. Check your internet connection.");
            return false;
        }
    }

    return (
        <>
        <button
            onClick={() => setShowSidebar(prev => !prev)}
        >Toggle Sidebar
        </button>

        <main className="flex flex-col md:flex-row">
            {showSidebar && <Sidebar />}
            <section className="flex-1 p-8">
                <h1 className="text-3xl font-bold">
                    Engineering Dashboard
                </h1>

                {errorMessage && (
                    <p className="mt-4 text-red-600">
                        {errorMessage}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <MetricCard
                        title="Quality Score"
                        value="92"
                    />

                    <MetricCard
                        title="Build Success"
                        value="95%"
                    />

                    <MetricCard
                        title="Open Issue"
                        value="12"
                    />
                </div>
                <div className="flex gap-4 mt-8 item-center">
                    <SearchBar
                        searchText={searchText}
                        onSearchTextChange={setSearchText}
                    />
                    <StatusFilter
                        status={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                    <SortFilter
                        option={sortOption}
                        onOptionChange={setSortOption}
                    />
                </div>

                {isLoading ? (
                    <p>Loading projects...</p>
                ) : (
                    <ProjectList
                        projects={projects}
                        onDelete={deleteProject}
                        onEdit={handleEdit}
                        searchText={searchText}
                        statusFilter={statusFilter}
                        sortOption={sortOption}
                    />
                )}

                <ProjectForm
                    editingProject={editingProject}
                    onAdd={addProject}
                    onClearErrors={() => setErrors([])}
                    onUpdate={updateProject}
                    errors={errors}
                    errorMessage={errorMessage}
                />
            </section>
        </main>
        </>
    )
}