import { describe, expect, it } from "vitest"
import { CreateProjectSchema, ProjectStatusSchema } from "./project"

describe("CreateProjectSchema", () => {
    it("accepts valid project data", () => {
        const result = CreateProjectSchema.safeParse({
            name: "Averis",
            status: "Healthy",
            time: "10 hours",
        });

        expect(result.success).toBe(true);
    })
})

it("rejects an empty project name", () => {
  const result = CreateProjectSchema.safeParse({
    name: "   ",
    status: "Healthy",
    time: "10 hours",
  });

  expect(result.success).toBe(false);
});

it("rejects an invalid project status", () => {
    const result = CreateProjectSchema.safeParse({
        name: "Averis",
        status: "Pending",
        time: "10 hours",
    });

    expect(result.success).toBe(false);
});
