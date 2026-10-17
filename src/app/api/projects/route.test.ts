import { beforeEach, it, expect, vi } from "vitest";
import { GET, POST } from "./route";
import { Project } from "@/types/project";

beforeEach(() => {
    vi.clearAllMocks()
});

const { mockAuth } = vi.hoisted(() => ({
    mockAuth: vi.fn(),
}));

vi.mock("@/auth", () => ({
    auth: mockAuth
}));

const { mockFindMany } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
}));

const { mockCreate } = vi.hoisted(() => ({
    mockCreate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    default: {
        project: {
            findMany: mockFindMany,
            create: mockCreate
        }
    }
}));

// GET
it("function GET returns 200", async () => {
    const userId: string = "user_1";
    const mockProject: Project = {
        id: "project_1",
        name: "project_1",
        status: "Healthy",
        time: "10 hours",
        githubUrl: "https://github.com/user/project",
        createdAt: "2026-01-01T00:00:00.000Z",

        userId: userId,
    };
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    mockFindMany.mockResolvedValue([mockProject]);
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toStrictEqual([mockProject])
    expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
    });
})

it("function GET returns 401", async () => {
    mockAuth.mockResolvedValue(null);
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toStrictEqual({
        message: 'Unauthorized'
    });
    expect(mockFindMany).not.toHaveBeenCalled();
});

// POST
it("function POST returns 201", async () => {
    const userId: string = "user_1";
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours",
        githubUrl: "https://github.com/user/project"
    };
    const mockProject: Project = {
        id: "project_1",
        name: "project_1",
        status: "Healthy",
        time: "10 hours",
        githubUrl: "https://github.com/user/project",
        createdAt: "2026-01-01T00:00:00.000Z",
        userId: userId,
    };
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    mockCreate.mockResolvedValue(mockProject);
    const request = new Request("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mockInputProject),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toStrictEqual(mockProject)
    expect(mockCreate).toHaveBeenCalledWith({
        data: {
            ...mockInputProject,
            userId: userId,
        }
    })
})

it("function POST returns 401", async () => {
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours"
    };

    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mockInputProject),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toStrictEqual({
        message: "Unauthorized",
    });
    expect(mockCreate).not.toHaveBeenCalled();
});

it("function POST returns 400 for invalid JSON", async () => {
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    const request = new Request("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: "{"
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toStrictEqual({
        message: "Invalid JSON."
    });
    expect(mockCreate).not.toHaveBeenCalled();
});

it("function POST returns 400 for invalid request", async () => {
    const mockInputProject = {
        name: "  ",
        status: "Healthy",
        time: "10 hours"
    };
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    const request = new Request("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Invalid request");
    expect(body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                field: "name",
            }),
        ])
    );
    expect(mockCreate).not.toHaveBeenCalled();
});

it("function POST returns 500 for Internal server error", async () => {
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours"
    };
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    mockCreate.mockRejectedValue(new Error("Internal server error"));
    const request = new Request("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mockInputProject),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toStrictEqual({
        message: "Internal server error"
    });
    expect(mockCreate).toHaveBeenCalledOnce();
});
