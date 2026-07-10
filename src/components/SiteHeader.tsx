import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";

export function SiteHeader() {
  return (
    <header className="border-b border-[#d8ded9] bg-[#f7f8f6]/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold text-[#14251f]"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-[#ee5d3a] text-white">
            <MapPin aria-hidden="true" size={17} strokeWidth={2.5} />
          </span>
          Clip2Map
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <Link
            href="/maps/tokyo-ramen"
            className="hidden px-3 py-2 text-sm font-semibold text-[#52635d] transition hover:text-[#14251f] sm:block"
          >
            Demo map
          </Link>
          <Link
            href="/feedback"
            className="hidden px-3 py-2 text-sm font-semibold text-[#52635d] transition hover:text-[#14251f] md:block"
          >
            Feedback
          </Link>
          <TrackedLink
            href="/create"
            eventName="create_map_clicked"
            eventProperties={{ location: "header" }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#123f4d] px-4 text-sm font-semibold text-white transition hover:bg-[#0b303b]"
          >
            <Plus aria-hidden="true" size={16} />
            Request a map
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
