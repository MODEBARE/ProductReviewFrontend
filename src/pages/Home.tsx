import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  averageRating: number | null;
  price: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data);
      setAllProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category ? product.category === category : true)
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: 'url(https://source.unsplash.com/featured/?technology)' }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Explore Our Products</h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">All Categories</option>
            {[...new Set(allProducts.map(p => p.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-gray-100 hover:bg-gray-200 p-4 rounded shadow transform hover:scale-105 transition-all duration-200"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-blue-700 font-semibold">Category: {product.category}</p>
              <p className="text-sm text-green-700 font-bold">${product.price}</p>
              <p className="text-yellow-600">
                ⭐ {product.averageRating !== null ? product.averageRating.toFixed(1) : 'No rating'}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
