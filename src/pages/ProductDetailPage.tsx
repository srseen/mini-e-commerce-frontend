import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { productsApi } from "../api/products";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { formatPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="bg-gray-200 h-6 rounded w-2/3"></div>
              <div className="bg-gray-200 h-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบสินค้า</h1>
          <Button onClick={() => navigate("/products")}>
            กลับไปหน้าสินค้า
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    // Show success message or redirect to cart
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/products")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปหน้าสินค้า
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.ratings)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.numReviews} รีวิว)
              </span>
            </div>

            {product.brand && (
              <p className="text-gray-600 mb-2">แบรนด์: {product.brand}</p>
            )}

            <p className="text-gray-600 mb-2">
              หมวดหมู่: {product.category.name}
            </p>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-4">
            {product.salePrice ? (
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  ประหยัด {formatPrice(product.price - product.salePrice)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div>
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">
                มีสินค้าในสต็อก ({product.stock} ชิ้น)
              </p>
            ) : (
              <p className="text-red-600 font-medium">สินค้าหมด</p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  จำนวน:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button onClick={handleAddToCart} size="lg" className="w-full">
                <ShoppingCart className="h-5 w-5 mr-2" />
                เพิ่มลงตะกร้า
              </Button>
            </div>
          )}

          {/* Description */}
          <Card>
            <h3 className="text-lg font-semibold mb-3">รายละเอียดสินค้า</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
            {product.richDescription && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.richDescription }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
