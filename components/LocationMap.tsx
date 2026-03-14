"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet not showing correct paths
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Component to dynamically adjust map view when locations change
function MapUpdater({ locations, center }: { locations: any[], center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.filter(l => l.latitude && l.longitude).map(l => [l.latitude, l.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      map.setView(center, 4);
    }
  }, [locations, map, center]);
  return null;
}

export default function DynamicMap({ locations, userLocation }: { locations: any[], userLocation: {lat: number, lng: number} | null }) {
  // Default center of US
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <MapContainer center={center} zoom={userLocation ? 10 : 4} style={{ height: "100%", width: "100%", zIndex: 10 }}>
      {/* Dark theme map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapUpdater locations={locations} center={center} />
      {locations.map((loc) => {
        if (!loc.latitude || !loc.longitude) return null;
        return (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={icon}>
            <Popup className="custom-popup">
              <div className="font-display font-bold">{loc.name}</div>
              <div className="text-sm">{loc.address}</div>
            </Popup>
          </Marker>
        );
      })}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} 
          icon={L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [25, 41],
            className: "hue-rotate-180" // cheap way to make user marker look different
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
