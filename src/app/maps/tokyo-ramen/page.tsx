import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned, MessageSquareText } from "lucide-react";
import { AnalyticsEvent } from "@/components/AnalyticsEvent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TokyoRamenExplorer } from "@/components/TokyoRamenExplorer";
import { TrackedLink } from "@/components/TrackedLink";
import { tokyoRamenPlaces } from "@/data/tokyo-ramen";

export const metadata: Metadata = {
  title: "Tokyo Ramen Map",
  description: "A public Clip2Map demo with eight example ramen spots in Tokyo.",
};

export default function TokyoRamenMapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#14251f]">
      <AnalyticsEvent name="demo_map_opened" />
      <SiteHeader />
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase text-[#ee5d3a]">
              <MapPinned aria-hidden="true" size={17} />
              Public example
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Tokyo Ramen Map
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#52635d]">
              A sample collection showing how food recommendations can become one
              practical map. Select a card to move the map to that area.
            </p>
          </div>
          <div className="w-fit rounded-md border border-[#f0b2a3] bg-[#fff1eb] px-4 py-3 text-sm font-bold text-[#9b3b25]">
            Demo map for product testing.
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#52635d]">
          <p>
            <strong className="text-[#14251f]">{tokyoRamenPlaces.length}</strong>{" "}
            demo places
          </p>
          <p>
            <strong className="text-[#14251f]">4</strong> ramen styles
          </p>
          <p>Locations and descriptions are illustrative, not field-tested reviews.</p>
        </div>

        <div className="mt-4">
          <TokyoRamenExplorer />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#d8ded9] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Would your own food list work here?</h2>
            <p className="mt-2 text-sm text-[#52635d]">
              Request a map workflow or tell us what this demo is missing.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/create"
              eventName="create_map_clicked"
              eventProperties={{ location: "demo_map" }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#123f4d] px-4 text-sm font-bold text-white transition hover:bg-[#0b303b]"
            >
              Request a food map
              <ArrowRight aria-hidden="true" size={17} />
            </TrackedLink>
            <Link
              href="/feedback"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#cfd7d1] bg-white px-4 text-sm font-bold text-[#14251f] transition hover:border-[#87958e]"
            >
              <MessageSquareText aria-hidden="true" size={17} />
              Share feedback
            </Link>
          </div>
        </div>
      </section>
      <div className="border-t border-[#d8ded9] bg-white py-6">
        <p className="mx-auto w-full max-w-7xl px-5 text-sm text-[#6c7b75] sm:px-8">
          Map tiles by OpenStreetMap contributors. All place content is demo data.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
