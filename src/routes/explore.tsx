import { createFileRoute } from "@tanstack/react-router";
import { AppTopBar } from "@/components/AppTopBar";
import { HikeCard } from "@/components/HikeCard";
import { HIKES } from "@/lib/hikes";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore trails — Trail Atlas" },
      {
        name: "description",
        content: "Browse every hike in the atlas as a photo grid, ranked by difficulty.",
      },
      { property: "og:title", content: "Explore trails — Trail Atlas" },
      {
        property: "og:description",
        content: "A photo grid of every hike in the atlas, with difficulty, distance and elevation.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  return (
    <div>
      <AppTopBar />
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="text-sm text-white/50">{HIKES.length} spots</div>
        <div className="inline-flex overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs">
          <button className="rounded-full px-3 py-1.5 text-white/60">Reader</button>
          <button className="rounded-full bg-white/10 px-3 py-1.5 font-medium text-white">
            Grid
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        {HIKES.map((h) => (
          <HikeCard key={h.id} hike={h} />
        ))}
      </div>
    </div>
  );
}
