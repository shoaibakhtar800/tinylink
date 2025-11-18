import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: { code: string } },
) {
  const { code } = params;
  const link = await db.link.findUnique({ where: { code } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(
  req: Request,
  { params }: { params: { code: string } },
) {
  const { code } = params;
  const link = await db.link.findUnique({ where: { code } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.link.delete({ where: { code } });
  return NextResponse.json({ ok: true });
}
