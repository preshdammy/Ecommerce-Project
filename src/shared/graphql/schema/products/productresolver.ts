import cloudinary from '@/shared/utils/cloudinary';
import slugify from 'slugify';
import { productModel } from '@/shared/database/model/product.model'
import { handleError } from '@/shared/utils/handleError';

type product = {
    name: string;
    category: string;
    description: string;
    subCategory: string;
    color: string;
    condition: string;
    minimumOrder: number;
    price: number;
    images: [string];
}


export const productresolver = {
    Query: {
        allProducts: async (_: any, {limit, offset}:{limit:number, offset:number}) => {
           try {
                const products = await productModel.find()
                    .limit(limit)
                    .skip(offset)
                    .sort({ createdAt: -1 })
                 return products;
           } catch (error) {
                handleError(error)
           }
        },
        product: async (_: any, arg: { id: string }) => {
            try {
                const oneProduct = await productModel.findById(arg.id)
                if (!oneProduct) {
                    throw new Error("Product not found");
                }
                return oneProduct;
            } catch (error) {
                handleError(error);   
            }
    },
        productsByCategory: async (_: any, { category }: { category: string }) => {
            try {
                const productsbycategory = await productModel.find({ category })
                if (!productsbycategory || productsbycategory.length === 0) {
                    throw new Error("No products found in this category");
                }
                return productsbycategory;
            } catch (error) {
                handleError(error);
            }
        },
        productsBySubcategory: async (_: any, { subCategory }: { subCategory: string }) => {
            try {
                const productsbysubcategory = await productModel.find({ subCategory })
                if (!productsbysubcategory || productsbysubcategory.length === 0) {
                    throw new Error("No products found in this sub-category");
                }
                return productsbysubcategory;
            } catch (error) {
                handleError(error);
            }
        },
        productsBySeller: async (_: any, { sellerId }: { sellerId: string }) => {
            try {
                const productsbyseller = await productModel.find({ seller: sellerId })
                if (!productsbyseller || productsbyseller.length === 0) {
                    throw new Error("No products found for this seller");
                }
                return productsbyseller;
            } catch (error) {
                handleError(error);
            }
        },
        searchProducts: async (_: any, { query }: { query: string }) => {
            try {
                const searchResults = await productModel.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } },
                        { subCategory: { $regex: query, $options: 'i' } }
                    ]
                });
                if (!searchResults || searchResults.length === 0) {
                    throw new Error("No products found for this search query");
                }
                return searchResults;
            } catch (error) {
                handleError(error);
            }
        },
        productsByRating: async (_: any, { rating }: { rating: number }) => {
            try {
                const productsbyrating = await productModel.find({ 'reviews.rating': rating })
                if (!productsbyrating || productsbyrating.length === 0) {
                    throw new Error("No products found with this rating");
                }
                return productsbyrating;
            } catch (error) {
                handleError(error);
            }
        },
        productsByCondition: async (_: any, { condition }: { condition: string }) => {
            try {
                const productsbycondition = await productModel.find({ condition })
                if (!productsbycondition || productsbycondition.length === 0) {
                    throw new Error("No products found with this condition");
                }
                return productsbycondition;
            } catch (error) {
                handleError(error);
            }
        },
        productsByPriceRange: async (_: any, { minPrice, maxPrice }: { minPrice: number, maxPrice: number }) => {
            try {
                const productsbypricerange = await productModel.find({
                    price: { $gte: minPrice, $lte: maxPrice }
                });
                if (!productsbypricerange || productsbypricerange.length === 0) {
                    throw new Error("No products found in this price range");
                }
                return productsbypricerange;
            } catch (error) {
                handleError(error);
            }
        }

    },
}