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

export default function Map({ aksi, statePosition, stateProps = null }) {
  const [stateLatLng, setLatLng] = useState(stateProps);
  // Berlin coordinates
  const position = [-8.409518, 115.188919];

  // --- (6) Create a custom marker ---
  const customIcon = new Icon({
    iconUrl: `${import.meta.env.VITE_BASE_ASSETS}/images/marker-icon.png`,
    // iconSize: [20, 20],
    // iconAnchor: [1, 1],
    // popupAnchor: [-0, -76]
  });

  function LocationMarker({ setLatLng }) {
    const [position, setPosition] = useState(null);
    if (!aksi) {
      const map = useMapEvents({
        click(e) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
        },
      });
    } else {
      const map = useMapEvents({
        click(e) {
          map.locate();
        },
        locationfound(e) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
        },
      });
    }

    if (position !== null) {
      setLatLng(position);
    }

    return false;
  }

  useEffect(()=>{
    if(stateLatLng!==null) {
      const inv = setTimeout(() => {
        statePosition({
          type: "CHANGE_INPUT",
          payload: { name: "lat", value: stateLatLng?.lat },
        })
        statePosition({
          type: "CHANGE_INPUT",
          payload: { name: "long", value: stateLatLng?.lng },
        })
      }, 1);
      return () => {
        clearInterval(inv)
      }
    }
  },[stateLatLng])

  return (
    <section className="map-component">
      {/* --- (5) Add leaflet map container --- */}
      <div className="map">
        <MapContainer center={position} zoom={10} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // --- (7) Alternative map style (attribution and url copied from the leaflet extras website) ---
            // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            // url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
            // --- -------------------------------------------------------------------------------------- ---
          />
          <LocationMarker setLatLng={setLatLng} />
          {stateLatLng === null ? null : (
            <Marker position={stateLatLng}>
              <Popup>You are here</Popup>
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
