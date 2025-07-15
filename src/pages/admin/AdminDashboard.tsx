import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { ordersApi } from '../../api/orders';
import { productsApi } from '../../api/products';
import { Card } from '../../components/ui/Card';
import { formatPrice } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => ordersApi.getAll({ limit: 5 }),
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAll({ limit: 5 }),
  });

  const stats = [
    {
      name: 'คำสั่งซื้อทั้งหมด',
      value: ordersData?.total || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'สินค้าทั้งหมด',
      value: productsData?.total || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'ผู้ใช้ทั้งหมด',
      value: '0', // จะต้องเพิ่ม API สำหรับนับผู้ใช้
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'ยอดขายรวม',
      value: formatPrice(0), // จะต้องเพิ่ม API สำหรับยอดขาย
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แดshboard ผู้ดูแลระบบ</h1>
        <p className="text-gray-600 mt-2">ภาพรวมการจัดการระบบ ShopSphere</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4">คำสั่งซื้อล่าสุด</h3>
          <div className="space-y-3">
            {ordersData?.orders?.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">#{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-600">{order.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">สินค้าล่าสุด</h3>
          <div className="space-y-3">
            {productsData?.products?.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock} ชิ้น
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};