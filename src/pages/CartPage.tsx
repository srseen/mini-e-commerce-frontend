import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { couponsApi } from "../api/coupons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { formatPrice } from "../lib/utils";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const validateCouponMutation = useMutation({
    mutationFn: couponsApi.validate,
    onSuccess: (data) => {
      if (data.isValid) {
        setAppliedCoupon({
          code: couponCode,
          discount: data.discount,
        });
      }
    },
    onError: () => {
      // Handle error silently or show message
    },
  });

  const handleValidateCoupon = () => {
    if (couponCode.trim()) {
      validateCouponMutation.mutate({
        code: couponCode,
        orderTotal: getTotalPrice(),
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const subtotal = getTotalPrice();
  const discount = appliedCoupon?.discount || 0;
  const shippingFee = subtotal >= 1000 ? 0 : 50;
  const total = subtotal - discount + shippingFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ตะกร้าสินค้าของคุณว่างเปล่า
          </h2>
          <p className="text-gray-600 mb-8">
            เริ่มช้อปปิ้งและเพิ่มสินค้าลงในตะกร้า
          </p>
          <Link to="/products">
            <Button size="lg">เริ่มช้อปปิ้ง</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        ตะกร้าสินค้า ({getTotalItems()} รายการ)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product._id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images && item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    หมวดหมู่: {item.product.category?.name || "ไม่ระบุ"}
                  </p>
                  <div className="mt-2">
                    {item.product.salePrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(item.product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h3 className="text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h3>

            {/* Coupon */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">รหัสส่วนลด</h4>
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">
                    {appliedCoupon.code} (-{formatPrice(appliedCoupon.discount)}
                    )
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    placeholder="ใส่รหัสส่วนลด"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleValidateCoupon}
                    loading={validateCouponMutation.isPending}
                    disabled={!couponCode.trim()}
                  >
                    ใช้
                  </Button>
                </div>
              )}
              {validateCouponMutation.error && (
                <p className="text-sm text-red-600 mt-1">
                  รหัสส่วนลดไม่ถูกต้องหรือหมดอายุ
                </p>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>ยอดรวม</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลด</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600">ฟรี</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              {subtotal < 1000 && (
                <p className="text-sm text-gray-600">
                  ซื้อเพิ่ม {formatPrice(1000 - subtotal)} เพื่อได้จัดส่งฟรี
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>รวมทั้งสิ้น</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full">
              ดำเนินการชำระเงิน
            </Button>

            <Link to="/products" className="block mt-3">
              <Button variant="outline" className="w-full">
                ช้อปปิ้งต่อ
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
