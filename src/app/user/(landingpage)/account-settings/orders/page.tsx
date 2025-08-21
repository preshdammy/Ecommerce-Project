"use client";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation"; 
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const GET_USER_ORDERS = gql`
  query GetUserOrders {
    myOrders {
      id
      status
      paymentStatus
      totalAmount
      items {
        quantity
      }
    }
  }
`;

type OrderItem = {
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
};

type OrdersData = {
  myOrders: Order[];
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders = () => {
  const { data, loading } = useQuery<OrdersData>(GET_USER_ORDERS, {
    pollInterval: 60000,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading orders...</p>
      </div>
      
    );
  }

  return (
    <>

    <div className="relative">
      
      <div className="h-[100vh] overflow-y-scroll p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-xs sm:text-sm md:text-base">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-300">Order ID</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-300">Status</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-300">Qty</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-300">Total</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.myOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200 truncate max-w-[100px] sm:max-w-none">
                    {order.id}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    ₦{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/user/account-settings/track-orders/${order.id}`)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm font-medium"
                      >
                        Track Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md p-4 sm:p-6 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>

              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </p>
              <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
              <p><span className="font-medium">Total:</span> ₦{selectedOrder.totalAmount.toLocaleString()}</p>
              <p className="font-medium mt-4">Items:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>Quantity: {item.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>

     <div className="md:hidden flex justify-center mt-6 pb-4">
        <Link 
          href="/user/account-settings" 
          className="flex gap-2 px-4 py-2 items-center bg-gray-100 text-gray-700 rounded-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </Link>
      </div>
    </>
  );
};

export default Orders;  