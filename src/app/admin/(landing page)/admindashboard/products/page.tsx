
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

// When using the query


export default function ProductList() {
  
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
  variables: {
    limit: 20,  // Required value
    offset: 0   // Required value
  }
});

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (error) {
    console.error("GraphQL error:", error);
    return <div className="mt-10 text-center text-red-500">Failed to load products</div>;
  }

  const products = data?.allProducts || [];

  const filtered = products.filter((p: any) =>
    (p.name?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (p.category?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  return (
    <div className="w-[90%] mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <input
        placeholder="Search products by name or category..."
        className="mb-6 w-full px-4 py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid gap-4 h-screen overflow-hidden overflow-y-scroll">
          {filtered.map((product: any) => (
            <Link href={`/admin/admindashboard/products/${product.id}`} key={product.id}>
              <div className="p-4 bg-white rounded shadow hover:bg-gray-50 transition cursor-pointer">
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-600">₦{Number(product.price).toLocaleString()}</div>
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