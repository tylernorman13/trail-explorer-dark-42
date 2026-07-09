import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, ChevronRight } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HIKES, kmToMi, mToFt, type Hike } from "@/lib/hikes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trail Atlas — Discover legendary hikes" },
      {
        name: "description",
        content:
          "A mobile hiking guide to legendary trails around the world. Difficulty, distance, elevation, and photos, all on one interactive map.",
      },
      { property: "og:title", content: "Trail Atlas — Discover legendary hikes" },
      {
        property: "og:description",
        content:
          "Mobile-first hiking guide: difficulty, distance, elevation, photos, and an interactive dark map.",
      },
    ],
  }),
  component: Home,
});

const dot: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-yellow-400",
  Hard: "bg-orange-400",
  Expert: "bg-rose-400",
};

function Home() {
  const featured = HIKES[0];

  return (
    <div>
      <AppTopBar />

      <div className="px-4">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/50 focus-within:border-primary/50">
          <Search className="h-4 w-4" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Search trails, regions, difficulty…"
          />
        </label>
      </div>

      <section className="mt-4 px-4">
        <Link
          to="/map"
          search={{ id: featured.id }}
          className="block overflow-hidden rounded-3xl bg-card ring-1 ring-white/5"
        >
          <div className="relative aspect-[4/3] w-full">
            <img
              src={featured.images[0]}
              alt={featured.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {featured.tagline}
              </div>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-white">
                {featured.name}
              </h1>
              <p className="mt-1 text-sm text-white/70">{featured.region}</p>
            </div>
          </div>
        </Link>
      </section>

      <section className="mt-8 px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Browse the guide
            </div>
            <h2 className="text-xl font-semibold text-white">All trails</h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-medium text-primary hover:underline"
          >
            See all →
          </Link>
        </div>

        <ul className="space-y-3">
          {HIKES.map((h) => (
            <li key={h.id}>
              <Link
                to="/map"
                search={{ id: h.id }}
                className="flex items-center gap-4 rounded-2xl bg-card p-3 ring-1 ring-white/5 transition hover:ring-white/15"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={h.images[0]}
                    alt={h.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/50">
                    <span className={cn("h-1.5 w-1.5 rounded-full", dot[h.difficulty])} />
                    {h.difficulty} · {kmToMi(h.distanceKm)} mi · ↑ {mToFt(h.elevationM).toLocaleString()} ft
                  </div>
                  <h3 className="mt-1 truncate text-base font-semibold text-white">
                    {h.name}
                  </h3>
                  <p className="truncate text-xs text-white/50">{h.region}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-white/30" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
