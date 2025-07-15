import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import type { UpdateProfileDto } from "../types";

const profileSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  password: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    initialData: user,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      password: "",
      street: profile?.shippingAddress?.street || "",
      city: profile?.shippingAddress?.city || "",
      postalCode: profile?.shippingAddress?.postalCode || "",
      country: profile?.shippingAddress?.country || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(["profile"], updatedUser);
      reset({
        name: updatedUser.name,
        password: "",
        street: updatedUser.shippingAddress?.street || "",
        city: updatedUser.shippingAddress?.city || "",
        postalCode: updatedUser.shippingAddress?.postalCode || "",
        country: updatedUser.shippingAddress?.country || "",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const updateData: UpdateProfileDto = {
      name: data.name,
      ...(data.password && { password: data.password }),
      shippingAddress: {
        street: data.street || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        country: data.country || "",
      },
    };

    updateProfileMutation.mutate(updateData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">โปรไฟล์ของฉัน</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {profile?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.name}
              </h2>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="mt-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    profile?.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : profile?.role === "CEO"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {profile?.role === "ADMIN"
                    ? "ผู้ดูแลระบบ"
                    : profile?.role === "CEO"
                    ? "ผู้บริหาร"
                    : "สมาชิก"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-6">แก้ไขข้อมูลส่วนตัว</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  ข้อมูลทั่วไป
                </h4>
                <div className="space-y-4">
                  <Input
                    label="ชื่อ-นามสกุล"
                    {...register("name")}
                    error={errors.name?.message}
                  />

                  <Input
                    label="รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)"
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  ที่อยู่จัดส่ง
                </h4>
                <div className="space-y-4">
                  <Input
                    label="ที่อยู่"
                    {...register("street")}
                    error={errors.street?.message}
                    placeholder="123 ถนน..."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="เมือง"
                      {...register("city")}
                      error={errors.city?.message}
                      placeholder="กรุงเทพฯ"
                    />
                    <Input
                      label="รหัสไปรษณีย์"
                      {...register("postalCode")}
                      error={errors.postalCode?.message}
                      placeholder="10110"
                    />
                  </div>

                  <Input
                    label="ประเทศ"
                    {...register("country")}
                    error={errors.country?.message}
                    placeholder="Thailand"
                  />
                </div>
              </div>

              {updateProfileMutation.error && (
                <div className="text-red-600 text-sm">
                  เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง
                </div>
              )}

              {updateProfileMutation.isSuccess && (
                <div className="text-green-600 text-sm">
                  อัปเดตข้อมูลเรียบร้อยแล้ว
                </div>
              )}

              <Button
                type="submit"
                loading={updateProfileMutation.isPending}
                className="w-full"
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
