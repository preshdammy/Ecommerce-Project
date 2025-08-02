"use client";

import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Image from "next/image";

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($productId: ID!) {
    product(id: $productId) {
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
    }
  }
`;

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($limit: Int!, $offset: Int!) {
    allProducts(limit: $limit, offset: $offset) {
      id
      name
      price
    }
  }
`;

const GET_PRODUCT_STATS = gql`
  query GetProductStats($productId: ID!) {
    productStats(productId: $productId) {
      totalSales
      dailySales
      percentageChange
    }
  }
`;

const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    productReviews(productId: $productId) {
      id
      rating
      comment
      createdAt
      user {
        name
      }
    }
  }
`;

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [filter, setFilter] = useState('all');
  const [statsData, setStatsData] = useState<any>(null);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [productNotFound, setProductNotFound] = useState(false);
  const [getProductDetails, { data, loading, error }] = useLazyQuery(GET_PRODUCT_DETAILS);
  const [getProductStats] = useLazyQuery(GET_PRODUCT_STATS);
  const [getProductReviews] = useLazyQuery(GET_PRODUCT_REVIEWS);
  
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_ALL_PRODUCTS, {
    variables: { limit: 20, offset: 0 },
  });

  useEffect(() => {
    if (searchTerm && productsData?.allProducts) {
      const product = productsData.allProducts.find((p: any) => 
        p.id && p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (product?.id) {
        setSelectedProductId(product.id);
        setProductNotFound(false);
        getProductDetails({ variables: { productId: product.id } });
      } else {
        setSelectedProductId(null);
        setProductNotFound(true);
      }
    } else {
      setProductNotFound(false);
    }
  }, [searchTerm, productsData, getProductDetails]);

  const handleDeleteProduct = async () => {
    alert(`Product ${data?.product?.name || 'Unknown'} deleted.`);
  };

  const StatsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h3 className="text-xl font-bold mb-4">Product Performance</h3>
        {statsData ? (
          <div>
            <p>Total Sales: {statsData.totalSales}</p>
            <p>Today's Sales: {statsData.dailySales}</p>
            <p>Change from yesterday: {statsData.percentageChange}%</p>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}
        <button 
          onClick={() => setShowStats(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  const ReviewsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Product Reviews</h3>
        {reviewsData?.length > 0 ? (
          reviewsData.map((review: any) => (
            <div key={review.id} className="mb-4 border-b pb-2">
              <p><strong>{review.user.name}</strong> - {review.rating}★</p>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
        <button 
          onClick={() => setShowReviews(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  if (productsLoading) return <div>Loading products...</div>;
  if (productsError) return <div>Error: {productsError.message}</div>;

  return (
    <div className="w-[95%] mx-auto font-sans mt-[20px]">
      <h1 className="font-[400] text-[32px]">Manage Products</h1>

      <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center mt-[40px]">
        <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-full outline-none ml-[10px] text-[16px]"
        />
      </div>

      {productNotFound && (
        <p className="mt-4 text-red-500">Product not found</p>
      )}

      <div className="flex gap-2 mt-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Products
        </button>
        <button 
          onClick={() => setFilter('best')}
          className={`px-4 py-2 rounded ${filter === 'best' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Best Selling
        </button>
        <button 
          onClick={() => setFilter('featured')}
          className={`px-4 py-2 rounded ${filter === 'featured' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Featured
        </button>
        <button 
          onClick={() => setFilter('out')}
          className={`px-4 py-2 rounded ${filter === 'out' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Out of Stock
        </button>
      </div>

      {loading && <div>Loading product details...</div>}
      {error && <div>Error: {error.message}</div>}
       {selectedProductId && data?.product && (
        <div className="mt-[30px] border-[1px] border-[#CCE5FF] p-4 rounded-[10px]">
          {/* Product Image Display */}
          {data.product.images?.length > 0 && (
            <div className="mb-4">
              <Image
                src={data.product.images[0]}
                alt={data.product.name}
                width={300}
                height={200}
                className="rounded-full object-cover h-48 w-48"
              // Remove if you have proper image optimization setup
              />
            </div>
          )}
          <h2 className="font-[500] text-[24px]">{data.product.name || 'Unknown Product'}</h2>
          <p><strong>Category:</strong> {data.product.category || 'N/A'}</p>
          <p><strong>Description:</strong> {data.product.description || 'N/A'}</p>
          <p><strong>SubCategory:</strong> {data.product.subCategory || 'N/A'}</p>
          <p><strong>Color:</strong> {data.product.color || 'N/A'}</p>
          <p><strong>Condition:</strong> {data.product.condition || 'N/A'}</p>
          <p><strong>Minimum Order:</strong> {data.product.minimumOrder || 0}</p>
          <p><strong>Stock:</strong> {data.product.stock || 0}</p>
          <p><strong>Price:</strong> ₦{(data.product.price || 0).toLocaleString()}</p>
          <p><strong>Seller:</strong> {data.product.seller?.name || 'N/A'} ({data.product.seller?.email || 'N/A'})</p>
          <p><strong>Average Rating:</strong> {data.product.averageRating || 0}</p>
          <p><strong>Total Reviews:</strong> {data.product.totalReviews || 0}</p>
          <p><strong>Created At:</strong> {new Date(data.product.createdAt).toLocaleDateString()}</p>
          <p><strong>Updated At:</strong> {new Date(data.product.updatedAt).toLocaleDateString()}</p>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-bold">Rating</p>
              <p>{data.product.averageRating || 0} ★ ({data.product.totalReviews || 0} reviews)</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={async () => {
                const { data } = await getProductStats({ variables: { productId: selectedProductId } });
                setStatsData(data.productStats);
                setShowStats(true);
              }}
            >
              View Performance
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded"
              onClick={async () => {
                const { data } = await getProductReviews({ variables: { productId: selectedProductId } });
                setReviewsData(data.productReviews);
                setShowReviews(true);
              }}
            >
              View Reviews
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteProduct}
            >
              Delete Product
            </button>
          </div>
        </div>
      )}

      {showStats && <StatsModal />}
      {showReviews && <ReviewsModal />}
    </div>
  );
};

export default AdminProducts;