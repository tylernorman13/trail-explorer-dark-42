import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { type Hike, kmToMi, mToFt } from "@/lib/hikes";
import { cn } from "@/lib/utils";

const dotColor: Record<Hike["difficulty"], string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-yellow-400",
  Hard: "bg-orange-400",
  Expert: "bg-rose-400",
};

export function HikeCard({ hike, compact = false }: { hike: Hike; compact?: boolean }) {
  return (
    <Link
      to="/spot/$id"
      params={{ id: hike.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-white/5 transition hover:ring-white/15"
    >
      <div className={cn("relative w-full", compact ? "aspect-square" : "aspect-[4/5]")}>
        <img
          src={hike.images[0]}
          alt={hike.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label="Save"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className={cn("absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur")}>
          <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[hike.difficulty])} />
          {hike.difficulty}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-[11px] font-semibold uppercase leading-snug tracking-wider text-primary">
          {hike.tagline}
        </div>
        <h3 className="text-xl font-semibold leading-tight text-white">{hike.name}</h3>
        {!compact && (
          <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-white/50">
            <span>{kmToMi(hike.distanceKm)} mi</span>
            <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
            <span>↑ {mToFt(hike.elevationM).toLocaleString()} ft</span>
          </div>
        )}
      </div>
    </Link>
  );
}
