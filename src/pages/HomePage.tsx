import React, { useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white border p-4 shadow rounded hover:shadow-md hover:bg-gray-50 transition"
              >
                <h2 className="font-semibold text-xl mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                <p className="text-sm text-blue-700">Category: {product.category}</p>
                <p className="text-sm text-green-700 font-bold">${product.price}</p>
                <p className="text-yellow-500 font-medium mt-2">
                  ⭐ {product.averageRating !== null ? product.averageRating.toFixed(1) : 'No rating'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
