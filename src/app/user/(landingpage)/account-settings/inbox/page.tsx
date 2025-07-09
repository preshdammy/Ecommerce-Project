"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import msg from "../../../../../../public/figma images/Group 88 (1).png";
import hamburger from "../../../../../../public/figma images/menu-01.png";
import msgprofile from "../../../../../../public/figma images/Group 86.png";
import hamburger2 from "../../../../../../public/figma images/Icon (3).png";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";

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

interface Chat {
  id: string;
  name: string;
  profilePicture?: string;
}

const Messages = () => {
  const currentVendorId = "vendor-123"; // 🔁 Replace with real vendor ID from context
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const { data: vendorsData } = useQuery(GET_VENDORS);

  const {
    data: messagesData,
    refetch,
  } = useQuery(MESSAGES_BETWEEN, {
    variables: selectedChat
      ? { senderId: currentVendorId, receiverId: selectedChat.id }
      : undefined,
    skip: !selectedChat,
    pollInterval: 3000, // 🔁 Poll every 3 seconds
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
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <Link href="/AccountSettings/vendor" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-medium">Back</span>
        </Link>
      </div>

      <div className="flex justify-between items-center px-4 py-4 mb-16">
        {/* Sidebar */}
        <div className="w-[30%] border rounded-lg h-[434px] overflow-y-auto">
          <div className="bg-[#007bff] p-3 text-white font-semibold text-sm flex justify-between items-center">
            <span>My Messages</span>
            <Image className="hidden sm:block" src={hamburger} alt="menu" />
            <Image className="block sm:hidden" src={hamburger2} alt="menu2" />
          </div>

          {vendorsData?.vendors.map((vendor: any) => (
            <button
              key={vendor.id}
              className={`w-full text-left p-3 border-b hover:bg-blue-50 ${
                selectedChat?.id === vendor.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleSelectChat(vendor)}
            >
              <div className="flex gap-3 items-center">
                <Image
                  src={vendor.profilePicture || msgprofile}
                  alt="profile"
                  width={30}
                  height={30}
                />
                <div className="flex flex-col">
                  <p className="text-xs font-medium">{vendor.name}</p>
                  <p className="text-[10px] text-gray-500">Tap to view conversation</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 ml-4 border rounded-lg h-[434px] bg-[#f5faff] flex flex-col justify-between p-4 overflow-hidden">
          {selectedChat ? (
            <>
              <h3 className="text-blue-600 font-semibold text-sm mb-2">{selectedChat.name}</h3>
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
                {messages.map((msg) => (
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
                ))}
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Image src={msg} alt="no chat" width={120} />
              <p className="text-gray-500 text-sm mt-2">Select a chat to view conversation</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
