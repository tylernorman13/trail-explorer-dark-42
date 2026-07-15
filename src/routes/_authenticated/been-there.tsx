import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HikeCard } from "@/components/HikeCard";
import { HIKES } from "@/lib/hikes";
import { useVisitedIds } from "@/hooks/use-saved";

export const Route = createFileRoute("/_authenticated/been-there")({
  head: () => ({
    meta: [
      { title: "Been There — Trail Atlas" },
      {
        name: "description",
        content: "Trails you've marked visited across the Pacific coast.",
      },
      { property: "og:title", content: "Been There — Trail Atlas" },
      {
        property: "og:description",
        content: "Your logbook of finished hikes.",
      },
    ],
  }),
  component: BeenTherePage,
});

function BeenTherePage() {
  const ids = useVisitedIds();
  const visited = ids
    .map((id) => HIKES.find((h) => h.id === id))
    .filter((h): h is (typeof HIKES)[number] => Boolean(h));

  return (
    <div className="pb-8">
      <AppTopBar />
      <div className="px-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Your logbook
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Been there
            </h1>
          </div>
          <div className="text-sm text-white/50">
            {visited.length} {visited.length === 1 ? "spot" : "spots"}
          </div>
        </div>
      </div>

      {visited.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 px-4">
          {visited.map((h) => (
            <HikeCard key={h.id} hike={h} />
          ))}
        </div>
      ) : (
        <div className="mx-4 mt-8 flex flex-col items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="mt-4 text-base font-semibold text-white">
            No visits logged yet
          </div>
          <p className="mt-1 max-w-xs text-sm text-white/60">
            Tap "Mark Visited" on any spot to add it to your logbook.
          </p>
          <Link
            to="/"
            className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Explore spots
          </Link>
        </div>
      )}
    </div>
  );
}
