import { beforeEach, it, expect, vi } from "vitest";
import { PUT } from "./route"
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

const { mockFindFirst } = vi.hoisted(() => ({
    mockFindFirst: vi.fn(),
}));

const { mockUpdate } = vi.hoisted(() => ({
    mockUpdate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    default: {
        project: {
            findFirst: mockFindFirst,
            update: mockUpdate
        }
    }
}));

// PUT
it("function PUT returns 200", async () => {
    const userId: string = "user_1";
    const projectId: string = "project_1";
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours"
    };
    const mockProject: Project = {
        id: projectId,
        name: "project_1",
        status: "Healthy",
        time: "10 hours",
        createdAt: "2026-01-01T00:00:00.000Z",
        userId: userId,
    };
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    mockFindFirst.mockResolvedValue(mockProject);
    mockUpdate.mockResolvedValue(mockProject);
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await PUT(request, {
        params: Promise.resolve({ id: projectId })
    });
    const body = await response.json();

    expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
            id: projectId,
            userId: userId
        }
    });
    expect(mockUpdate).toHaveBeenCalledWith({
        where: {
            id: projectId
        },
        data: mockInputProject
    });
    expect(response.status).toBe(200);
    expect(body).toStrictEqual(mockProject);
    
});

it("function PUT returns 401", async () => {
    const projectId = "project_1";
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours"
    };
    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await PUT(request, {
        params: Promise.resolve({id: projectId})
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toStrictEqual({
        message: "Unauthorized"
    });
    expect(mockFindFirst).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled();
});

it("function PUT returns 400 for invalid JSON", async () => {
    const projectId = "project_1";
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: "{"
    });
    const response = await PUT(request, {
        params: Promise.resolve({ id: projectId })
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toStrictEqual({
        message: "Invalid JSON."
    });
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
});

it("function PUT returns 400 for invalid request", async () => {
    const projectId = "project_1";
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
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await PUT(request, {
        params: Promise.resolve({ id: projectId })
    });
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
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
});

it("function PUT returns 404", async () => {
    const projectId = "project_1";
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
    mockFindFirst.mockResolvedValue(null);
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await PUT(request, {
        params: Promise.resolve({ id: projectId })
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toStrictEqual({
        message: "Project not found"
    });
    expect(mockUpdate).not.toHaveBeenCalled();
});

it("function PUT returns 500", async () => {
    const projectId = "project_1"
    const userId = "user_1"
    const mockInputProject = {
        name: "project_1",
        status: "Healthy",
        time: "10 hours"
    };
    const mockProject: Project = {
        id: projectId,
        name: "project_1",
        status: "Healthy",
        time: "10 hours",
        createdAt: "2026-01-01T00:00:00.000Z",
        userId: userId,
    };
    mockAuth.mockResolvedValue({
        user: {
            id: userId
        }
    });
    mockFindFirst.mockResolvedValue(mockProject)
    mockUpdate.mockRejectedValue(new Error("Internal server error"));
    const request = new Request("http://localhost:3000/api/projects/project_1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mockInputProject)
    });
    const response = await PUT(request, {
        params: Promise.resolve({ id: projectId })
    });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toStrictEqual({
        message: "Internal server error."
    });
});

