import React, { useState } from "react";
import './newPlace.css';

// Debe ser el mismo ENDPOINT que usas en Mapa.jsx para la llamada POST
const ENDPOINT = "http://3.138.174.15:3000/places"; 

/**
 * Componente de formulario para crear un nuevo lugar.
 * @param {object} props - Propiedades del componente.
 * @param {number} props.lat - Latitud del clic en el mapa.
 * @param {number} props.lng - Longitud del clic en el mapa.
 * @param {function} props.onClose - Función para cerrar el popup.
 * @param {function} props.onPlaceCreated - Función para actualizar la z
 */
const NewPlacePopup = ({ lat, lng, onClose, onPlaceCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPlaceData = {
      image: imageUrl,
      latitude: lat,
      longitude: lng,
      name: name,
      description: description
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        
        // Error
        const errorMessage = errorData.message || response.statusText;
        throw new Error("Error al guardar: " + errorMessage);
      }

      const result = await response.json();
      

      onPlaceCreated(result.data); 
      alert("¡Lugar guardado correctamente!"); 
      
      onClose(); 

    } catch (err) {
      console.error("Error POST:", err);
      
      
    alert("Error al crear lugar " + err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-place-form">
      {/* Título simple en color verde fuerte */}
      <h4>Agregar Nuevo Lugar</h4> 
      
      {/* --- Nombre y Label --- */}
      <label htmlFor="place-name">Nombre:</label>
      <input
        id="place-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      {/* --- Descripción y Label --- */}
      <label htmlFor="place-description">Descripcion:</label>
      <textarea
        id="place-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      {/* --- URL Imagen y Label --- */}
      <label htmlFor="place-url">URL Imagen:</label>
      <input
        id="place-url"
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      
      {/* Coordenadas */}
      <p className="coordinates-display">
          Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>

      {/* --- Botón Guardar --- */}
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"} 
      </button>
    </form>
  );
};

export default NewPlacePopup;