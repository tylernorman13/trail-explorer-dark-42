import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  GeoJSON,
  useMap,
} from "react-leaflet";
import type { Hike } from "@/lib/hikes";
import { kmToMi, mToFt } from "@/lib/hikes";

const HIGHLIGHT_STATES = ["washington", "oregon", "california"] as const;

function useHighlightGeo() {
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      HIGHLIGHT_STATES.map((s) =>
        fetch(
          `https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/${s}.geojson`,
        ).then((r) => (r.ok ? r.json() : null)),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        const features = results.filter(Boolean).flatMap((g: any) =>
          g.type === "FeatureCollection" ? g.features : [g],
        );
        if (features.length) setGeo({ type: "FeatureCollection", features });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return geo;
}

const DOT_COLOR = "#d85c2b";

function makeDotIcon(active: boolean, saved: boolean) {
  const size = active ? 20 : 14;
  if (saved) {
    // Match dot footprint but render a symmetrical heart with the same
    // 2px white outline as the circular dots.
    const s = active ? 24 : 18;
    const html = `
      <div style="
        width:${s}px;height:${s}px;
        display:block;
        filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));
        transition:all 180ms ease;cursor:pointer;
      ">
        <svg viewBox="0 0 32 32" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;">
          <path d="M16 28 C 16 28, 3 20, 3 11.5 A 7.5 7.5 0 0 1 16 6.5 A 7.5 7.5 0 0 1 29 11.5 C 29 20, 16 28, 16 28 Z"
            fill="${DOT_COLOR}"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"/>
        </svg>
      </div>`;
    return L.divIcon({
      html,
      className: "hike-dot-icon",
      iconSize: [s, s],
      iconAnchor: [s / 2, s / 2],
    });
  }
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

// Bounding box covering WA, OR, CA with padding so any pin can be centered
const WEST_COAST_BOUNDS = L.latLngBounds(
  [28.5, -130.0], // SW corner (padded south + west of CA coast)
  [52.5, -108.5], // NE corner (padded north + east of WA)
);

function FitAndFly({
  hikes,
  selected,
}: {
  hikes: Hike[];
  selected: Hike | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!hikes.length) {
      map.fitBounds(WEST_COAST_BOUNDS, { padding: [20, 20] });
      return;
    }
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
  savedIds?: string[];
}

export function HikeMapInner({ hikes, selectedId, onSelect, savedIds }: Props) {
  const selected = hikes.find((h) => h.id === selectedId) ?? null;
  const highlight = useHighlightGeo();
  const savedSet = new Set(savedIds ?? []);

  return (
    <MapContainer
      center={[42, -120]}
      zoom={5}
      minZoom={5}
      maxZoom={12}
      maxBounds={WEST_COAST_BOUNDS}
      maxBoundsViscosity={1.0}
      className="h-full w-full"
      style={{ background: "#0b0f14" }}
    >
      <TileLayer
        attribution="&copy; OSM &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {highlight && (
        <GeoJSON
          data={highlight}
          style={{
            color: "#c9d1da",
            weight: 1,
            opacity: 0.6,
            fillColor: "#c9d1da",
            fillOpacity: 0.18,
          }}
          interactive={false}
        />
      )}
      {hikes.map((hike) => (
        <Marker
          key={hike.id}
          position={[hike.lat, hike.lng]}
          icon={makeDotIcon(hike.id === selectedId, savedSet.has(hike.id))}
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
