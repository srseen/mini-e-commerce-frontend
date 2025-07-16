import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Shield, UserPlus } from "lucide-react";
import { usersApi, type UpdateUserDto } from "../../../api/users";
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
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { formatDate } from "../../../lib/utils";
import { useAuthStore } from "../../../store/authStore";

export const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "ADMIN" | "CEO",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "USER" as "USER" | "ADMIN" | "CEO",
  });

  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, roleFilter, searchTerm],
    queryFn: () =>
      usersApi.getAll({
        page,
        limit: 10,
        ...(roleFilter && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm }),
      }),
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateModalOpen(false);
      setCreateForm({ name: "", email: "", password: "", role: "USER" });
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error("Update user error:", error);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.updateRole(id, { role: role as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error("Update role error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      console.error("Delete user error:", error);
    },
  });

  const handleCreateUser = () => {
    setCreateForm({ name: "", email: "", password: "", role: "USER" });
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleRoleChange = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.name.trim() ||
      !createForm.email.trim() ||
      !createForm.password.trim()
    ) {
      return;
    }
    createMutation.mutate(createForm);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !editForm.name.trim() || !editForm.email.trim()) {
      return;
    }
    updateMutation.mutate({
      id: selectedUser._id,
      data: {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      },
    });
  };

  const handleUpdateRole = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({ id: selectedUser._id, role: newRole });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`คุณต้องการลบผู้ใช้ "${name}" หรือไม่?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "CEO":
        return <Badge variant="warning">ผู้บริหาร</Badge>;
      case "ADMIN":
        return <Badge variant="info">ผู้ดูแลระบบ</Badge>;
      case "USER":
        return <Badge variant="success">สมาชิก</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const roleOptions = [
    { value: "", label: "บทบาททั้งหมด" },
    { value: "USER", label: "สมาชิก" },
    { value: "ADMIN", label: "ผู้ดูแลระบบ" },
    { value: "CEO", label: "ผู้บริหาร" },
  ];

  const canManageUser = (user: any) => {
    if (currentUser?.role === "CEO") return true;
    if (currentUser?.role === "ADMIN" && user.role !== "CEO") return true;
    return false;
  };

  const canCreateUser = () => {
    return ["ADMIN", "CEO"].includes(currentUser?.role || "");
  };

  const canUpdateRole = () => {
    return currentUser?.role === "CEO";
  };

  const canDeleteUser = () => {
    return currentUser?.role === "CEO";
  };

  const getAvailableRoles = () => {
    const roles = [
      { value: "USER", label: "สมาชิก" },
      { value: "ADMIN", label: "ผู้ดูแลระบบ" },
    ];

    if (currentUser?.role === "CEO") {
      roles.push({ value: "CEO", label: "ผู้บริหาร" });
    }

    return roles;
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
          <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
          <p className="text-gray-600 mt-2">จัดการผู้ใช้และบทบาทในระบบ</p>
        </div>
        {canCreateUser() && (
          <Button onClick={handleCreateUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            เพิ่มผู้ใช้ใหม่
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            options={roleOptions}
            placeholder="กรองตามบทบาท"
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {canManageUser(user) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canUpdateRole() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    {canDeleteUser() && user._id !== currentUser?._id && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user._id, user.name)}
                        loading={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="เพิ่มผู้ใช้ใหม่"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="ชื่อ-นามสกุล"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <Input
            label="อีเมล"
            type="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />

          <Select
            label="บทบาท"
            value={createForm.role}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, role: value as any }))
            }
            options={getAvailableRoles()}
          />

          {createMutation.error && (
            <div className="text-red-600 text-sm">
              เกิดข้อผิดพลาดในการสร้างผู้ใช้
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              สร้างผู้ใช้
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="แก้ไขข้อมูลผู้ใช้"
      >
        {selectedUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="ชื่อ-นามสกุล"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <Input
              label="อีเมล"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />

            <Select
              label="บทบาท"
              value={editForm.role}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, role: value as any }))
              }
              options={getAvailableRoles()}
            />

            {updateMutation.error && (
              <div className="text-red-600 text-sm">
                เกิดข้อผิดพลาดในการแก้ไขข้อมูล
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="เปลี่ยนบทบาทผู้ใช้"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">ผู้ใช้:</p>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            <Select
              label="บทบาทใหม่"
              value={newRole}
              onChange={setNewRole}
              options={getAvailableRoles()}
            />

            {updateRoleMutation.error && (
              <div className="text-red-600 text-sm">
                เกิดข้อผิดพลาดในการเปลี่ยนบทบาท
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsRoleModalOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleUpdateRole}
                loading={updateRoleMutation.isPending}
                disabled={!newRole || newRole === selectedUser.role}
              >
                บันทึก
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
