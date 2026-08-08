import { timingSafeEqual } from "node:crypto";
import { getContactConfig } from "@/lib/config/server";
import { runContactWorker } from "@/lib/jobs/worker";
export const maxDuration = 60;
function secureEqual(left: string, right: string) { const a = Buffer.from(left); const b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }
export async function POST(request: Request) { const secret = getContactConfig().cronSecret; const supplied = request.headers.get("authorization"); if (!secret || !supplied || !secureEqual(supplied, `Bearer ${secret}`)) return Response.json({ error: "Unauthorized" }, { status: 401 }); try { return Response.json(await runContactWorker()); } catch (error) { console.error("[contact-worker] unable to claim jobs", { errorClass: error instanceof Error ? error.name : "unknown" }); return Response.json({ error: "Worker unavailable" }, { status: 500 }); } }
