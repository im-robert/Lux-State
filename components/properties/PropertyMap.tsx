"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue with Next.js/Webpack
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  location: string;
  // In a real app we would geocode this location to coordinates,
  // but for the visual prototype we'll use a fixed or random coordinate.
  lat?: number;
  lng?: number;
}

export function PropertyMap({ location, lat = 37.4419, lng = -122.1430 }: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full aspect-[4/3] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="material-icons text-mosque/50">map</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-mosque/10 shadow-inner z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="font-display">
              <strong>{location}</strong>
              <br />
              Estimated Location
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      <a 
        href={`https://maps.google.com/?q=${encodeURIComponent(location)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded shadow-sm text-nordic hover:text-mosque transition-colors z-[400] flex items-center gap-1 border border-nordic/10"
      >
        <span className="material-icons text-[14px]">open_in_new</span>
        View on Google Maps
      </a>
    </div>
  );
}
