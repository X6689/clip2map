import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { CreateMapForm } from "@/components/CreateMapForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Create your first food map",
  description: "Request a food-map workflow as part of Clip2Map product research.",
};

export default function CreateMapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#14251f]">
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:py-20">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#52635d] hover:text-[#14251f]"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back home
          </Link>
          <p className="mt-10 text-sm font-bold uppercase text-[#ee5d3a]">
            Early product research
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Create your first food map
          </h1>
          <p className="mt-5 text-base leading-7 text-[#52635d]">
            Tell us what kind of food list you want to organize. Clip2Map is
            currently testing the simplest creation workflow.
          </p>
          <ul className="mt-8 grid gap-3 text-sm font-semibold text-[#52635d]">
            {[
              "No account required",
              "No social-platform scraping",
              "No promise of automatic map generation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" size={16} className="text-[#176b4b]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <CreateMapForm />
      </section>
      <SiteFooter />
    </main>
  );
}
