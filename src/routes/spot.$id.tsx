import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  MapPin,
  Navigation,
  Apple,
  X,
} from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HIKES, STATES, kmToMi, mToFt, type Hike } from "@/lib/hikes";
import { useSaved } from "@/hooks/use-saved";
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

const DIFF_BADGE: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-500/20 text-emerald-300",
  Moderate: "bg-yellow-500/20 text-yellow-300",
  Hard: "bg-orange-500/20 text-orange-300",
  Expert: "bg-rose-500/20 text-rose-300",
};

function toEmbedUrl(url: string): string | null {
  // Instagram post / reel / tv → append /embed
  const m = url.match(/^(https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/[^/?#]+)/i);
  if (m) return `${m[1]}/embed`;
  return null;
}

function SpotPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const hike = HIKES.find((h) => h.id === id)!;
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState(false);
  const [visited, setVisited] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const state = STATES.find((s) => s.code === hike.state);

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  const openExternal = (url: string) => {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.top?.location.assign(url);
    setShowMapPicker(false);
  };


  const prev = () =>
    setI((v) => (v - 1 + hike.images.length) % hike.images.length);
  const next = () => setI((v) => (v + 1) % hike.images.length);

  const related = HIKES.filter(
    (h) => h.state === hike.state && h.id !== hike.id,
  ).slice(0, 4);

  const q = encodeURIComponent(`${hike.name}, ${hike.region}`);
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${hike.lat},${hike.lng}&query_place_id=${q}`;
  const amaps = `https://maps.apple.com/?q=${q}&ll=${hike.lat},${hike.lng}`;

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
            <button
              type="button"
              onClick={goBack}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
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
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
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

      {/* Stats — floating below, detached from photo */}
      <div className="px-4">
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 text-center ring-1 ring-white/10 shadow-lg shadow-black/40">
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

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        <button
          type="button"
          onClick={() => setVisited((v) => !v)}
          className={cn(
            "rounded-2xl p-3 text-sm font-semibold ring-1 transition",
            visited
              ? "bg-primary/15 text-primary ring-primary/30"
              : "bg-white/[0.04] text-white ring-white/10 hover:bg-white/[0.06]",
          )}
        >
          {visited ? "✓ Visited" : "Mark Visited"}
        </button>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className={cn(
            "rounded-2xl p-3 text-sm font-semibold ring-1 transition",
            saved
              ? "bg-primary/15 text-primary ring-primary/30"
              : "bg-white/[0.04] text-white ring-white/10 hover:bg-white/[0.06]",
          )}
        >
          {saved ? "♥ Saved" : "Save Spot"}
        </button>
      </div>

      {/* Details rows */}
      <section className="mt-6 px-4">
        <div className="divide-y divide-white/5 rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
          <DetailRow label="Region" value={hike.region} />
          {hike.access && <DetailRow label="Access" value={hike.access} />}
          <DetailRow
            label="Effort"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                    DIFF_BADGE[hike.difficulty],
                  )}
                >
                  {hike.difficulty}
                </span>
                <span className="text-white/80">
                  {kmToMi(hike.distanceKm)} mi · ↑{" "}
                  {mToFt(hike.elevationM).toLocaleString()} ft
                </span>
              </span>
            }
          />
          {hike.bestLight && (
            <DetailRow label="Best Light" value={hike.bestLight} />
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="mt-6 px-4">
        <SectionHeader>Overview</SectionHeader>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {hike.description}
        </p>
      </section>

      {/* Tyler's Notes */}
      {hike.notes && (
        <section className="mt-6 px-4">
          <SectionHeader>Tyler's Notes</SectionHeader>
          <div className="mt-2 rounded-2xl bg-white/[0.03] p-4 text-sm leading-relaxed text-white/70 ring-1 ring-white/10">
            {hike.notes}
          </div>
        </section>
      )}

      {/* Photo tip */}
      {hike.photoTip && (
        <section className="mt-4 px-4">
          <div className="rounded-2xl bg-primary/10 p-4 text-sm leading-relaxed text-primary ring-1 ring-primary/20">
            📸 {hike.photoTip}
          </div>
        </section>
      )}

      {/* Instagram embeds */}
      <section className="mt-8 px-4">
        <SectionHeader>
          <span className="inline-flex items-center gap-2">
            <Instagram className="h-4 w-4 text-primary" />
            Reels from the spot
          </span>
        </SectionHeader>

        {hike.instagram && hike.instagram.length > 0 ? (
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hike.instagram.map((clip) => {
              const embed = toEmbedUrl(clip.url);
              return (
                <div
                  key={clip.url}
                  className="w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
                >
                  {embed ? (
                    <iframe
                      src={embed}
                      title={clip.caption ?? "Instagram reel"}
                      className="block h-[560px] w-full border-0"
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={clip.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block p-6 text-sm text-white/70"
                    >
                      Open reel ↗
                    </a>
                  )}
                  {clip.caption && (
                    <div className="border-t border-white/10 p-3 text-xs text-white/70">
                      {clip.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center text-xs text-white/50">
            Paste Instagram reel URLs into this spot's{" "}
            <code className="text-white/70">instagram</code> array to embed them
            here.
          </div>
        )}
      </section>

      {/* Open on map */}
      <section className="mt-8 px-4">
        <button
          type="button"
          onClick={() => setShowMapPicker(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-white/[0.04] p-4 text-left ring-1 ring-white/10 hover:bg-white/[0.06]"
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
        </button>
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

      {/* Map picker sheet */}
      {showMapPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMapPicker(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-card p-5 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Open in…</div>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => openExternal(amaps)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.04] p-4 text-left ring-1 ring-white/10 hover:bg-white/[0.08]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black">
                  <Apple className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Apple Maps</div>
                  <div className="text-xs text-white/50">Open directions on iOS / macOS</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </button>
              <button
                type="button"
                onClick={() => openExternal(gmaps)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.04] p-4 text-left ring-1 ring-white/10 hover:bg-white/[0.08]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4285F4] text-white">
                  <Navigation className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Google Maps</div>
                  <div className="text-xs text-white/50">Open in browser or app</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </button>
              <Link
                to="/map"
                onClick={() => setShowMapPicker(false)}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 hover:bg-white/[0.08]"
              >

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">In-app map</div>
                  <div className="text-xs text-white/50">See it on Trail Atlas</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </Link>
            </div>
          </div>
        </div>
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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}
