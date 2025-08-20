"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import fallbackUser from "../../../../../../public/figma images/Group 86.png";
import noChatImage from "../../../../../../public/figma images/Group 88 (1).png";
import hamburger from "../../../../../../public/figma images/menu-01.png";
import hamburger2 from "../../../../../../public/figma images/Icon (3).png";

const GET_VENDORS = gql`
  query {
    vendors {
      id
      name
      profilePicture
    }
  }
`;

const MESSAGES_BETWEEN = gql`
  query MessagesBetween($senderId: ID!, $receiverId: ID!) {
    messagesBetween(senderId: $senderId, receiverId: $receiverId) {
      id
      content
      senderId
      receiverId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $content: String!) {
    sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content) {
      id
      senderId
      receiverId
      content
      createdAt
    }
  }
`;

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface Vendor {
  id: string;
  name: string;
  profilePicture?: string;
}

interface Chat {
  id: string;
  name: string;
  profilePicture?: string;
}

const VendorMessages = () => {
  const currentVendorId = "vendor-123"; // Replace with real vendor ID from context
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: vendorsData } = useQuery(GET_VENDORS);

  const {
    data: messagesData,
    refetch,
  } = useQuery(MESSAGES_BETWEEN, {
    variables: selectedChat
      ? { senderId: currentVendorId, receiverId: selectedChat.id }
      : undefined,
    skip: !selectedChat,
    pollInterval: 3000, 
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (messagesData?.messagesBetween) {
      setMessages(messagesData.messagesBetween);
    }
  }, [messagesData]);

  const handleSelectChat = (vendor: { id: string; name: string; profilePicture?: string }) => {
    setSelectedChat({
      id: vendor.id,
      name: vendor.name,
      profilePicture: vendor.profilePicture,
    });
    setShowSidebar(false);
  };

  const handleBackToSidebar = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const { data } = await sendMessage({
      variables: {
        senderId: currentVendorId,
        receiverId: selectedChat.id,
        content: newMessage,
      },
    });

    setMessages((prev) => [...prev, data.sendMessage]);
    setNewMessage("");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-6 h-auto">
        {showSidebar ? (
          <div className="w-full rounded-lg border border-blue-400 h-[500px] overflow-y-auto">
            <div className="bg-[#007bff] p-3 text-white font-semibold text-sm flex justify-between items-center sticky top-0 z-10">
              <span>My Messages</span>
              <div className="flex items-center">
                <Image className="hidden sm:block" src={hamburger} alt="menu" width={20} height={20} />
                <Image className="block sm:hidden" src={hamburger2} alt="menu2" width={20} height={20} />
              </div>
            </div>

            {vendorsData?.vendors.length > 0 ? (
              vendorsData.vendors.map((vendor: any) => (
                <button
                  key={vendor.id}
                  className={`w-full text-left p-3 border-b border-blue-400 hover:bg-blue-50 ${
                    selectedChat?.id === vendor.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleSelectChat(vendor)}
                >
                  <div className="flex gap-3 items-center">
                    <Image
                      src={vendor.profilePicture || fallbackUser}
                      alt="profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{vendor.name}</p>
                      <p className="text-xs text-gray-500">Tap to view conversation</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                You have no messages yet.
                <Image src={noChatImage} alt="No chats" width={200} height={200} className="mx-auto mt-4" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full shadow rounded-lg h-[500px] bg-[#f5faff] flex flex-col justify-between p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToSidebar}
                  className="md:hidden text-blue-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-blue-600 font-semibold text-sm">{selectedChat?.name}</h3>
              </div>
              <button
                onClick={handleBackToSidebar}
                className="hidden md:block text-blue-600 font-medium text-sm hover:underline"
              >
                Back to messages
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] px-4 py-2 text-sm rounded-xl ${
                      msg.senderId === currentVendorId
                        ? "bg-blue-600 text-white self-end"
                        : "bg-white text-black self-start"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] text-right opacity-60">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No messages yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-full border text-sm"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex justify-center mt-6 pb-4">
        <Link 
          href="/vendor/account-settings" 
          className="flex gap-2 px-4 py-2 items-center bg-gray-100 text-gray-700 rounded-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </Link>
      </div>
    </>
  );
};

export default VendorMessages;