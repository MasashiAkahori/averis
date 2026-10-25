

type GitHubRepository = {
    owner: string,
    repo: string
};

export function parseGitHubRepositoryUrl(url: string): GitHubRepository | null {
    try {
        const parsedUrl = new URL(url);
        const segments = parsedUrl.pathname.split("/").filter(Boolean);

        const hostname = parsedUrl.hostname;
        const owner = segments[0];
        const repo = segments[1];

        if (
            parsedUrl.protocol === "https:" &&
            hostname === "github.com" &&
            parsedUrl.search === "" &&
            parsedUrl.hash === "" &&
            segments.length === 2 &&
            owner &&
            repo
        ) {
            return {
                owner,
                repo
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}