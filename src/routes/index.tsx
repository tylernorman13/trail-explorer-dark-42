import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HikeMap } from "@/components/HikeMap";
import { HikeSidebar } from "@/components/HikeSidebar";
import { HIKES } from "@/lib/hikes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trail Atlas — Interactive Hike Map" },
      {
        name: "description",
        content:
          "Explore a dark interactive world map of iconic hikes. Click a marker to see difficulty, stats, and a photo carousel from the trail.",
      },
      { property: "og:title", content: "Trail Atlas — Interactive Hike Map" },
      {
        property: "og:description",
        content:
          "Explore iconic hikes on an interactive dark world map, with difficulty, stats, and photos.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedId, setSelectedId] = useState<string | null>("half-dome");

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <main className="relative flex-1">
        <HikeMap hikes={HIKES} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white/70 backdrop-blur">
          <span className="mr-2 font-semibold text-white">Trail Atlas</span>
          Click any marker to view details
        </div>
      </main>
      <div className="h-full w-full max-w-sm shrink-0 md:w-[400px]">
        <HikeSidebar hikes={HIKES} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
