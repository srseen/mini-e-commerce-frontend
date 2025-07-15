import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Grid, List } from "lucide-react";
import { productsApi } from "../api/products";
import { ProductCard } from "../components/products/ProductCard";
import { FilterSidebar } from "../components/products/FilterSidebar";
import { Pagination } from "../components/ui/Pagination";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
  });

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.search) params.set("search", filters.search);
    if (page > 1) params.set("page", page.toString());
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);

    setSearchParams(params);
  }, [filters, page, sortBy, sortOrder, setSearchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters, page, sortBy, sortOrder],
    queryFn: () =>
      productsApi.getAll({
        ...filters,
        page,
        limit: 12,
        sortBy,
        sortOrder,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      }),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
    setPage(1);
  };

  const sortOptions = [
    { value: "createdAt", label: "วันที่เพิ่ม" },
    { value: "name", label: "ชื่อสินค้า" },
    { value: "price", label: "ราคา" },
    { value: "ratings", label: "คะแนน" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">สินค้าทั้งหมด</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              placeholder="เรียงตาม"
            />

            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value as "asc" | "desc")}
              options={[
                { value: "asc", label: "น้อยไปมาก" },
                { value: "desc", label: "มากไปน้อย" },
              ]}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "blue" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "blue" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                แสดง {data.products.length} จาก {data.total} รายการ
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
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
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่พบสินค้าที่ค้นหา
              </h3>
              <p className="text-gray-600 mb-4">
                ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างตัวกรอง
              </p>
              <Button onClick={handleClearFilters}>ล้างตัวกรอง</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
