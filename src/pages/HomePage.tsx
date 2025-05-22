import React, { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <Link key={product.id} to={`/products/${product.id}`} className="border p-4 shadow rounded hover:bg-gray-50">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-yellow-500 font-bold">⭐ {product.averageRating.toFixed(1)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;