"use client";

import type { Link } from "generated/prisma";
import { useEffect, useState } from "react";
import AddLinkForm from "~/components/add-link-form";
import LinksTable from "~/components/links-table";
import { env } from "~/env";

export default function HomePage() {
  const [links, setLinks] = useState<Link[]>([]);

  const getAllLinks = async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/links`, {
      cache: "no-store",
    });
    setLinks(await res.json() as Link[]);
  };

  useEffect(() => {
    void getAllLinks();
  }, []);

  return (
    <div className="mx-auto max-w-5xl py-6">
      <AddLinkForm getAllLinks={getAllLinks} />
      <LinksTable
        links={links}
        onDelete={(code) => setLinks(links.filter((l) => l.code !== code))}
      />
    </div>
  );
}
