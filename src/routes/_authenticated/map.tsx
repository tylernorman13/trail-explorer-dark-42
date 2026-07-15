import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { HikeMap } from "@/components/HikeMap";
import { HIKES } from "@/lib/hikes";
import { useSavedIds } from "@/hooks/use-saved";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Trail Atlas" },
      {
        name: "description",
        content: "Interactive dark map of every hike in the atlas. Tap a marker to open the spot.",
      },
      { property: "og:title", content: "Map — Trail Atlas" },
      {
        property: "og:description",
        content: "Interactive dark map of legendary hikes. Tap a marker to open the spot.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const navigate = useNavigate();
  const savedIds = useSavedIds();
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const visibleHikes = useMemo(() => {
    if (!showSavedOnly) return HIKES;
    const set = new Set(savedIds);
    return HIKES.filter((h) => set.has(h.id));
  }, [showSavedOnly, savedIds]);

  return (
    <div className="relative h-[calc(100dvh-5rem)] w-full overflow-hidden touch-none">
      <HikeMap
        hikes={visibleHikes}
        selectedId={null}
        savedIds={savedIds}
        onSelect={(id) => navigate({ to: "/spot/$id", params: { id } })}
      />
      <div className="absolute right-3 top-3 z-[1000]">
        <button
          type="button"
          onClick={() => setShowSavedOnly((v) => !v)}
          aria-pressed={showSavedOnly}
          className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium backdrop-blur transition ${
            showSavedOnly
              ? "border-[#d85c2b] bg-[#d85c2b]/90 text-white"
              : "border-white/15 bg-[#0a0f1a]/80 text-white/80 hover:bg-[#0a0f1a]/95"
          }`}
        >
          <Heart
            className="h-3.5 w-3.5"
            fill={showSavedOnly ? "currentColor" : "none"}
          />
          {showSavedOnly ? "Saved only" : "Show saved only"}
          {showSavedOnly && (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {visibleHikes.length}
            </span>
          )}
        </button>
      </div>
      {showSavedOnly && visibleHikes.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-[1000] px-4 text-center text-sm text-white/70">
          No saved spots yet. Tap the heart on any spot to save it.
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[1000] px-4 text-center text-xs text-white/60">
        Tap a marker to open the spot
      </div>
    </div>
  );
}
