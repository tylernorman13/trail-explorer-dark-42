import { Link } from "@tanstack/react-router";
import { HIKES, STATES, type StateCode } from "@/lib/hikes";
import { cn } from "@/lib/utils";

// Very rough stylized paths for the three west-coast states.
// Coordinate system 0..320 wide, 0..340 tall.
const STATE_PATHS: Record<StateCode, string> = {
  WA: "M40,20 L200,20 L210,90 L60,95 L48,70 Z",
  OR: "M48,95 L210,90 L215,175 L58,180 Z",
  CA: "M58,180 L215,175 L235,235 L215,300 L155,325 L120,300 L95,255 L70,220 Z",
};

// Dot cluster positions per state (visual only, in the same 320x340 space).
const CLUSTERS: Record<StateCode, [number, number][]> = {
  WA: [
    [95, 55],
    [110, 65],
    [125, 50],
    [140, 62],
    [155, 55],
  ],
  OR: [
    [110, 130],
    [130, 140],
    [150, 125],
    [170, 145],
  ],
  CA: [
    [130, 220],
    [145, 240],
    [160, 260],
    [175, 245],
    [155, 285],
  ],
};

export function RegionMap({
  active,
  onSelect,
}: {
  active?: StateCode | null;
  onSelect?: (code: StateCode) => void;
}) {
  return (
    <svg
      viewBox="0 0 320 340"
      className="h-full w-full"
      role="img"
      aria-label="Pacific coast hiking regions"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#d85c2b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#d85c2b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="340" fill="url(#glow)" />
      {(Object.keys(STATE_PATHS) as StateCode[]).map((code) => {
        const isActive = active === code;
        const dots = CLUSTERS[code];
        const count = HIKES.filter((h) => h.state === code).length;
        return (
          <g
            key={code}
            className="cursor-pointer transition"
            onClick={() => onSelect?.(code)}
          >
            <path
              d={STATE_PATHS[code]}
              fill={isActive ? "#d85c2b" : "#f4f2ee"}
              fillOpacity={isActive ? 0.55 : 0.92}
              stroke="#0a0a0a"
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
            {dots.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3.2}
                fill="#f4f2ee"
                stroke="#0a0a0a"
                strokeWidth={0.9}
              />
            ))}
            {/* Invisible label anchor for count badge — rendered above via HTML overlay */}
            <title>
              {code} — {count} spots
            </title>
          </g>
        );
      })}
    </svg>
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
              className={cn(
                "flex items-center gap-4 py-3 pr-2 transition hover:bg-white/[0.02]",
              )}
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
    <svg viewBox="0 0 320 340" className="h-full w-full">
      {(Object.keys(STATE_PATHS) as StateCode[]).map((c) => (
        <path
          key={c}
          d={STATE_PATHS[c]}
          fill={c === code ? "#d85c2b" : "#f4f2ee"}
          fillOpacity={c === code ? 0.85 : 0.35}
          stroke="#0a0a0a"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
