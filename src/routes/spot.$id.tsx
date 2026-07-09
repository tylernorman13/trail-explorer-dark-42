import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  MapPin,
  Share2,
} from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HIKES, STATES, kmToMi, mToFt, type Hike } from "@/lib/hikes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spot/$id")({
  parseParams: (raw) => {
    const id = raw.id ?? "";
    if (!HIKES.some((h) => h.id === id)) throw notFound();
    return { id };
  },
  stringifyParams: (params) => ({ id: params.id }),
  head: ({ params }) => {
    const h = HIKES.find((x) => x.id === params.id);
    if (!h) return { meta: [{ title: "Spot — Trail Atlas" }] };
    return {
      meta: [
        { title: `${h.name} — Trail Atlas` },
        { name: "description", content: h.description },
        { property: "og:title", content: `${h.name} — Trail Atlas` },
        { property: "og:description", content: h.description },
        { property: "og:image", content: h.images[0] },
      ],
    };
  },
  component: SpotPage,
});

const DIFF_DOT: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-yellow-400",
  Hard: "bg-orange-400",
  Expert: "bg-rose-400",
};

function SpotPage() {
  const { id } = Route.useParams();
  const hike = HIKES.find((h) => h.id === id)!;
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState(false);
  const state = STATES.find((s) => s.code === hike.state);

  const prev = () =>
    setI((v) => (v - 1 + hike.images.length) % hike.images.length);
  const next = () => setI((v) => (v + 1) % hike.images.length);

  const related = HIKES.filter(
    (h) => h.state === hike.state && h.id !== hike.id,
  ).slice(0, 4);

  return (
    <div className="pb-8">
      <AppTopBar />

      <div className="relative w-full">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
          <img
            src={hike.images[i]}
            alt={`${hike.name} — photo ${i + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

          {/* Top actions */}
          <div className="absolute inset-x-3 top-3 flex items-center justify-between">
            <Link
              to="/region/$state"
              params={{ state: hike.state }}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Share"
                className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Save"
                onClick={() => setSaved((v) => !v)}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full backdrop-blur transition",
                  saved ? "bg-primary text-primary-foreground" : "bg-black/60 text-white",
                )}
              >
                <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Carousel controls */}
          {hike.images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-1.5">
                {hike.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              {hike.type}
            </div>
            <h1 className="mt-1 text-3xl font-semibold leading-tight text-white">
              {hike.name}
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5" />
              {hike.region}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4">
        <div className="-mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 text-center ring-1 ring-white/10 shadow-lg shadow-black/40">
          <Stat label="Distance" value={`${kmToMi(hike.distanceKm)} mi`} />
          <Stat
            label="Elevation"
            value={`↑ ${mToFt(hike.elevationM).toLocaleString()} ft`}
          />
          <Stat
            label="Effort"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", DIFF_DOT[hike.difficulty])}
                />
                {hike.difficulty}
              </span>
            }
          />
        </div>
      </div>

      {/* Overview */}
      <section className="mt-6 px-4">
        <SectionHeader>Overview</SectionHeader>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {hike.description}
        </p>
        {state && (
          <p className="mt-3 text-xs text-white/40">
            Part of {state.name} — {state.blurb}
          </p>
        )}
      </section>

      {/* Instagram */}
      <section className="mt-8 px-4">
        <SectionHeader
          right={
            <span className="text-[11px] text-white/40">
              Add clips in <code>hikes.ts → instagram</code>
            </span>
          }
        >
          <span className="inline-flex items-center gap-2">
            <Instagram className="h-4 w-4 text-primary" />
            From the ground
          </span>
        </SectionHeader>

        {hike.instagram && hike.instagram.length > 0 ? (
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hike.instagram.map((clip) => (
              <a
                key={clip.url}
                href={clip.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative aspect-[9/16] w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
              >
                <img
                  src={hike.images[0]}
                  alt={clip.caption ?? "Instagram clip"}
                  className="h-full w-full scale-105 object-cover opacity-70 transition group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white">
                  <Instagram className="h-4 w-4" />
                </div>
                <div className="absolute inset-x-2 bottom-2 text-[11px] leading-tight text-white">
                  {clip.caption ?? "Open reel"}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center text-xs text-white/50">
            No Instagram clips yet for {hike.name}. Paste reel URLs into this
            spot's <code className="text-white/70">instagram</code> array to
            feature them here.
          </div>
        )}
      </section>

      {/* Open on map */}
      <section className="mt-8 px-4">
        <Link
          to="/map"
          search={{ id: hike.id }}
          className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 hover:bg-white/[0.06]"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Show on map</div>
              <div className="text-xs text-white/50">
                {hike.lat.toFixed(3)}, {hike.lng.toFixed(3)}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/40" />
        </Link>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-8 px-4">
          <SectionHeader>More in {state?.name ?? hike.region}</SectionHeader>
          <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {related.map((h) => (
              <Link
                key={h.id}
                to="/spot/$id"
                params={{ id: h.id }}
                className="w-40 shrink-0 overflow-hidden rounded-2xl bg-card ring-1 ring-white/5"
              >
                <div className="aspect-[4/5] w-full">
                  <img src={h.images[0]} alt={h.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {h.type}
                  </div>
                  <div className="mt-0.5 truncate text-sm font-semibold text-white">
                    {h.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {children}
      </div>
      {right}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
