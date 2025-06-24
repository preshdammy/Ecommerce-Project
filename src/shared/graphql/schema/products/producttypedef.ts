

export const producttypedef = `
    type Product {
        id: ID!
        name: String!
        category: String!
        description: String!
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
        updateProduct(id: ID!, name: String, category: String, description: String, subCategory: String, color: String, condition: String, minimumOrder: Int, price: Float, images: [String!]!): Product
        deleteProduct(id: ID!): Boolean!  
    }
`