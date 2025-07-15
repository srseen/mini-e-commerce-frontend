import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categoriesApi } from "../../../api/categories";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/Table";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { formatDate } from "../../../lib/utils";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../../../types";

export const CategoryManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "",
    color: "#3B82F6",
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon || "",
        color: category.color || "#3B82F6",
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        slug: "",
        icon: "",
        color: "#3B82F6",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: "",
      slug: "",
      icon: "",
      color: "#3B82F6",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const categoryData = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      icon: formData.icon.trim() || undefined,
      color: formData.color,
    };

    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory._id, data: categoryData });
    } else {
      createMutation.mutate(categoryData as CreateCategoryDto);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`คุณต้องการลบหมวดหมู่ "${name}" หรือไม่?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-1/3 mb-4"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <p className="text-gray-600 mt-2">จัดการหมวดหมู่สินค้าในระบบ</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มหมวดหมู่ใหม่
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ไอคอน</TableHead>
              <TableHead>ชื่อหมวดหมู่</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>สี</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <div className="text-2xl">{category.icon || "📦"}</div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{category.name}</span>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.color}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category._id, category.name)}
                      loading={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Category Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ชื่อหมวดหมู่"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="เช่น อิเล็กทรอนิกส์"
            required
          />

          <Input
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="electronics"
            required
          />

          <Input
            label="ไอคอน (Emoji)"
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="📱"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สี
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedCategory ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มหมวดหมู่"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};