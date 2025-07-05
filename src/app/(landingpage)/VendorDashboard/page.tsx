"use client"
import React, { useEffect, useState, useRef} from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";



export const get_my_products = gql`
  query GetMyProducts {
    myProducts {
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
  ) {
    updateProduct(
      id: $id
      name: $name
      category: $category
      description: $description
      price: $price
    ) {
      id
      name
      category
      description
      price
    }
  }
`;


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
  const router = useRouter();
  const { loading, error, data, networkStatus } = useQuery(get_my_products, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      console.error("GraphQL Error:", err);
    },
  });
  
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
      },
    });
  };
  
  
  
    return ( 
        <div className="bg-gray-100 min-h-screen">
      <section className="bg-blue-50 py-10 text-center ">
        <div className="max-w-xl mx-auto  bg-blue">


            
            <img className="w-23.5 h-23.5 mx-auto " src="/figma images/Group 209.png" alt="" />
          
          <h2 className="text-[40px] leading-[100%] tracking-[0] font-bold font-Merriweather text-[#55A7FF] mt-4">Soothe & Tie</h2>

          <p className="text-[#939090] mt-2 text-[24px]">We design and deliver high quality luxury suits to people that want that easy life and comfort..</p>
          <p className="text-[16px] text-[#272222] ">Herbert Macaulay way, Off Ikeja Road. Lagos</p>
          <div className="mt-3 mx-auto space-x-7 flex ml-[200px] min-ml-screen">
      <img src="/figma images/Frame 240 (1).png" alt="message" />
      <img src="/figma images/Frame 241.png" alt="" />
          </div>
          <button onClick={()=>router.push("/product-upload")} className="mt-5 font-semibold font-Work-Sans text-2xl w-[349px] h-[60px] bg-[#FF4C3B] text-[#FFFFFF] text-[24px] px-[56px] py-[10px] rounded-full">
            ADD NEW PRODUCT
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-10 ml-[30px] ">
        <h3 className="text-xl font-semibold mb-6 ml-[18px]">My Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
       
      
{data?.myProducts?.length > 0 ? (
  data.myProducts.map((product: Product) => (
    <div key={product.id} className="flex flex-col">
    {/* Product Card */}
    <div
      className="bg-white shadow-md rounded-[16px] w-[232px] h-auto ml-[18px] flex flex-col"
    >
      {/* Product Image */}
      <img
        className="w-[232px] h-[203px] object-cover rounded-tr-[16px] rounded-tl-[16px]"
        src={product.images[0] || "/figma images/Frame 89.png"}
        alt={product.name}
      />
  
      {/* Price */}
      <h4 className="border-t border-gray-300 pt-2 pb-2 pl-4 text-[16px] font-[600]">
        NGN {product.price.toLocaleString()}
      </h4>
  
      {/* Name */}
      <p className="pl-4 text-[16px] font-Merriweather">{product.name}</p>
  
      {/* Description */}
      <p className="pl-4 mt-2 text-[12px] text-[#939090]">{product.description.length > 62 ? product.description.slice(0, 62) + "..." : product.description}</p>
  
      {/* Location */}
      <div className="flex items-center gap-2 mt-3 text-sm pl-4">
        <img src="/figma images/map-pin.png" alt="" className="w-4 h-4" />
        <p className="text-[#939090]">{"hardcoded, location"}</p>
      </div>
  
      {/* Buttons */}
      <div className="flex justify-between items-center mt-4 px-4 pb-3">
      <button
        onClick={() => handleEdit(product)}
        className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-600 transition"
      >
        Edit
      </button>

        <button
          onClick={() => handleDelete(product.id)}
          className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded hover:bg-red-600 transition"
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  
    
    <div className="w-[232px] ml-[18px] mt-2 flex justify-between items-center text-[13px] text-gray-600">
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
          ? `${product.totalReviews} reviews`
          : "No reviews"}
      </div>
    </div>
  </div>
  
  ))
) : (
  !loading &&
  <div className="col-span-full text-center py-10 text-gray-500">
    No products yet. Click "Add New Product" to get started.
  </div>
)}

        
            
        </div>
      </section>


      {isEditModalOpen && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-[#f5f5f5] w-full max-w-lg p-8 rounded-xl shadow-2xl relative">
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
