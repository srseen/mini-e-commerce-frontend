import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { productsApi } from "../../../api/products";
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
import { Badge } from "../../../components/ui/Badge";
import { Pagination } from "../../../components/ui/Pagination";
import { formatPrice, formatDate } from "../../../lib/utils";

export const ProductManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => productsApi.getAll({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`คุณต้องการลบสินค้า "${name}" หรือไม่?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) return <Badge variant="danger">หมด</Badge>;
    if (status === "active") return <Badge variant="success">เปิดขาย</Badge>;
    if (status === "inactive") return <Badge variant="warning">ปิดขาย</Badge>;
    return <Badge variant="default">{status}</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">จัดการสินค้า</h1>
          <p className="text-gray-600 mt-2">จัดการสินค้าทั้งหมดในระบบ</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มสินค้าใหม่
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รูปภาพ</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>สต็อก</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products?.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
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
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.brand && (
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  <div>
                    {product.salePrice ? (
                      <>
                        <p className="font-medium text-red-600">
                          {formatPrice(product.salePrice)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </p>
                      </>
                    ) : (
                      <p className="font-medium">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 10
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(product.status, product.stock)}
                </TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link to={`/products/${product.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/admin/products/edit/${product._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product._id, product.name)}
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

        {data && data.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
