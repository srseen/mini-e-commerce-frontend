import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../../api/categories";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface FilterSidebarProps {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">ค้นหา</h3>
        <Input
          placeholder="ค้นหาสินค้า..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">หมวดหมู่</h3>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !filters.category
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            ทั้งหมด
          </button>
          {categories?.map((category) => (
            <button
              key={category._id}
              onClick={() => onFilterChange("category", category._id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filters.category === category._id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">ช่วงราคา</h3>
        <div className="space-y-3">
          <Input
            placeholder="ราคาต่ำสุด"
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
          />
          <Input
            placeholder="ราคาสูงสุด"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </Card>

      <Button variant="outline" onClick={onClearFilters} className="w-full">
        ล้างตัวกรอง
      </Button>
    </div>
  );
};
