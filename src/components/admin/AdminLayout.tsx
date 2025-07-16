import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Home,
  Menu,
  X,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ShopSphere</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={closeSidebar}
            >
              <Home className="mr-3 h-5 w-5" />
              กลับสู่เว็บไซต์
            </Link>

            <div className="border-t border-gray-200 pt-4 mt-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Admin</span>
              </div>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};