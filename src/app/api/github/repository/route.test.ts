import { afterEach, it, expect, vi } from "vitest";
import { GET } from "./route";
import { object } from "zod";

afterEach(() => {
    vi.restoreAllMocks();
});

it("function GET returns 200 with repository data", async () => {
    const mockGitHubRepository = {
        name: "next.js",
        description: "The React Framework",
        stargazers_count: 100,
        language: "JavaScript",
        updated_at: "2026-10-25T18:18:22Z",
    };

    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockGitHubRepository), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    const request = new Request(
        "http://localhost:3000/api/github/repository?url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js"
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toStrictEqual(mockGitHubRepository);
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/vercel/next.js",
        {
            headers: {
                Accept: "application/vnd.github+json",
            },
        }
    );
});

it("function GET returns 404 when repository is not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(
            JSON.stringify({ message: "Not Found" }),
            { status: 404 }
        )
    );

    const request = new Request(
        "http://localhost:3000/api/github/repository?url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnot-found-repo"
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toStrictEqual({
        error: "Failed to fetch GitHub repository",
    });
});

it("function GET returns 502 when GitHub API connection fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
        new Error("Network error")
    );

    const request = new Request(
        "http://localhost:3000/api/github/repository?url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js"
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toStrictEqual({
        error: "Failed to connect to GitHub API",
    });
});

it("function GET returns 400 for invalid GitHub URL", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch");

    const request = new Request(
        "http://localhost:3000/api/github/repository?url=https%3A%2F%2Fexample.com%2Fvercel%2Fnext.js"
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toStrictEqual({
        error: "Invalid GitHub repository URL",
    });
    expect(mockFetch).not.toHaveBeenCalled();
});
