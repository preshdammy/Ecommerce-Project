import {reviewModel} from '@/shared/database/model/reviews.model';
import {productModel} from '@/shared/database/model/product.model';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { handleError } from '@/shared/utils/handleError';

export const reviewresolver = {
  Query: {
    productReviews: async (_: any, { productId }: { productId: string }) => {
      try {
        const reviews = await reviewModel.find({ product: productId })
          .populate('user')
          .populate('product')
          .sort({ createdAt: -1 }); 
        return reviews;
      } catch (error) {
        handleError(error);
      }
    }
  },

  Mutation: {
    createReview: async (_: any, { input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to leave a review');
      }

      const { productId, rating, comment } = input;

      if (rating < 1 || rating > 5) {
        throw new UserInputError('Rating must be between 1 and 5');
      }

      try {
        // Ensure product exists
        const product = await productModel.findById(productId);
        if (!product) {
          throw new UserInputError('Product not found');
        }

        // Create review
        const review = await reviewModel.create({
          user: context.user._id,
          product: productId,
          rating,
          comment
        });

        // Add review ID to product
        product.reviews.push(review._id);
        await product.save();

        return await review.populate('user').populate('product');
      } catch (error) {
        handleError(error);
      }
    }
  }
};
