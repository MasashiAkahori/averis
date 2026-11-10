
"use client";

import { GitHubRepository } from "@/types/github";
import { useEffect, useState } from "react";
import { Star, Code } from "lucide-react"

type GitHubRepositoryInfoProps = {
    githubUrl: string;
};

type FetchStatus = "loading" | "success" | "error";

export function GitHubRepositoryInfo({
    githubUrl,
}: GitHubRepositoryInfoProps) {
    const [gitHubRepositoryInfo, setGitHubRepositoryInfo] =
        useState<GitHubRepository | null>(null);

    const [status, setStatus] = useState<FetchStatus>("loading");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchRepositoryInfo() {
            setStatus("loading");
            setGitHubRepositoryInfo(null);

            try {
                const params = new URLSearchParams({
                    url: githubUrl,
                });

                const response = await fetch(
                    `/api/github/repository?${params.toString()}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch repository info.");
                }

                const data: GitHubRepository = await response.json();

                setGitHubRepositoryInfo(data);
                setStatus("success");
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setStatus("error");
            }
        }

        fetchRepositoryInfo();

        return () => {
            controller.abort();
        };
    }, [githubUrl]);

    return (
        <div>
            {status === "loading" && <p>Loading repository...</p>}

            {status === "error" && (
                <p className="truncate">Failed to load Repository Info.</p>
            )}

            {status === "success" && gitHubRepositoryInfo && (
                <div>
                    <h3 className="font-bold">{gitHubRepositoryInfo.name}</h3>
                    <p className="truncate">{gitHubRepositoryInfo.description}</p>
                    <div className="flex md:flex-row items-center gap-1">
                        <Star size={14}/>
                        <p>{gitHubRepositoryInfo.stargazers_count}</p>
                    </div>
                    <div className="flex md:flex-row items-center gap-1">
                        <Code size={14} />
                        <p>{gitHubRepositoryInfo.language}</p>
                    </div>
                    {/* <p>Updated: {gitHubRepositoryInfo.updated_at}</p> */}
                </div>
            )}
        </div>
    );
}
