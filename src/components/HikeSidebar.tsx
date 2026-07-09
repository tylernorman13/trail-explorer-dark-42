import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Mountain, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Hike } from "@/lib/hikes";
import { cn } from "@/lib/utils";

const difficultyStyles: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Moderate: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Hard: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Expert: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [images]);
  const prev = () => setI((v) => (v - 1 + images.length) % images.length);
  const next = () => setI((v) => (v + 1) % images.length);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/40">
      <div className="aspect-[4/3] w-full">
        <img
          src={images[i]}
          alt={`${alt} — photo ${i + 1}`}
          width={1024}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, idx) => (
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
  );
}

interface Props {
  hikes: Hike[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function HikeSidebar({ hikes, selectedId, onSelect }: Props) {
  const hike = hikes.find((h) => h.id === selectedId) ?? null;

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-l border-white/5 bg-[#0d1117]">
      <div className="border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
          <Mountain className="h-3.5 w-3.5" />
          Trail Atlas
        </div>
        <h1 className="mt-1 text-lg font-semibold text-white">Explore hikes</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {hike ? (
          <div className="space-y-5 p-5">
            <Carousel images={hike.images} alt={hike.name} />

            <div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin className="h-3.5 w-3.5" />
                {hike.region}
              </div>
              <h2 className="mt-1 text-2xl font-semibold text-white">{hike.name}</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={cn("border font-medium", difficultyStyles[hike.difficulty])}
              >
                {hike.difficulty}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70">
                <Route className="mr-1 h-3 w-3" />
                {hike.distanceKm} km
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70">
                ↑ {hike.elevationM} m
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-white/70">{hike.description}</p>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
              <Stat label="Distance" value={`${hike.distanceKm} km`} />
              <Stat label="Elevation" value={`${hike.elevationM} m`} />
              <Stat label="Level" value={hike.difficulty} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center text-sm text-white/50">
            <MapPin className="h-6 w-6 text-white/30" />
            <p>Click a marker on the map to explore a hike.</p>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 bg-black/20 p-3">
        <div className="mb-2 px-2 text-[10px] uppercase tracking-widest text-white/40">
          All trails
        </div>
        <div className="space-y-1">
          {hikes.map((h) => (
            <Button
              key={h.id}
              variant="ghost"
              onClick={() => onSelect(h.id)}
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-left transition",
                h.id === selectedId
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  h.difficulty === "Easy" && "bg-emerald-400",
                  h.difficulty === "Moderate" && "bg-yellow-400",
                  h.difficulty === "Hard" && "bg-orange-400",
                  h.difficulty === "Expert" && "bg-rose-400",
                )}
              />
              <span className="flex-1 truncate text-sm font-medium">{h.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {h.difficulty}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
