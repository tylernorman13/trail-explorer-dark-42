import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { RegionMap, RegionList } from "@/components/RegionMap";
import { HIKES, STATES } from "@/lib/hikes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trail Atlas — Pacific Coast hiking guide" },
      {
        name: "description",
        content:
          "A mobile hiking guide to Washington, Oregon and California. Waterfalls, alpine lakes, ridges and peaks — mapped, filtered, ready to send.",
      },
      { property: "og:title", content: "Trail Atlas — Pacific Coast hiking guide" },
      {
        property: "og:description",
        content:
          "Mobile-first guide to the best hikes in Washington, Oregon and California.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const total = HIKES.length;

  return (
    <div className="pb-4">
      <AppTopBar />

      <div className="px-4">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/50 focus-within:border-primary/50">
          <Search className="h-4 w-4" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Search spots, regions, themes…"
          />
        </label>
      </div>

      <section className="mt-5 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-white/5">
          <div className="aspect-square w-full">
            <RegionMap />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Coverage
            </div>
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-white">
              Pacific Coast
            </h1>
            <p className="mt-1 max-w-[36ch] text-sm text-white/60">
              {total} spots across {STATES.length} states — from Olympic
              rainforest to the Sierra crest.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-1 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Browse by region
            </div>
          </div>
          <Link
            to="/explore"
            className="text-xs font-medium text-primary hover:underline"
          >
            All spots →
          </Link>
        </div>
        <RegionList />
      </section>
    </div>
  );
}
