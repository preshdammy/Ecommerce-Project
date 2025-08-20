"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export const GET_USER_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      totalAmount
      status
      estimatedDeliveryDate
      createdAt
      updatedAt
      items {
        quantity
        lineTotal
        product {
          id
          name
          images
          price
          averageRating
          totalReviews
        }
      }
    }
  }
`;

function normalizeOrder(o: GqlOrder): DeliveryCardProps["order"] {
  const items = Array.isArray(o.items) ? o.items : [];
  const totalQty = items.reduce((sum, it) => sum + (it?.quantity ?? 0), 0);
  const first = items[0];
  const p = first?.product;

  const fallbackName =
    items.length > 1 ? `${items.length} items` : p?.name ?? "Product unavailable";

  const fallbackImages = p?.images && Array.isArray(p.images) ? p.images : [];
  const fallbackPrice = p?.price ?? 0;

  return {
    id: o.id,
    product: {
      name: fallbackName,
      images: fallbackImages,
      price: fallbackPrice,
      averageRating: p?.averageRating ?? 0,
      totalReviews: p?.totalReviews ?? 0,
    },
    quantity: totalQty,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

type GqlOrderItem = {
  quantity: number;
  lineTotal: number;
  product: {
    id: string;
    name: string;
    images?: string[] | null;
    price: number;
    averageRating?: number | null;
    totalReviews?: number | null;
  } | null;
};

type GqlOrder = {
  id: string;
  totalAmount: number;
  status: string;
  estimatedDeliveryDate?: string | number | null;
  createdAt: string;
  updatedAt: string;
  items: GqlOrderItem[];
};

type DeliveryCardProps = {
  order: {
    id: string;
    product: {
      name: string;
      images: string[] | string | null;
      price: number;
      averageRating?: number;
      totalReviews?: number;
    };
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    estimatedDeliveryDate?: string | undefined;
  };
};

const getStatusProgress = (status: string): number => {
  switch (status) {
    case "PENDING":
      return 25;
    case "PROCESSING":
      return 50;
    case "SHIPPED":
      return 75;
    case "DELIVERED":
    case "CANCELLED":
      return 100; 
    default:
      return 0;
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PROCESSING":
      return "Processing";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

function toSafeDate(v: unknown): Date | null {
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string") {
   
    if (/^\d+$/.test(v)) return new Date(Number(v));
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  return null;
}

const ProgressCircle = ({ progress, daysLeft, status }: { progress: number; daysLeft: string; status: string }) => {
const getProgressColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "#FF6B6B"; 
    case "PROCESSING":
      return "#4ECDC4"; 
    case "SHIPPED":
      return "#FFD700"; 
    case "DELIVERED":
      return "#00cc66"; 
    case "CANCELLED":
      return "#FF6B6B"; 
    default:
      return "#CCCCCC"; 
  }
  };

  const data = [
    { name: "Progress", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  return (
    <div className="relative w-[70px] h-[70px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={22}
            outerRadius={30}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? getProgressColor(status) : "#f3f3f3"}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-[10px] rounded-full bg-white flex flex-col items-center justify-center text-center">
        <span className="text-[12px] text-black font-semibold leading-tight">{progress}%</span>
        <span className="text-[10px] text-gray-500">{daysLeft}</span>
      </div>
    </div>
  );
};

const DeliveryCard = ({ order }: DeliveryCardProps) => {
  if (!order?.product) return null;
  const { product, quantity, totalAmount, status, createdAt, estimatedDeliveryDate } = order;
  const progress = getStatusProgress(status);
  const daysLeft =getStatusText(status);

  const averageRating = product.averageRating || 0;
  const totalReviews = product.totalReviews || 0;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const imgSrc = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : typeof product.images === "string" && product.images
      ? product.images
      : "/fallback.jpg";

  return (
    <div className="bg-white rounded-2xl border border-[#CCE5FF]  h-auto w-[280px] flex-shrink-0 hover:border hover:border-blue-500 transition-all duration-500 ease-in-out">
      <div className="relative w-full h-[180px] rounded-t-2xl overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute top-2 right-2 bg-white text-[16px] text-[#007bff] font-bold px-2 py-1 rounded-full shadow">
          {quantity === 1 ? "1 piece" : `${quantity} pieces`}
        </div>
      </div>

      <p className="font-medium text-sm ml-3 mt-4 text-gray-700">
        {product.name.length > 40 ? product.name.slice(0, 40) + "..." : product.name}
      </p>

      <div className="flex justify-between items-center ml-3 mt-2">
        <div className="flex items-center text-[#FFB800] text-[16px] mt-[8px]">
          {Array(fullStars).fill(0).map((_, i) => <AiFillStar key={`full-${i}`} />)}
          {hasHalfStar && <AiFillStar key="half-star" className="opacity-50" />}
          {Array(emptyStars).fill(0).map((_, i) => <AiOutlineStar key={`empty-${i}`} />)}
          <span className="text-sm text-gray-600 ml-1">
            {`(${Math.floor(product.averageRating ?? 0)})`}
          </span>
        </div>
        <span className="text-sm text-[#858383]">₦ {product.price.toLocaleString()}</span>
        
        <ProgressCircle progress={progress} daysLeft={daysLeft} status={status} />
      </div>

      <p className="font-semibold text-[18px] text-[#0063c6] ml-4">
        ₦ {totalAmount.toLocaleString()}
      </p>
    </div>
  );
};

export default function PurchasesWrapper() {
  const { data, loading, error, refetch } = useQuery(GET_USER_ORDERS, {
    pollInterval: 30000,
  });

  useEffect(() => {
    refetch(); 
  }, [refetch]);

  const [orders, setOrders] = useState<DeliveryCardProps["order"][]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  useEffect(() => {
    if (!data?.myOrders) return;
    console.log("My Orders Data:", JSON.stringify(data.myOrders, null, 2));
    const normalized = data.myOrders.map(normalizeOrder);
    setOrders(normalized);
  }, [data]);

  const pendingRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const scrollWidth = 300;
      if (pendingRef.current) {
        const el = pendingRef.current;
        el.scrollLeft = el.scrollLeft + el.clientWidth >= el.scrollWidth ? 0 : el.scrollLeft + scrollWidth;
      }
      if (completedRef.current) {
        const el = completedRef.current;
        el.scrollLeft = el.scrollLeft + el.clientWidth >= el.scrollWidth ? 0 : el.scrollLeft + scrollWidth;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

   if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading purchases...</p>
      </div>
    );
  }
  if (error) {
    return (
      <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center font-medium">
        Error loading purchases: {error.message}
      </p>
    );
  }
 
  const totalIncome = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCount = orders.length;

  const pendingOrders = orders.filter((order) =>
    ["PENDING", "PROCESSING", "SHIPPED"].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    ["DELIVERED", "CANCELLED"].includes(order.status)
  );

  const deliveryHistoryOrders = completedOrders;
 

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 md:px-12 py-6 md:py-10">
      <section className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-[#55A7FF] text-[24px] md:text-[40px] font-light">My Purchases</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
          <div className="bg-white w-full md:w-1/2 p-6 rounded-xl border border-[#CCE5FF]">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Income</span>
            <h2 className="text-[#007BFF] text-3xl md:text-[30px] font-semibold mt-2">
              ₦ {totalIncome.toLocaleString()}
            </h2>
          </div>
          <div className="bg-white w-full md:w-1/2 p-6 rounded-xl border border-[#CCE5FF]">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Orders</span>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-[#007BFF] text-3xl md:text-[30px] font-semibold">{totalCount}</h2>
              <span className="text-sm text-[#939090]">Items</span>
            </div>
          </div>
        </div>
      </section>

     <div className="w-full mt-10">
      <h2 className="text-[24px] font-semibold mb-4 mt-4 text-[#939090]">Pending deliveries</h2>
      <div className="w-full mb-8 relative">
        {pendingOrders.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1.2}
              navigation={{
                nextEl: '.pending-next',
                prevEl: '.pending-prev',
              }}
              breakpoints={{
                640: { slidesPerView: 2.2, }, 
                768: { slidesPerView: 2.5,  },
                1024: { slidesPerView: 3.2,  },
                1280: { slidesPerView: 4.2,  }
              }}
              className="px-1 py-2 h-auto" 
            >
              {pendingOrders.map((order) => (
                <SwiperSlide key={order.id}>
                  <DeliveryCard order={order} />
                </SwiperSlide>
              ))}
            </Swiper>

            
            {/* Custom navigation buttons */}
            <button className="pending-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer block items-center justify-center w-8 h-8 hover:bg-blue-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="pending-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer block items-center justify-center w-8 h-8 hover:bg-blue-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#CCE5FF] h-[40vh] w-[280px] flex items-center justify-center text-gray-400 font-medium">
            No pending deliveries yet.
          </div>
        )}
      </div>

      <h2 className="text-[24px] font-semibold mb-4 text-[#939090]">Completed deliveries</h2>
      <div className="w-full mb-8 relative"> 
        {completedOrders.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation,]}
              spaceBetween={20}
              slidesPerView={1.2}
              navigation={{
                nextEl: '.completed-next',
                prevEl: '.completed-prev',
              }}
              breakpoints={{
                640: { slidesPerView: 2.2, }, 
                768: { slidesPerView: 2.5,  },
                1024: { slidesPerView: 3.2,  },
                1280: { slidesPerView: 4.2,  },
              }}
              className="px-1 py-2 h-auto"
            >
              {completedOrders.map((order) => (
                <SwiperSlide key={order.id}>
                  <DeliveryCard order={order} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom navigation buttons */}
            <button className="completed-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer flex items-center justify-center w-8 h-8 hover:bg-blue-50 transition sm:hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="completed-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer flex items-center justify-center w-8 h-8 hover:bg-blue-50 transition sm:hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#CCE5FF] h-[40vh] w-[280px] flex items-center justify-center text-gray-400 font-medium">
            No completed deliveries yet.
          </div>
        )}
      </div>

        <h2 className="text-[24px] font-semibold mb-4 text-[#939090]">Delivery History</h2>
        {deliveryHistoryOrders.length > 0 ? (
          <>
          {(showAllHistory ? deliveryHistoryOrders : deliveryHistoryOrders.slice(0, 3)).map((order) => (
            
            <div key={order.id} className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="flex flex-wrap gap-2">
                {[order.product.name].map((item, i) => (
                  <span key={i} className="bg-[#eaf3ff] text-sm text-[#007bff] px-3 py-1 rounded-full">
                    {item.length > 35 ? item.slice(0, 35) + "..." : item}
                  </span>
                ))}
              </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            {(() => {
              const created = toSafeDate(order.createdAt);
              return (
                <span>
                  {created
                    ? created.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "Unknown Date"}
                </span>
              );
            })()}

                <div className="flex gap-2">
                  <button className="rounded-full w-6 h-6 bg-gray-100 text-gray-500">❮</button>
                  <button className="rounded-full w-6 h-6 bg-gray-100 text-gray-500">❯</button>
                </div>
              </div>
            </div>


         ))}
    
    {/* Show "View More" or "Show Less" button */}
    {deliveryHistoryOrders.length > 3 && (
      <div className="text-center mt-4">
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => setShowAllHistory(!showAllHistory)}
        >
          {showAllHistory 
            ? "Show Less" 
            : `View More (${deliveryHistoryOrders.length - 3} more)`}
        </button>
      </div>
    )}
  </>
        ) : (
          <div className="rounded-lg border border-[#CCE5FF] h-[100px] flex items-center justify-center text-gray-400 font-medium">
            No delivery history yet.
          </div>
        )}
      </div>
    </div>
  );
}