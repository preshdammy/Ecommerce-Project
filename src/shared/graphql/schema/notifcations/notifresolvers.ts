import { NotificationModel } from "@/shared/database/model/notifications.model";


type  Notification = {
    recipientId: String
    recipientRole: String
    type: String
    title: String
    message: String
    isRead: Boolean
    createdAt: Date
  }
export const notificationresolver = {
    Query: {
      async myNotifications(_: any, __:any, context: any) {
        let recipientId, recipientRole;
  
        if (context.admin) {
          recipientId = context.admin.id;
          recipientRole = "ADMIN";
        } else if (context.vendor) {
          recipientId = context.vendor.id;
          recipientRole = "VENDOR";
        } else if (context.user) {
          recipientId = context.user.id;
          recipientRole = "USER";
        } else {
          throw new Error("Not authenticated");
        }
    
        return NotificationModel.find({
          recipientId,
          recipientRole
        }).sort({ createdAt: -1 });
      }
    },
  
    Mutation: {
      async createNotification(_: any, { recipientId, recipientRole, type, title, message }: Notification, context: any) {
        if (!context.admin && !context.vendor && !context.user) {
          throw new Error("Not authenticated");
        }
  
        const notification = await NotificationModel.create({
          recipientId,
          recipientRole,
          type,
          title,
          message,
          isRead: false,
          createdAt: new Date()
        });
  
        return notification;
      },
  
      async markNotificationAsRead(_: any, { notificationId }: { notificationId: string }, context: any) {
        let recipientId, recipientRole;
  
        if (context.admin) {
          recipientId = context.admin.id;
          recipientRole = "ADMIN";
        } else if (context.vendor) {
          recipientId = context.vendor.id;
          recipientRole = "VENDOR";
        } else if (context.user) {
          recipientId = context.user.id;
          recipientRole = "USER";
        } else {
          throw new Error("Not authenticated");
        }
  
        const notif = await NotificationModel.findOneAndUpdate(
          {
            _id: notificationId,
            recipientId,
            recipientRole
          },
          { isRead: true },
          { new: true }
        );
  
        if (!notif) throw new Error("Notification not found");
        return notif;
      },
  
      async deleteNotification(_: any, { notificationId }: {notificationId: string}, context: any) {
        let recipientId, recipientRole;
  
        if (context.admin) {
          recipientId = context.admin.id;
          recipientRole = "ADMIN";
        } else if (context.vendor) {
          recipientId = context.vendor.id;
          recipientRole = "VENDOR";
        } else if (context.user) {
          recipientId = context.user.id;
          recipientRole = "USER";
        } else {
          throw new Error("Not authenticated");
        }
  
        const deleted = await NotificationModel.deleteOne({
          _id: notificationId,
          recipientId,
          recipientRole
        });
  
        return deleted.deletedCount === 1;
      }
    }
  };
  