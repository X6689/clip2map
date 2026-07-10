"use client";

import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { FallbackActions } from "@/components/FallbackActions";
import { trackEvent } from "@/lib/analytics";
import { submitFeedback } from "@/lib/feedback";

const mappingOptions = [
  "Restaurants",
  "Caf\u00e9s",
  "Street food",
  "Desserts",
  "Bars",
  "Mixed food spots",
  "Other",
];

const storageOptions = [
  "Notes",
  "Google Maps",
  "TikTok",
  "Instagram",
  "YouTube",
  "Spreadsheet",
  "Messages",
  "Other",
];

const inputOptions = [
  "Paste a list",
  "Upload a CSV",
  "Add places one by one",
  "Paste social media links",
  "Import from Google Maps",
];

type FormStatus = "idle" | "submitting" | "success" | "fallback" | "error";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formatRequest(data: Record<string, string>) {
  return [
    "Clip2Map Map Request",
    "",
    `Map title: ${data.mapTitle}`,
    `City: ${data.city}`,
    `Mapping: ${data.mappingType}`,
    `Number of places: ${data.placeCount}`,
    `Current storage: ${data.currentStorage}`,
    `Preferred input: ${data.preferredInput}`,
    `Video links: ${data.videoLinks || "None"}`,
    `Email: ${data.email}`,
    `Optional notes: ${data.notes || "None"}`,
    "",
    "Submitted as part of Clip2Map early product research.",
  ].join("\n");
}

export function CreateMapForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [requestContent, setRequestContent] = useState("");
  const started = useRef(false);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackEvent("map_request_started");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const data = {
      mapTitle: value(formData, "mapTitle"),
      city: value(formData, "city"),
      mappingType: value(formData, "mappingType"),
      placeCount: value(formData, "placeCount"),
      currentStorage: value(formData, "currentStorage"),
      preferredInput: value(formData, "preferredInput"),
      videoLinks: value(formData, "videoLinks"),
      email: value(formData, "email"),
      notes: value(formData, "notes"),
    };
    const content = formatRequest(data);

    setRequestContent(content);
    setStatus("submitting");

    try {
      const result = await submitFeedback({
        email: data.email,
        city: data.city,
        videoLinks: data.videoLinks,
        mapType: data.mappingType,
        notes: data.notes,
        sourcePage: "/create",
        createdAt: new Date().toISOString(),
        submissionType: "map_request",
        mapTitle: data.mapTitle,
        placeCount: data.placeCount,
        currentStorage: data.currentStorage,
        preferredInput: data.preferredInput,
      });
      setStatus(result.delivery === "fallback" ? "fallback" : "success");
      trackEvent("map_request_submitted", { delivery: result.delivery });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-[#b9d0c5] bg-[#edf7f1] p-6">
        <CheckCircle2 aria-hidden="true" size={28} className="text-[#176b4b]" />
        <h2 className="mt-4 text-xl font-bold">
          Request received. We&apos;ll review your links and send a sample map if it
          fits the test.
        </h2>
      </div>
    );
  }

  if (status === "fallback" || status === "error") {
    return (
      <div className="rounded-lg border border-[#f0b2a3] bg-[#fff1eb] p-6">
        <h2 className="text-xl font-bold text-[#8c3824]">
          {status === "fallback"
            ? "Your request is ready, but it has not been uploaded."
            : "The feedback endpoint could not receive this request."}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6f5148]">
          Use an email draft or copy the structured request. You stay in control
          of whether it is sent.
        </p>
        <FallbackActions
          subject="Clip2Map map request"
          content={requestContent}
          copyLabel="Copy Request"
        />
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8c3824] hover:text-[#612516]"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Edit request
        </button>
      </div>
    );
  }

  const fieldClass =
    "h-11 min-w-0 rounded-md border border-[#cfd7d1] bg-white px-3 font-normal placeholder:text-[#9aa69f] focus:border-[#123f4d]";

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className="rounded-lg border border-[#d8ded9] bg-white p-5 shadow-[0_12px_40px_rgb(20_37_31_/_8%)] sm:p-7"
    >
      <p className="text-xs font-bold uppercase text-[#9b3b25]">
        Fields marked * are required
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          Map title *
          <input
            name="mapTitle"
            required
            placeholder="Tokyo coffee weekend"
            className={fieldClass}
          />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          City *
          <input name="city" required placeholder="Tokyo" className={fieldClass} />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          What are you mapping? *
          <select name="mappingType" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select one
            </option>
            {mappingOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          Number of places *
          <select name="placeCount" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a range
            </option>
            {["1-5", "6-10", "11-25", "26-50", "51+"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          Where is your list currently stored? *
          <select name="currentStorage" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select one
            </option>
            {storageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold">
          Preferred input method *
          <select name="preferredInput" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select one
            </option>
            {inputOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        Video links *
        <textarea
          name="videoLinks"
          required
          rows={5}
          placeholder={"Paste one TikTok, Reels, or Shorts link per line."}
          className="resize-y rounded-md border border-[#cfd7d1] p-3 font-normal placeholder:text-[#9aa69f] focus:border-[#123f4d]"
        />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        Email *
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="alex@example.com"
          className={fieldClass}
        />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        Optional notes
        <textarea
          name="notes"
          rows={4}
          placeholder="What would make this map useful for your trip or audience?"
          className="resize-y rounded-md border border-[#cfd7d1] p-3 font-normal placeholder:text-[#9aa69f] focus:border-[#123f4d]"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#123f4d] px-4 text-sm font-bold text-white transition hover:bg-[#0b303b] disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? (
          <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />
        ) : null}
        {status === "submitting" ? "Submitting..." : "Submit map request"}
      </button>
      <p className="mt-4 text-xs leading-5 text-[#6c7b75]">
        Submissions are only sent when you press submit. Clip2Map stores the
        request for this validation test; if delivery fails, you can copy it.
      </p>
    </form>
  );
}
