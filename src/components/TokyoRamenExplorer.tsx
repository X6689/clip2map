"use client";

import dynamic from "next/dynamic";
import { Check, Copy, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ramenCategories,
  tokyoRamenPlaces,
  type RamenCategory,
} from "@/data/tokyo-ramen";
import { trackEvent } from "@/lib/analytics";
import { copyText } from "@/lib/feedback";

const TokyoRamenMap = dynamic(() => import("./TokyoRamenMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#e8eeea] text-sm font-semibold text-[#52635d]">
      Loading map...
    </div>
  ),
});

type Filter = "All" | RamenCategory;

export function TokyoRamenExplorer() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">(
    "idle",
  );
  const [shareUrl, setShareUrl] = useState("");

  const filteredPlaces = useMemo(
    () =>
      filter === "All"
        ? tokyoRamenPlaces
        : tokyoRamenPlaces.filter((place) => place.category === filter),
    [filter],
  );

  function changeFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setSelectedId(null);
    trackEvent("category_filter_used", { category: nextFilter });
  }

  function selectPlace(id: string) {
    setSelectedId(id);
    trackEvent("place_card_selected", { placeId: id });
  }

  async function handleCopy() {
    const currentUrl = window.location.href;
    setShareUrl(currentUrl);
    const copied = await copyText(currentUrl);
    setCopyState(copied ? "copied" : "manual");
    trackEvent("map_link_copied", { method: copied ? "clipboard" : "manual" });
    if (copied) {
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border-y border-[#d8ded9] py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Filter ramen places">
          {(["All", ...ramenCategories] as Filter[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => changeFilter(category)}
              className={`h-9 rounded-md border px-3 text-sm font-semibold transition ${
                filter === category
                  ? "border-[#123f4d] bg-[#123f4d] text-white"
                  : "border-[#cfd7d1] bg-white text-[#52635d] hover:border-[#87958e] hover:text-[#14251f]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#cfd7d1] bg-white px-4 text-sm font-semibold text-[#14251f] transition hover:border-[#87958e]"
          >
            {copyState === "copied" ? (
              <Check aria-hidden="true" size={16} />
            ) : (
              <Copy aria-hidden="true" size={16} />
            )}
            {copyState === "copied" ? "Link copied" : "Copy Map Link"}
          </button>
          <span className="text-sm text-[#6c7b75]" aria-live="polite" />
        </div>
      </div>

      {copyState === "manual" ? (
        <label className="mb-5 grid gap-2 rounded-lg border border-[#f0b2a3] bg-[#fff1eb] p-4 text-sm font-bold text-[#9b3b25]">
          Clipboard access is restricted. Select and copy this link:
          <input
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="h-10 min-w-0 rounded-md border border-[#f0b2a3] bg-white px-3 font-mono text-xs font-normal text-[#14251f]"
          />
        </label>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="h-[430px] overflow-hidden rounded-lg border border-[#cfd7d1] bg-[#e8eeea] sm:h-[560px]">
          <TokyoRamenMap
            places={filteredPlaces}
            selectedId={selectedId}
            onSelect={selectPlace}
          />
        </div>

        <div className="grid max-h-none gap-3 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
          {filteredPlaces.map((place, index) => (
            <button
              key={place.id}
              type="button"
              onClick={() => selectPlace(place.id)}
              className={`w-full rounded-lg border bg-white p-4 text-left transition ${
                selectedId === place.id
                  ? "border-[#123f4d] shadow-[0_0_0_2px_#123f4d]"
                  : "border-[#d8ded9] hover:border-[#87958e]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-[#ee5d3a]">
                    {index + 1}. {place.category}
                  </p>
                  <h2 className="mt-1 text-base font-bold text-[#14251f]">
                    {place.name}
                  </h2>
                </div>
                <span className="shrink-0 rounded-md bg-[#eef2ef] px-2 py-1 text-xs font-bold text-[#52635d]">
                  {place.priceLevel}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#52635d]">
                <MapPin aria-hidden="true" size={14} />
                {place.area}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#52635d]">
                {place.shortNote}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#14251f]">
                Try: {place.recommendedDish}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
