"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { usePathname } from "next/navigation";

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    myNotifications {
      id
      message
      createdAt
      isRead
    }
  }
`;

const GET_VENDOR_NOTIFICATIONS = gql`
  query GetVendorNotifications {
    myNotifications {
      id
      message
      createdAt
      isRead
    }
  }
`;

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

type NotificationType = {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

type NotificationsContextType = {
  userNotifications: NotificationType[];
  vendorNotifications: NotificationType[];
  loading: boolean;
  error: any;
  userUnreadCount: number;
  vendorUnreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  userNotifications: [],
  vendorNotifications: [],
  loading: true,
  error: null,
  userUnreadCount: 0,
  vendorUnreadCount: 0,
  markAsRead: async () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { data: userData, loading: userLoading, error: userError } = useQuery<{ myNotifications: NotificationType[] }>(
    GET_NOTIFICATIONS,
    {
      pollInterval: 15000,
      skip: !usePathname().startsWith("/user"), // Skip if not on user path
    }
  );
  const { data: vendorData, loading: vendorLoading, error: vendorError } = useQuery<{ myNotifications: NotificationType[] }>(
    GET_VENDOR_NOTIFICATIONS,
    {
      pollInterval: 15000,
      skip: !usePathname().startsWith("/vendor"), // Skip if not on vendor path
    }
  );
  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });
  const pathname = usePathname();

  // Combine loading and error states
  const loading = userLoading || vendorLoading;
  const error = userError || vendorError;

  // Calculate unread counts based on pathname
  const userUnreadCount = pathname.startsWith("/user") && userData?.myNotifications
    ? userData.myNotifications.filter((n) => !n.isRead).length
    : 0;
  const vendorUnreadCount = pathname.startsWith("/vendor") && vendorData?.myNotifications
    ? vendorData.myNotifications.filter((n) => !n.isRead).length
    : 0;

  const markAsRead = async (notificationId: string) => {
    await markAsReadMutation({ variables: { notificationId } });
  };

  return (
    <NotificationsContext.Provider
      value={{
        userNotifications: userData?.myNotifications || [],
        vendorNotifications: vendorData?.myNotifications || [],
        loading,
        error,
        userUnreadCount,
        vendorUnreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}