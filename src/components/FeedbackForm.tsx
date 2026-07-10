"use client";

import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { FallbackActions } from "@/components/FallbackActions";
import { trackEvent } from "@/lib/analytics";
import { submitFeedback } from "@/lib/feedback";

type FormStatus = "idle" | "submitting" | "success" | "fallback" | "error";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formatFeedback(data: Record<string, string>) {
  return [
    "Clip2Map Product Feedback",
    "",
    `Trying to do: ${data.goal}`,
    `Confusing: ${data.confusing}`,
    `Most useful feature: ${data.feature}`,
    `Email: ${data.email || "Not provided"}`,
    "",
    "Shared as part of Clip2Map early product research.",
  ].join("\n");
}

export function FeedbackForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [content, setContent] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const data = {
      goal: value(formData, "goal"),
      confusing: value(formData, "confusing"),
      feature: value(formData, "feature"),
      email: value(formData, "email"),
    };
    const nextContent = formatFeedback(data);

    setContent(nextContent);
    setStatus("submitting");

    try {
      const result = await submitFeedback({
        email: data.email,
        city: "",
        videoLinks: "",
        mapType: "feedback",
        notes: nextContent,
        sourcePage: "/feedback",
        createdAt: new Date().toISOString(),
        submissionType: "product_feedback",
        goal: data.goal,
        confusing: data.confusing,
        feature: data.feature,
      });
      setStatus(result.delivery === "endpoint" ? "success" : "fallback");
      trackEvent("feedback_submitted", { delivery: result.delivery });
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
            ? "Your feedback is ready, but it has not been uploaded."
            : "The feedback endpoint could not receive this response."}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6f5148]">
          Open an email draft or copy the response. Nothing is sent without your
          next explicit action.
        </p>
        <FallbackActions
          subject="Clip2Map product feedback"
          content={content}
          copyLabel="Copy Feedback"
        />
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8c3824] hover:text-[#612516]"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Edit feedback
        </button>
      </div>
    );
  }

  const fieldClass =
    "min-w-0 rounded-md border border-[#cfd7d1] bg-white p-3 font-normal placeholder:text-[#9aa69f] focus:border-[#123f4d]";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#d8ded9] bg-white p-5 shadow-[0_12px_40px_rgb(20_37_31_/_8%)] sm:p-7"
    >
      <label className="grid gap-2 text-sm font-bold">
        What were you trying to do? *
        <textarea
          name="goal"
          required
          rows={4}
          placeholder="Plan a trip, find a saved restaurant, share a list..."
          className={fieldClass}
        />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        What was confusing? *
        <textarea
          name="confusing"
          required
          rows={4}
          placeholder="Tell us where you hesitated or expected something different."
          className={fieldClass}
        />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        Which feature would be most useful? *
        <select
          name="feature"
          required
          defaultValue=""
          className="h-11 min-w-0 rounded-md border border-[#cfd7d1] bg-white px-3 font-normal focus:border-[#123f4d]"
        >
          <option value="" disabled>
            Select one
          </option>
          {[
            "Paste a food list",
            "Upload a CSV",
            "Paste social media links",
            "Import from Google Maps",
            "Shareable map collections",
            "Other",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">
        Email optional
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          className="h-11 min-w-0 rounded-md border border-[#cfd7d1] px-3 font-normal placeholder:text-[#9aa69f] focus:border-[#123f4d]"
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
        {status === "submitting" ? "Submitting..." : "Submit feedback"}
      </button>
      <p className="mt-4 text-xs leading-5 text-[#6c7b75]">
        Feedback is stored only after you submit. If delivery fails, you will be
        offered an email or copy fallback.
      </p>
    </form>
  );
}
