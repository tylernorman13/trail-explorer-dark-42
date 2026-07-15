import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Grid2x2, Heart, List, MapPin } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { HikeCard } from "@/components/HikeCard";
import { HIKES, STATES, kmToMi, mToFt, type Hike, type StateCode } from "@/lib/hikes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/region/$state")({
  parseParams: (raw) => {
    const code = (raw.state ?? "").toUpperCase() as StateCode;
    if (!STATES.some((s) => s.code === code)) throw notFound();
    return { state: code };
  },
  stringifyParams: (params) => ({ state: params.state }),
  head: ({ params }) => {
    const s = STATES.find((x) => x.code === params.state);
    const name = s?.name ?? "Region";
    return {
      meta: [
        { title: `${name} — Trail Atlas` },
        { name: "description", content: `Hikes in ${name}: ${s?.blurb ?? ""}` },
        { property: "og:title", content: `${name} — Trail Atlas` },
        { property: "og:description", content: s?.blurb ?? "" },
      ],
    };
  },
  component: RegionPage,
});

type View = "grid" | "reader";

function RegionPage() {
  const { state } = Route.useParams();
  const [view, setView] = useState<View>("grid");
  const meta = STATES.find((s) => s.code === state)!;
  const hikes = HIKES.filter((h) => h.state === state);

  return (
    <div className="pb-6">
      <AppTopBar />

      <div className="px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          All regions
        </Link>

        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Region
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-white">{meta.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{meta.blurb}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-white/50">
            {hikes.length} {hikes.length === 1 ? "spot" : "spots"}
          </div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition",
                view === "grid"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white",
              )}
            >
              <Grid2x2 className="h-3.5 w-3.5" />
              Grid
            </button>
            <button
              onClick={() => setView("reader")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition",
                view === "reader"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white",
              )}
            >
              <List className="h-3.5 w-3.5" />
              Reader
            </button>
          </div>
        </div>
      </div>

      {hikes.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl border border-white/5 bg-card p-6 text-center text-sm text-white/60">
          No spots in this region yet.
        </div>
      ) : view === "grid" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          {hikes.map((h) => (
            <HikeCard key={h.id} hike={h} />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-4 px-4">
          {hikes.map((h) => (
            <ReaderCard key={h.id} hike={h} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReaderCard({ hike }: { hike: Hike }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-card ring-1 ring-white/5">
      <div className="relative aspect-[4/5] w-full">
        <img
          src={hike.images[0]}
          alt={hike.name}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label="Save"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white/80 backdrop-blur"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          {hike.type}
        </div>
        <h2 className="mt-1 text-2xl font-semibold text-white">{hike.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {hike.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Region" value={hike.region} />
          <Field label="Effort" value={hike.difficulty} />
          <Field label="Distance" value={`${kmToMi(hike.distanceKm)} mi`} />
          <Field
            label="Elevation"
            value={`↑ ${mToFt(hike.elevationM).toLocaleString()} ft`}
          />
        </div>

        <Link
          to="/map"
          search={{ id: hike.id }}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <MapPin className="h-4 w-4" />
          Open on map
        </Link>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="mt-0.5 text-white">{value}</div>
    </div>
  );
}
