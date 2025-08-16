import axios from "axios";
import { usermodel } from "@/shared/database/model/user.model";
import { walletmodel } from "@/shared/database/model/wallet.model";
import { Types } from "mongoose";

type Ctx = {
  user?: {
    id: string;
    email?: string;
  };
};

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const walletResolvers = {
  Query: {
    async getWalletBalance(_: unknown, __: unknown, context: Ctx) {
      if (!context.user) throw new Error("Unauthorized");

      const user = await usermodel.findById(context.user.id).select("walletBalance createdAt updatedAt");
      if (!user) throw new Error("User not found");

      return {
        id: user._id.toString(),
        userId: user._id.toString(),
        balance: user.walletBalance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
    myWalletTransactions: async (_: any, __: any, context: any) => {
      const user = context.user;
      const transactions = await walletmodel.find({ user: user.id }).sort({ createdAt: -1 });
      return transactions;
    },
  },

  Mutation: {
    // INITIATE PAYSTACK PAYMENT
    async initializeWalletFunding(_: unknown, { amount }: { amount: number }, context: Ctx) {
      if (!context.user) throw new Error("Unauthorized");
      if (amount <= 0) throw new Error("Invalid amount");

      const user = await usermodel.findById(context.user.id).select("email");
      if (!user) throw new Error("User not found");

      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: user.email,
          amount: Math.floor(amount * 100), // convert to kobo
          callback_url: "http://localhost:3000/user/my-payments/success", 
          metadata: {
            userId: context.user.id,
            purpose: "Wallet Funding",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    },

    // VERIFY TRANSACTION
    async verifyWalletFunding(_: unknown, { reference }: { reference: string }, context: Ctx) {
      if (!context.user) throw new Error("Unauthorized");

      const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      const data = response.data.data;

      if (data.status !== "success") {
        throw new Error("Transaction verification failed");
      }

      const amountFunded = data.amount / 100;

      const user = await usermodel.findById(context.user.id);
      if (!user) throw new Error("User not found");

      user.walletBalance += amountFunded;
      await user.save();

      await walletmodel.create({
        user: new Types.ObjectId(context.user.id),
        type: "CREDIT",
        amount: amountFunded,
        description: "Paystack wallet funding",
        status: "SUCCESS",
        reference,
      });

      return {
        id: user._id.toString(),
        userId: user._id.toString(),
        balance: user.walletBalance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    // WITHDRAW FUNDS
    async withdrawFunds(_: unknown, { amount }: { amount: number }, context: Ctx) {
      if (!context.user) throw new Error("Unauthorized");
      if (amount <= 0) throw new Error("Amount must be greater than zero");

      const user = await usermodel.findById(context.user.id);
      if (!user) throw new Error("User not found");

      if (user.walletBalance < amount) {
        throw new Error("Insufficient balance");
      }

      user.walletBalance -= amount;
      await user.save();

      await walletmodel.create({
        user: new Types.ObjectId(context.user.id),
        type: "DEBIT",
        amount,
        description: "Wallet withdrawal",
        status: "SUCCESS",
      });

      return {
        id: user._id.toString(),
        userId: user._id.toString(),
        balance: user.walletBalance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
  },
};
