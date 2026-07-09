import { useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HIKES, STATES, type StateCode, type Hike } from "@/lib/hikes";
import { MAP_VIEWBOX, STATE_PATHS, projectLatLng } from "@/lib/map-paths";
import { cn } from "@/lib/utils";

const DIFF_COLOR: Record<Hike["difficulty"], string> = {
  Easy: "#34d399",
  Moderate: "#fbbf24",
  Hard: "#fb923c",
  Expert: "#fb7185",
};

export function RegionMap({
  height = "aspect-[4/5]",
}: {
  height?: string;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const points = useMemo(
    () => HIKES.map((h) => ({ hike: h, ...projectLatLng(h.lat, h.lng) })),
    [],
  );

  return (
    <div className={cn("relative w-full", height)}>
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Pacific coast hikes"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#d85c2b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#d85c2b" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="dotGrid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.6" fill="#ffffff" fillOpacity="0.05" />
          </pattern>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0.6" stdDeviation="0.8" floodOpacity="0.5" />
          </filter>
        </defs>

        <rect width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h} fill="url(#dotGrid)" />
        <rect width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h} fill="url(#mapGlow)" />

        {(Object.keys(STATE_PATHS) as StateCode[]).map((code) => (
          <path
            key={code}
            d={STATE_PATHS[code]}
            fill="#e8e5df"
            fillOpacity={0.95}
            stroke="#0a0a0a"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        ))}

        {/* Faint state divider highlights */}
        {(Object.keys(STATE_PATHS) as StateCode[]).map((code) => (
          <path
            key={`shade-${code}`}
            d={STATE_PATHS[code]}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.35}
            strokeWidth={0.35}
          />
        ))}

        {/* State labels */}
        <StateLabel code="WA" x={65} y={30} />
        <StateLabel code="OR" x={75} y={110} />
        <StateLabel code="CA" x={140} y={330} />

        {/* Hike markers */}
        {points.map(({ hike, x, y }) => {
          const isHover = hovered === hike.id;
          return (
            <g
              key={hike.id}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(hike.id)}
              onMouseLeave={() => setHovered((v) => (v === hike.id ? null : v))}
              onClick={() =>
                navigate({ to: "/spot/$id", params: { id: hike.id } })
              }
            >
              {isHover && (
                <circle r={9} fill={DIFF_COLOR[hike.difficulty]} fillOpacity={0.25} />
              )}
              <circle
                r={isHover ? 4.5 : 3.2}
                fill={DIFF_COLOR[hike.difficulty]}
                stroke="#0a0a0a"
                strokeWidth={0.9}
                filter="url(#pinShadow)"
              />
              <circle r={1} fill="#ffffff" fillOpacity={0.9} />
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip card */}
      {hovered && (
        <MarkerTooltip
          hike={HIKES.find((h) => h.id === hovered)!}
          points={points}
        />
      )}
    </div>
  );
}

function StateLabel({ code, x, y }: { code: StateCode; x: number; y: number }) {
  const count = HIKES.filter((h) => h.state === code).length;
  return (
    <g transform={`translate(${x} ${y})`} style={{ pointerEvents: "none" }}>
      <text
        x={0}
        y={0}
        fill="#0a0a0a"
        fillOpacity={0.55}
        fontSize={8}
        fontWeight={700}
        letterSpacing={1.2}
      >
        {code}
      </text>
      <text
        x={0}
        y={8}
        fill="#0a0a0a"
        fillOpacity={0.4}
        fontSize={5.5}
        fontWeight={500}
      >
        {count} spots
      </text>
    </g>
  );
}

function MarkerTooltip({
  hike,
  points,
}: {
  hike: Hike;
  points: { hike: Hike; x: number; y: number }[];
}) {
  const pt = points.find((p) => p.hike.id === hike.id);
  if (!pt) return null;
  // Convert SVG-space to percentage within the container.
  const leftPct = (pt.x / MAP_VIEWBOX.w) * 100;
  const topPct = (pt.y / MAP_VIEWBOX.h) * 100;
  return (
    <Link
      to="/spot/$id"
      params={{ id: hike.id }}
      className="pointer-events-auto absolute z-10 flex w-40 -translate-x-1/2 -translate-y-[calc(100%+10px)] gap-2 rounded-xl bg-black/85 p-2 ring-1 ring-white/15 backdrop-blur transition hover:bg-black"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
    >
      <img
        src={hike.images[0]}
        alt=""
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold text-white">
          {hike.name}
        </div>
        <div className="truncate text-[10px] text-white/60">
          {hike.type} · {hike.difficulty}
        </div>
      </div>
    </Link>
  );
}

export function RegionList() {
  return (
    <ul className="mt-2 divide-y divide-white/5">
      {STATES.map((s) => {
        const count = HIKES.filter((h) => h.state === s.code).length;
        return (
          <li key={s.code}>
            <Link
              to="/region/$state"
              params={{ state: s.code }}
              className="flex items-center gap-4 py-3 pr-2 transition hover:bg-white/[0.02]"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
                <MiniState code={s.code} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold text-white">
                  {s.name}
                </div>
                <div className="text-xs text-white/50">
                  {count} {count === 1 ? "spot" : "spots"}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MiniState({ code }: { code: StateCode }) {
  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {(Object.keys(STATE_PATHS) as StateCode[]).map((c) => (
        <path
          key={c}
          d={STATE_PATHS[c]}
          fill={c === code ? "#d85c2b" : "#e8e5df"}
          fillOpacity={c === code ? 0.9 : 0.28}
          stroke="#0a0a0a"
          strokeWidth={0.8}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
