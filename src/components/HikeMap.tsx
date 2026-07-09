import { useEffect, useState, type ComponentType } from "react";
import type { Hike } from "@/lib/hikes";

interface Props {
  hikes: Hike[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type InnerType = ComponentType<Props>;

export function HikeMap(props: Props) {
  const [Inner, setInner] = useState<InnerType | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./HikeMapInner").then((mod) => {
      if (!cancelled) setInner(() => mod.HikeMapInner);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Inner) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0b0f14]">
        <div className="text-sm text-white/50">Loading map…</div>
      </div>
    );
  }
  return <Inner {...props} />;
}
