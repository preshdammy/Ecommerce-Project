"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { toast } from "react-toastify";

type NotificationType = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      id
      message
      createdAt
      read
    }
  }
`;

const NotificationsContext = createContext<{ notifications: NotificationType[] }>({
  notifications: [],
});

export const useNotifications = () => useContext(NotificationsContext);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery<{ getNotifications: NotificationType[] }>(
    GET_NOTIFICATIONS,
    {
      pollInterval: 15000, // poll every 15 sec
    }
  );

  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    if (data?.getNotifications) {
      const newNotifs = data.getNotifications.filter((n) => !seenIds.includes(n.id));
      newNotifs.forEach((n) => {
        toast.info(n.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });
      setSeenIds((prev) => [...prev, ...newNotifs.map((n) => n.id)]);
    }
  }, [data]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: data?.getNotifications || [],
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
