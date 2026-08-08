import { describe, expect, it, vi } from "vitest";
import { MAX_EMAIL_RETRY_HORIZON_MS, RESEND_IDEMPOTENCY_WINDOW_MS, retryDelayMs } from "./types";
describe("contact job retry policy", () => {
 it("keeps the configured email retry horizon inside Resend's 24-hour idempotency window", () => expect(MAX_EMAIL_RETRY_HORIZON_MS).toBeLessThan(RESEND_IDEMPOTENCY_WINDOW_MS));
 it("uses bounded full jitter and honors a bounded Retry-After", () => { vi.spyOn(Math, "random").mockReturnValue(0.5); expect(retryDelayMs(3)).toBeGreaterThan(0); expect(retryDelayMs(3)).toBeLessThanOrEqual(8000); expect(retryDelayMs(1, 9_999_999)).toBe(3_600_000); vi.restoreAllMocks(); });
});
