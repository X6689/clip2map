"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { buildMailto, copyText } from "@/lib/feedback";

type FallbackActionsProps = {
  subject: string;
  content: string;
  copyLabel: string;
};

export function FallbackActions({
  subject,
  content,
  copyLabel,
}: FallbackActionsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">(
    "idle",
  );

  async function handleCopy() {
    const copied = await copyText(content);
    setCopyState(copied ? "copied" : "manual");
  }

  return (
    <div className="mt-5 grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={buildMailto(subject, content)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#123f4d] px-4 text-sm font-bold text-white transition hover:bg-[#0b303b]"
        >
          <Mail aria-hidden="true" size={17} />
          Open email draft
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#b9c5be] bg-white px-4 text-sm font-bold text-[#14251f] transition hover:border-[#87958e]"
        >
          {copyState === "copied" ? (
            <Check aria-hidden="true" size={17} />
          ) : (
            <Copy aria-hidden="true" size={17} />
          )}
          {copyState === "copied" ? "Copied" : copyLabel}
        </button>
      </div>
      {copyState === "manual" ? (
        <label className="grid gap-2 text-xs font-bold text-[#9b3b25]">
          Clipboard access is restricted. Select and copy the request:
          <textarea
            readOnly
            value={content}
            onFocus={(event) => event.currentTarget.select()}
            rows={8}
            className="resize-y rounded-md border border-[#f0b2a3] bg-white p-3 font-mono text-xs font-normal leading-5 text-[#14251f]"
          />
        </label>
      ) : null}
    </div>
  );
}
