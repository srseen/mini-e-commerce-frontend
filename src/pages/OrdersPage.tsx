import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye } from "lucide-react";
import { ordersApi } from "../api/orders";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { formatPrice, formatDate } from "../lib/utils";

export const OrdersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", page, statusFilter],
    queryFn: () =>
      ordersApi.getMyOrders({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
      }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "processing":
        return "กำลังเตรียมสินค้า";
      case "shipped":
        return "จัดส่งแล้ว";
      case "delivered":
        return "ส่งสำเร็จ";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ประวัติการสั่งซื้อ</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="processing">กำลังเตรียมสินค้า</option>
          <option value="shipped">จัดส่งแล้ว</option>
          <option value="delivered">ส่งสำเร็จ</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>

      {data?.orders && data.orders.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.orders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      คำสั่งซื้อ #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      สั่งซื้อเมื่อ {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      สินค้าที่สั่งซื้อ
                    </h4>
                    <div className="space-y-2">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
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
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              จำนวน {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <p className="text-sm text-gray-500">
                          และอีก {order.orderItems.length - 3} รายการ
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      ที่อยู่จัดส่ง
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingInfo.address}</p>
                      <p>
                        {order.shippingInfo.city}{" "}
                        {order.shippingInfo.postalCode}
                      </p>
                      <p>{order.shippingInfo.country}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-24 w-24 text-gray-400 mb-6" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ยังไม่มีประวัติการสั่งซื้อ
          </h3>
          <p className="text-gray-600 mb-8">
            เริ่มช้อปปิ้งและสั่งซื้อสินค้าแรกของคุณ
          </p>
          <Link to="/products">
            <Button>เริ่มช้อปปิ้ง</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
