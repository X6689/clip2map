import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the Clip2Map early MVP handles demo data and form submissions.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#14251f]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="flex items-center gap-2 text-sm font-bold uppercase text-[#ee5d3a]">
          <ShieldCheck aria-hidden="true" size={17} />
          Early MVP privacy
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
          What Clip2Map handles today
        </h1>
        <p className="mt-5 text-base leading-7 text-[#52635d]">
          This short notice describes the actual behavior of the current product
          research prototype. It is not a template for features that do not exist.
        </p>

        <div className="mt-10 border-t border-[#d8ded9]">
          {[
            {
              title: "Demo map",
              body: "The Tokyo Ramen Map is for product testing. Its locations and descriptions are illustrative and are not claimed to be personally reviewed recommendations.",
            },
            {
              title: "Form submissions",
              body: "A form submission is attempted only when you explicitly press submit. Map requests and feedback are sent to insert-only Supabase tables first, with the validation endpoint retained as a temporary backup. If both fail, the page shows a copy and email fallback instead of claiming success.",
            },
            {
              title: "Data collected",
              body: "The map request and feedback forms ask only for the information shown on those pages. Do not include passwords, payment details, or other sensitive information.",
            },
            {
              title: "Analytics status",
              body: "The MVP includes a lightweight event interface for development testing. No third-party analytics platform or hidden user profile is connected.",
            },
          ].map((item) => (
            <section key={item.title} className="border-b border-[#d8ded9] py-6">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#52635d]">{item.body}</p>
            </section>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
