import { useCallback, useEffect, useState } from "react";

function makeStore(key: string, eventName: string) {
  function read(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((v) => typeof v === "string")
        : [];
    } catch {
      return [];
    }
  }

  function write(ids: string[]) {
    window.localStorage.setItem(key, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(eventName));
  }

  function useIds(): string[] {
    const [ids, setIds] = useState<string[]>([]);
    useEffect(() => {
      setIds(read());
      const sync = () => setIds(read());
      window.addEventListener(eventName, sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener(eventName, sync);
        window.removeEventListener("storage", sync);
      };
    }, []);
    return ids;
  }

  function useItem(id: string) {
    const ids = useIds();
    const active = ids.includes(id);
    const toggle = useCallback(() => {
      const current = read();
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      write(next);
    }, [id]);
    return { active, toggle };
  }

  return { useIds, useItem };
}

const saved = makeStore("trail-atlas:saved", "trail-atlas:saved-changed");
const visited = makeStore("trail-atlas:visited", "trail-atlas:visited-changed");

export const useSavedIds = saved.useIds;
export function useSaved(id: string) {
  const { active, toggle } = saved.useItem(id);
  return { saved: active, toggle };
}

export const useVisitedIds = visited.useIds;
export function useVisited(id: string) {
  const { active, toggle } = visited.useItem(id);
  return { visited: active, toggle };
}
