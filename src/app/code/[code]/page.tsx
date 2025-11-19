import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { db } from "~/server/db";

export default async function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) return <div className="text-center text-xl">Not Found</div>;

  return (
    <Card className="mt-6 border">
      <CardHeader>
        <h1 className="text-2xl font-semibold">Stats: {link.code}</h1>
      </CardHeader>

      <CardContent className="space-y-3">
        <p>
          <strong>Target URL:</strong> {link.targetUrl}
        </p>
        <p>
          <strong>Clicks:</strong> {link.clicks}
        </p>
        <p>
          <strong>Last clicked:</strong>
          {link.lastClicked
            ? " " + new Date(link.lastClicked).toLocaleString()
            : " Never"}
        </p>
        <p>
          <strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
