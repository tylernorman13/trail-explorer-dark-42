import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import type { Hike } from "@/lib/hikes";

const difficultyColor: Record<Hike["difficulty"], string> = {
  Easy: "#4ade80",
  Moderate: "#facc15",
  Hard: "#fb923c",
  Expert: "#f43f5e",
};

function makeDotIcon(color: string, active: boolean) {
  const size = active ? 22 : 16;
  const ring = active ? 4 : 2;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};
      box-shadow:0 0 0 ${ring}px rgba(255,255,255,0.15), 0 0 18px ${color};
      border:2px solid rgba(255,255,255,0.85);
      transition:all 200ms ease;
      cursor:pointer;
    "></div>`;
  return L.divIcon({
    html,
    className: "hike-dot-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyTo({ hike }: { hike: Hike | null }) {
  const map = useMap();
  useEffect(() => {
    if (!hike) return;
    map.flyTo([hike.lat, hike.lng], 6, { duration: 1.2 });
  }, [hike, map]);
  return null;
}

interface Props {
  hikes: Hike[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function HikeMapInner({ hikes, selectedId, onSelect }: Props) {
  const selected = hikes.find((h) => h.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      className="h-full w-full"
      style={{ background: "#0b0f14" }}
    >
      <TileLayer
        attribution='&copy; OSM &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {hikes.map((hike) => (
        <Marker
          key={hike.id}
          position={[hike.lat, hike.lng]}
          icon={makeDotIcon(difficultyColor[hike.difficulty], hike.id === selectedId)}
          eventHandlers={{ click: () => onSelect(hike.id) }}
        />
      ))}
      <FlyTo hike={selected} />
    </MapContainer>
  );
}
