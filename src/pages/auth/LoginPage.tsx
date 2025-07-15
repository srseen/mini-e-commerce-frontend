import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import type { LoginDto } from "../../types";

const loginSchema = z.object({
  email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: LoginDto) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm text-gray-600">
            หรือ{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              สมัครสมาชิกใหม่
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {loginMutation.error && (
              <div className="text-red-600 text-sm text-center">
                อีเมลหรือรหัสผ่านไม่ถูกต้อง
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isPending}
            >
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
