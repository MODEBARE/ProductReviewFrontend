import type { Product } from '../types/Product';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }: { product: Product }) => {
  const ratingText = typeof product.averageRating === 'number'
    ? product.averageRating.toFixed(1)
    : 'No rating';

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white">
      <Link to={`/products/${product.id}`}>
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-2">{product.category}</p>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>${product.price}</span>
          <span>⭐ {ratingText}</span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
