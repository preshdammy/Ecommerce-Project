"use client";

import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

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

const statusStages = ["Pending", "Processing", "Shipped", "Delivered"];

const TrackOrder = () => {
  const params = useParams();
  const orderId = params?.orderId as string;

  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_ORDER_STATUS, {
    variables: { id: orderId },
    pollInterval: 5000,
    skip: !orderId,
  });

  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  if (loading) return <p className="text-center py-4 text-gray-500">Loading...</p>;
  if (error || !data?.order) return <p className="text-red-500 text-center py-4">Failed to fetch order data.</p>;

  const order = data.order;
  const currentIndex = statusStages.findIndex(
    (s) => s.toLowerCase() === order.status.toLowerCase()
  );
  

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
        Tracking Order: <span className="text-gray-600">{order.id}</span>
      </h2>

      {/* Vertical Progress Bar */}
      <div className="relative flex flex-col items-start space-y-6 pl-6">
  {/* Background line */}
  <div className="absolute left-0 top-0 w-0.5 h-full bg-gray-300 z-0" />

  {/* Progress line */}
  <div
    className="absolute left-0 top-0 w-0.5 bg-blue-500 z-10 transition-all duration-500"
    style={{
      height: `${(currentIndex / (statusStages.length - 1)) * 100}%`,
    }}
  />

  {/* Steps */}
  {statusStages.map((stage, i) => {
    const isActive = i <= currentIndex;
    return (
      <div key={stage} className="relative flex items-start space-x-4 z-20">
        {/* Dot */}
        <div
          className={`w-5 h-5 absolute -left-[33px] mt-0.2 rounded-full border-2 ${
            isActive ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"
          }`}
        />
        {/* Label */}
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
      <div className="pt-4 border-t text-sm sm:text-base space-y-2 text-gray-700">
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
  );
};

export default TrackOrder