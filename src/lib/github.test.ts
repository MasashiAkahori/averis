import { it, expect } from "vitest";
import { parseGitHubRepositoryUrl } from "@/lib/github"; 

it ("parses a valid GitHub repository URL", () => {
    const url = "https://github.com/vercel/next.js"
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toStrictEqual({
        owner: "vercel",
        repo: "next.js"
    });
});

it ("returns null for a URL with an incorrect domain",  () => {
    const url = "https://example.com/vercel/next.js";
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toBeNull();
});

it ("returns null for a URL with no repository",  () => {
    const url = "https://github.com/vercel";
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toBeNull();
});

it ("returns null for a invalid URL",  () => {
    const url = "github.com/vercel";
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toBeNull();
});

it ("returns null for a URL with query",  () => {
    const url = "https://github.com/vercel/next.js?tab=readme";
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toBeNull();
});

it ("returns null for a URL with http",  () => {
    const url = "http://github.com/vercel/next.js";
    const result = parseGitHubRepositoryUrl(url);

    expect(result).toBeNull();
});