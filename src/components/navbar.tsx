"use client";

import Link from "next/link";
import { Separator } from "./ui/separator";

export default function Navbar() {
  return (
    <>
      <nav className="w-full py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            TinyLink
          </Link>
        </div>
      </nav>
      <Separator />
    </>
  );
}
