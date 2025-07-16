import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, ShoppingCart, Sparkles } from "lucide-react";
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-2" />
              <span className="text-yellow-300 font-medium">ยินดีต้อนรับสู่</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ShopSphere
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              แพลตฟอร์มอีคอมเมิร์ซที่ครบครันสำหรับทุกความต้องการ
              <br />
              <span className="text-lg">ช้อปปิ้งง่าย ปลอดภัย มั่นใจได้</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-blue-700 hover:text-blue-800 shadow-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  เริ่มช้อปปิ้ง
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            หมวดหมู่สินค้า
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เลือกช้อปปิ้งตามหมวดหมู่ที่คุณสนใจ พร้อมสินค้าคุณภาพจากแบรนด์ชั้นนำ
          </p>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-32"></div>
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
                <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-blue-200">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon || "📦"}
                  </div>
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              สินค้าแนะนำ
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              สินค้าคุณภาพดีที่ได้รับความนิยมสูงสุด คัดสรรมาเพื่อคุณโดยเฉพาะ
            </p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
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
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-0 overflow-hidden border-2 hover:border-blue-200"
                >
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
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product);
                        }}
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
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                ดูสินค้าทั้งหมด
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือก ShopSphere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เราให้บริการที่ดีที่สุดเพื่อประสบการณ์การช้อปปิ้งที่สมบูรณ์แบบ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">จัดส่งรวดเร็ว</h3>
              <p className="text-gray-600 leading-relaxed">
                จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า 1,000 บาท
                <br />
                ส่งถึงมือคุณภายใน 1-2 วัน
              </p>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">ปลอดภัย 100%</h3>
              <p className="text-gray-600 leading-relaxed">
                ระบบความปลอดภัยระดับสูงสำหรับการชำระเงิน
                <br />
                ข้อมูลของคุณได้รับการคุ้มครอง
              </p>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">บริการลูกค้า 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง
                <br />
                แก้ไขปัญหาได้อย่างรวดเร็ว
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};