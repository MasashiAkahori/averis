"use client"

import { useState, useEffect } from "react"
import {
    CreateProjectInput,
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
    const [showSidebar, setShowSidebar] = useState(true)
    const [projects, setProjects] = useState<Project[]>([])
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("All");
    const [sortOption, setSortOption] = useState<ProjectSortOption>("Created Date")

    useEffect(() => {
        async function fetchProjects() {
            const response = await fetch("/api/projects");
            const data: Project[] = await response.json();
            setProjects(data)
        }

        fetchProjects()
    }, [])

    async function addProject(input: CreateProjectInput) {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        });

        const createdProject: Project = await response.json();

        setProjects(prev => [
            createdProject,
            ...prev
        ]);
    }

    function handleEdit(project: Project) {
        setEditingProject(project)
    }

    async function updateProject(input: Project) {
        const { id, ...projectInfo } = input
        const response = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectInfo)
        })

        const updatedProject: Project = await response.json() 
        setProjects(prev =>
            prev.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        )
        setEditingProject(null)
    }

    async function deleteProject(id: string) {
        const response = await fetch(`/api/projects/${id}`, {
            method: "DELETE"
        })

        const deletedProject: Project = await response.json()
        setProjects(prev => prev.filter((project) => project.id !== deletedProject.id))
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
                <ProjectList
                    projects={projects}
                    onDelete={deleteProject}
                    onEdit={handleEdit}
                    searchText={searchText}
                    statusFilter={statusFilter}
                    sortOption={sortOption}
                />
                <ProjectForm
                    editingProject={editingProject}
                    onAdd={addProject}
                    onUpdate={updateProject}
                />
            </section>
        </main>
        </>
    )
}