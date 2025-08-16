"use client";

import { LuSearch } from "react-icons/lu";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const GET_DASHBOARD_DATA = gql`
  query GetDashboardAndProducts($limit: Int!, $offset: Int!) {
    adminProfile {
      name
      email
    }
    getDashboardMetrics {
      totalUsers
      totalVendors
      totalOrders
      totalSales
      totalAdminCommission
      yesterdayAdminCommission
    }
    allProducts(limit: $limit, offset: $offset) {
      id
      name
      price
    }
    allOrders {
      id
      status
      totalAmount
    }
  }
`;

const GET_RECENT_COMMISSIONS = gql`
  query {
    recentAdminCommissions {
      buyerName
      productName
      amount
      createdAt
    }
  }
`;

const GET_WEEKLY_COMMISSIONS = gql`
  query {
    weeklyAdminCommissions {
      date
      total
    }
  }
`;

type WeeklyData = {
  weeklyAdminCommissions: {
    date: string;
    total: number;
  }[];
};


type RecentCommission = {
  buyerName: string;
  productName: string;
  amount: number;
  createdAt: string;
};

type RecentCommissionData = {
  recentAdminCommissions: RecentCommission[];
};

type Product = {
  id: string;
  name: string;
  price: number;
};

const AdminDashboard = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [notifData, setNotifData] = useState<RecentCommission | null>(null);
  const [lastSeen, setLastSeen] = useState<string>("");

  const { data: recentData } = useQuery<RecentCommissionData>(GET_RECENT_COMMISSIONS, {
    pollInterval: 4000,
  });

  useEffect(() => {
    if (recentData?.recentAdminCommissions?.length) {
      const latest = recentData.recentAdminCommissions[0];
      if (latest.createdAt !== lastSeen) {
        setNotifData(latest);
        setShowNotif(true);
        setLastSeen(latest.createdAt);
        setTimeout(() => setShowNotif(false), 10000);
      }
    }
  }, [recentData]);

  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
    variables: { limit: 20, offset: 0 },
    fetchPolicy: "network-only",
    ssr: false,
  });

  const { data: weeklyData } = useQuery<WeeklyData>(GET_WEEKLY_COMMISSIONS);
  const weeklyCommissions = weeklyData?.weeklyAdminCommissions ?? [];



  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const admin = data?.adminProfile;
  const metrics = data?.getDashboardMetrics || {};
  const products = data?.allProducts || [];
  const orders = data?.allOrders || [];

  const percentChange = metrics.yesterdayAdminCommission
    ? ((metrics.totalAdminCommission - (metrics.totalAdminCommission - metrics.yesterdayAdminCommission)) / metrics.totalAdminCommission) * 100
    : 0;

  const isPositive = percentChange >= 0;

  return (
    <div className="w-full font-sans bg-gray-50 min-h-screen pb-10">
      <h1 className="font-semibold text-3xl w-[95%] mx-auto mt-8 text-gray-800">
        Welcome, {admin?.name}
      </h1>

      <div className="w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
        <MetricCard label="Active Users" value={metrics.totalUsers} />
        <MetricCard label="Total Products" value={products.length} />
        <MetricCard label="Total Vendors" value={metrics.totalVendors} />
        <MetricCard label="Total Orders" value={orders.length} />
        <MetricCard label="Sales ₦" value={metrics.totalSales} isCurrency />
      </div>

      <div className="w-[95%] mx-auto mt-10 p-6 rounded-lg bg-white border border-gray-200 shadow-md">
        <p className="text-lg text-gray-500 font-medium">Total Products Commission</p>
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-blue-600 font-bold text-5xl">
            ₦{metrics.totalAdminCommission?.toLocaleString()}
          </h2>
          <div className={`flex items-center gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span className="text-lg font-semibold">
              {Math.abs(percentChange).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">from yesterday</span>
          </div>
        </div>
      </div>

      {showNotif && notifData && (
        <div className="fixed bottom-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 max-w-sm w-full">
          <p className="font-medium">
            💰 {notifData.buyerName} bought <strong>{notifData.productName}</strong>. You earned ₦{notifData.amount}
          </p>
        </div>
      )}

      {weeklyCommissions.length > 0 && (
        <div className="w-[95%] mx-auto mt-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Weekly Admin Commission
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyCommissions}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#007BFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

const MetricCard = ({
  label,
  value,
  isCurrency = false,
}: {
  label: string;
  value: number;
  isCurrency?: boolean;
}) => (
  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
    <p className="text-gray-500 font-medium">{label}</p>
    <h2 className="text-blue-600 font-bold text-3xl mt-2">
      {isCurrency ? `₦${value?.toLocaleString()}` : value}
    </h2>
  </div>
);

export default AdminDashboard;
