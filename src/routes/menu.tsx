import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppTopBar } from "@/components/AppTopBar";
import { Compass, Heart, MapPin, Info, ChevronRight } from "lucide-react";
import { HIKES } from "@/lib/hikes";
import { useSavedIds, useVisitedIds } from "@/hooks/use-saved";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Trail Atlas" },
      { name: "description", content: "Collections, saved trails, and settings for Trail Atlas." },
      { property: "og:title", content: "Menu — Trail Atlas" },
      { property: "og:description", content: "Collections, saved trails, and settings." },
    ],
  }),
  component: Menu,
});

function Menu() {
  const navigate = useNavigate();
  const savedCount = useSavedIds().length;
  const visitedCount = useVisitedIds().length;

  const openRandom = () => {
    const h = HIKES[Math.floor(Math.random() * HIKES.length)];
    if (h) navigate({ to: "/spot/$id", params: { id: h.id } });
  };

  return (
    <div className="pb-8">
      <AppTopBar />
      <div className="px-4">
        <h1 className="text-2xl font-semibold text-white">Menu</h1>
        <p className="mt-1 text-sm text-white/50">Collections and shortcuts.</p>

        <ul className="mt-5 space-y-2">
          <li>
            <button
              type="button"
              onClick={openRandom}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-white/5 transition hover:ring-white/15"
            >
              <IconTile icon={Compass} />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Random trail</div>
                <div className="text-xs text-white/50">Surprise me</div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/30" />
            </button>
          </li>

          <MenuLink
            to="/saved"
            icon={Heart}
            label="Saved"
            hint={`${savedCount} ${savedCount === 1 ? "spot" : "spots"} on your shortlist`}
          />

          <MenuLink
            to="/been-there"
            icon={MapPin}
            label="Been there"
            hint={`${visitedCount} ${visitedCount === 1 ? "trail" : "trails"} logged`}
          />

          <MenuLink
            to="/about"
            icon={Info}
            label="About Trail Atlas"
            hint="How this guide works"
          />
        </ul>
      </div>
    </div>
  );
}

function MenuLink({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: "/saved" | "/been-there" | "/about";
  icon: typeof Compass;
  label: string;
  hint: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-white/5 transition hover:ring-white/15"
      >
        <IconTile icon={Icon} />
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="text-xs text-white/50">{hint}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-white/30" />
      </Link>
    </li>
  );
}

function IconTile({ icon: Icon }: { icon: typeof Compass }) {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
      <Icon className="h-5 w-5" />
    </div>
  );
}
