import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { Hike } from "@/lib/hikes";
import { kmToMi, mToFt } from "@/lib/hikes";

const DOT_COLOR = "#d85c2b";

function makeDotIcon(active: boolean) {
  const size = active ? 20 : 14;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${DOT_COLOR};
      border:2px solid #ffffff;
      box-shadow:0 1px 3px rgba(0,0,0,0.6);
      transition:all 180ms ease;
      cursor:pointer;
    "></div>`;
  return L.divIcon({
    html,
    className: "hike-dot-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitAndFly({
  hikes,
  selected,
}: {
  hikes: Hike[];
  selected: Hike | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!hikes.length) return;
    const bounds = L.latLngBounds(hikes.map((h) => [h.lat, h.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
  }, [hikes, map]);
  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], 8, { duration: 1 });
  }, [selected, map]);
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
      center={[45, -121]}
      zoom={5}
      minZoom={3}
      maxZoom={12}
      className="h-full w-full"
      style={{ background: "#0b0f14" }}
    >
      <TileLayer
        attribution="&copy; OSM &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {hikes.map((hike) => (
        <Marker
          key={hike.id}
          position={[hike.lat, hike.lng]}
          icon={makeDotIcon(hike.id === selectedId)}
          eventHandlers={{ click: () => onSelect(hike.id) }}
        >
          <Tooltip
            direction="top"
            offset={[0, -8]}
            opacity={1}
            className="hike-tooltip"
          >
            <div style={{ minWidth: 180 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <img
                  src={hike.images[0]}
                  alt=""
                  style={{
                    width: 44,
                    height: 44,
                    objectFit: "cover",
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {hike.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                    {hike.region}
                  </div>
                  <div style={{ fontSize: 10, color: DOT_COLOR, marginTop: 2 }}>
                    {hike.type} · {hike.difficulty}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                    {kmToMi(hike.distanceKm)} mi · ↑{" "}
                    {mToFt(hike.elevationM).toLocaleString()} ft
                  </div>
                </div>
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
      <FitAndFly hikes={hikes} selected={selected} />
    </MapContainer>
  );
}
