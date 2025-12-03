import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./home.css";

// URL de tu API
const API_URL = "http://3.138.174.15:3000/api-docs/";
const ENDPOINT = "http://3.138.174.15:3000/places";

function Home() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // La API devuelve un objeto con la propiedad 'data'
        const placesData = data.data || [];

        // Limitamos a los primeros 4
        const firstFourPlaces = placesData.slice(0, 5);
        setPlaces(firstFourPlaces);

        // Establecer el primer lugar como el seleccionado por defecto
        if (firstFourPlaces.length > 0) {
          setSelectedPlace(firstFourPlaces[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlaces();
  }, []);

  const handlePlaceSelect = (place, index) => {
    setSelectedPlace(place);
    setCarouselIndex(index);
  };
  return (
    <div className="page-container">
      {/* --- Navbar Superior --- */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img
            src="/icono-luna.svg"
            alt="Logo de la aplicación de viajes"
            className="app-logo"
          />
        </div>
        <div className="navbar-links">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/mapa"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Mapa
          </NavLink>
        </div>
      </nav>
      {/* --- Contenido Principal --- */}
      <main className="main-content">
        <div className="left-section">
          <h1 className="main-title">
            Top Mejores Lugares <br /> para Visitar
          </h1>

          <div className="info-card">
            {selectedPlace ? (
              <>
                <h2 className="place-name">{selectedPlace?.name}</h2>

                <div className="description-section">
                  <div className="icon-title-group">
                    <span class="material-symbols-rounded">home</span>
                    <p className="description-title">Descripción</p>
                  </div>
                  <p className="description-text">
                    {selectedPlace?.description}
                  </p>
                </div>

                <div className="location-section">
                  <div className="icon-title-group">
                    <span class="material-symbols-rounded">location_on</span>
                    <p className="location-title">Ubicación</p>
                  </div>
                  <p className="location-text">
                    Longitud: {selectedPlace?.location.coordinates[0]}, <br />
                    Latitud: {selectedPlace?.location.coordinates[1]}
                  </p>
                </div>
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Cargando información...
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="carousel-container">
            {places.map((place, index) => (
              <div
                key={place.id}
                className={`carousel-item ${
                  selectedPlace?.id === place.id ? "active-slide" : ""
                }`}
                style={{
                  // URL de la imagen de la API
                  backgroundImage: `url(${place.image})`,
                }}
                onClick={() => handlePlaceSelect(place, index)}
              ></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
