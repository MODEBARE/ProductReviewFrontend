import { useState } from 'react';
import axios from 'axios';
import type { Review } from '../types/Review'; // ⬅️ Uppercase import

interface Props {
  productId: number;
  onReviewAdded: () => void;
  existingReview?: Review;
}

const ReviewForm = ({ productId, onReviewAdded, existingReview }: Props) => {
  const [author, setAuthor] = useState(existingReview?.author || '');
  const [rating, setRating] = useState(existingReview?.rating || 1);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isEditing] = useState(!!existingReview);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const review: Omit<Review, 'id' | 'date'> = { productId, author, rating, comment };
    try {
      if (isEditing && existingReview) {
        await axios.put(`${API_BASE}/api/products/${productId}/reviews/${existingReview.id}`, review);
      } else {
        await axios.post(`${API_BASE}/api/products/${productId}/reviews`, review);
      }
      onReviewAdded();
      setAuthor('');
      setRating(1);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDelete = async () => {
    if (existingReview) {
      try {
        await axios.delete(`${API_BASE}/api/products/${productId}/reviews/${existingReview.id}`);
        onReviewAdded();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Edit Review' : 'Add a Review'}</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} required
               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded">
          {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {isEditing ? 'Update' : 'Submit'}
        </button>
        {isEditing && (
          <button type="button" onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
