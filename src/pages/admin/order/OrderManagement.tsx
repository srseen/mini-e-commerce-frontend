import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { ordersApi } from "../../../api/orders";
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
import { Select } from "../../../components/ui/Select";
import { Pagination } from "../../../components/ui/Pagination";
import { formatPrice, formatDate } from "../../../lib/utils";

export const OrderManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, statusFilter],
    queryFn: () =>
      ordersApi.getAll({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">รอดำเนินการ</Badge>;
      case "processing":
        return <Badge variant="info">กำลังเตรียม</Badge>;
      case "shipped":
        return <Badge variant="info">จัดส่งแล้ว</Badge>;
      case "delivered":
        return <Badge variant="success">ส่งสำเร็จ</Badge>;
      case "cancelled":
        return <Badge variant="danger">ยกเลิก</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const statusOptions = [
    { value: "", label: "สถานะทั้งหมด" },
    { value: "pending", label: "รอดำเนินการ" },
    { value: "processing", label: "กำลังเตรียม" },
    { value: "shipped", label: "จัดส่งแล้ว" },
    { value: "delivered", label: "ส่งสำเร็จ" },
    { value: "cancelled", label: "ยกเลิก" },
  ];

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
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
          <h1 className="text-3xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>
          <p className="text-gray-600 mt-2">จัดการคำสั่งซื้อทั้งหมดในระบบ</p>
        </div>

        <div className="w-64">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="กรองตามสถานะ"
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสคำสั่งซื้อ</TableHead>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>จำนวนสินค้า</TableHead>
              <TableHead>ยอดรวม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สั่งซื้อ</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.orders?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <span className="font-mono text-sm">
                    #{order._id.slice(-8)}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  ชิ้น
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatPrice(order.totalPrice)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {getStatusBadge(order.status)}
                    <Select
                      value={order.status}
                      onChange={(value) => handleStatusChange(order._id, value)}
                      options={statusOptions.slice(1)} // Remove "all" option
                    />
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(`/orders/${order._id}`, "_blank")
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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
