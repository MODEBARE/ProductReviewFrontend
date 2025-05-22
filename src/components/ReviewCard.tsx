import type { Review } from '../types/Review';

const ReviewCard = ({ review }: { review: Review }) => {
  const formattedDate = review.date
    ? new Date(review.date).toLocaleDateString()
    : 'No date provided';

  return (
    <div className="border p-4 rounded-lg shadow-sm mb-3 bg-white hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">{review.author}</span>
        <span className="text-yellow-500 font-medium">⭐ {review.rating}</span>
      </div>
      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
      <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
    </div>
  );
};

export default ReviewCard;
