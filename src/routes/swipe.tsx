import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, X } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HIKES } from "@/lib/hikes";

export const Route = createFileRoute("/swipe")({
  head: () => ({
    meta: [
      { title: "Swipe trails — Trail Atlas" },
      { name: "description", content: "Swipe through hikes one card at a time." },
      { property: "og:title", content: "Swipe trails — Trail Atlas" },
      { property: "og:description", content: "Tinder-style discovery for your next hike." },
    ],
  }),
  component: Swipe,
});

const dot: Record<string, string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-yellow-400",
  Hard: "bg-orange-400",
  Expert: "bg-rose-500",
};

function Swipe() {
  const [i, setI] = useState(0);
  const hike = HIKES[i % HIKES.length];
  const next = () => setI((n) => (n + 1) % HIKES.length);

  return (
    <div>
      <AppTopBar subtitle="Swipe" />
      <div className="px-4 pt-2">
        <Link
          to="/map"
          search={{ id: hike.id }}
          className="relative block overflow-hidden rounded-3xl border border-white/5 bg-card"
        >
          <img src={hike.images[0]} alt={hike.name} className="h-[520px] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <span className={`h-2 w-2 rounded-full ${dot[hike.difficulty]}`} />
              {hike.type} · {hike.difficulty}
            </div>
            <div className="text-2xl font-semibold leading-tight text-white">{hike.name}</div>
            <div className="mt-1 text-sm text-white/70">{hike.tagline}</div>
          </div>
        </Link>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={next}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 active:scale-95"
            aria-label="Skip"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground active:scale-95"
            aria-label="Save"
          >
            <Heart className="h-6 w-6" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
