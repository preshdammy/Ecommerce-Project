import cloudinary from '@/shared/utils/cloudinary';
import slugify from 'slugify';
import { productModel } from '@/shared/database/model/product.model'
import { vendorModel } from '@/shared/database/model/vendor.model';
import { handleError } from '@/shared/utils/handleError';
import { OrderModel } from '@/shared/database/model/orders.model';
import { Model, Document, Types } from "mongoose";


type product = {
    id: string;
    name: string;
    category: string;
    description: string;
    extendedDescription: string;
    subCategory: string;
    color: string;
    condition: string;
    minimumOrder: number;
    stock: number;
    price: number;
    images: [string];

}

type OrderItem = {
  product: Types.ObjectId | string;
  quantity: number;
};

type Order = {
  items: OrderItem[];
  createdAt: Date | string;
};

type MonthlySalesData = {
  month: string;
  total: number;
};

type OrderStats = {
  totalOrders: number;
  totalQuantity: number;
  salesPerMonth: MonthlySalesData[];
};

const calculateOrderStats = async (productId: string, year: number = new Date().getFullYear()): Promise<OrderStats> => {
  const orders = await OrderModel.find({ 'items.product': new Types.ObjectId(productId) }) as Order[];

  let totalOrders = 0;
  let totalQuantity = 0;
  const salesPerMonthMap: Record<string, number> = {};

  // Populate sales data dynamically from orders
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const orderMonth = orderDate.getMonth(); // 0-based (6 = July, 7 = August)
    const orderYear = orderDate.getFullYear();


    // Only process orders from the specified year
    if (orderYear === year) {
      const monthKey = `${orderYear}-${String(orderMonth + 1).padStart(2, '0')}`; // YYYY-MM (1-based)
      order.items.forEach((item: OrderItem) => {
        if (item.product instanceof Types.ObjectId ? item.product.equals(new Types.ObjectId(productId)) : item.product === productId) {
          totalOrders += 1; // Increment per order containing the product
          totalQuantity += item.quantity;
          salesPerMonthMap[monthKey] = (salesPerMonthMap[monthKey] || 0) + item.quantity;
        }
      });
    }
  });

  // Format sales per month
  const salesPerMonth = Object.entries(salesPerMonthMap)
    .map(([month, total]) => ({
      month: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total,
    }))
    .sort((a, b) => new Date(`${a.month} 1, 2025`).getTime() - new Date(`${b.month} 1, 2025`).getTime()); // Sort by month

  return {
    totalOrders,
    totalQuantity,
    salesPerMonth,
  };
};



export const productresolver = {
    Query: {
    allProducts: async (_: any, { limit, offset }: { limit: number; offset: number }) => {
      try {
        if (typeof limit !== "number" || typeof offset !== "number") {
          throw new Error("Invalid limit or offset provided");
        }

        const products = await productModel
          .find()
          .populate("seller")
          .sort({ createdAt: -1 })
          .limit(limit > 0 ? limit : 12) 
          .skip(offset);

        const enhancedProducts = await Promise.all(
          products.map(async (p) => {
            const obj = p.toObject();
            const orderStats = await calculateOrderStats(p._id.toString());
            return {
              ...obj,
              id: obj._id.toString(),
              orderStats,
            };
          })
        );

        return enhancedProducts;
      } catch (error: any) {
        console.error("Error in allProducts resolver:", error);
        handleError(error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    },


     allCategories: async () => {
            try {
              const categories = await productModel.distinct("category");
              return categories.map((cat: string) => ({
                name: cat,
                slug: slugify(cat, { lower: true, strict: true })
              }));
            } catch (error) {
              handleError(error);
            }
      },
          
    myProducts: async (_parent: any, args: { limit?: number; offset?: number }, context: any) => {
     try {
        const { vendor } = context;
        if (!vendor) {
          throw new Error("Unauthorized: Only vendors can view their products.");
        }

    const { limit = 10, offset = 0 } = args;

    const myproducts = await productModel
      .find({ seller: vendor.id })
      .skip(offset)
      .limit(limit)
      .populate("seller");

    return myproducts.map((p) => {
      const obj = p.toObject();
      obj.id = p._id.toString();

      if (obj.seller && obj.seller._id) {
        obj.seller.id = obj.seller._id.toString();
      } else {
        obj.seller = null;
      }

      return obj;
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
},
    
      product: async (_: any, { id }: { id: string }) => {
                try {
                    const product = await productModel.findById(id).populate("seller");
                    if (!product) throw new Error("Product not found");

                    const orderStats = await calculateOrderStats(id);
                    
                    return {
                        ...product.toObject(),
                        id: product._id.toString(),
                        orderStats
                    };
                } catch (error) {
                    handleError(error);
                    throw error;
                }
            },

      productBySlug: async (_: any, { slug }: { slug: string }) => {
                try {
                    const product = await productModel.findOne({ slug }).populate("seller");
                    if (!product) throw new Error("Product not found");

                    const orderStats = await calculateOrderStats(product._id.toString());
                    
                    return {
                        ...product.toObject(),
                        id: product._id.toString(),
                        orderStats
                    };
                } catch (error) {
                    handleError(error);
                    throw error;
                }
            },

      productsByCategory: async (_: any, { category }: { category: string }) => {
        const products = await productModel.find({
          categorySlug: category, 
        }).populate("seller");
      
        return products;
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
          
              if (!vendor) {
                throw new Error("Unauthorized: Only vendors can create products.");
              }
          
              // Extract fields from args
              const {
                name,
                category,
                description,
                extendedDescription,
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

              const categorySlug = category
                    .replace(/&/g, "and")
                    .replace(/\s+/g, '-')
                    .toLowerCase();
          
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
                categorySlug,
                description,
                extendedDescription,
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
            const  {id, name, category, description, extendedDescription, subCategory, color, condition, minimumOrder, price, images, stock} = arg
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
                extendedDescription,
                subCategory,
                color,
                condition,
                minimumOrder,
                price,
                images,
                stock
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

            if (typeof parent.seller === "object" && parent.seller._id) {
                return {
                    ...parent.seller,
                    id: parent.seller._id.toString(),
                };
            }

            const seller = await vendorModel.findById(parent.seller);
            if (!seller) return null;
            
            return {
                ...seller.toObject(),
                id: seller._id.toString(),
            };
        },
        orderStats: async (parent: any) => {
            if (!parent._id) return null;

            const orderStats = await calculateOrderStats(parent._id.toString());
            return orderStats;
          },
        },
  
}