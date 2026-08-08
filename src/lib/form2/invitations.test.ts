import { describe, expect, it } from "vitest";
import { createInviteVerifier, hashInviteVerifier, verifyInviteVerifier } from "./invitations";
describe("Form 2 verifier", () => { it("is random, hash-verifiable, and tamper-resistant", () => { const verifier = createInviteVerifier(); const hash = hashInviteVerifier(verifier); expect(verifier).not.toContain(hash); expect(verifyInviteVerifier(verifier, hash)).toBe(true); expect(verifyInviteVerifier(`${verifier}x`, hash)).toBe(false); }); });
