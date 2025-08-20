
"use client";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($limit: Int!, $offset: Int!) {
    allProducts(limit: $limit, offset: $offset) {
      id
      name
      price
      stock
      averageRating
      category
      createdAt
    }
  }
`;


export default function ProductList() {
  
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
  variables: {
    limit: 20,  
    offset: 0   
  }
});

   if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center font-medium">
        Failed to load products: {error.message}
      </p>
    );
  }

  const products = data?.allProducts || [];

  const filtered = products.filter((p: any) =>
    (p.name?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (p.category?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

return (
    <div className="w-full mx-auto p-4 mt-4 md:mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">All Products</h2>

      <input
        placeholder="Search products by name or category..."
        className="mb-4 md:mb-6 w-full px-3 py-2 md:px-4 md:py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="flex flex-col gap-5 md:gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filtered.map((product: any) => (
            <Link href={`/admin/admindashboard/products/${product.id}`} key={product.id}>
              <div className="p-3 md:p-4 bg-white rounded shadow hover:bg-gray-50 transition cursor-pointer">
                <div className="font-semibold text-sm md:text-base">{product.name}</div>
                <div className="text-xs md:text-sm text-gray-600">
                  ₦{Number(product.price).toLocaleString()}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {product.averageRating.toFixed(0) || 0} ★
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}