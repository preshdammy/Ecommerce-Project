"use client";

import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const GET_VENDOR_ORDERS = gql`
  query GetVendorOrders {
    vendorOrders {
      id
      status
      paymentStatus
      totalAmount
      items {
        quantity
        product {
          name
        }
      }
      buyer {
        name
        email
      }
    }
  }
`;

const VENDOR_UPDATE_ORDER_STATUS = gql`
  mutation VendorUpdateOrderStatus($orderId: ID!, $status: String!) {
    vendorUpdateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;


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

type OrderItem = {
  quantity: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  buyer: {
    name: string;
    email: string;
  };
};

type OrdersData = {
  vendorOrders: Order[];
};

const VendorOrders = () => {
    const router = useRouter()
  const { data, loading, refetch } = useQuery<OrdersData>(GET_VENDOR_ORDERS, {
    pollInterval: 60000,
  });
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  const [updateOrderStatus] = useMutation(VENDOR_UPDATE_ORDER_STATUS, {
    onCompleted: () => refetch(),
  });
  

  const handleMarkAsShipped = async (orderId: string) => {
    await updateOrderStatus({ variables: { orderId, status: "SHIPPED" } });
    setSelectedOrder(null);
  };
  
  const handleMarkAsDelivered = async (orderId: string) => {
    await updateOrderStatus({ variables: { orderId, status: "DELIVERED" } });
    setSelectedOrder(null);
  };
  

  const filteredOrders = filterStatus
    ? data?.vendorOrders.filter((order) => order.status === filterStatus)
    : data?.vendorOrders;

  if (loading) return <p className="text-center py-4 text-gray-500">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      {/* Filter dropdown */}
      <div className="mb-4">
        <label className="font-medium mr-2">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <table className="w-full table-auto border border-gray-300 text-sm md:text-base">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 border-b">Order ID</th>
            <th className="px-4 py-3 border-b">Status</th>
            <th className="px-4 py-3 border-b">Qty</th>
            <th className="px-4 py-3 border-b">Total</th>
            <th className="px-4 py-3 border-b">Buyer</th>
            <th className="px-4 py-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 border-b">{order.id}</td>
              <td className="px-4 py-3 border-b">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 border-b">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="px-4 py-3 border-b">
                ₦{order.totalAmount.toLocaleString()}
              </td>
              <td className="px-4 py-3 border-b">
                {order.buyer.name}
                <br />
                <span className="text-sm text-gray-500">{order.buyer.email}</span>
              </td>
              <td className="px-4 py-3 border-b space-y-1  ">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:underline text-sm font-medium block"
                >
                  View
                </button>
                <button
                  onClick={() => router.push(`/vendor/account-settings/track-orders/${order.id}`)}
                  className="text-gray-600 hover:underline text-sm font-medium block"
                >
                  Track Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
            <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
            <p><span className="font-medium">Payment:</span> {selectedOrder.paymentStatus}</p>
            <p><span className="font-medium">Total:</span> ₦{selectedOrder.totalAmount.toLocaleString()}</p>
            <p className="font-medium mt-4">Items:</p>
            <ul className="list-disc list-inside text-sm mt-1 mb-4">
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  {item.product.name} - Qty: {item.quantity}
                </li>
              ))}
            </ul>

            {/* Status Actions */}
            {["PENDING", "PROCESSING"].includes(selectedOrder.status) && (
              <button
                onClick={() => handleMarkAsShipped(selectedOrder.id)}
                className="bg-purple-600 text-white px-4 py-2 rounded w-full mb-2"
              >
                Mark as Shipped
              </button>
            )}
            {selectedOrder.status === "SHIPPED" && (
              <button
                onClick={() => handleMarkAsDelivered(selectedOrder.id)}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
