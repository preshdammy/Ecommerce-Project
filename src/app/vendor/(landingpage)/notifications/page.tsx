"use client";
import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNotifications } from "../../../../shared/provider/notificationsProvider"; // Adjust path

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

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

const VendorNotifications = () => {
  const { vendorNotifications, loading, error } = useNotifications();
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  const handleMarkAsRead = (id: string) => {
    markAsRead({ variables: { notificationId: id } });
  };

 if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center font-medium">
        Error loading notifications
      </p>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden ">
  <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto min-h-screen">
    <div className="pt-10">
      <h2 className="font-semibold font-Merriweather text-[#55A7FF] text-2xl sm:text-3xl md:text-4xl lg:text-[40px] mb-6">
        My Notifications (Vendor)
      </h2>

      <div className="space-y-4 pb-10 h-screen overflow-y-scroll">
        {vendorNotifications.length > 0 ? (
          vendorNotifications.map((notif: any) => (
            <div
              key={notif.id}
              className="w-full min-h-[100px] flex items-start justify-between px-4 py-3 rounded-[16px] border bg-[#F5FAFF] border-[#CCE5FF] hover:bg-[#e0f0ff] cursor-pointer"
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
            >
              <div className="flex items-center space-x-4">
                <img
                  className="bg-gray-300 w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full"
                  src="/figma images/Frame 188.png"
                  alt="Notification"
                />
                <div>
                  <p className="text-[#007BFF] text-sm sm:text-base md:text-lg lg:text-[16px] font-medium">
                    {notif.message}
                  </p>
                  <p className="text-[#939090] text-xs sm:text-sm md:text-base lg:text-[16px] mt-2">
                    {new Date(
                      notif.isRead ? notif.createdAt : notif.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-[#939090] text-sm sm:text-base md:text-lg">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default VendorNotifications;