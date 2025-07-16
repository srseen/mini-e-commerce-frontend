import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Search, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../ui/Button";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">ShopSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              หน้าหลัก
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              สินค้า
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          โปรไฟล์
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ประวัติการสั่งซื้อ
                        </Link>
                        
                        {user?.role === "ADMIN" && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            จัดการระบบ
                          </Link>
                        )}
                        
                        {user?.role === "CEO" && (
                          <Link
                            to="/ceo/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            แดชบอร์ด CEO
                          </Link>
                        )}
                        
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    หน้าหลัก
                  </Link>
                  <Link
                    to="/products"
                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    สินค้า
                  </Link>
                </div>

                {/* Mobile User Menu */}
                {isAuthenticated ? (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex items-center space-x-3 pb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      โปรไฟล์
                    </Link>
                    <Link
                      to="/orders"
                      className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      ประวัติการสั่งซื้อ
                    </Link>
                    
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        จัดการระบบ
                      </Link>
                    )}
                    
                    {user?.role === "CEO" && (
                      <Link
                        to="/ceo/dashboard"
                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        แดชบอร์ด CEO
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        เข้าสู่ระบบ
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button className="w-full">สมัครสมาชิก</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};