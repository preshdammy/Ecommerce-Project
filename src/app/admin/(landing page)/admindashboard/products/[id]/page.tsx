
"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,  CartesianGrid, Legend} from "recharts";
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

  if (loading) return <p className="mt-10 text-center">Loading product...</p>;
  if (error || !data?.product) return <p className="mt-10 text-center text-red-500">Product not found.</p>;

  const p = data.product;

   const salesData = p.orderStats?.salesPerMonth?.map((item: SalesDataItem) => ({
    ...item,
    month: item.month, 
  })) || [];

  return (
    <div className="w-[90%] mx-auto mt-10 h-screen overflow-y-scroll">
      <Link 
        href="/admin/admindashboard/products"
        className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Link>
      
      <h2 className="text-2xl font-bold mb-4">{p.name}</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8">
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
          
          <div className="w-full md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{p.orderStats?.totalOrders || 0}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Quantity Sold</p>
                <p className="text-2xl font-bold">{p.orderStats?.totalQuantity || 0}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="font-medium text-gray-600 mb-2">Description:</p>
              <p className="text-gray-700">{p.description || 'No description available'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="h-64 bg-white p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
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



      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Seller Information</h3> 
        <div className="space-y-2">
          <p><span className="font-medium text-gray-600">Seller Name:</span> {p.seller?.storeName || 'N/A'}</p>
          <p><span className="font-medium text-gray-600">Seller ID:</span> {p.seller?.id || 'N/A'}</p>
          <p><span className="font-medium text-gray-600">Joined:</span> {new Date(p.createdAt).toLocaleDateString()}</p>
          <p><span className="font-medium text-gray-600">Last Updated:</span> {new Date(p.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Product Reviews</h3>
          
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
    
  );
}