import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Image as ImageIcon,
  ListPlus,
  Map,
  MapPinned,
  MessageCircle,
  Send,
  StickyNote,
  Tags,
} from "lucide-react";
import { AnalyticsEvent } from "@/components/AnalyticsEvent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedLink } from "@/components/TrackedLink";

const scatteredSources = [
  { label: "Random notes", icon: StickyNote },
  { label: "TikTok favorites", icon: Heart },
  { label: "Screenshots", icon: ImageIcon },
  { label: "Google Maps lists", icon: Map },
  { label: "Messages from friends", icon: MessageCircle },
];

const steps = [
  {
    number: "01",
    title: "Add your food spots",
    description: "Bring in the places saved across videos, notes, and messages.",
    icon: ListPlus,
  },
  {
    number: "02",
    title: "Organize the details",
    description: "Group each place with practical categories and short notes.",
    icon: Tags,
  },
  {
    number: "03",
    title: "Share one clean map",
    description: "Send one link that is easier to scan, plan, and revisit.",
    icon: Send,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8f6] text-[#14251f]">
      <AnalyticsEvent name="landing_viewed" />
      <SiteHeader />

      <section className="relative h-[calc(100svh-7rem)] min-h-[580px] max-h-[760px] overflow-hidden border-b border-[#d8ded9]">
        <iframe
          title="OpenStreetMap view of Tokyo"
          src="https://www.openstreetmap.org/export/embed.html?bbox=139.60%2C35.60%2C139.84%2C35.78&layer=mapnik&marker=35.6895%2C139.6917"
          className="absolute inset-0 h-full w-full scale-[1.03] border-0"
          loading="eager"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-[#071915]/75" />
        <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase text-[#ffb39f]">
              <MapPinned aria-hidden="true" size={17} />
              Clip2Map
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
              Turn food spots into a shareable map.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#d6e1dc] sm:text-xl sm:leading-8">
              Organize restaurants, cafes and travel food recommendations into
              a clean map you can share in minutes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/maps/tokyo-ramen"
                eventName="demo_map_opened"
                eventProperties={{ location: "hero" }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ee5d3a] px-5 text-sm font-bold text-white transition hover:bg-[#d94d2d]"
              >
                <MapPinned aria-hidden="true" size={18} />
                View Demo Map
              </TrackedLink>
              <TrackedLink
                href="/create"
                eventName="create_map_clicked"
                eventProperties={{ location: "hero" }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/60 bg-[#071915]/45 px-5 text-sm font-bold text-white transition hover:bg-[#071915]/70"
              >
                Request a food map
                <ArrowRight aria-hidden="true" size={18} />
              </TrackedLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#b8c9c1]">
              <Check aria-hidden="true" size={15} />
              Early MVP · No account required
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8ded9] bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase text-[#ee5d3a]">
                One place for every save
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
                Great food spots are easy to save and hard to find again.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#52635d]">
                Clip2Map turns scattered recommendations into one organized view
                built for your next trip.
              </p>
            </div>
            <div className="border-t border-[#d8ded9]">
              {scatteredSources.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 border-b border-[#d8ded9] py-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#eef2ef] text-[#123f4d]">
                    <Icon aria-hidden="true" size={17} />
                  </span>
                  <span className="font-semibold">{label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    className="ml-auto text-[#9aa69f]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-bold uppercase text-[#ee5d3a]">How it works</p>
          <div className="mt-8 grid border-y border-[#d8ded9] md:grid-cols-3">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <article
                key={number}
                className={`py-7 md:px-7 ${
                  index > 0
                    ? "border-t border-[#d8ded9] md:border-t-0 md:border-l"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#87958e]">
                    {number}
                  </span>
                  <Icon aria-hidden="true" size={20} className="text-[#123f4d]" />
                </div>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52635d]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d8ded9] bg-[#0d2723] py-20 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[#ffb39f]">Example map</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Tokyo Ramen Map
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#bfcec8]">
              Eight demo ramen stops across Tokyo, organized by style with quick
              notes and dishes to try.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
              {['8 demo spots', 'Shoyu', 'Tonkotsu', 'Miso', 'Tsukemen'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/20 px-3 py-2 text-[#dce6e1]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <TrackedLink
              href="/maps/tokyo-ramen"
              eventName="demo_map_opened"
              eventProperties={{ location: "example_section" }}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-[#14251f] transition hover:bg-[#e9efec]"
            >
              View the map
              <ArrowRight aria-hidden="true" size={17} />
            </TrackedLink>
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-lg border border-white/20 bg-[#dce6de]">
            <iframe
              title="Tokyo Ramen Map preview"
              src="https://www.openstreetmap.org/export/embed.html?bbox=139.60%2C35.60%2C139.84%2C35.78&layer=mapnik&marker=35.6895%2C139.6917"
              className="h-full w-full border-0"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 rounded-md bg-white px-3 py-2 text-xs font-bold text-[#14251f] shadow-sm">
              Demo map for product testing
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#ee5d3a] py-16 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            Stop losing great food spots in random notes.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/create"
              eventName="create_map_clicked"
              eventProperties={{ location: "bottom_cta" }}
              className="inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-md bg-[#14251f] px-5 text-sm font-bold text-white transition hover:bg-[#0d342f]"
            >
              Request a food map
              <ArrowRight aria-hidden="true" size={18} />
            </TrackedLink>
            <Link
              href="/feedback"
              className="inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-md border border-white/70 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Share feedback
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
