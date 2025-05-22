
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  averageRating: number | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const fetchProduct = async () => {
    const res = await axios.get(`/api/products`);
    const found = res.data.find((p: Product) => p.id === Number(id));
    setProduct(found);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`/api/products/${id}/reviews`);
    setReviews(res.data);
  };

  const fetchSummary = async () => {
    const res = await axios.get(`/api/products/${id}/reviews/summary`);
    setSummary(res.data.summary);
  };

  useEffect(() => {
    setReviews([]);
    setSummary('');
    setLoading(true);
    Promise.all([fetchProduct(), fetchReviews(), fetchSummary()])
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/products/${id}/reviews/${editId}`, { rating, comment });
        setEditId(null);
      } else {
        await axios.post(`/api/products/${id}/reviews`, { author, rating, comment });
        setAuthor('');
      }
      setRating(5);
      setComment('');
      fetchReviews();
      fetchSummary();
    } catch (err) {
      console.error("Review submit error", err);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await axios.delete(`/api/products/${id}/reviews/${reviewId}`);
      fetchReviews();
      fetchSummary();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleEdit = (review: Review) => {
    setEditId(review.id);
    setRating(review.rating);
    setComment(review.comment);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Reviewing: {product?.name}</h1>
      <p className="text-gray-600 italic mb-4">{summary || "No summary yet."}</p>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        {!editId && (
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="border p-2 w-full"
            required
          />
        )}
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="border p-2 w-full"
          min={1}
          max={5}
          required
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update Review" : "Submit Review"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setComment('');
                setRating(5);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-3 rounded shadow-sm">
            <p><strong>{r.author}</strong> ({r.rating}/5)</p>
            <p>{r.comment}</p>
            <p className="text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
            <div className="mt-2 flex gap-3 text-sm">
              <button
                onClick={() => handleEdit(r)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
