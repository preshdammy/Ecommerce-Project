// app/products/[id]/page.tsx
"use client";
import Image from "next/image";
import { useParams } from "next/navigation";

const productImages = [
  "/product_image_1.png",
  "/product_image_2.png",
  "/product_image_3.png",
  "/product_image_4.png",
];

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-[#007BFF] mb-6">Product Details</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Image Gallery */}
        <div className="grid grid-cols-2 gap-4">
          {productImages.map((img, index) => (
            <div key={index} className="relative w-full h-48 border rounded-md overflow-hidden">
              <Image
                src={img}
                alt={`Product Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Executive Office Table</h2>
          <p className="text-gray-700 mb-4">Hardwood executive office table with three drawers and modern finish.</p>
          <p className="text-lg font-bold mb-2 text-[#007BFF]">₦ 65,000</p>
          <p className="text-gray-600 mb-2">Sold by: Dele Electronics</p>
          <p className="text-gray-600">Location: Lagos, Gbagada</p>
        </div>
      </div>
    </div>
  );
}
