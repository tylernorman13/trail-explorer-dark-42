import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { StateFilterCards } from "@/components/RegionMap";
import { HikeCard } from "@/components/HikeCard";
import {
  HIKES,
  DIFFICULTIES,
  HIKE_TYPES,
  STATES,
  type Difficulty,
  type HikeType,
  type StateCode,
} from "@/lib/hikes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trail Atlas — Pacific Coast hiking guide" },
      {
        name: "description",
        content:
          "Explore Washington, Oregon and California hikes. Filter by state, difficulty and type — waterfalls, alpine lakes, ridges and peaks.",
      },
      { property: "og:title", content: "Trail Atlas — Pacific Coast hiking guide" },
      {
        property: "og:description",
        content:
          "Mobile-first guide to the best hikes in Washington, Oregon and California.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [state, setState] = useState<StateCode | null>(null);
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [type, setType] = useState<HikeType | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      HIKES.filter((h) => (state ? h.state === state : true))
        .filter((h) => (diff ? h.difficulty === diff : true))
        .filter((h) => (type ? h.type === type : true))
        .filter((h) =>
          q
            ? [h.name, h.region, h.type].some((s) =>
                s.toLowerCase().includes(q.toLowerCase()),
              )
            : true,
        ),
    [state, diff, type, q],
  );

  return (
    <div className="pb-4">
      <AppTopBar />

      <div className="px-4">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/50 focus-within:border-primary/50">
          <Search className="h-4 w-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Search spots, regions, themes…"
          />
        </label>
      </div>

      {/* State filter — map style */}
      <section className="mt-5 px-4">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Filter by state
          </div>
          {state && (
            <button
              onClick={() => setState(null)}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-white/5">
          <div className="aspect-[5/4] w-full">
            <RegionMap
              selectedState={state}
              onSelectState={(s) =>
                setState((prev) => (prev === s ? null : s))
              }
            />
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 text-center">
            {STATES.map((s) => {
              const count = HIKES.filter((h) => h.state === s.code).length;
              const active = state === s.code;
              return (
                <button
                  key={s.code}
                  onClick={() =>
                    setState((prev) => (prev === s.code ? null : s.code))
                  }
                  className={cn(
                    "flex flex-col items-center py-2.5 text-xs transition",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  <span className="text-sm font-semibold">{s.code}</span>
                  <span className="text-[10px] opacity-70">
                    {count} {count === 1 ? "spot" : "spots"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="mt-5 px-4">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Difficulty
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={diff === null} onClick={() => setDiff(null)}>
            All <span className="opacity-60">({HIKES.length})</span>
          </Chip>
          {DIFFICULTIES.map((d) => {
            const count = HIKES.filter(
              (h) =>
                h.difficulty === d &&
                (type ? h.type === type : true) &&
                (state ? h.state === state : true),
            ).length;
            return (
              <Chip
                key={d}
                active={diff === d}
                onClick={() => setDiff(diff === d ? null : d)}
              >
                {d} <span className="opacity-60">({count})</span>
              </Chip>
            );
          })}
        </div>

        <div className="mb-1 mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Type
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={type === null} onClick={() => setType(null)}>
            All <span className="opacity-60">({HIKES.length})</span>
          </Chip>
          {HIKE_TYPES.map((t) => {
            const count = HIKES.filter(
              (h) =>
                h.type === t &&
                (diff ? h.difficulty === diff : true) &&
                (state ? h.state === state : true),
            ).length;
            return (
              <Chip
                key={t}
                active={type === t}
                onClick={() => setType(type === t ? null : t)}
              >
                {t} <span className="opacity-60">({count})</span>
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-4">
        <div className="text-sm text-white/50">
          {filtered.length} {filtered.length === 1 ? "spot" : "spots"}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 px-4">
          {filtered.map((h) => (
            <HikeCard key={h.id} hike={h} />
          ))}
        </div>
      ) : (
        <div className="mx-4 mt-6 rounded-2xl border border-white/5 bg-card p-6 text-center text-sm text-white/60">
          No hikes match those filters yet.
        </div>
      )}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-white/10 bg-white/[0.04] text-white/70 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
