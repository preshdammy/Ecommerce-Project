"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import fallbackUser from "@/public/figma images/Group 86.png";
import noChatImage from "@/public/figma images/Group 88 (1).png";

const GET_USERS = gql`
  query {
    users {
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

interface User {
  id: string;
  name: string;
  profilePicture?: string;
}

const UserMessages = () => {
  const currentUserId = "user-123"; // TODO: Replace with real ID from token/context
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: usersData } = useQuery(GET_USERS);

  // Only fetch messages when a chat is selected
  const { data: messagesData } = useQuery(MESSAGES_BETWEEN, {
    variables: selectedUser
      ? {
          senderId: currentUserId,
          receiverId: selectedUser.id,
        }
      : undefined,
    skip: !selectedUser,
    pollInterval: 3000, // ✅ fetch every 3 seconds
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (messagesData?.messagesBetween) {
      setMessages(messagesData.messagesBetween);
    }
  }, [messagesData]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const { data } = await sendMessage({
      variables: {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: newMessage,
      },
    });

    setMessages((prev) => [...prev, data.sendMessage]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col px-4 py-6">
      <Link href="/AccountSettings/user" className="text-blue-600 mb-4 flex items-center gap-2">
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="flex gap-4 h-[500px]">
        {/* Sidebar */}
        <div className="w-[30%] border rounded-lg overflow-y-auto">
          <h2 className="bg-blue-600 text-white p-3 text-sm font-semibold">All Users</h2>
          {usersData?.users.map((user: any) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-3 p-3 border-b hover:bg-blue-50 cursor-pointer ${
                selectedUser?.id === user.id ? "bg-blue-100" : ""
              }`}
            >
              <Image
                src={user.profilePicture || fallbackUser}
                alt="avatar"
                width={30}
                height={30}
              />
              <div className="text-sm">{user.name}</div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="flex-1 border rounded-lg flex flex-col justify-between p-4 bg-[#f5faff]">
          {selectedUser ? (
            <>
              <h3 className="text-blue-600 font-medium mb-2">{selectedUser.name}</h3>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] px-4 py-2 text-sm rounded-xl ${
                      msg.senderId === currentUserId
                        ? "bg-blue-600 text-white self-end"
                        : "bg-white text-black self-start"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-60 text-right">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 border rounded-full text-sm"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Image src={noChatImage} alt="no chat" width={120} />
              <p className="text-gray-500 text-sm mt-2">Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
