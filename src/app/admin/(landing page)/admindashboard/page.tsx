"use client";

import { LuSearch } from "react-icons/lu";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronUp,BarChart3 } from "lucide-react";
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

  const [showChart, setShowChart] = useState(false); // mobile toggle for chart

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

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

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
    <div className="w-full font-sans min-h-screen pb-6 md:pb-10">
      <h1 className="font-semibold text-2xl md:text-3xl w-full mx-auto px-4 md:px-0 md:w-[95%] mt-4 md:mt-8 text-gray-800">
        Welcome, {admin?.name}
      </h1>

      <div className="w-full mx-auto px-2 md:px-0 md:w-[95%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 md:gap-6 mt-6 md:mt-10">
        <MetricCard label="Active Users" value={metrics.totalUsers} />
        <MetricCard label="Total Products" value={products.length} />
        <MetricCard label="Total Vendors" value={metrics.totalVendors} />
        <MetricCard label="Total Orders" value={orders.length} />
        <MetricCard label="Sales ₦" value={metrics.totalSales} isCurrency />
      </div>

      <div className="w-[95%] mx-auto mt-6 md:mt-10 p-5 lg:p-10 md:p-6 rounded-lg bg-[white] border border-gray-200 shadow-md">
        <p className="text-base md:text-lg text-gray-500 font-medium">Total Products Commission</p>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-3 md:mt-4 gap-3">
          <h2 className="text-blue-600 font-bold text-3xl md:text-5xl">
            ₦{metrics.totalAdminCommission?.toLocaleString()}
          </h2>
          <div className={`flex items-center gap-1 md:gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" />}
            <span className="text-base md:text-lg font-semibold">
              {Math.abs(percentChange).toFixed(1)}%
            </span>
            <span className="text-xs md:text-sm text-gray-500">from yesterday</span>
          </div>
        </div>
      </div>

      {showNotif && notifData && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto bg-green-100 border-l-4 border-green-500 text-green-700 p-3 md:p-4 rounded shadow-lg z-50 max-w-full md:max-w-sm">
          <p className="font-medium text-sm md:text-base">
            💰 {notifData.buyerName} bought <strong>{notifData.productName}</strong>. You earned ₦{notifData.amount}
          </p>
        </div>
      )}

      {/* Mobile toggle button for chart */}
          {weeklyCommissions.length > 0 && (
        <div className="w-[95%] mx-auto mt-10 bg-white p-3 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-0 lg:mb-4">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-700">
              Weekly Admin Commission
            </h3>
            <button 
              onClick={() => setShowChart(!showChart)}
              className="lg:hidden flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-md"
            >
              <BarChart3 className="w-4 h-4" />
              {showChart ? 'Hide Chart' : 'View Chart'}
            </button>
          </div>
          
          <div className={`${showChart ? 'block' : 'hidden'} lg:block`}>
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
}) => {
  const [showValue, setShowValue] = useState(false);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
      <p className="text-gray-500 font-medium flex items-center justify-between">
        {label}
        {/* Mobile toggle */}
        <button
          className="md:hidden ml-2 text-gray-600"
          onClick={() => setShowValue(!showValue)}
        >
          {showValue ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </p>
      <h2
        className={`text-blue-600 font-bold text-3xl mt-2 ${
          !showValue && "hidden md:block" 
        }`}
      >
        {isCurrency ? `₦${value?.toLocaleString()}` : value}
      </h2>
    </div>
  );
};

export default AdminDashboard;
