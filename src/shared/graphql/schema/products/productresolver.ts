import cloudinary from '@/shared/utils/cloudinary';
import slugify from 'slugify';
import { productModel } from '@/shared/database/model/product.model'
import { vendorModel } from '@/shared/database/model/vendor.model';
import { handleError } from '@/shared/utils/handleError';

type product = {
    id: string;
    name: string;
    category: string;
    description: string;
    subCategory: string;
    color: string;
    condition: string;
    minimumOrder: number;
    stock: number;
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
        myProducts: async (_: any, context: any) => {
            try {
                const { vendor } = context;
                if (!vendor) {
                    throw new Error("Unauthorized: Only vendors can view their products.")
                }
                const myproducts = await productModel.find({ seller: vendor?._id })
                if (!myproducts || myproducts.length === 0) {
                    throw new Error("No products found for this vendor")
                }
                return myproducts;
            } catch (error) {
                handleError(error);
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
        productsBySubCategory: async (_: any, { subCategory }: { subCategory: string }) => {
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
    Mutation: {
        createProduct: async (_: any, {name, category, description, subCategory, color, condition, minimumOrder, price, images, stock}: product, context: any) => {
            try {
                const {vendor} = context 
                console.log(vendor);
                    if (!vendor) {
                        throw new Error("Unauthorized: Only vendors can create products.");
                    }
                    const pictures = await Promise.all(images.map(async(image)=>{
                    const cloudimages = await cloudinary.uploader.upload(image)
                    return cloudimages.secure_url
                }))
                console.log(pictures);
                if (!name || !category || !description || !subCategory || !color || !condition || !minimumOrder || !stock || pictures.length === 0) {
                    throw new Error("input fields cannot be empty")
                    
                }
                const slug = await slugify(name, {
                    replacement: "-",
                    lower: true,
                    strict: false,
                    trim: true
                })
                const seller = await vendorModel.findOne({email:vendor.email, name: vendor.name})
                if (!seller) {
                    throw new Error("Vendor not found");
                  }
                  
                const newproduct = await productModel.create({name, category, description, subCategory, color, condition, minimumOrder, price, images: pictures, slug, stock, seller: vendor?._id}) 
                return newproduct
            } catch (error) {
                console.error("Product creation error:", error);
                handleError(error);
                
            }
        },
        updateProduct: async (_: any, arg: product, context: any) => {
            const  {id, name, category, description, subCategory, color, condition, minimumOrder, price, images} = arg
            try {
              const {vendorId} = context 
              console.log(vendorId);
                    if (!vendorId) {
                        throw new Error("Unauthorized: Only vendors can update products.");
                    }
                    const existingProduct = await productModel.findById(id);

                    if (!existingProduct) {
                      throw new Error("Product not found");
                    }
                
                    if (existingProduct.seller.toString() !== context.vendor.id) {
                      throw new Error("You are not authorized to update this product");
                    }
              const updatedproduct = await productModel.findByIdAndUpdate(id, {
                name,
                category,
                description,
                subCategory,
                color,
                condition,
                minimumOrder,
                price,
                images
              }, { new: true})
              return updatedproduct
            } catch (error) {
                handleError(error);
                
            }
        },
        deleteProduct: async (_: any, { id }: { id: string }, context: any) => {
            try {
                const {vendorId} = context 
                console.log(vendorId);
                    if (!vendorId) {
                        throw new Error("Unauthorized: Only vendors can delete products.");
                    }
                    const existingProduct = await productModel.findById(id);

                    if (!existingProduct) {
                      throw new Error("Product not found");
                    }
                
                    if (existingProduct.seller.toString() !== context.vendor.id) {
                      throw new Error("You are not authorized to delete this product");
                    }
                const deletedproduct = await productModel.findByIdAndDelete(id)
                return !!deletedproduct
            } catch (error) {
                handleError(error);
                
            }
        }
}}