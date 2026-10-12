import { beforeEach, it, expect, vi } from "vitest"
import { GET } from "./route";

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

vi.mock("@/lib/prisma", () => ({
    default: {
        project: {
            findMany: mockFindMany
        }
    }
}));

it("function GET returns 200", async () => {
    mockAuth.mockResolvedValue({
        user: {
            id: "user_1"
        }
    });
    mockFindMany.mockResolvedValue([
        {
            status: "Healthy",
            id: "project_1",
            name: "project_1",
            time: "10 hours",
            createdAt: "Date",
            userId: "user_1",
        }
    ]);
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toStrictEqual([
        {
            "createdAt": "Date",
            "id": "project_1",
            "name": "project_1",
            "status": "Healthy",
            "time": "10 hours",
            "userId": "user_1",
        },
    ])
    expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: "user_1" },
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
