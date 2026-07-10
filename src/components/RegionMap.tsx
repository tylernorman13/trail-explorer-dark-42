import { useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HIKES, STATES, kmToMi, mToFt, type StateCode, type Hike } from "@/lib/hikes";
import { MAP_VIEWBOX, STATE_PATHS, projectLatLng } from "@/lib/map-paths";
import { cn } from "@/lib/utils";

const DOT_COLOR = "#d85c2b";

export function RegionMap({
  height = "aspect-[4/5]",
  selectedState = null,
  onSelectState,
}: {
  height?: string;
  selectedState?: StateCode | null;
  onSelectState?: (code: StateCode) => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const points = useMemo(
    () => HIKES.map((h) => ({ hike: h, ...projectLatLng(h.lat, h.lng) })),
    [],
  );

  return (
    <div className={cn("relative h-full w-full", height)}>
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Pacific coast hikes"
      >
        <defs>
          <pattern
            id="dotGrid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.6" fill="#ffffff" fillOpacity="0.05" />
          </pattern>
        </defs>

        <rect width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h} fill="url(#dotGrid)" />

        {(Object.keys(STATE_PATHS) as StateCode[]).map((code) => {
          const isSel = selectedState === code;
          const dimmed = selectedState && !isSel;
          return (
            <path
              key={code}
              d={STATE_PATHS[code]}
              fill={isSel ? "#f5efe6" : "#e8e5df"}
              fillOpacity={dimmed ? 0.35 : 0.95}
              stroke="#0a0a0a"
              strokeWidth={isSel ? 1.4 : 1}
              strokeLinejoin="round"
              className={onSelectState ? "cursor-pointer transition" : undefined}
              onClick={() => onSelectState?.(code)}
            />
          );
        })}

        <StateLabel code="WA" x={65} y={30} />
        <StateLabel code="OR" x={75} y={110} />
        <StateLabel code="CA" x={140} y={330} />

        {/* Hike markers — uniform orange, no glow */}
        {points.map(({ hike, x, y }) => {
          const isHover = hovered === hike.id;
          const dim = selectedState && hike.state !== selectedState;
          return (
            <g
              key={hike.id}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer"
              opacity={dim ? 0.35 : 1}
              onMouseEnter={() => setHovered(hike.id)}
              onMouseLeave={() =>
                setHovered((v) => (v === hike.id ? null : v))
              }
              onClick={() =>
                navigate({ to: "/spot/$id", params: { id: hike.id } })
              }
            >
              <circle
                r={isHover ? 4.5 : 3.2}
                fill={DOT_COLOR}
                stroke="#ffffff"
                strokeWidth={0.9}
              />
            </g>
          );
        })}
      </svg>

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
  const leftPct = (pt.x / MAP_VIEWBOX.w) * 100;
  const topPct = (pt.y / MAP_VIEWBOX.h) * 100;
  return (
    <Link
      to="/spot/$id"
      params={{ id: hike.id }}
      className="pointer-events-auto absolute z-10 flex w-52 -translate-x-1/2 -translate-y-[calc(100%+10px)] gap-2 rounded-xl bg-black/90 p-2 ring-1 ring-white/15 backdrop-blur transition hover:bg-black"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
    >
      <img
        src={hike.images[0]}
        alt=""
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-semibold text-white">
          {hike.name}
        </div>
        <div className="truncate text-[10px] text-white/60">{hike.region}</div>
        <div className="mt-0.5 text-[10px] text-primary">
          {hike.type} · {hike.difficulty}
        </div>
        <div className="text-[10px] text-white/50">
          {kmToMi(hike.distanceKm)} mi · ↑{" "}
          {mToFt(hike.elevationM).toLocaleString()} ft
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

function pathBBox(d: string) {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

export function StateShape({
  code,
  color = "#d85c2b",
}: {
  code: StateCode;
  color?: string;
}) {
  const d = STATE_PATHS[code];
  const { minX, minY, maxX, maxY } = pathBBox(d);
  const pad = 4;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  return (
    <svg
      viewBox={`${minX - pad} ${minY - pad} ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={d} fill={color} stroke="#0a0a0a" strokeOpacity={0.25} strokeWidth={0.6} strokeLinejoin="round" />
    </svg>
  );
}

export function StateFilterCards({
  selected,
  onSelect,
}: {
  selected: StateCode | null;
  onSelect: (code: StateCode) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {STATES.map((s) => {
        const count = HIKES.filter((h) => h.state === s.code).length;
        const active = selected === s.code;
        const dim = selected && !active;
        return (
          <button
            key={s.code}
            onClick={() => onSelect(s.code)}
            className={cn(
              "flex flex-col items-center rounded-2xl bg-card p-3 text-left ring-1 transition",
              active
                ? "ring-primary"
                : "ring-white/5 hover:ring-white/15",
              dim && "opacity-60",
            )}
          >
            <div className="aspect-square w-full">
              <StateShape
                code={s.code}
                color={active ? "#d85c2b" : "#d85c2b"}
              />
            </div>
            <div className="mt-2 w-full text-sm font-semibold text-white">
              {s.name}
            </div>
            <div className="text-[11px] text-white/50">
              {count} {count === 1 ? "spot" : "spots"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
