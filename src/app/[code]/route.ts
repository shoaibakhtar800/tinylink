import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: { code: string } },
) {
  const { code } = params;
  const link = await db.link.findUnique({ where: { code } });
  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  // update clicks & lastClicked
  await db.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
