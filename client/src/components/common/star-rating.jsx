import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={
            handleRatingChange ? () => handleRatingChange(star) : undefined
          }
          className={`p-0.5 rounded transition-transform hover:scale-110 ${
            handleRatingChange ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <StarIcon
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-foreground/25"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
