import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import type { RegisterDto } from "../../types";

const registerSchema = z
  .object({
    name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
    email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterFormData = RegisterDto & { confirmPassword: string };

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Register error:", error);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">สมัครสมาชิก</h2>
          <p className="mt-2 text-sm text-gray-600">
            หรือ{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="ชื่อ-นามสกุล"
              {...register("name")}
              error={errors.name?.message}
              placeholder="ชื่อ นามสกุล"
            />

            <Input
              label="อีเมล"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="your@email.com"
            />

            <Input
              label="รหัสผ่าน"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              placeholder="••••••••"
            />

            <Input
              label="ยืนยันรหัสผ่าน"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
            />

            {registerMutation.error && (
              <div className="text-red-600 text-sm text-center">
                เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={registerMutation.isPending}
            >
              สมัครสมาชิก
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            การสมัครสมาชิกแสดงว่าคุณยอมรับ{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              เงื่อนไขการใช้งาน
            </Link>{" "}
            และ{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              นโยบายความเป็นส่วนตัว
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
