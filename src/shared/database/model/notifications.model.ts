import mongoose, { Schema, Document, models, model } from "mongoose";

export type NotificationRole = "USER" | "VENDOR" | "ADMIN";
export type NotificationType = "ORDER" | "MESSAGE" | "SYSTEM" | "GENERAL" | "COMPLAINT";

export interface INotification extends Document {
  recipientId: string;
  recipientRole: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: String,
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["USER", "VENDOR", "ADMIN"],
      required: true,
    },
    type: {
      type: String,
      enum: ["ORDER", "MESSAGE", "SYSTEM", "GENERAL", 'COMPLAINT'],
      default: "GENERAL",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We already store createdAt manually
  }
);

// Avoid recompiling model during hot reload
export const NotificationModel = models.Notification || model<INotification>("Notification", notificationSchema);
