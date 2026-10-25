import { parseGitHubRepositoryUrl } from "@/lib/github";
import type { GitHubRepository } from "@/types/github";

export async function GET(request: Request) {

    const url = new URL(request.url);
    const repositoryUrl = url.searchParams.get("url");

    if (!repositoryUrl) {
        return Response.json(
            { error: "GitHub repository URL is required" },
            { status: 400 }
        );
    }

    const repository = parseGitHubRepositoryUrl(repositoryUrl);

    if (!repository) {
        return Response.json(
            { error: "Invalid GitHub repository URL" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}`,
            {
                headers: {
                    Accept: "application/vnd.github+json"
                },
            }
        );

        if (!response.ok) {
            return Response.json(
                { error: "Failed to fetch GitHub repository" },
                { status: response.status === 404 ? 404 : 502 }
            );
        }

        const data = await response.json();

        const repositoryData: GitHubRepository = {
            name: data.name,
            description: data.description,
            stargazers_count: data.stargazers_count,
            language: data.language,
            updated_at: data.updated_at,
        };

        return Response.json(repositoryData);
    } catch {
        return Response.json(
            { error: "Failed to connect to GitHub API" },
            { status: 502 }
        );
    }
};
