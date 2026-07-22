import { headers } from "next/headers";

export async function GET(request: Request) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  return Response.json({
    status: "ok",
    message: userAgent,
  });
}
