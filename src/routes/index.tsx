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
      { title: "PeakTrails — Pacific Coast hiking guide" },
      {
        name: "description",
        content:
          "Explore Washington, Oregon and California hikes. Filter by state, difficulty and type — waterfalls, alpine lakes, ridges and peaks.",
      },
      { property: "og:title", content: "PeakTrails — Pacific Coast hiking guide" },
      {
        property: "og:description",
        content:
          "Explore Washington, Oregon and California hikes. Filter by state, difficulty and type — waterfalls, alpine lakes, ridges and peaks.",
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

      {/* State filter — 3 cards, each state as an orange shape */}
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
        <StateFilterCards
          selected={state}
          onSelect={(s) => setState((prev) => (prev === s ? null : s))}
        />
      </section>


      {/* Filters */}
      <div className="mt-5 px-4">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Difficulty
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(() => {
            const scoped = HIKES.filter(
              (h) =>
                (state ? h.state === state : true) &&
                (type ? h.type === type : true),
            );
            return (
              <>
                <Chip active={diff === null} onClick={() => setDiff(null)}>
                  All <span className="opacity-60">({scoped.length})</span>
                </Chip>
                {DIFFICULTIES.map((d) => {
                  const count = scoped.filter((h) => h.difficulty === d).length;
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
              </>
            );
          })()}
        </div>

        <div className="mb-1 mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Type
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(() => {
            const scoped = HIKES.filter(
              (h) =>
                (state ? h.state === state : true) &&
                (diff ? h.difficulty === diff : true),
            );
            return (
              <>
                <Chip active={type === null} onClick={() => setType(null)}>
                  All <span className="opacity-60">({scoped.length})</span>
                </Chip>
                {HIKE_TYPES.map((t) => {
                  const count = scoped.filter((h) => h.type === t).length;
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
              </>
            );
          })()}
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
