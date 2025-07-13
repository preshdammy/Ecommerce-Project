"use client";

import { FaRegHeart, FaStar } from "react-icons/fa";
import { CiStar, CiLocationOn } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { log } from "console";

interface ProductType {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  images: string[];
  averageRating: number;
  seller: {
    id: string;
  };
}

interface Props {
  products: ProductType[];
  formattedCategory: string;
}

const CategoryClientComponent = ({ products, formattedCategory }: Props) => {
  console.log("Products in category:", products);
  console.log("Formatted Category:", formattedCategory);
  
  
  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="text-[#FABE22] text-[14px]" />
        ) : (
          <CiStar key={i} className="text-[#FABE22] text-[14px]" />
        )
      )}
    </div>
  );

  return (
    <div className="bg-[#F8F8F8] min-h-screen relative">
      <h1 className="text-2xl font-semibold px-4 mt-6">Products in: {formattedCategory}</h1>

      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-md p-3 cursor-pointer hover:shadow"
              >
                <div className="w-full h-40 relative mb-3">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="rounded object-cover"
                  />
                </div>

                <span className="text-[#007BFF] text-xs font-medium">
                  {product.name || "Unknown product"}
                </span>

                <p className="text-[#272222] text-sm mt-1">  {product.description.length > 39
                    ? product.description.slice(0, 39) + "..."
                    : product.description}</p>
                {renderStars(Math.round(product.averageRating || 0))}
                <span className="text-[#272222] text-base font-semibold block mt-1">
                  ₦{product.price}
                </span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#007BFF] text-xs flex items-center">
                    <CiLocationOn className="mr-1" />
                    { "Not set"}
                  </span>
                </div>

                <Link href={`/product/${product.slug}`}>
                  <button className="text-[#007BFF] mt-2 text-sm underline">See more</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryClientComponent;
