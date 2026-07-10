import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#071915] py-8 text-[#b8c9c1]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 text-sm sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-bold text-white">Clip2Map</p>
          <p className="mt-1">Product status: Early MVP · Demo data only.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/feedback" className="transition hover:text-white">
            Feedback
          </Link>
          <Link href="/create" className="transition hover:text-white">
            Request a food map
          </Link>
        </nav>
      </div>
    </footer>
  );
}
