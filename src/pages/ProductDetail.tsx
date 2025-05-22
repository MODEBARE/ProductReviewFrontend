import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [summary, setSummary] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProduct = async () => {
    const res = await axios.get(`${BASE_URL}/api/products`);
    const found = res.data.find((p: any) => p.id === Number(id));
    setProduct(found);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`${BASE_URL}/api/products/${id}/reviews`);
    setReviews(res.data);
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/${id}/reviews/summary`);
      setSummary(res.data.summary);
    } catch {
      setSummary('');
    }
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
        await axios.put(`${BASE_URL}/api/products/${id}/reviews/${editId}`, { rating, comment });
        setEditId(null);
      } else {
        await axios.post(`${BASE_URL}/api/products/${id}/reviews`, { author, rating, comment });
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
      await axios.delete(`${BASE_URL}/api/products/${id}/reviews/${reviewId}`);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>
        <p className="text-sm text-gray-600 mb-2">{product?.description}</p>
        <p className="text-sm text-blue-600 mb-2">Category: {product?.category}</p>
        <p className="text-green-600 mb-2 font-bold">Price: ${product?.price}</p>
        <p className="text-yellow-600 font-bold mb-4">
          Average Rating: {typeof product?.averageRating === 'number' ? product.averageRating.toFixed(1) : 'No rating yet'}
        </p>

        {summary && (
          <div className="bg-blue-50 p-4 rounded mb-4">
            <strong>Review Summary:</strong>
            <p>{summary}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          {!editId && (
            <input
              className="w-full p-2 border border-gray-300 rounded"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Your name"
              required
            />
          )}
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review"
            required
          />
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n} Star</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            {editId ? "Update Review" : "Submit Review"}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          {reviews.map(r => (
            <div key={r.id} className="border-b py-2">
              <p className="font-bold">{r.author} ({r.rating}⭐)</p>
              <p>{r.comment}</p>
              <div className="space-x-2 mt-1">
                <button onClick={() => handleEdit(r)} className="text-sm text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
