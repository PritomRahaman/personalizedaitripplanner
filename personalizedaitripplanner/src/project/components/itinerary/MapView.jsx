 
import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
 
export default function MapView({ hotelLocation, activities = [] }) {
  const mapRef = useRef();
  const [selectedMarker, setSelectedMarker] = useState(null);
 
  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
 
  // Dummy coordinates if none provided
  const hotelCoords = hotelLocation || { lat: 12.9716, lng: 77.5946 }; // Bangalore
  const validActivities = activities.filter(
    (a) => a.coords && typeof a.coords.lat === "number" && typeof a.coords.lng === "number"
  );
 
  const allCoords = [{ ...hotelCoords, name: "Hotel" }, ...validActivities.map((a) => ({ ...a.coords, name: a.name }))];
 
  const center = allCoords[0] || { lat: 12.9716, lng: 77.5946 };
 
  // Fit map bounds when map is loaded
  useEffect(() => {
    if (!mapRef.current || allCoords.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    allCoords.forEach((c) => bounds.extend({ lat: c.lat, lng: c.lng }));
    mapRef.current.fitBounds(bounds);
  }, [allCoords]);
 
  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded)
    return <div style={{ width: "100%", height: "300px" }}>Loading map...</div>;
 
  return (
    <div id="map-container" style={{ width: "100%", height: "300px" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
      >
        {/* Hotel Marker */}
        {hotelCoords && (
          <Marker
            position={hotelCoords}
            label="🏨"
            title="Hotel"
            onClick={() => setSelectedMarker({ name: "Hotel", position: hotelCoords })}
          />
        )}
 
        {/* Activity Markers */}
        {validActivities.map((act, i) => (
          <Marker
            key={i}
            position={act.coords}
            label="📍"
            title={act.name}
            onClick={() => setSelectedMarker({ name: act.name, position: act.coords })}
          />
        ))}
 
        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>{selectedMarker.name}</div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
 
 