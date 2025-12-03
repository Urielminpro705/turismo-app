import React, { useState, useEffect } from "react";
import "./newPlace.css";
import "./review.css";

const REVIEWS_ENDPOINT = "http://3.138.174.15:3000/reviews";

/**
 * Componente Popup para mostrar las reseñas de un lugar.
 * @param {string} props.placeId - ID del lugar para el que se buscan las reseñas.
 * @param {function} props.onClose - Callback para cerrar este popup y volver al anterior.
 * @param {string} props.placeName - Nombre del lugar para el título.
 */
const ReviewPopup = ({ placeId, placeName, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddingReview, setIsAddingReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${REVIEWS_ENDPOINT}?placeId=${placeId}`);

        if (!response.ok) {
          throw new Error(`Error al cargar reseñas: ${response.statusText}`);
        }

        const result = await response.json();
        setReviews(result.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("No se pudieron cargar las reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId]);

  const handleAddReviewClick = (e) => {
    e.stopPropagation();

    setIsAddingReview(true);
  };

  if (isAddingReview) {
    return (
      <div className="new-place-form" onClick={(e) => e.stopPropagation()}>
        <h4>Agregando Reseña a {placeName}</h4>
        <p> (Aquí iría el formulario de la reseña) </p>
        <div
          className="button-group-existing"
          style={{ justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingReview(false);
            }}
            style={{ backgroundColor: "#A9A9A9", color: "white" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="new-place-form review-form-container"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Título de Reseñas y Conteo */}
      <h4 className="review-header">
        Reseñas de: {placeName} ({reviews.length})
      </h4>

      {loading && <p>Cargando reseñas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="reviews-list-container">
          {reviews.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#666" }}>
              Aún no hay reseñas para este lugar.
            </p>
          ) : (
            reviews.map((review, index) => (
              // ESTRUCTURA DE LA RESEÑA
              <div key={review.id || index} className="review-item">
                {/* Icono y Nombre */}
                <div className="review-user-info">
                  <span className="material-symbols-rounded review-user-icon">
                    account_circle
                  </span>
                  <strong>{review.user_name || "Anónimo"}</strong>
                </div>

                {/*  Metadata (Fecha y Calificación) */}
                <div className="review-metadata">
                  <span className="review-date">
                    {/* Procesamos la fecha y la hora en un solo string */}
                    {new Date(review.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {new Date(review.date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <div className="review-rating">
                    <span>{review.rating || "N/A"}</span>
                    <span className="material-symbols-rounded">star</span>
                  </div>
                </div>

                {/* Comentario */}
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Botones de Acción (Alineación a la Derecha) */}
      <div
        className="button-group-existing"
        style={{ justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}
      >
        {/* BOTÓN CANCELAR */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="icon-button cancel-review-button"
        >
          <span className="material-symbols-rounded">close</span>
        </button>

        {/* BOTÓN AGREGAR RESEÑA*/}
        <button
          type="button"
          onClick={handleAddReviewClick}
          className="add-review-button"
        >
          Agregar Reseña
        </button>
      </div>
    </div>
  );
};

export default ReviewPopup;
