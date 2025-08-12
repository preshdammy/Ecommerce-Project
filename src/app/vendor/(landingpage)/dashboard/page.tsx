"use client"
import React, { useEffect, useState, useRef} from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Link from "next/link";
import Image from "next/image"
import dummy from "../../../../../public/figma images/person-dummy.jpg"
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"



export const get_my_products = gql`
   query GetMyProducts($limit: Int!, $offset: Int!) {
    myProducts(limit: $limit, offset: $offset) {
      id
      name
      category
      description
      subCategory
      color
      condition
      minimumOrder
      price
      images
      createdAt
      updatedAt
      slug
      averageRating
      totalReviews
      stock
      seller {
        id
        name
        email
      }
    }
  }
`

const delete_product = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $id: ID!
    $name: String!
    $category: String!
    $description: String!
    $price: Float!
    $stock: Int!
  ) {
    updateProduct(
      id: $id
      name: $name
      category: $category
      description: $description
      price: $price
      stock: $stock
    ) {
      id
      name
      category
      description
      price
      stock
    }
  }
`;

const get_vendor_by_id = gql`
    query GetVendorById($id: ID!) {
    getVendorById(id: $id) {
      id
      profilePicture
      businessName
      businessDescription
      businessAddress
    }
  }
`


type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  subCategory: string;
  color: string;
  condition: string;
  minimumOrder: number;
  price: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  averageRating: number;
  totalReviews: number;
  stock: number;
}

const vendor = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
  
      if (width < 640) setLimit(4);       
      else if (width < 768) setLimit(4);  
      else if (width < 1024) setLimit(6); 
      else if (width < 1280) setLimit(8);
      else setLimit(8);                  
    };
  
    updateLimit(); 
    window.addEventListener("resize", updateLimit);
  
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

 const { loading, error, data, networkStatus } = useQuery(get_my_products, {
  variables: { limit, offset},
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "cache-and-network",
  onError: (err) => {
    console.error("GraphQL Error:", err);
  },
});

  const vendorId = data?.myProducts?.[0]?.seller?.id;
  const {data: vendorData, loading: vendorLoading, error: vendorError} = useQuery(get_vendor_by_id, {
    variables: { id: vendorId },
    skip: !vendorId,
  })
  
  const toastId = useRef<string | number | null>(null);

useEffect(() => {
  if (
    networkStatus === 1 &&
    (!data || !data.myProducts || data.myProducts.length === 0) &&
    toastId.current === null
  ) {
    toastId.current = toast.loading("Fetching your products...");
  }

  if (error) {
    if (toastId.current !== null) {
      toast.update(toastId.current, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      toastId.current = null;
    } else {
      toast.error(`Error: ${error.message}`);
    }
  }

  if (networkStatus === 7 && data) {
    if (toastId.current !== null) {
      toast.update(toastId.current, {
        render: "Products fetched successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      toastId.current = null;
    }
  }
}, [networkStatus, error, data]);

  
    
  
  const [deleteProduct, { loading: deleteLoading }] = useMutation(delete_product, {
    refetchQueries: [{ query: get_my_products }],
    onCompleted: () => {
      toast.success("Product deleted successfully!");
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });
  
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct({
          variables: { id },
        });
      }
    });
  };
  
  
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: get_my_products }],
    onCompleted: () => {
      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });


  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
  
    updateProduct({
      variables: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        category: selectedProduct.category,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock
      },
    });
  };

 const disableNext = data?.myProducts?.length < limit || !data?.myProducts;
  
  
  
    return ( 
      <div className="bg-gray-100 min-h-screen overflow-x-hidden">
      <section className="bg-blue-50 py-10 text-center">
        <div className="max-w-xl mx-auto bg-blue">
          <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full border border-[#939090] flex items-center justify-center mx-auto">
            <div className="relative w-22 sm:w-26 md:w-30 h-22 sm:h-26 md:h-30 rounded-full bg-white border border-[#939090] overflow-hidden">
              {vendorData?.getVendorById?.profilePicture ? (
                <Image
                  src={vendorData.getVendorById.profilePicture}
                  alt="Vendor Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image src={dummy} alt="Default Profile" fill className="object-cover" />
              )}
            </div>
          </div>
    
          {/* Business Name */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight font-bold font-Merriweather text-[#55A7FF] mt-4">
            {vendorData?.getVendorById?.businessName || "Business Name Unavailable"}
          </h2>
    
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#939090] mt-2">
            {vendorData?.getVendorById?.businessDescription ||
              "No business description available."}
          </p>
    
          {/* Address */}
          <p className="text-sm sm:text-base md:text-lg text-[#272222]">
            {vendorData?.getVendorById?.businessAddress || "No business address provided"}
          </p>
    
          {/* Icons */}
          <div className="mt-3 mx-auto flex justify-center gap-5">
            <img src="/figma images/Frame 240 (1).png" alt="message" className="w-8 sm:w-11 md:w-15" />
            <img src="/figma images/Frame 241.png" alt="notification" className="w-8 sm:w-11 md:w-15" />
          </div>
    
          {/* Button */}
          <button
            onClick={() => router.push("/vendor/product-upload")}
            className="mt-5 font-semibold font-Work-Sans text-lg sm:text-xl md:text-2xl w-[200px] sm:w-[250px] md:w-[300px] lg:w-[349px] h-12 sm:h-14 bg-[#FF4C3B] text-white px-6 py-2 rounded-full"
          >
            ADD PRODUCT
          </button>
        </div>
      </section>
    
      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-6">My Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.myProducts?.length > 0 ? (
            data.myProducts.map((product: Product) => (
              <div key={product.id} className="flex mx-auto flex-col">
                {/* Card */}
                <div className="bg-white shadow-md rounded-[16px] w-[250px] sm:w-[230px] md:w-[225px] lg:w-[236px] flex flex-col">
                  {/* Image */}
                  <div className="relative">
                    <img
                      className="w-full h-[180px] sm:h-[190px] md:h-[200px] lg:h-[203px] object-cover rounded-t-[16px]"
                      src={product.images[0] || "/figma images/Frame 89.png"}
                      alt={product.name}
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        Out of Stock
                      </div>
                    )}
                  </div>
    
                  {/* Price */}
                  <h4 className="border-t border-gray-300 pt-2 pb-2 pl-4 text-sm sm:text-base font-semibold">
                    NGN {product.price.toLocaleString()}
                  </h4>
    
                  {/* Name */}
                  <p className="pl-4 text-sm sm:text-base font-Merriweather">{product.name}</p>
    
                  {/* Description */}
                  <p className="pl-4 mt-2 text-xs sm:text-sm text-[#939090]">
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description}
                  </p>
    
                  {/* Location */}
                  <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm pl-4">
                    <img src="/figma images/map-pin.png" alt="" className="w-3 sm:w-4" />
                    <p className="text-[#939090]">{"hardcoded, location"}</p>
                  </div>
    
                  {/* Buttons */}
                  <div className="flex justify-between items-center mt-4 px-4 pb-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
    
                {/* Rating */}
                <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    ⭐
                    <span className="ml-1 font-medium">
                      {product.averageRating
                        ? product.averageRating.toFixed(1)
                        : "No ratings yet"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.totalReviews
                      ? `, ${product.totalReviews} reviews`
                      : ", No reviews"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-10 text-gray-500 text-sm sm:text-base">
                No products yet. Click "Add New Product" to get started.
              </div>
            )
          )}
        </div>
      </section>
    

   <div className="flex justify-center mt-6 gap-4">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${page === 1 ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white hover:bg-[#007BFF] hover:text-white" }`} >
          <BsArrowLeft />
          Previous
      </button>
    <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={disableNext}
          className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${
            disableNext
              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-[#007BFF] hover:text-white"
          }`}
        >
          Next
          <BsArrowRight />
        </button>

</div>

  {isEditModalOpen && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-[#f5f5f5] w-[90%] sm:w-full max-w-lg p-8 rounded-xl shadow-2xl relative">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Edit Product
      </h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateProduct();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={selectedProduct.name}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, name: e.target.value })
          }
          className="w-full p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
        />
        <input
          type="text"
          placeholder="Category"
          value={selectedProduct.category}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, category: e.target.value })
          }
          className="w-full p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
        />
        <textarea
          placeholder="Description"
          value={selectedProduct.description}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, description: e.target.value })
          }
          className="w-full p-3 bg-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
          rows={3}
        />
        <input
          type="number"
          placeholder="Price"
          value={selectedProduct.price}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              price: parseFloat(e.target.value)
            })
          }
          className="w-full p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
        />
        <input
            type="number"
            placeholder="Stock"
            value={selectedProduct.stock}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                stock: parseInt(e.target.value, 10),
              })
            }
            className="w-full p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
          />


        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      
    </div>
     );
}
 
 
export default vendor; 
