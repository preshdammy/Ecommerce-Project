"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import share from '../../../../public/figma images/share.png'
import placeholder from '../../../../public/figma images/image-03.png';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const create_products = gql`
  mutation createProduct ($name:String!, $category:String!, $description:String!, $subCategory:String!, $color:String!, $condition:String!, $minimumOrder:Int!, $stock:Int! $price:Float!, $images: [String!]!) {
    createProduct (name: $name, category: $category, description: $description, subCategory: $subCategory, color: $color, condition: $condition, minimumOrder: $minimumOrder, stock: $stock, price: $price, images: $images) {
    name,
    category,
    description,
    subCategory,
    color,
    condition,
    minimumOrder,
    stock,
    price,
    images
  }
}
`



const ProductUpload = () => {
  const router = useRouter()
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    description: '',
    subCategory: '',
    color: '',
    stock: 0,
    condition: '',
    minimumOrder: 0,
    price: 0,
    images: [] as String[]
  })

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [createProduct, {loading, data, error}] = useMutation(create_products)
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers = Array.from(files).slice(0, 4).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      setProductData((prev) => ({
        ...prev,
        images: base64Images,
      }));
      setPreviewImages(base64Images);
    });
  };

  const handleUpload = async () => {
    const toastId = toast.loading("Uploading product...");
    try {
      const res = await createProduct({ variables: { ...productData } });
      console.log("Product created:", res.data.createProduct);
      toast.update(toastId, {
        render: "Product uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });

      setProductData({
        name: '',
        category: '',
        description: '',
        subCategory: '',
        color: '',
        stock: 0,
        condition: '',
        minimumOrder: 0,
        price: 0,
        images: [],
      });
      setPreviewImages([]);
      setTimeout(() => {
        router.push("/VendorDashboard");
      }, 1000);
    } catch (error) {
      toast.update(toastId, {
        render: `Error creating product: ${
          error instanceof Error ? error.message : String(error)
        }`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
        closeOnClick: true,
      });
      
    }
  };

  return (
    <>
 

    <div className="">
      <div className="min-h-screen py-8 bg-gray-100">
        <div className="w-full mx-auto min-h-[240vh] ">
          <div className="pt-36 px-6 sm:px-8 md:px-20 lg:px-32">
            <h2 className="font-Merriweather text-3xl sm:text-4xl font-medium text-[#55A7FF] mb-6 mt-[-80px]">
              Upload Products
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Main Image Upload */}
               <div className="md:col-span-2">
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer flex flex-col justify-center items-center h-[365px] md:h-[265px] lg:h-[365px] w-full bg-blue-50 rounded-[16px] hover:bg-blue-100 transition-all duration-200"
                >
                  <input
                    onChange={handleImages}
                    id="mainImage"
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="text-center text-gray-500 pointer-events-none">
                    <Image src={share} alt="Upload Icon" className="mx-auto h-10 w-10 mb-3" />
                    <p className="text-black text-lg">Upload Images</p>
                    <p className="text-sm text-gray-400">(Max 4 images)</p>
                  </div>
                </label>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[150px] sm:h-[175px] md:h-[125px] lg:h-[175px] w-full rounded-[16px] flex items-center justify-center bg-white overflow-hidden relative"
                  >
                    {previewImages[idx] ? (
                      <img
                        src={previewImages[idx]}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image src={placeholder} alt="Placeholder" className="h-10 w-10 mx-auto" />
                    )}
                  </div>
                ))}
              </div>

              {/* Input Fields */}
              <div className="md:col-span-3 mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                     value={productData.name}
                      onChange={(e)=>setProductData({...productData, name: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      value={productData.category}
                      onChange={(e)=>setProductData({...productData, category: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Product Description
                    </label>
                    <input
                      value={productData.description}
                      onChange={(e)=>setProductData({...productData, description: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[176px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Sub-category
                    </label>
                    <input
                      value={productData.subCategory}
                      onChange={(e)=>setProductData({...productData, subCategory: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[176px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      value={productData.color}
                      onChange={(e)=>setProductData({...productData, color: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      value={productData.stock}
                      onChange={(e)=>setProductData({...productData, stock: Number(e.target.value)})}
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <input
                      value={productData.condition}
                      onChange={(e)=>setProductData({...productData, condition: e.target.value})}
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Minimum order
                    </label>
                    <input
                    value={productData.minimumOrder}
                    onChange={(e)=>setProductData({...productData, minimumOrder: Number(e.target.value)})}
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      value={productData.price}
                      onChange={(e)=>setProductData({...productData, price: Number(e.target.value)})}
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleUpload}
                      type="button"
                      className="w-full h-[92px] rounded-[100px] text-[20px] font-semibold bg-[#FF4C3B] text-white hover:bg-red-600 transition-all"
                    >
                      {loading? "Uploading..." : "Upload product"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductUpload;
