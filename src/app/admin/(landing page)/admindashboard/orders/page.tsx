"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ChevronDown } from "lucide-react";

const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      id
      status
      totalAmount
      shippingFee
      manualOverride
      paymentMethod
      paymentStatus
      estimatedDeliveryDate
      createdAt
      updatedAt
      shippedAt
      deliveredAt
      buyer {
        id
        name
        email
      }
      vendors {
        id
        businessName
      }
      shippingAddress {
        street
        city
        state
        postalCode
        country
      }
      items {
        quantity
        unitPrice
        lineTotal
        product {
          id
          name
          price
          images
        }
        vendor {
          id
          businessName
        }
      }
    }
  }
`;

const ADMIN_UPDATE_ORDER = gql`
  mutation AdminUpdateOrderStatus($orderId: ID!, $status: String!) {
    adminUpdateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;

const statusColorMap: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-300 text-gray-800",
};

const AdminOrders = () => {
  const { data, loading, refetch } = useQuery(GET_ALL_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateStatus, { loading: updating }] = useMutation(ADMIN_UPDATE_ORDER);
  const [searchTerm, setSearchTerm] = useState("");

  const orders = data?.allOrders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const buyerName = order?.buyer?.name?.toLowerCase() || "";
      const buyerEmail = order?.buyer?.email?.toLowerCase() || "";
      const status = order?.status?.toLowerCase() || "";
      return (
        buyerName.includes(searchTerm) ||
        buyerEmail.includes(searchTerm) ||
        status.includes(searchTerm)
      );
    });
  }, [orders, searchTerm]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    if (status === "CANCELLED") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Cancelling will refund the buyer's wallet.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it!",
      });
      if (!result.isConfirmed) return;
    }

    if (status === "REFUNDED") {
      const result = await Swal.fire({
        title: "Refund buyer?",
        text: "This will credit the buyer's wallet.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, refund",
      });
      if (!result.isConfirmed) return;
    }

    try {
      await updateStatus({ variables: { orderId, status } });
      toast.success(`Order ${status.toLowerCase()} successfully`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 bg-gray-100 min-h-screen rounded ">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">All Orders</h2>

      <input
        type="text"
        placeholder="Search by buyer name, email, or status..."
        className="w-full md:w-1/2 lg:w-1/3 p-2 mb-4 md:mb-5 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />

      <div className="grid gap-4 md:gap-5 h-screen overflow-hidden overflow-y-scroll">
        {filteredOrders.map((order: any) => {
          const isRefunded = order.status === "REFUNDED";
          const statusColor = statusColorMap[order.status] || "bg-gray-100 text-gray-600";
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className={`relative p-2 md:p-6 rounded-xl bg-white shadow-md transition-all duration-300 ${
                isRefunded ? "opacity-50 pointer-events-none select-none" : ""
              }`}
            >
              {/* Top Row: Buyer + Chevron */}
              <div className="flex items-center justify-between mb-2">
                {/* Left side: Buyer */}
                <div className="text-gray-800 font-semibold text-base md:text-lg">
                  Buyer: {order.buyer?.name}
                </div>

                {/* Right side: Chevron */}
                <button
                  className="text-gray-500 hover:text-gray-700 "
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Status below buyer name */}
              <div className="mb-3">
                <span
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${statusColor}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Desktop summary - always visible on desktop, hidden on mobile */}
              <div className="hidden md:block">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Total Amount:</strong> ₦{order.totalAmount.toLocaleString()}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <strong>Products:</strong>{" "}
                  {order.items.map((item: any, i: number) => (
                    <span key={i}>
                      {item.product.name} ({item.quantity})
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Always visible on desktop, only visible when expanded on mobile */}
              <div className="hidden md:flex flex-wrap gap-2 md:gap-3 mt-4">
                {(() => {
                  const current = order.status;
                  const statusFlow = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
                  const currentIndex = statusFlow.indexOf(current);

                  if (current === "DELIVERED") return null;

                  if (current === "CANCELLED" && order.paymentStatus === "PAID") {
                    return (
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded font-medium bg-yellow-100 text-yellow-700 hover:opacity-90"
                        disabled={updating}
                        onClick={() => handleStatusUpdate(order.id, "REFUNDED")}
                      >
                        Refund Buyer
                      </button>
                    );
                  }

                  return statusFlow.slice(currentIndex + 1).map((nextStatus) => (
                    <button
                      key={nextStatus}
                      className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded font-medium ${
                        nextStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      } hover:opacity-90`}
                      disabled={updating}
                      onClick={() => handleStatusUpdate(order.id, nextStatus)}
                    >
                      Mark as {nextStatus}
                    </button>
                  ));
                })()}
              </div>

              {/* Expanded details (toggle) - Mobile only */}
              {isExpanded && (
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p className="md:hidden">
                    <strong>Total Amount:</strong> ₦{order.totalAmount.toLocaleString()}
                  </p>
                  <p className="md:hidden">
                    <strong>Products:</strong>{" "}
                    {order.items.map((item: any, i: number) => (
                      <span key={i}>
                        {item.product.name} ({item.quantity})
                        {i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}
                  </p>
                  <p>
                    <strong>Shipping Fee:</strong> ₦{order.shippingFee.toLocaleString()}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong>{" "}
                    {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`}
                  </p>
                  <p className="text-xs text-gray-400">
                  Ordered:{" "}
                  {new Date(parseInt(order.createdAt)).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                  
                  {/* Action Buttons - Only show when expanded on mobile */}
                  <div className="mt-4 flex flex-wrap gap-2 md:gap-3 pt-3 border-t border-gray-200 md:hidden">
                    {(() => {
                      const current = order.status;
                      const statusFlow = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
                      const currentIndex = statusFlow.indexOf(current);

                      if (current === "DELIVERED") return null;

                      if (current === "CANCELLED" && order.paymentStatus === "PAID") {
                        return (
                          <button
                            className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded font-medium bg-yellow-100 text-yellow-700 hover:opacity-90"
                            disabled={updating}
                            onClick={() => handleStatusUpdate(order.id, "REFUNDED")}
                          >
                            Refund Buyer
                          </button>
                        );
                      }

                      return statusFlow.slice(currentIndex + 1).map((nextStatus) => (
                        <button
                          key={nextStatus}
                          className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded font-medium ${
                            nextStatus === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          } hover:opacity-90`}
                          disabled={updating}
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        >
                          Mark as {nextStatus}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;