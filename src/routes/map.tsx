import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HikeMap } from "@/components/HikeMap";
import { HIKES } from "@/lib/hikes";

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
  return (
    <div className="relative h-[calc(100dvh-5rem)] w-full overflow-hidden touch-none">
      <HikeMap
        hikes={HIKES}
        selectedId={null}
        onSelect={(id) => navigate({ to: "/spot/$id", params: { id } })}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[1000] px-4 text-center text-xs text-white/60">
        Tap a marker to open the spot
      </div>
    </div>
  );
}
