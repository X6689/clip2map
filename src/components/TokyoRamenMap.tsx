"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { RamenPlace } from "@/data/tokyo-ramen";

type TokyoRamenMapProps = {
  places: RamenPlace[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function MoveToSelection({ place }: { place: RamenPlace | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.flyTo([place.latitude, place.longitude], 14, { duration: 0.8 });
    } else {
      map.flyTo([35.6895, 139.72], 11, { duration: 0.6 });
    }
  }, [map, place]);

  return null;
}

export default function TokyoRamenMap({
  places,
  selectedId,
  onSelect,
}: TokyoRamenMapProps) {
  const selectedPlace = places.find((place) => place.id === selectedId);
  const icons = useMemo(
    () =>
      new Map(
        places.map((place, index) => [
          place.id,
          L.divIcon({
            className: "",
            html: `<div class="ramen-marker${selectedId === place.id ? " is-selected" : ""}">${index + 1}</div>`,
            iconAnchor: [15, 15],
            popupAnchor: [0, -16],
          }),
        ]),
      ),
    [places, selectedId],
  );

  return (
    <MapContainer
      center={[35.6895, 139.72]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={icons.get(place.id)}
          eventHandlers={{ click: () => onSelect(place.id) }}
        >
          <Popup>
            <div className="min-w-40">
              <p className="m-0 text-sm font-bold">{place.name}</p>
              <p className="mt-1 mb-0 text-xs text-[#52635d]">
                {place.area} · {place.category} · {place.priceLevel}
              </p>
              <p className="mt-2 mb-0 text-xs">Try: {place.recommendedDish}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <MoveToSelection place={selectedPlace} />
    </MapContainer>
  );
}
