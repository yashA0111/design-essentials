import { DEFAULT_PHONE_COUNTRY } from "@/lib/validation/contact";

export function GET(request: Request) {
  const countryCode =
    request.headers.get("x-vercel-ip-country")?.trim().toUpperCase() ||
    DEFAULT_PHONE_COUNTRY;

  return Response.json({ countryCode });
}
