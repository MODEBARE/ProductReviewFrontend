import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  averageRating: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid gap-4">
        {products.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="block p-4 shadow hover:bg-gray-50"
          >
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-yellow-500">⭐ {product.averageRating?.toFixed(1)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
