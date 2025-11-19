import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

// @ts-expect-error Next.js dynamic route context has no type
export async function GET(req: NextRequest, context) {
  const { code } = context.params;
  const link = await db.link.findUnique({ where: { code } });
  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  await db.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
