import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Product } from '../types/product';
import type { Review } from '../types/review';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const [productRes, reviewRes] = await Promise.all([
        axios.get(`http://localhost:5050/products/${id}`),
        axios.get(`http://localhost:5050/products/${id}/reviews`)
      ]);
      setProduct(productRes.data);
      setReviews(reviewRes.data);
    } catch (error) {
      console.error('Error fetching product details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!product) return <p className="text-center mt-8">Product not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-gray-500">Category: {product.category}</p>
      <p>⭐ {product.averageRating.toFixed(1)}</p>

      <ReviewForm productId={product.id} onReviewAdded={fetchDetails} />

      <h2 className="text-xl font-semibold mb-2 mt-6">Reviews</h2>
      {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
    </div>
  );
};

export default ProductDetail;