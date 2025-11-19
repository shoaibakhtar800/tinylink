import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

// @ts-expect-error Next.js dynamic route context has no type
export async function GET(req: NextRequest, context) {
  const { code } = context.params as { code: string };
  const link = await db.link.findUnique({ where: { code } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(link);
}

// @ts-expect-error Next.js dynamic route context has no type
export async function DELETE(req: NextRequest, context) {
  const { code } = context.params as { code: string };
  const link = await db.link.findUnique({ where: { code } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.link.delete({ where: { code } });
  return NextResponse.json({ ok: true });
}
