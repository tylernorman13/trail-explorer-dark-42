import { useEffect, useState, useCallback } from "react";

export type HikeExtras = {
  alltrailsUrl?: string;
  instagramUrls?: string[];
};

const KEY = "trail-atlas:extras";
const EVENT = "trail-atlas:extras-change";

function readAll(): Record<string, HikeExtras> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, HikeExtras>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, HikeExtras>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useHikeExtras(id: string) {
  const [extras, setExtras] = useState<HikeExtras>({});

  useEffect(() => {
    const sync = () => setExtras(readAll()[id] ?? {});
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  const save = useCallback(
    (next: HikeExtras) => {
      const all = readAll();
      const cleaned: HikeExtras = {
        alltrailsUrl: next.alltrailsUrl?.trim() || undefined,
        instagramUrls: (next.instagramUrls ?? [])
          .map((u) => u.trim())
          .filter(Boolean),
      };
      if (!cleaned.alltrailsUrl && (!cleaned.instagramUrls || cleaned.instagramUrls.length === 0)) {
        delete all[id];
      } else {
        all[id] = cleaned;
      }
      writeAll(all);
      setExtras(cleaned);
    },
    [id],
  );

  return { extras, save };
}
