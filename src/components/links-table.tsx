"use client";

import { CopyIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Link } from "generated/prisma";

export default function LinksTable({
  links,
  onDelete,
}: {
  links: Link[];
  onDelete: (code: string) => void;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [copyLoading, setCopyLoading] = useState<string | null>(null);

  function openConfirm(code: string) {
    setSelectedCode(code);
    setOpen(true);
  }

  async function confirmDelete() {
    if (!selectedCode) return;

    setLoadingDelete(true);

    const res = await fetch(`/api/links/${selectedCode}`, {
      method: "DELETE",
    });

    setLoadingDelete(false);

    if (res.ok) {
      onDelete(selectedCode);
      setOpen(false);
    }
  }

  async function copy(code: string) {
    try {
      const short = `${window.location.origin}/${code}`;
      setCopyLoading(code);

      await navigator.clipboard.writeText(short);
      toast.success("Copied!");

      setTimeout(() => {
        setCopyLoading(null);
      }, 400);
    } catch (error) {
      toast.error("Failed to copy");
      setCopyLoading(null);
    }
  }

  const filtered = links.filter((l) =>
    [l.code.toLowerCase(), l.targetUrl.toLowerCase()].some((v) =>
      v.includes(filter.toLowerCase()),
    ),
  );

  return (
    <div className="mt-6 space-y-4">
      <Input
        placeholder="Search by code or URL"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Last Clicked</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((l) => (
            <TableRow key={l.code}>
              <TableCell className="font-mono">{l.code}</TableCell>
              <TableCell className="max-w-xs truncate">{l.targetUrl}</TableCell>
              <TableCell>{l.clicks}</TableCell>
              <TableCell>
                {l.lastClicked
                  ? new Date(l.lastClicked).toLocaleString()
                  : "Never"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => copy(l.code)}
                  disabled={copyLoading === l.code}
                  className="flex items-center gap-2"
                >
                  {copyLoading === l.code ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/code/${l.code}`)}
                >
                  Stats
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => openConfirm(l.code)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Short Link?</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{selectedCode}</strong>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loadingDelete}
              onClick={confirmDelete}
              className="flex items-center gap-2"
            >
              {loadingDelete && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
