import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map2({ aksi, statePosition, stateProps = null }) {
  const [stateLatLng, setLatLng] = useState(stateProps);
  // Berlin coordinates
  const position = stateLatLng;
  // const position = stateLatLng;

  // --- (6) Create a custom marker ---
  const customIcon = new Icon({
    iconUrl: `${import.meta.env.VITE_BASE_ASSETS}/images/marker-icon.png`,
    // iconSize: [20, 20],
    // iconAnchor: [1, 1],
    // popupAnchor: [-0, -76]
  });

  return (
    <section className="map-component">
      {/* --- (5) Add leaflet map container --- */}
      <div className="map">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // --- (7) Alternative map style (attribution and url copied from the leaflet extras website) ---
            // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            // url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
            // --- -------------------------------------------------------------------------------------- ---
          />
          {/* <LocationMarker setLatLng={setLatLng} /> */}
          {stateLatLng === null ? null : (
            <Marker position={stateLatLng}>
              <Popup><a href={`https://www.google.com/maps/place/${stateLatLng.lat},${stateLatLng.lng}`} target="_blank" rel="noopener noreferrer">Open Kordinat</a></Popup>
            </Marker>
          )}
          {/* <Marker position={position}
          icon={customIcon}
        >
          <Popup>
            🐻🍻🎉
          </Popup>
        </Marker> */}
        </MapContainer>
        {/* --- ---------------------------- --- */}
      </div>
    </section>
  );
}
