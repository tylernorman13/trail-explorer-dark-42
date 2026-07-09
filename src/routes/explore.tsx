import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppTopBar } from "@/components/AppTopBar";
import { HikeCard } from "@/components/HikeCard";
import { HIKES, DIFFICULTIES, HIKE_TYPES, type Difficulty, type HikeType } from "@/lib/hikes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore trails — Trail Atlas" },
      {
        name: "description",
        content: "Browse every hike in the atlas as a photo grid, filtered by difficulty and type.",
      },
      { property: "og:title", content: "Explore trails — Trail Atlas" },
      {
        property: "og:description",
        content: "A photo grid of every hike, filterable by difficulty and terrain type.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [type, setType] = useState<HikeType | null>(null);

  const filtered = useMemo(
    () =>
      HIKES.filter((h) => (diff ? h.difficulty === diff : true)).filter((h) =>
        type ? h.type === type : true,
      ),
    [diff, type],
  );

  return (
    <div>
      <AppTopBar />

      <div className="px-4 pt-2">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Difficulty
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={diff === null} onClick={() => setDiff(null)}>
            All
          </Chip>
          {DIFFICULTIES.map((d) => (
            <Chip key={d} active={diff === d} onClick={() => setDiff(diff === d ? null : d)}>
              {d}
            </Chip>
          ))}
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
              (h) => h.type === t && (diff ? h.difficulty === diff : true),
            ).length;
            return (
              <Chip key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>
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
