import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRate, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onRate?.(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
            className={`
              text-3xl transition-all duration-200
              ${isActive ? 'text-yellow-400 drop-shadow-glow' : 'text-gray-300'}
              ${!readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            `}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;