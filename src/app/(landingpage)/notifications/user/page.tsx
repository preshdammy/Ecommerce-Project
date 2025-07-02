"use client";
import React from "react";
import { useQuery, gql } from "@apollo/client";

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


type NotificationType = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};


const UserNotifications = () => {
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS);

  if (loading) {
    return <p className="p-4">Loading notifications...</p>;
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error loading notifications: {error.message}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto min-h-screen ml-20">
        <div className="pt-30 h-auto">
          <h2 className="text-xl font-semibold font-Merriweather text-[#55A7FF] text-[40px] mb-6">
            My Notifications (User)
          </h2>

          <div className="space-y-4">
            {data.getNotifications.map((notif: NotificationType) => (
              <div
                key={notif.id}
                className="w-[816px] min-h-[100px] flex items-start justify-between px-4 py-3 rounded-[16px] border bg-[#F5FAFF] border-[#CCE5FF]"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="bg-gray-300 w-[60px] h-[60px] rounded-full"
                    src="/figma images/Frame 188.png"
                    alt="Notification"
                  />
                  <div>
                    <p className="text-[#007BFF] text-[16px] font-medium">
                      {notif.message}
                    </p>
                    <p className="text-[#939090] text-[16px] mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-[14px] text-[#939090] mt-4">
                  {notif.read ? "Read" : "Unread"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
