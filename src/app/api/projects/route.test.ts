import { it, expect, vi } from "vitest"
import { GET } from "./route";
import prisma from "@/lib/prisma";

vi.mock("@/auth", () => {
    return {
        auth: vi.fn().mockResolvedValue(null)
    }
});

vi.mock("@/lib/prisma", () => ({
    default: {
        project: {
            findMany: vi.fn()
        }
    }
}))

it("function GET returns 401", async () => {
    const response = await GET();
    const body = await response.json()
    expect(body).toStrictEqual({
        message: 'Unauthorized'
    })
    expect(response.status).toBe(401);
    expect(prisma.project.findMany).not.toHaveBeenCalled()
});
