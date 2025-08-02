"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;

  

  return (
    <div className="w-[95%] mx-auto bg-gray-100 min-h-screen py-6 rounded">
      <h2 className="text-[24px] font-semibold mb-6">All Orders</h2>
      <input
        type="text"
        placeholder="Search by buyer name, email, or status..."
        className="w-full md:w-1/3 p-2 mb-5 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />

      <div className="grid gap-5 h-screen overflow-hidden overflow-y-scroll">
        {filteredOrders.map((order: any) => {
          const isRefunded = order.status === "REFUNDED";
          const statusColor = statusColorMap[order.status] || "bg-gray-100 text-gray-600";

          return (
            <div
              key={order.id}
              className={`relative p-6 rounded-xl bg-white shadow-md transition-all duration-300 ${
                isRefunded ? "opacity-50 pointer-events-none select-none" : ""
              }`}
            >

              <div className="mb-3 flex justify-between items-center">
                <div className="text-gray-800 font-semibold text-lg">Buyer: {order.buyer.name}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Total Amount:</strong> ₦{order.totalAmount}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Products:</strong>{" "}
                {order.items.map((item: any, i: number) => (
                  <span key={i}>
                    {item.product.name} ({item.quantity}){i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                {(() => {
                  const current = order.status;
                  const statusFlow = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
                  const currentIndex = statusFlow.indexOf(current);

                  if (current === "DELIVERED") return null;

                  if (current === "CANCELLED" && order.paymentStatus === "PAID") {
                    return (
                      <button
                        className="px-4 py-2 text-sm rounded font-medium bg-yellow-100 text-yellow-700 hover:opacity-90"
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
                      className={`px-4 py-2 text-sm rounded font-medium ${
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
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
