import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { dashboardApi } from "../../api/dashboard";
import { Card } from "../../components/ui/Card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/Tabs";
import { formatPrice } from "../../lib/utils";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export const CEODashboard: React.FC = () => {
  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.getSummary,
  });

  const { data: salesReport } = useQuery({
    queryKey: ["sales-report"],
    queryFn: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      return dashboardApi.getSalesReport(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => dashboardApi.getTopProducts(10),
  });

  const { data: salesByCategory } = useQuery({
    queryKey: ["sales-by-category"],
    queryFn: dashboardApi.getSalesByCategory,
  });

  const { data: userGrowth } = useQuery({
    queryKey: ["user-growth"],
    queryFn: dashboardApi.getUserGrowth,
  });

  const stats = [
    {
      name: "ยอดขายวันนี้",
      value: formatPrice(summary?.sales.today.totalSales || 0),
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "คำสั่งซื้อวันนี้",
      value: summary?.sales.today.orderCount || 0,
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      name: "ผู้ใช้ทั้งหมด",
      value: summary?.totals.users || 0,
      change: "+3.1%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "สินค้าทั้งหมด",
      value: summary?.totals.products || 0,
      change: "+1.4%",
      changeType: "increase",
      icon: Package,
      color: "bg-orange-500",
    },
  ];

  // Transform sales report data for chart
  const salesChartData =
    salesReport?.dailySales?.map((item: any) => ({
      date: `${item._id.day}/${item._id.month}`,
      sales: item.totalSales,
      orders: item.orderCount,
    })) || [];

  // Transform user growth data for chart
  const userGrowthData =
    userGrowth?.map((item: any) => ({
      month: `${item._id.month}/${item._id.year}`,
      users: item.newUsers,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด CEO</h1>
          <p className="text-gray-600 mt-2">ภาพรวมธุรกิจและสถิติสำคัญ</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`} />
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="sales">ยอดขาย</TabsTrigger>
            <TabsTrigger value="products">สินค้า</TabsTrigger>
            <TabsTrigger value="categories">หมวดหมู่</TabsTrigger>
            <TabsTrigger value="users">ผู้ใช้</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  ยอดขายรายวัน (30 วันล่าสุด)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="ยอดขาย"
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  จำนวนคำสั่งซื้อรายวัน
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="orders" 
                        fill="#10B981" 
                        name="คำสั่งซื้อ"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <h3 className="text-lg font-semibold mb-4">สินค้าขายดี Top 10</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="productName" type="category" width={150} />
                    <Tooltip formatter={(value) => [value, "จำนวนขาย"]} />
                    <Bar 
                      dataKey="totalQuantity" 
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <h3 className="text-lg font-semibold mb-4">ยอดขายตามหมวดหมู่</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, percent }) =>
                        `${categoryName} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                    >
                      {salesByCategory?.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                การเติบโตของผู้ใช้ (6 เดือนล่าสุด)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      name="ผู้ใช้ใหม่"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-4">สรุปยอดขายเดือนนี้</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">ยอดขาย:</span>
                <span className="font-bold text-xl">
                  {formatPrice(summary?.sales.month.totalSales || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">คำสั่งซื้อ:</span>
                <span className="font-medium">
                  {summary?.sales.month.orderCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">ยอดขายเฉลี่ย:</span>
                <span className="font-medium">
                  {formatPrice(
                    (summary?.sales.month.totalSales || 0) /
                      (summary?.sales.month.orderCount || 1)
                  )}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-4">สรุปยอดขายปีนี้</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-100">ยอดขาย:</span>
                <span className="font-bold text-xl">
                  {formatPrice(summary?.sales.year.totalSales || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">คำสั่งซื้อ:</span>
                <span className="font-medium">
                  {summary?.sales.year.orderCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">เป้าหมาย:</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold mb-4">ข้อมูลรวม</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-100">รายได้รวม:</span>
                <span className="font-bold text-xl">
                  {formatPrice(summary?.totals.revenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">คำสั่งซื้อรวม:</span>
                <span className="font-medium">{summary?.totals.orders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">ผู้ใช้ทั้งหมด:</span>
                <span className="font-medium">{summary?.totals.users || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};