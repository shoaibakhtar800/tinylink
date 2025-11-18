"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function AddLinkForm({ getAllLinks }: { getAllLinks: () => void }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ targetUrl, code: code || undefined }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Something went wrong");
      toast.error(data.error || "Something went wrong");
      return;
    }

    setMsg(`Short link created: ${data.code}`);
    toast.success(`Short link created: ${data.code}`);
    setTargetUrl("");
    setCode("");

    getAllLinks();
  }

  return (
    <Card className="border">
      <CardHeader>
        <h2 className="text-xl font-semibold">Create Short Link</h2>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label>Long URL</Label>
            <Input
              placeholder="https://google.com"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Custom Code (optional)</Label>
            <Input
              placeholder="6–8 alphanumeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Link"}
          </Button>
          {msg && (
            <Alert>
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
