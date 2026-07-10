import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Share feedback",
  description: "Share focused product feedback about the Clip2Map early MVP.",
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#14251f]">
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:py-20">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase text-[#ee5d3a]">
            <MessageSquareText aria-hidden="true" size={17} />
            Early MVP feedback
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Help us find the simplest useful workflow.
          </h1>
          <p className="mt-5 text-base leading-7 text-[#52635d]">
            Tell us what you expected, where the product felt unclear, and which
            next capability would matter most. Short, specific feedback is enough.
          </p>
        </div>
        <FeedbackForm />
      </section>
      <SiteFooter />
    </main>
  );
}
