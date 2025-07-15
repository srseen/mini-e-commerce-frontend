import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { ordersApi } from '../api/orders';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatPrice, formatDate } from '../lib/utils';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const message = location.state?.message;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'processing':
        return 'กำลังเตรียมสินค้า';
      case 'shipped':
        return 'จัดส่งแล้ว';
      case 'delivered':
        return 'ส่งสำเร็จ';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-8 rounded w-1/3"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
          <div className="bg-gray-200 h-32 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบคำสั่งซื้อ</h1>
          <Link to="/orders">
            <Button>กลับไปหน้าประวัติการสั่งซื้อ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปประวัติการสั่งซื้อ
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              คำสั่งซื้อ #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              สั่งซื้อเมื่อ {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2">{getStatusText(order.status)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">สินค้าที่สั่งซื้อ</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        📦
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      จำนวน {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">ที่อยู่จัดส่ง</h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city} {order.shippingInfo.postalCode}</p>
              <p>{order.shippingInfo.country}</p>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <span className="text-green-600">ฟรี</span>
                  ) : (
                    formatPrice(order.shippingPrice)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>ภาษี</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              
              {order.couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลด ({order.couponApplied.code})</span>
                  <span>-{formatPrice(order.couponApplied.discountAmount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>รวมทั้งสิ้น</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">สถานะการสั่งซื้อ</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">สั่งซื้อสำเร็จ</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">กำลังเตรียมสินค้า</p>
                    </div>
                  </div>
                )}
                
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">จัดส่งแล้ว</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && order.deliveredAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ส่งสำเร็จ</p>
                      <p className="text-xs text-gray-500">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};