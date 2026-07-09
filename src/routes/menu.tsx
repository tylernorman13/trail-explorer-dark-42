import { createFileRoute } from "@tanstack/react-router";
import { AppTopBar } from "@/components/AppTopBar";
import { Compass, Heart, MapPin, Info } from "lucide-react";

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

const items = [
  { icon: Compass, label: "Random trail", hint: "Surprise me" },
  { icon: Heart, label: "Saved", hint: "Your shortlist" },
  { icon: MapPin, label: "Been there", hint: "Trails you've done" },
  { icon: Info, label: "About Trail Atlas", hint: "How this guide works" },
];

function Menu() {
  return (
    <div>
      <AppTopBar />
      <div className="px-4">
        <h1 className="text-2xl font-semibold text-white">Menu</h1>
        <p className="mt-1 text-sm text-white/50">Collections and shortcuts.</p>

        <ul className="mt-5 space-y-2">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li
                key={it.label}
                className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-white/5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{it.label}</div>
                  <div className="text-xs text-white/50">{it.hint}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
