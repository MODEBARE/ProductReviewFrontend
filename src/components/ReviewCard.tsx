import type { Review } from '../types/review';

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm mb-3">
      <div className="flex justify-between">
        <span className="font-semibold">{review.author}</span>
        <span>⭐ {review.rating}</span>
      </div>
      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
      <p className="text-xs text-gray-400 mt-1">{new Date(review.date).toLocaleDateString()}</p>
    </div>
  );
};

export default ReviewCard;