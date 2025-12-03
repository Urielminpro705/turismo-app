import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapa.css";
import L from "leaflet";

import NewPlacePopup from "./newPlace";
import ExistingPlacePopup from "./existingPlace";

// URL de tu API
const ENDPOINT = "http://3.138.174.15:3000/places";

const iconoLuna = L.icon({
  iconUrl: "/icono-luna.svg",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Componente que fuerza a Leaflet a recalcular tamaño
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

// Función que se ejecuta al hacer clic en el mapa
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

// Abrir popup automáticamente
const AutoOpenPopup = ({ markerRef }) => {
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [markerRef]);
  return null;
};

function Mapa() {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [newPlaceCoords, setNewPlaceCoords] = useState(null);

  const existingMarkersRef = useRef({});
  const mapRef = useRef(null);
  const newMarkerRef = useRef(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(ENDPOINT);
        const data = await response.json();
        const placesData = data.data || [];
        setPlaces(placesData);

        if (placesData.length > 0) {
          setSelectedPlace(placesData[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceCreated = (newPlace) => {
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    setNewPlaceCoords(null);
    handlePlaceClick(newPlace);
  };

  const handlePlaceUpdated = (updatedPlace) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((p) => (p.id === updatedPlace.id ? updatedPlace : p))
    );
    if (selectedPlace?.id === updatedPlace.id) {
      setSelectedPlace(updatedPlace);
    }
  };

  const handlePlaceDeleted = (deletedId) => {
    setPlaces((prevPlaces) => prevPlaces.filter((p) => p.id !== deletedId));
    if (selectedPlace?.id === deletedId) {
      setSelectedPlace(null);
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setNewPlaceCoords(null);

    const lat = place.location.coordinates[1];
    const lng = place.location.coordinates[0];

    const sidebarWidthOffset = 150;
    const offset = L.point(sidebarWidthOffset, 0);

    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 14, {
        duration: 1.5,
        pan: {
          offset: offset,
        },
      });

      const marker = existingMarkersRef.current[place.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }
    }
  };

  const handleMapClick = (e) => {
    setNewPlaceCoords({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/icono-luna.svg" alt="Logo" className="app-logo" />
        </div>
        <div className="navbar-links">
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/mapa" className={({ isActive }) => (isActive ? "active" : "")}>Mapa</NavLink>
        </div>
      </nav>

      <main className="main-content-map">
        <div className="left-section-map">
          <h1 className="map-title">Lugares Turísticos</h1>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Busca un lugar por su nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="material-symbols-rounded search-icon">search</span>
          </div>

          <div className="places-list">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className={`place-list-item ${selectedPlace?.id === place.id ? "active-item" : ""}`}
                  onClick={() => handlePlaceClick(place)}
                >
                  <div className="place-info-content">
                    <div className="place-item-icon-group">
                      <span className="material-symbols-rounded map-place-icon">location_on</span>
                      <h3>{place.name}</h3>
                    </div>
                    <p className="item-description">{place.description}</p>
                    <p className="item-coordinates">
                      Coordenadas: {place.location.coordinates[0]}, {place.location.coordinates[1]}
                    </p>
                  </div>
                  <div className="item-separator"></div>
                </div>
              ))
            ) : (
              <p>No se encontraron lugares.</p>
            )}
          </div>
        </div>

        <div className="right-section-map">
          <MapContainer
            center={[21.0, -101.5]}
            zoom={8}
            style={{ width: "100%", height: "100%", minHeight: "400px", borderRadius: "15px" }}
            ref={mapRef}
          >
            <ResizeMap />
            <TileLayer
              attribution="&copy; CartoDB"
              url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            <MapClickHandler onClick={handleMapClick} />

            {places.map((place) => (
              <Marker
                key={place.id}
                position={[place.location.coordinates[1], place.location.coordinates[0]]}
                icon={iconoLuna}
                ref={(el) => (existingMarkersRef.current[place.id] = el)}
                eventHandlers={{
                  click: () => handlePlaceClick(place),
                  popupopen: () => setSelectedPlace(place),
                }}
              >
                <Popup>
                  <ExistingPlacePopup
                    place={place}
                    onPlaceUpdated={handlePlaceUpdated}
                    onPlaceDeleted={handlePlaceDeleted}
                    onClose={() => mapRef.current.closePopup()}
                  />
                </Popup>
              </Marker>
            ))}

            {newPlaceCoords && (
              <Marker
                key={`${newPlaceCoords.lat}-${newPlaceCoords.lng}`}
                position={[newPlaceCoords.lat, newPlaceCoords.lng]}
                icon={iconoLuna}
                ref={newMarkerRef}
              >
                <Popup
                  position={[newPlaceCoords.lat, newPlaceCoords.lng]}
                  autoClose={false}
                  closeOnClick={false}
                  autoPan={true}
                >
                  <NewPlacePopup
                    lat={newPlaceCoords.lat}
                    lng={newPlaceCoords.lng}
                    onClose={() => setNewPlaceCoords(null)}
                    onPlaceCreated={handlePlaceCreated}
                  />
                </Popup>
              </Marker>
            )}
            {newPlaceCoords && (
              <AutoOpenPopup
                key={`open-${newPlaceCoords.lat}-${newPlaceCoords.lng}`}
                markerRef={newMarkerRef}
              />
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default Mapa;