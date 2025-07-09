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
        allProducts: async (_: any, { limit, offset }: { limit: number; offset: number }) => {
            try {
              const products = await productModel
                .find()
                .populate("seller")
                .sort({ createdAt: -1 })
                .limit(limit || 0)
                .skip(offset);
          
              return products.map((p) => {
                // Important: Convert toObject to safely access _id as string
                const obj = p.toObject();
                return {
                  ...obj,
                  id: obj._id ? obj._id.toString() : "", // fallback empty string to avoid null
                };
              });
            } catch (error: any) {
              handleError(error);
              throw new Error(error);
            }
          },
          
          
        myProducts: async (_parent: any, _args: any, context: any) => {
            try {
              console.log("Context received in resolver:", context);
              const { vendor } = context;
              if (!vendor) {
                throw new Error("Unauthorized: Only vendors can view their products.");
              }
          
              // Fetch products AND populate seller
              const myproducts = await productModel
                .find({ seller: vendor.id })
                .populate("seller");
          
              if (!myproducts || myproducts.length === 0) {
                throw new Error("No products found for this vendor.");
              }
          
              // Map each product into a plain object and fix IDs
              return myproducts.map((p) => {
                const obj = p.toObject();
                // Convert _id to id string
                obj.id = p._id.toString();
          
                // If seller is populated, convert its _id as well
                if (obj.seller && obj.seller._id) {
                  obj.seller.id = obj.seller._id.toString();
                } else {
                  // If not populated, you can set it to null or remove it
                  obj.seller = null;
                }
          
     
          
                return obj;
              });
            } catch (error) {
              handleError(error);
              throw error
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
    productBySlug: async (_: any, { slug }: { slug: string }) => {
        try {
          const product = await productModel.findOne({ slug }).populate("seller");
          if (!product) {
            throw new Error("Product not found");
          }
      
          // Convert _id to id for consistency
          const obj = product.toObject();
          obj.id = product._id.toString();
      
          // Populate seller id if exists
          if (obj.seller && obj.seller._id) {
            obj.seller.id = obj.seller._id.toString();
          }
      
          return obj;
        } catch (error) {
          handleError(error);
          throw error;
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
        },
        autoFeaturedProducts: async (_: any, args: {limit?: number}) => {
          const limit = args.limit || 8;
          return await productModel.find({
            averageRating: { $gte: 4.5 },
            totalReviews: { $gte: 10 },
          }).populate("seller").limit(limit).sort({ averageRating: -1 });
        },
    
        bestDeals: async (_: any, args: { limit?: number }) => {
          const limit = args.limit || 4;
          return await productModel.find({
            originalPrice: { $exists: true, $gt: 0 },
            $expr: { $gt: ["$originalPrice", "$price"] }, 
          }).limit(limit).sort({ price: 1 });
        },
        relatedProducts: async (_: any, { productId, limit }: {productId: string, limit?: number}) => {
          const currentProduct = await productModel.findById(productId);
          if (!currentProduct) throw new Error("Product not found");
        
          const related = await productModel.find({
            _id: { $ne: productId }, 
            category: currentProduct.category, 
          })
          .limit(limit || 0)
          .sort({ createdAt: -1 }); 
        
          return related;
        },

    },
    Mutation: {
        createProduct: async (_: any, args: any, context: any) => {
            try {
              const { vendor } = context;
              console.log("Vendor in context:", vendor);
          
              if (!vendor) {
                throw new Error("Unauthorized: Only vendors can create products.");
              }
          
              // Extract fields from args
              const {
                name,
                category,
                description,
                subCategory,
                color,
                condition,
                minimumOrder,
                price,
                originalPrice,
                isFeatured,
                images,
                stock,
              } = args;
          
              if (
                !name ||
                !category ||
                !description ||
                !subCategory ||
                !color ||
                !condition ||
                !minimumOrder ||
                !stock ||
                !images ||
                images.length === 0
              ) {
                throw new Error("Input fields cannot be empty.");
              }
          
              // Generate slug
              const slug = slugify(name, {
                replacement: "-",
                lower: true,
                strict: false,
                trim: true,
              });
              console.log("Generated slug:", slug);
          
              // Upload images to Cloudinary
              const pictures = await Promise.all(
                images.map(async (image: string) => {
                  const cloudimages = await cloudinary.uploader.upload(image);
                  return cloudimages.secure_url;
                })
              );
          
              // Get seller
              const seller = await vendorModel.findOne({
                email: vendor.email,
                name: vendor.name,
              });
          
              if (!seller) {
                throw new Error("Vendor not found.");
              }

              const newproduct = await productModel.create({
                name,
                category,
                description,
                subCategory,
                color,
                condition,
                minimumOrder,
                price,
                originalPrice: typeof originalPrice === "number" ? originalPrice : price,
                isFeatured: isFeatured || false,
                images: pictures,
                slug,
                stock,
                seller: seller._id,
              });
          
              return newproduct;
            } catch (error) {
              console.error("Product creation error:", error);
              handleError(error);
              throw error;
            }
          },
          
          
        updateProduct: async (_: any, arg: product, context: any) => {
            const  {id, name, category, description, subCategory, color, condition, minimumOrder, price, images} = arg
            try {
              const {vendor} = context 
              console.log(vendor);
                    if (!vendor) {
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
                const {vendor} = context 
                console.log(vendor);
                    if (!vendor) {
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
},
      Product: {
          seller: async (parent: any) => {
            if (!parent.seller) return null;
        
            // If already populated (object), return it with string id
            if (typeof parent.seller === "object" && parent.seller._id) {
              return {
                ...parent.seller,
                id: parent.seller._id.toString(),
              };
            }
        
            // If it's just an ID, fetch from DB
            const seller = await vendorModel.findById(parent.seller);
            if (!seller) return null;
            return {
              ...seller.toObject(),
              id: seller._id.toString(),
            };
          },
        },
  
}