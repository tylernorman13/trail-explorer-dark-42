import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { z } from "zod";
import { HikeMap } from "@/components/HikeMap";
import { HIKES, type Hike } from "@/lib/hikes";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/map")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Map — Trail Atlas" },
      {
        name: "description",
        content: "Interactive dark map of every hike in the atlas. Tap a marker to see details.",
      },
      { property: "og:title", content: "Map — Trail Atlas" },
      {
        property: "og:description",
        content: "Interactive dark map of legendary hikes. Tap a marker for stats and photos.",
      },
    ],
  }),
  component: MapPage,
});

const dot: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-yellow-400",
  Hard: "bg-orange-400",
  Expert: "bg-rose-400",
};

function MapPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/map" });
  const selectedId = id ?? null;
  const hike = HIKES.find((h) => h.id === selectedId) ?? null;

  const setSelected = (nextId: string | null) => {
    navigate({ search: () => ({ id: nextId ?? undefined }), replace: true });
  };

  return (
    <div className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
      <HikeMap hikes={HIKES} selectedId={selectedId} onSelect={(v) => setSelected(v)} />

      {hike ? (
        <DetailCard hike={hike} onClose={() => setSelected(null)} />
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[1000] px-4 text-center text-xs text-white/60">
          Tap a marker to see the trail
        </div>
      )}
    </div>
  );
}

function DetailCard({ hike, onClose }: { hike: Hike; onClose: () => void }) {
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v - 1 + hike.images.length) % hike.images.length);
  const next = () => setI((v) => (v + 1) % hike.images.length);

  return (
    <div className="absolute inset-x-3 bottom-3 z-[1000] overflow-hidden rounded-3xl bg-[#0d1420]/95 ring-1 ring-white/10 backdrop-blur">
      <div className="relative">
        <div className="aspect-[16/10] w-full overflow-hidden">
          <img
            src={hike.images[i]}
            alt={`${hike.name} — photo ${i + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
        >
          <X className="h-4 w-4" />
        </button>
        {hike.images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {hike.images.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === i ? "w-5 bg-white" : "w-1.5 bg-white/40",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {hike.tagline}
        </div>
        <h2 className="mt-1 text-2xl font-semibold text-white">{hike.name}</h2>
        <p className="mt-0.5 text-sm text-white/60">{hike.region}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.04] p-3 text-center ring-1 ring-white/5">
          <Stat label="Distance" value={`${hike.distanceKm} km`} />
          <Stat label="Elevation" value={`↑ ${hike.elevationM} m`} />
          <Stat
            label="Level"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", dot[hike.difficulty])} />
                {hike.difficulty}
              </span>
            }
          />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/70">{hike.description}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
