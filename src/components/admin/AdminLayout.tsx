import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Home,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const navigation = [
  { name: "ภาพรวม", href: "/admin", icon: BarChart3 },
  { name: "สินค้า", href: "/admin/products", icon: Package },
  { name: "คำสั่งซื้อ", href: "/admin/orders", icon: ShoppingCart },
  { name: "ผู้ใช้", href: "/admin/users", icon: Users },
  { name: "หมวดหมู่", href: "/admin/categories", icon: Tag },
  { name: "คูปอง", href: "/admin/coupons", icon: Tag },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ShopSphere</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="px-4 pb-4">
            <div className="space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="mr-3 h-5 w-5" />
                กลับสู่เว็บไซต์
              </Link>

              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
