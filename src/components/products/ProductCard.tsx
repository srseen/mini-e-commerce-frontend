import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatPrice } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-0 overflow-hidden border-2 hover:border-blue-200">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {product.salePrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ลดราคา
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">สินค้าหมด</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.ratings)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.numReviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {product.stock === 0 && (
          <div className="mt-2">
            <span className="text-sm text-red-600 font-medium">สินค้าหมด</span>
          </div>
        )}
      </div>
    </Card>
  );
};