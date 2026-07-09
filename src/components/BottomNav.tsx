import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Map as MapIcon, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: LayoutGrid },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/menu", label: "Menu", icon: Menu },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-[#0a0f1a]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 px-2 pt-2">
        {tabs.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition",
                  active ? "text-primary" : "text-white/50 hover:text-white/80",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
