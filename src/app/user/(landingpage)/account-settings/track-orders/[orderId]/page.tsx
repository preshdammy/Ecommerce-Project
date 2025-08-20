"use client";

import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const GET_ORDER_STATUS = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      status
      paymentStatus
      estimatedDeliveryDate
      shippingAddress {
        city
        street
      }
      orderedAt
      processedAt
      shippedAt
      deliveredAt
      items {
        product {
          name
        }
        quantity
      }
    }
  }
`;

const GET_MY_ORDERS = gql`
  query GetMyOrders {
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

const statusStages = ["Pending", "Processing", "Shipped", "Delivered"];

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

type OrderItem = {
  product: {
    name: string;
  };
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  orderedAt?: string;
  processedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
};

export default function TrackOrder() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orderData, loading, error, startPolling, stopPolling } = useQuery(GET_ORDER_STATUS, {
    variables: { id: orderId },
    pollInterval: 5000,
    skip: !orderId,
  });

  const { data: ordersData } = useQuery(GET_MY_ORDERS);

  useEffect(() => {
    if (orderId) {
      startPolling(5000);
      return () => stopPolling();
    }
  }, [orderId, startPolling, stopPolling]);

  if (loading) return <p className="text-center py-4 text-gray-500">Loading...</p>;
  if (error || !orderData?.order) return <p className="text-red-500 text-center py-4">Failed to fetch order data.</p>;

  const order = orderData.order;
  const currentIndex = statusStages.findIndex(
    (s) => s.toLowerCase() === order.status.toLowerCase()
  );

  return (
   <>
      <div className="min-h-screen bg-gray-50">
      {/* Mobile Back Button (Top) */}
      <div className="md:hidden p-4">
        <Link 
          href="/user/account-settings" 
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      {/* Main Tracking Content */}
      <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Tracking Order: <span className="text-gray-600">{order.id}</span>
        </h2>

        {/* Progress Bar */}
        <div className="relative flex flex-col items-start space-y-6 pl-6">
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gray-300 z-0" />
          <div
            className="absolute left-0 top-0 w-0.5 bg-blue-500 z-10 transition-all duration-500"
            style={{
              height: `${(currentIndex / (statusStages.length - 1)) * 100}%`,
            }}
          />

          {statusStages.map((stage, i) => {
            const isActive = i <= currentIndex;
            return (
              <div key={stage} className="relative flex items-start space-x-4 z-20">
                <div
                  className={`w-5 h-5 absolute -left-[33px] mt-0.5 rounded-full border-2 ${
                    isActive ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"
                  }`}
                />
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isActive ? "text-blue-700" : "text-gray-400"}`}>
                    {stage}
                  </span>
                  {isActive && (
                    <span className="text-xs text-gray-500">
                      {stage === "Pending" && order.orderedAt && new Date(order.orderedAt).toLocaleString()}
                      {stage === "Processing" && order.processedAt && new Date(order.processedAt).toLocaleString()}
                      {stage === "Shipped" && order.shippedAt && new Date(order.shippedAt).toLocaleString()}
                      {stage === "Delivered" && order.deliveredAt && new Date(order.deliveredAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="pt-4 border-t space-y-3 text-gray-700">
          <p>
            <strong>Shipping to:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate || "Not yet available"}
          </p>
        </div>
      </div>

      {/* Order History Table */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Your Recent Orders</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordersData?.myOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[120px]">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ₦{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/user/account-settings/track-orders/${order.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><span className="font-medium">Total:</span> ₦{selectedOrder.totalAmount.toLocaleString()}</p>
                <div className="pt-2">
                  <h4 className="font-medium">Items:</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>{item.product.name} (Qty: {item.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
}