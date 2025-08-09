

export const producttypedef = `
    type Product {
        id: ID!
        name: String!
        category: String!
        categorySlug: String
        description: String!
        extendedDescription: String
        subCategory: String!
        color: String
        condition: String!
        minimumOrder: Int!
        price: Float!
        images: [String!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        slug: String!
        seller: Vendor
        averageRating: Float
        totalReviews: Int
        stock: Int
        isFeatured: Boolean
        originalPrice: Float
        orderStats: OrderStats

    }
        scalar DateTime

    type Category {
        name: String!
        slug: String!
        }

       type OrderStats {
        totalOrders: Int!
        totalQuantity: Int!
        salesPerMonth: [SalesData]
        }

        type SalesData {
        month: String!
        total: Float!
        }


    type Query {
        allProducts(limit: Int!, offset: Int!): [Product!]!
        myProducts(limit: Int, offset: Int): [Product!]!
        product(id: ID!): Product
        productBySlug(slug: String!): Product
        allCategories: [Category!]!
        productsByCategory(category: String!): [Product!]!
        productsBySubCategory(subCategory: String!): [Product!]!
        productsBySeller(sellerId: ID!): [Product!]!
        searchProducts(query: String!): [Product!]!
        productsByRating(rating: Int!): [Product!]!
        productsByCondition(condition: String!): [Product!]!
        productsByPriceRange(minPrice: Float!, maxPrice: Float!): [Product!]!
        autoFeaturedProducts(limit: Int = 8): [Product!]!
        bestDeals(limit: Int = 4): [Product!]!
        relatedProducts(productId: ID!, limit: Int = 4): [Product!]!
    }

    type Mutation {
        createProduct(name: String!, category: String!, description: String!, extendedDescription: String, subCategory: String!, color: String!, condition: String!, minimumOrder: Int!, stock: Int! price: Float!, images: [String!]!, originalPrice: Float): Product!
        updateProduct(id: ID!, name: String, category: String, description: String, extendedDescription: String, subCategory: String, color: String, condition: String, minimumOrder: Int, price: Float, images: [String], originalPrice: Float, stock: Int): Product
        deleteProduct(id: ID!): Boolean!  
    }
`