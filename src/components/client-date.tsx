"use client";

import { useEffect, useState } from "react";

export default function ClientDate({ value }: { value: string | null }) {
  const [formatted, setFormatted] = useState("Loading...");

  useEffect(() => {
    if (value) {
      setFormatted(new Date(value).toLocaleString());
    } else {
      setFormatted("Never");
    }
  }, [value]);

  return <span>{formatted}</span>;
}
