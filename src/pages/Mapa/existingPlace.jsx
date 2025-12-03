import React, { useState } from "react";
import "./newPlace.css";

import ReviewPopup from "./review";
const ENDPOINT = "http://3.138.174.15:3000/places";

/**
 * Componente Popup para visualizar, editar y eliminar un lugar existente.
 * @param {object} props.place - El objeto del lugar a editar/mostrar.
 * @param {function} props.onPlaceUpdated - Callback para actualizar la lista de lugares.
 * @param {function} props.onPlaceDeleted - Callback para eliminar el lugar de la lista.
 * @param {function} props.onClose - Callback para cerrar el popup.
 */
const ExistingPlacePopup = ({
  place,
  onPlaceUpdated,
  onPlaceDeleted,
  onClose,
}) => {
  // Los datos iniciales provienen del lugar existente
  const [name, setName] = useState(place.name);
  const [description, setDescription] = useState(place.description);
  const [imageUrl, setImageUrl] = useState(place.image_url || place.image);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Las coordenadas no se editan en el formulario, solo se muestran/usan para la API
  const lat = place.location.coordinates[1];
  const lng = place.location.coordinates[0];

  // --- Manejadores de API ---

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const updatedData = {
      name,
      description,
      image: imageUrl,
      latitude: lat,
      longitude: lng,
    };

    try {
      const response = await fetch(`${ENDPOINT}/${place.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          "Error al actualizar: " + errorData.message || response.statusText
        );
      }

      const result = await response.json();

      onPlaceUpdated(result.data);
      alert(`¡Lugar "${name}" actualizado correctamente!`);
      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Error PATCH:", err);
      alert("Error al actualizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm(`¿Estás seguro de que quieres eliminar "${place.name}"?`)
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ENDPOINT}/${place.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar. Código: " + response.status);
      }

      onPlaceDeleted(place.id);
      alert(`¡Lugar "${place.name}" eliminado correctamente!`);
      onClose();
    } catch (err) {
      console.error("Error DELETE:", err);
      alert("Error al eliminar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewsClick = (e) => {
    e.stopPropagation();
    setShowReviews(true);
  };

  const closeReviewsPopup = () => {
      setShowReviews(false);
  };

  // --- Renderizado Condicional ---
  if (showReviews) {
      return (
          <ReviewPopup 
              placeId={place.id} 
              placeName={place.name}
              onClose={closeReviewsPopup}
          />
      );
  }

  if (!isEditing) {
    return (
      <div className="new-place-form" onClick={(e) => e.stopPropagation()}>
        <h4>{place.name}</h4>

        <p>
          <strong>Descripción:</strong> {place.description}
        </p>
        <p>
          <strong>URL Imagen:</strong>{" "}
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            Ver Imagen
          </a>
        </p>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={place.name}
            style={{
              width: "100%",
              maxHeight: "100px",
              objectFit: "cover",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          />
        )}

        <p className="coordinates-display">
          Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>

        <div className="button-group-existing icon-buttons">
          {/* Botón EDITAR */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            disabled={loading}
            className="icon-button edit-icon-button"
          >
            <span className="material-symbols-rounded">edit</span>
          </button>

          {/* Botón RESEÑAS */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReviewsClick(e);
            }}
            disabled={loading}
            className="icon-button reviews-icon-button"
          >
            <span className="material-symbols-rounded">rate_review</span>
          </button>

          {/* Botón ELIMINAR  */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
            disabled={loading}
            className="icon-button delete-icon-button"
          >
            <span className="material-symbols-rounded">delete</span>
          </button>
        </div>
      </div>
    );
  }

  // Modo Edición
  return (
    <form
      onSubmit={handleEditSubmit}
      className="new-place-form"
      onClick={(e) => e.stopPropagation()}
    >
      <h4>Editar Lugar: {place.name}</h4>

      <label htmlFor="edit-name">Nombre:</label>
      <input
        id="edit-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="edit-description">Descripcion:</label>
      <textarea
        id="edit-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label htmlFor="edit-url">URL Imagen:</label>
      <input
        id="edit-url"
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />

      <p className="coordinates-display">
        Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>

      <div className="button-group-existing" style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(false);
          }}
          disabled={loading}
          className="icon-button cancel-icon-button"
        >
          <span className="material-symbols-rounded">close</span> 
        </button>

        <button
          type="submit"
          disabled={loading}
          >
          {loading ? "Guardando..." : "Guardar Cambios"} 
        </button>
      </div>
    </form>
  );
};

export default ExistingPlacePopup;
