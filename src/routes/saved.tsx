import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HikeCard } from "@/components/HikeCard";
import { HIKES } from "@/lib/hikes";
import { useSavedIds } from "@/hooks/use-saved";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Spots — Trail Atlas" },
      {
        name: "description",
        content: "Your saved hikes and lookouts across the Pacific coast.",
      },
      { property: "og:title", content: "Saved Spots — Trail Atlas" },
      {
        property: "og:description",
        content: "Every trail you've hearted, in one tidy list.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const ids = useSavedIds();
  const saved = ids
    .map((id) => HIKES.find((h) => h.id === id))
    .filter((h): h is (typeof HIKES)[number] => Boolean(h));

  return (
    <div className="pb-8">
      <AppTopBar />

      <div className="px-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Your list
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Saved spots
            </h1>
          </div>
          <div className="text-sm text-white/50">
            {saved.length} {saved.length === 1 ? "spot" : "spots"}
          </div>
        </div>
      </div>

      {saved.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 px-4">
          {saved.map((h) => (
            <HikeCard key={h.id} hike={h} />
          ))}
        </div>
      ) : (
        <div className="mx-4 mt-8 flex flex-col items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-6 w-6" />
          </div>
          <div className="mt-4 text-base font-semibold text-white">
            Nothing saved yet
          </div>
          <p className="mt-1 max-w-xs text-sm text-white/60">
            Tap the heart on any spot to add it to your list. It'll show up
            here for quick access.
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
