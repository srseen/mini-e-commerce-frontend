import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { productsApi } from "../../../api/products";
import { categoriesApi } from "../../../api/categories";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Select } from "../../../components/ui/Select";
import type { CreateProductDto, UpdateProductDto } from "../../../types";

const productSchema = z.object({
  name: z.string().min(1, "กรุณาใส่ชื่อสินค้า"),
  slug: z.string().min(1, "กรุณาใส่ slug"),
  description: z.string().min(1, "กรุณาใส่คำอธิบาย"),
  richDescription: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0, "ราคาต้องมากกว่า 0"),
  salePrice: z.number().optional(),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  stock: z.number().min(0, "จำนวนสต็อกต้องมากกว่าหรือเท่ากับ 0"),
  isFeatured: z.boolean().optional(),
  status: z.enum(["active", "inactive", "out-of-stock"]).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [images, setImages] = React.useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "active",
      isFeatured: false,
    },
  });

  // Reset form when product data is loaded
  React.useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        richDescription: product.richDescription || "",
        brand: product.brand || "",
        price: product.price,
        salePrice: product.salePrice || undefined,
        category: product.category._id,
        stock: product.stock,
        isFeatured: product.isFeatured,
        status: product.status as any,
      });
      setImages(product.images || []);
    }
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/admin/products");
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, you would upload these files to a server
    // For now, we'll create object URLs for preview
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const watchName = watch("name");
  React.useEffect(() => {
    if (watchName && !isEdit) {
      setValue("slug", generateSlug(watchName));
    }
  }, [watchName, setValue, isEdit]);

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      ...data,
      images,
      salePrice: data.salePrice || undefined,
    };

    if (isEdit) {
      updateMutation.mutate({ id: id!, data: productData });
    } else {
      createMutation.mutate(productData as CreateProductDto);
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })) || [];

  const statusOptions = [
    { value: "active", label: "เปิดขาย" },
    { value: "inactive", label: "ปิดขาย" },
    { value: "out-of-stock", label: "หมด" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่เข้าสู่ระบบ"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">ข้อมูลพื้นฐาน</h3>
              <div className="space-y-4">
                <Input
                  label="ชื่อสินค้า"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="Slug (URL)"
                  {...register("slug")}
                  error={errors.slug?.message}
                  placeholder="product-name"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบาย
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบายเพิ่มเติม
                  </label>
                  <textarea
                    {...register("richDescription")}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Input
                  label="แบรนด์"
                  {...register("brand")}
                  error={errors.brand?.message}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">ราคาและสต็อก</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ราคาปกติ"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  error={errors.price?.message}
                />

                <Input
                  label="ราคาลดพิเศษ"
                  type="number"
                  step="0.01"
                  {...register("salePrice", { valueAsNumber: true })}
                  error={errors.salePrice?.message}
                />

                <Input
                  label="จำนวนสต็อก"
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  error={errors.stock?.message}
                />
              </div>
            </Card>

            {/* Image Upload */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">รูปภาพสินค้า</h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {isDragActive
                    ? "วางรูปภาพที่นี่..."
                    : "ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  รองรับไฟล์ JPG, PNG, WebP
                </p>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">การตั้งค่า</h3>
              <div className="space-y-4">
                <Select
                  label="หมวดหมู่"
                  value={watch("category") || ""}
                  onChange={(value) => setValue("category", value)}
                  options={categoryOptions}
                  error={errors.category?.message}
                />

                <Select
                  label="สถานะ"
                  value={watch("status") || "active"}
                  onChange={(value) => setValue("status", value as any)}
                  options={statusOptions}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-medium text-gray-700"
                  >
                    สินค้าแนะนำ
                  </label>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/products")}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
