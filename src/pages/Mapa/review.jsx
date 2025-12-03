import React, { useState, useEffect, useCallback } from "react";
import "./newPlace.css";
import "./review.css";
import ReviewForm from "./reviewForm";

const USERS_ENDPOINT = "http://3.138.174.15:3000/users";
const REVIEWS_ENDPOINT = "http://3.138.174.15:3000/reviews";

/**
 * Componente Popup para mostrar las reseñas de un lugar.
 * @param {string} props.placeId - ID del lugar para el que se buscan las reseñas.
 * @param {function} props.onClose - Callback para cerrar este popup y volver al anterior.
 * @param {string} props.placeName - Nombre del lugar para el título.
 */
const ReviewPopup = ({ placeId, placeName, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddingReview, setIsAddingReview] = useState(false);

  // Función para obtener la lista de usuarios y mapearla por ID
  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.statusText}`);
      }
      const result = await response.json();
      
      
      const usersMap = (result.data || []).reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {});
      
      setUsers(usersMap);
      return usersMap; 
    } catch (err) {
      console.error("Error fetching users:", err);
      return {}; 
    }
  };

  const fetchReviews = useCallback(async (usersMap) => {
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
}, [placeId, setLoading, setError]);

  useEffect(() => {
    fetchReviews();
    fetchUsers().then((usersMap) => {
        fetchReviews(usersMap);
    });
  }, [fetchReviews]);
  
  // Recargar lista de reseñas después de agregar/editar/eliminar
  const handleActionSuccess = () => {
        setIsAddingReview(false);
        fetchUsers().then((usersMap) => {
        fetchReviews(usersMap);
    });
    };

  const handleAddReviewClick = (e) => {
    e.stopPropagation();

    setIsAddingReview(true);
  };

  const getUserNameById = (userId) => {
      const user = users[userId];
      return user ? user.name : "Anónimo"; 
  };

  if (isAddingReview) {
    return (
             <ReviewForm
                 placeId={placeId}
                 placeName={placeName}
                 onSuccess={handleActionSuccess}
                 onCancel={() => setIsAddingReview(false)} // Vuelve a la lista
             />
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
                  <strong>{getUserNameById(review.userId)}</strong>
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
