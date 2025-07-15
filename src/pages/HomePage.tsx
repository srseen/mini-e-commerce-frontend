import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import { productsApi } from "../api/products";
import { categoriesApi } from "../api/categories";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { formatPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";

export const HomePage: React.FC = () => {
  const { addItem } = useCartStore();

  const { data: featuredProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productsApi.getFeatured(8),
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ยินดีต้อนรับสู่ ShopSphere
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              แพลตฟอร์มอีคอมเมิร์ซที่ครบครันสำหรับทุกความต้องการ
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-blue-600">
                เริ่มช้อปปิ้ง
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            หมวดหมู่สินค้า
          </h2>
          <p className="text-lg text-gray-600">
            เลือกช้อปปิ้งตามหมวดหมู่ที่คุณสนใจ
          </p>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-200 p-8">
                  <div className="text-4xl mb-4">{category.icon || "📦"}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">สินค้าแนะนำ</h2>
          <p className="text-lg text-gray-600">
            สินค้าคุณภาพดีที่ได้รับความนิยม
          </p>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <Card
                key={product._id}
                className="group hover:shadow-lg transition-shadow duration-200 p-0 overflow-hidden"
              >
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2">
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
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg">
              ดูสินค้าทั้งหมด
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือก ShopSphere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">จัดส่งรวดเร็ว</h3>
              <p className="text-gray-600">
                จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า 1,000 บาท
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">ปลอดภัย 100%</h3>
              <p className="text-gray-600">
                ระบบความปลอดภัยระดับสูงสำหรับการชำระเงิน
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">บริการลูกค้า 24/7</h3>
              <p className="text-gray-600">
                ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
