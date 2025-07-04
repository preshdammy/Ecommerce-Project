import { reviewModel } from '@/shared/database/model/reviews.model';
import { productModel } from '@/shared/database/model/product.model';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { handleError } from '@/shared/utils/handleError';
import mongoose from 'mongoose';




export const reviewresolver = {
  Query: {
    productReviews: async (_: any, { productId }: { productId: string }) => {
      try {
        const reviews = await reviewModel
          .find({ product: productId })
          .populate('user')
          .populate('product')
          .sort({ createdAt: -1 });
        return reviews;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    createReview: async (_: any, { productId, rating, comment }: { productId: string; rating: number; comment: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to leave a review');
      }

      

      if (rating < 1 || rating > 5) {
        throw new UserInputError('Rating must be between 1 and 5');
      }

      try {
        // Ensure product exists
        const product = await productModel.findById(productId);
        if (!product) {
          throw new UserInputError('Product not found');
        }
        console.log("Context user:", context.user);

        // Create review
        const review = await reviewModel.create({
          user: context.user.id,
          username: context.user.username,
          product: productId,
          rating,
          comment,
        });

        // Add review ID to product
        product.reviews.push(review._id);

        // 🔥 Aggregate to get the new average rating and total reviews
        const aggregation = await reviewModel.aggregate([
          { $match: { product: new mongoose.Types.ObjectId(productId) } },
          {
            $group: {
              _id: '$product',
              averageRating: { $avg: '$rating' },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        const { averageRating = 0, totalReviews = 0 } = aggregation[0] || {};

        // Update product fields
        product.averageRating = averageRating;
        product.totalReviews = totalReviews;

        await product.save();

        return await review.populate(['user', 'product']);

      } catch (error) {
        handleError(error);
      }
    },
  },
};
