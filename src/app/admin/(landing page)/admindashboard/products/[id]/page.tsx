"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      category
      description
      subCategory
      color
      condition
      minimumOrder
      stock
      price
      images
      createdAt
      updatedAt
      slug
      averageRating
      totalReviews
      seller {
        id
        storeName
      }
      orderStats {
        totalOrders
        totalQuantity
        salesPerMonth {
          month
          total
        }
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(id: $productId) {
      id
    }
  }
`;

type SalesDataItem = {
  month: string;
  total: number;
};

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const [showMonthlySales, setShowMonthlySales] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product deleted");
      window.location.href = "/admin/admindashboard/products";
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct({ variables: { productId: id } });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  if (error || !data?.product) return <p className="mt-10 text-center text-red-500">Product not found.</p>;

  const p = data.product;
  const salesData = p.orderStats?.salesPerMonth?.map((item: SalesDataItem) => ({
    ...item,
    month: item.month, 
  })) || [];

  return (
    <div className="w-full mx-auto p-4 mt-4 h-auto overflow-y-auto">
      <Link 
        href="/admin/admindashboard/products"
        className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Link>
      
      <h2 className="text-xl md:text-2xl font-bold mb-4">{p.name}</h2>
      
      {/* Product Image and Basic Info - Always Visible */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-4 md:mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {p.images?.length > 0 && (
              <div className="relative aspect-square">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3">
            {/* Stats always visible */}
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{p.orderStats?.totalOrders || 0}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Quantity Sold</p>
                <p className="text-2xl font-bold">{p.orderStats?.totalQuantity || 0}</p>
              </div>
            </div>
            
            {/* Desktop-only: Product details always visible */}
            <div className="hidden md:grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <p><span className="font-medium text-gray-600">Category:</span> {p.category}</p>
                <p><span className="font-medium text-gray-600">Subcategory:</span> {p.subCategory || 'N/A'}</p>
                <p><span className="font-medium text-gray-600">Price:</span> ₦{Number(p.price).toLocaleString()}</p>
                <p><span className="font-medium text-gray-600">Stock:</span> {p.stock}</p>
              </div>
              <div className="space-y-4">
                <p><span className="font-medium text-gray-600">Condition:</span> {p.condition}</p>
                <p><span className="font-medium text-gray-600">Color:</span> {p.color || 'N/A'}</p>
                <p><span className="font-medium text-gray-600">Min Order:</span> {p.minimumOrder}</p>
                <p><span className="font-medium text-gray-600">Rating:</span> {p.averageRating || 0} ★ ({p.totalReviews || 0} reviews)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only: View Product Details Button */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setShowProductDetails(!showProductDetails)}
            className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-base font-medium transition-colors"
          >
            {showProductDetails ? 'Hide Product Details' : 'View Product Details'}
            {showProductDetails ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
          </button>

          {/* Product Details - Only shown when expanded on mobile */}
          {showProductDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p><span className="font-bold text-gray-700 text-lg">Category:</span> {p.category}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Subcategory:</span> {p.subCategory || 'N/A'}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Price:</span> ₦{Number(p.price).toLocaleString()}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Stock:</span> {p.stock}</p>
                </div>
                <div className="space-y-3">
                  <p><span className="font-bold text-gray-700 text-lg">Condition:</span> {p.condition}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Color:</span> {p.color || 'N/A'}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Min Order:</span> {p.minimumOrder}</p>
                  <p><span className="font-bold text-gray-700 text-lg">Rating:</span> {p.averageRating || 0} ★ ({p.totalReviews || 0} reviews)</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="font-medium text-gray-600 mb-2">Description:</p>
                <p className="text-gray-700">{p.description || 'No description available'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description - Always visible on desktop */}
        <div className="hidden md:block pt-4 border-t border-gray-200">
          <p className="font-medium text-gray-600 mb-2">Description:</p>
          <p className="text-gray-700">{p.description || 'No description available'}</p>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <button
         className="bg-red-100 text-red-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-red-200 transition-colors"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </div>

      {/* Monthly Sales Chart - Hidden by default on mobile */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-4 md:mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-semibold">Monthly Sales</h3>
          <button
            onClick={() => setShowMonthlySales(!showMonthlySales)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showMonthlySales ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <div className={`${showMonthlySales ? 'block' : 'hidden md:block'} h-64 mt-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seller Information - Hidden by default on mobile */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Seller Information</h3>
          <button
            onClick={() => setShowSellerInfo(!showSellerInfo)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showSellerInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <div className={`${showSellerInfo ? 'block' : 'hidden md:block'} space-y-2 mt-4`}>
          <p><span className="font-bold text-gray-700 text-lg">Seller Name:</span> {p.seller?.storeName || 'N/A'}</p>
          <p><span className="font-bold text-gray-700 text-lg">Seller ID:</span> {p.seller?.id || 'N/A'}</p>
          <p><span className="font-bold text-gray-700 text-lg">Created:</span> {new Date(p.createdAt).toLocaleDateString()}</p>
          <p><span className="font-bold text-gray-700 text-lg">Last Updated:</span> {new Date(p.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Product Reviews - Hidden by default on mobile */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Product Reviews</h3>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showReviews ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <div className={`${showReviews ? 'block' : 'hidden md:block'} mt-4`}>
          {p.reviews?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {p.reviews.map((review: any) => (
                <li key={review.id} className="py-4">
                  <div className="flex items-center mb-2">
                    <div className="font-medium">{review.user.name}</div>
                    <div className="ml-2 text-yellow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}