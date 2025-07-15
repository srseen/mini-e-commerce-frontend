import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { formatPrice } from "../lib/utils";
import type { CreateOrderDto } from "../types";

const checkoutSchema = z.object({
  address: z.string().min(1, "กรุณาใส่ที่อยู่"),
  city: z.string().min(1, "กรุณาใส่เมือง"),
  postalCode: z.string().min(1, "กรุณาใส่รหัสไปรษณีย์"),
  country: z.string().min(1, "กรุณาใส่ประเทศ"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: user?.shippingAddress?.street || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      country: user?.shippingAddress?.country || "Thailand",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      clearCart();
      navigate(`/orders/${order._id}`, {
        state: { message: "สั่งซื้อสำเร็จ!" },
      });
    },
  });

  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 1000 ? 0 : 50;
  const taxRate = 0.07; // 7% VAT
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingFee + taxAmount;

  const onSubmit = (data: CheckoutFormData) => {
    const orderData: CreateOrderDto = {
      orderItems: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        product: item.product._id,
        image: item.product.images[0],
      })),
      shippingInfo: {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
      itemsPrice: subtotal,
      shippingPrice: shippingFee,
      taxPrice: taxAmount,
      totalPrice: total,
    };

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ชำระเงิน</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">ข้อมูลการจัดส่ง</h2>
              <div className="space-y-4">
                <Input
                  label="ที่อยู่"
                  {...register("address")}
                  error={errors.address?.message}
                  placeholder="123 ถนน..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="เมือง"
                    {...register("city")}
                    error={errors.city?.message}
                    placeholder="กรุงเทพฯ"
                  />
                  <Input
                    label="รหัสไปรษณีย์"
                    {...register("postalCode")}
                    error={errors.postalCode?.message}
                    placeholder="10110"
                  />
                </div>

                <Input
                  label="ประเทศ"
                  {...register("country")}
                  error={errors.country?.message}
                  placeholder="Thailand"
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">วิธีการชำระเงิน</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>บัตรเครดิต/เดบิต</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>โอนเงินผ่านธนาคาร</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>เก็บเงินปลายทาง</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x{" "}
                        {formatPrice(
                          item.product.salePrice || item.product.price
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(
                        (item.product.salePrice || item.product.price) *
                          item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

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

                <div className="flex justify-between">
                  <span>ภาษี (7%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>รวมทั้งสิ้น</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                loading={createOrderMutation.isPending}
              >
                ยืนยันการสั่งซื้อ
              </Button>

              {createOrderMutation.error && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง
                </p>
              )}
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
