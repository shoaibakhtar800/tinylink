import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { isValidCode, isValidUrl, normalizeUrl } from "~/utils/validation";

export async function GET() {
  const links = await db.link.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  let { targetUrl, code } = body as { targetUrl?: string; code?: string };

  if (!targetUrl)
    return NextResponse.json(
      { error: "targetUrl is required" },
      { status: 400 },
    );

  targetUrl = normalizeUrl(targetUrl);
  if (!isValidUrl(targetUrl)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (code) {
    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: "Invalid code. Must be [A-Za-z0-9]{6,8}" },
        { status: 400 },
      );
    }
    // check existence
    const existing = await db.link.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 },
      );
    }
  } else {
    // generate random 7-char code
    code = generateRandomCode(7);
    // ensure uniqueness (loop once or twice)
    let attempts = 0;
    while (attempts < 5) {
      const check = await db.link.findUnique({ where: { code } });
      if (!check) break;
      code = generateRandomCode(7);
      attempts++;
    }
  }

  const created = await db.link.create({
    data: {
      code,
      targetUrl,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

function generateRandomCode(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
