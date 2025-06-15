"use client"
import { useState } from 'react';

const Purchases = () => {
  const [filter, setFilter] = useState('All');

  const purchaseData = [
    { id: 'ORD123', date: 'June 11, 2025', item: 'Blue Classic Tie', amount: '₦ 12,000', status: 'Delivered' },
    { id: 'ORD124', date: 'June 08, 2025', item: 'Silk Pocket Square', amount: '₦ 4,500', status: 'In Transit' },
    { id: 'ORD125', date: 'June 04, 2025', item: 'Leather Belt', amount: '₦ 9,000', status: 'Cancelled' },
  ];

  const filteredPurchases = filter === 'All'
    ? purchaseData
    : purchaseData.filter((purchase) => purchase.status === filter);

  return ( 
    <div className="min-h-screen bg-white px-4 md:px-12 py-6 md:py-10">
      {/* Header & Summary */}
      <section className="w-3/4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-[#55A7FF] text-[28px] md:text-[40px] font-medium">Soothe & Tie Deliveries</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
          <div className="bg-[#F5F9FF] w-full md:w-1/2 p-6 rounded-xl shadow-sm">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Income</span>
            <h2 className="text-[#007BFF] text-3xl md:text-[40px] font-semibold mt-2">₦ 369,420</h2>
          </div>
          <div className="bg-[#F5F9FF] w-full md:w-1/2 p-6 rounded-xl shadow-sm">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Orders</span>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-[#007BFF] text-3xl md:text-[40px] font-semibold">₦ 369,420</h2>
              <span className="text-[#939090] text-sm font-medium">Items</span>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase History */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h3 className="text-[#55A7FF] text-xl font-semibold">Purchase History</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 outline-[#CCE5FF] rounded-md p-2 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="In Transit">In Transit</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-[#E8F3FF] text-left">
              <tr>
                <th className="p-4 text-sm text-gray-700 font-medium">Order ID</th>
                <th className="p-4 text-sm text-gray-700 font-medium">Date</th>
                <th className="p-4 text-sm text-gray-700 font-medium">Item</th>
                <th className="p-4 text-sm text-gray-700 font-medium">Amount</th>
                <th className="p-4 text-sm text-gray-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-4">{purchase.id}</td>
                  <td className="p-4">{purchase.date}</td>
                  <td className="p-4">{purchase.item}</td>
                  <td className="p-4 text-[#007BFF] font-medium">{purchase.amount}</td>
                  <td
                    className={`p-4 font-medium ${
                      purchase.status === 'Delivered'
                        ? 'text-green-600'
                        : purchase.status === 'In Transit'
                        ? 'text-yellow-600'
                        : 'text-red-500'
                    }`}
                  >
                    {purchase.status}
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                    No purchases match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Purchases;
