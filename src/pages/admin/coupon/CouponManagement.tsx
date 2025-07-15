import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Percent, DollarSign } from "lucide-react";
import { couponsApi } from "../../../api/coupons";
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
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { formatPrice, formatDate } from "../../../lib/utils";
import type { Coupon, CreateCouponDto, UpdateCouponDto } from "../../../types";

export const CouponManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    expiryDate: "",
    minPurchase: 0,
    isActive: true,
  });

  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: couponsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: couponsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponDto }) =>
      couponsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
        minPurchase: coupon.minPurchase || 0,
        isActive: coupon.isActive,
      });
    } else {
      setSelectedCoupon(null);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        expiryDate: "",
        minPurchase: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.expiryDate) return;

    const couponData = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      expiryDate: formData.expiryDate,
      minPurchase: formData.minPurchase || undefined,
      isActive: formData.isActive,
    };

    if (selectedCoupon) {
      updateMutation.mutate({ id: selectedCoupon._id, data: couponData });
    } else {
      createMutation.mutate(couponData as CreateCouponDto);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`คุณต้องการลบคูปอง "${code}" หรือไม่?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (!coupon.isActive) {
      return <Badge variant="danger">ปิดใช้งาน</Badge>;
    }

    if (expiryDate < now) {
      return <Badge variant="warning">หมดอายุ</Badge>;
    }

    return <Badge variant="success">ใช้งานได้</Badge>;
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return (
        <div className="flex items-center space-x-1">
          <Percent className="h-4 w-4" />
          <span>{coupon.discountValue}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span>{formatPrice(coupon.discountValue)}</span>
        </div>
      );
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
          <h1 className="text-3xl font-bold text-gray-900">จัดการคูปอง</h1>
          <p className="text-gray-600 mt-2">จัดการคูปองส่วนลดในระบบ</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มคูปองใหม่
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสคูปอง</TableHead>
              <TableHead>ประเภทส่วนลด</TableHead>
              <TableHead>มูลค่าส่วนลด</TableHead>
              <TableHead>ซื้อขั้นต่ำ</TableHead>
              <TableHead>วันหมดอายุ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                    {coupon.code}
                  </code>
                </TableCell>
                <TableCell>
                  {coupon.discountType === "percentage"
                    ? "เปอร์เซ็นต์"
                    : "จำนวนเงิน"}
                </TableCell>
                <TableCell>{getDiscountDisplay(coupon)}</TableCell>
                <TableCell>
                  {coupon.minPurchase ? formatPrice(coupon.minPurchase) : "-"}
                </TableCell>
                <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                <TableCell>{getStatusBadge(coupon)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(coupon._id, coupon.code)}
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

      {/* Coupon Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCoupon ? "แก้ไขคูปอง" : "เพิ่มคูปองใหม่"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="รหัสคูปอง"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                code: e.target.value.toUpperCase(),
              }))
            }
            placeholder="SAVE20"
            required
          />

          <Select
            label="ประเภทส่วนลด"
            value={formData.discountType}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, discountType: value as any }))
            }
            options={[
              { value: "percentage", label: "เปอร์เซ็นต์ (%)" },
              { value: "fixed", label: "จำนวนเงิน (บาท)" },
            ]}
          />

          <Input
            label={`มูลค่าส่วนลด ${
              formData.discountType === "percentage" ? "(%)" : "(บาท)"
            }`}
            type="number"
            step={formData.discountType === "percentage" ? "1" : "0.01"}
            min="0"
            max={formData.discountType === "percentage" ? "100" : undefined}
            value={formData.discountValue}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                discountValue: Number(e.target.value),
              }))
            }
            required
          />

          <Input
            label="ซื้อขั้นต่ำ (บาท)"
            type="number"
            step="0.01"
            min="0"
            value={formData.minPurchase}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                minPurchase: Number(e.target.value),
              }))
            }
            placeholder="0"
          />

          <Input
            label="วันหมดอายุ"
            type="date"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
            }
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              เปิดใช้งาน
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedCoupon ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มคูปอง"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
