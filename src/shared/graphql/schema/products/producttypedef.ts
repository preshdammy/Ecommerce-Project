import { vendortypedef } from "../vendor/vendortypedef"

export const producttypedef = `

   type Review {
        id: ID!
        userId: ID!
        comment: String!
        rating: Int!
        createdAt: String!
}


    type Product {
        id: ID!
        name: String!
        category: String!
        description: String!
        subCategory: String!
        color: String!
        condition: String!
        minimumOrder: Int!
        price: Float!
        images: [String!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        slug: String!
        seller: Vendor!
        reviews: [Review!]!
        averageRating: Float
        totalReviews: Int
    }
        scalar DateTime


    type Query {
        allProducts(limit: Int!, offset: Int!): [Product!]!
        product(id: ID!): Product
        productsByCategory(category: String!): [Product!]!
        productsBySubCategory(subCategory: String!): [Product!]!
        productsBySeller(sellerId: ID!): [Product!]!
        searchProducts(query: String!): [Product!]!
        productsByRating(rating: Int!): [Product!]!
        productsByCondition(condition: String!): [Product!]!
        productsByPriceRange(minPrice: Float!, maxPrice: Float!): [Product!]!
    }

    type Mutation {
        createProduct(name: String!, category: String!, description: String!, subCategory: String!, color: String!, condition: String!, minimumOrder: Int!, price: Float!, images: [String!]!): Product!
        updateProduct(id: ID!, name: String, category: String, description: String, subCategory: String, color: String, condition: String, minimumOrder: Int, price: Float, images: [String!]): Product
        deleteProduct(id: ID!): Boolean!
        addReview(productId: ID!, userId: ID!, comment: String!, rating: Int!): Review!
        deleteReview(id: ID!): Boolean!
        
    }
`