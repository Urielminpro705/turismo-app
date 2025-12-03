import React, { useState, useEffect} from "react";
import "./review.css"; 

const REVIEWS_ENDPOINT = "http://3.138.174.15:3000/reviews";

/**
 * @param {string} props.placeId - ID del lugar.
 * @param {string} props.placeName - Nombre del lugar.
 * @param {function} props.onSuccess - Callback al crear/actualizar/eliminar.
 * @param {function} props.onCancel - Callback para volver al listado de reseñas.
 */
const ReviewForm = ({ placeId, placeName, onSuccess, onCancel }) => {
    
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingReview, setExistingReview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userId = localStorage.getItem("userId");

    // -----------------------------------------------------
    // BUSCAR RESEÑA EXISTENTE
    useEffect(() => {
        if (!userId) {
            setError("Debes iniciar sesión para escribir una reseña.");
            setLoading(false);
            return;
        }

        const checkExistingReview = async () => {
            setLoading(true);
            setError(null);
            try {
                // Buscar reseñas filtrando por placeId Y userId
                const response = await fetch(`${REVIEWS_ENDPOINT}?placeId=${placeId}&userId=${userId}`);
                
                if (!response.ok) {
                    throw new Error("Error al buscar la reseña existente.");
                }
                
                const result = await response.json();
                
                const foundReview = result.data ? result.data[0] : null; 

                if (foundReview) {
                    setExistingReview(foundReview);
                    setComment(foundReview.comment || "");
                    setRating(foundReview.rating || 0);
                } else {
                    setExistingReview(null);
                    setComment("");
                    setRating(0);
                }
            } catch (err) {
                console.error("Error checking review:", err);
                setError("Hubo un error al verificar tu reseña.");
            } finally {
                setLoading(false);
            }
        };

        checkExistingReview();
    }, [placeId, userId]);

    // -----------------------------------------------------
    // MANEJO DE ENVÍO (POST para CREAR / PATCH para ACTUALIZAR)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError("No hay usuario autenticado.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const reviewData = {
            userId: userId,
            placeId: placeId,
            comment: comment,
            rating: parseInt(rating),
        };

        const method = existingReview ? "PATCH" : "POST";
        const url = existingReview ? `${REVIEWS_ENDPOINT}/${existingReview.id}` : REVIEWS_ENDPOINT;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al ${method === 'POST' ? 'crear' : 'actualizar'} la reseña: ${errorText}`);
            }

            onSuccess();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || "Ocurrió un error al guardar la reseña.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // -----------------------------------------------------
    // 3. MANEJO DE ELIMINACIÓN (DELETE)
    const handleDelete = async () => {
        if (!existingReview || !window.confirm("¿Estás seguro de que quieres eliminar tu reseña?")) return;

        if (!userId) {
            setError("No hay usuario autenticado.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${REVIEWS_ENDPOINT}/${existingReview.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la reseña.");
            }

            onSuccess();
        } catch (err) {
            console.error("Deletion error:", err);
            setError(err.message || "Ocurrió un error al eliminar la reseña.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // -----------------------------------------------------
    // 4. Renderizado
    if (loading) {
        return <div className="new-place-form">Cargando tu reseña...</div>;
    }
    
    if (error && error.includes("iniciar sesión")) {
        return <div className="new-place-form">
            <h4 style={{ color: 'red' }}>{error}</h4>
            <button 
                type="button"
                onClick={onCancel}
                className="icon-button cancel-review-button-form"
            >
                <span className="material-symbols-rounded">close</span>
            </button>
        </div>;
    }

    const isEditing = !!existingReview;

    return (
        <form onSubmit={handleSubmit} className="new-place-form review-form-container">
            <h4>{isEditing ? `Editar Reseña de ${placeName}` : `Crear Reseña para ${placeName}`}</h4>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <label htmlFor="rating">Rating (1 a 5):</label>
            <input
                id="rating"
                type="number"
                min="1"
                max="5"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />

            <label htmlFor="comment">Comentario:</label>
            <textarea
                id="comment"
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            
            <div className="button-group-existing" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
                
                {/* Botón CANCELAR*/}
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onCancel(); }}
                    disabled={isSubmitting}
                    className="icon-button cancel-review-button-form"
                >
                    <span className="material-symbols-rounded">close</span>
                </button>

                {/* Botón ELIMINAR*/}
                {isEditing && (
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                        disabled={isSubmitting}
                        className="icon-button delete-review-button"
                        style={{ order: 1 }}
                    >
                        <span className="material-symbols-rounded">delete</span>
                    </button>
                )}
                
                {/* Botón GUARDAR / CREAR  */}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="icon-button save-review-button"
                    style={{ order: isEditing ? 2 : 1 }}
                >
                    <span className="material-symbols-rounded">save</span>
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;