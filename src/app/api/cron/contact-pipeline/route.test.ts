import { beforeEach, describe, expect, it, vi } from "vitest";
const runContactWorker = vi.fn();
vi.mock("@/lib/jobs/worker", () => ({ runContactWorker }));
const { POST } = await import("./route");
const request = (authorization?: string) => new Request("https://example.test/api/cron/contact-pipeline", { method: "POST", headers: authorization ? { authorization } : {} });
describe("contact pipeline scheduler route", () => {
 beforeEach(() => { vi.stubEnv("CRON_SECRET", "schedule-secret"); runContactWorker.mockReset(); });
 it("requires an exact bearer secret", async () => { expect((await POST(request())).status).toBe(401); expect((await POST(request("Bearer wrong"))).status).toBe(401); expect(runContactWorker).not.toHaveBeenCalled(); });
 it("rejects a multibyte lookalike rather than comparing unsafe byte lengths", async () => { expect((await POST(request("Bearer schedule-secrét"))).status).toBe(401); });
 it("runs a bounded worker for an external authenticated caller", async () => { runContactWorker.mockResolvedValue({ claimed: 1, succeeded: 1, retried: 0, dead: 0, elapsedMs: 20 }); const response = await POST(request("Bearer schedule-secret")); expect(response.status).toBe(200); await expect(response.json()).resolves.toMatchObject({ succeeded: 1 }); });
});
