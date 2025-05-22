import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/useProductStore';

const Home = () => {
  const { products, setProducts } = useProductStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products') // Let Vite proxy handle it
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products', err))
      .finally(() => setLoading(false));
  }, [setProducts]);

  if (loading) return <p className="text-center mt-8">Loading products...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Home;