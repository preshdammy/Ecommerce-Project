// app/category/[category]/page.tsx
import { gql } from "@apollo/client";
import { client } from "@/shared/lib/apolloClient"; 
import CategoryClientComponent from "./index"

const GET_PRODUCTS_BY_CATEGORY = gql`
  query ProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      id
      name
      description
      slug
      price
      images
      averageRating
      stock
      totalReviews
      seller {
        id
      }
    }
  }
`;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    throw new Error("Missing category slug");
  }

  const formattedCategorySlug = decodeURIComponent(params.slug); 

  let products = [];

  try {
    const { data } = await client.query({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { category: formattedCategorySlug }, 
      fetchPolicy: "no-cache",
    });

    products = data?.productsByCategory || [];
  } catch (error) {
    console.error("GraphQL error:", error);
  }

  return (
    <CategoryClientComponent
      products={products}
      formattedCategory={formattedCategorySlug.replace(/-/g, " ")} 
    />
  );
}