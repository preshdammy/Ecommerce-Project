"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { format, isSameDay } from "date-fns";
import Cookies from "js-cookie";
import msgprofile from "../../../../../../public/figma images/Group 86.png";

// --- GraphQL queries/mutations ---

const GET_USER_CHATS = gql`
  query GetUserChats($userId: ID!) {
    userChatList(userId: $userId) {
      chatId
      vendor {
        id
        name
        profilePicture
      }
      latestMessage {
        content
        createdAt
      }
    }
  }
`;


const GET_MESSAGES = gql`
  query Messages($chatId: ID!) {
    messages(chatId: $chatId) {
      id
      content
      senderId
      receiverId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chatId: ID!
    $senderId: ID!
    $receiverId: ID!
    $content: String!
  ) {
    sendMessage(
      chatId: $chatId
      senderId: $senderId
      receiverId: $receiverId
      content: $content
    ) {
      id
      content
      senderId
      receiverId
      createdAt
    }
  }
`;

// --- Types ---

type Vendor = {
  id: string;
  name: string;
  profilePicture?: string;
};

type ChatItem = {
  chatId: string;
  vendor: Vendor;
  latestMessage: {
    content: string;
    createdAt: string;
  };
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
};

// --- Component ---

const UserInbox = () => {
  const userInfo = Cookies.get("userinfo");
  const userId = userInfo ? JSON.parse(userInfo).id : null;

  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [loadChats] = useLazyQuery<{ userChatList: ChatItem[] }>(GET_USER_CHATS, {
    onCompleted: (data) => {
      console.log("Vendor chats loaded:", data.userChatList);
      setChatList(data.userChatList)
    },
    fetchPolicy: "network-only",
  });

  const [loadMessages, { loading, error, data }] = useLazyQuery<{ messages: Message[] }>(GET_MESSAGES, {
    onCompleted: (data) => {
      console.log("Messages fetched:", data.messages);
      setMessages(data.messages);
    },
    fetchPolicy: "network-only",
  });
  
  

  const [sendMessageMutation] = useMutation<{ sendMessage: Message }>(SEND_MESSAGE);

  useEffect(() => {
    if (userId) loadChats({ variables: { userId } });
  }, [userId]);

  useEffect(() => {
    if (!selectedChat) return;
    const interval = setInterval(() => {
      console.log("Polling messages for chat:", selectedChat.chatId);
      loadMessages({ variables: { chatId: selectedChat.chatId } });
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    console.log("Vendor ID from cookie/session:", userId);
  }, [userId]);
  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !userId) return;
    const receiverId = selectedChat.vendor.id;

    try {
      const { data } = await sendMessageMutation({
        variables: {
          chatId: selectedChat.chatId,
          senderId: userId,
          receiverId,
          content: newMessage,
        },
      });

      if (data?.sendMessage) {
        setMessages((prev) => [...prev, data.sendMessage]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="max-w-full w-[100%] mx-auto p-0 sm:p-6 md:p-8 min-h-[80vh] sm:min-h-screen overflow-x-hidden">
      {!selectedChat ? (
        <div className="w-full rounded-lg border border-blue-400 h-[60vh] md:h-[500px] overflow-y-auto mt-6 overflow-x-hidden">
          <div className="bg-blue-600 p-5 text-white font-semibold text-sm sticky top-0">
            My Messages
          </div>
          {chatList.map((chat) => (
            <button
              key={chat.chatId}
              className="w-full text-left p-5 border-b border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setSelectedChat(chat);
                loadMessages({ variables: { chatId: chat.chatId } });
              }}
            >
              <div className="flex gap-3 items-center">
                <Image
                  src={chat.vendor.profilePicture || msgprofile}
                  alt="profile"
                  width={30}
                  height={30}
                />
                <div className="max-w-[150px] sm:max-w-none">
                  <p className="text-xs font-medium truncate">{chat.vendor.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {chat.latestMessage?.content || "No message yet"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full h-[60vh] md:h-[500px] bg-[#f5faff] flex flex-col justify-between mt-6 rounded-lg shadow p-0 sm:p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4 px-2 py-1">
            <h3 className="text-blue-600 font-semibold text-sm">
              Chat with {selectedChat.vendor.name}
            </h3>
            <button
              className="text-blue-600 text-sm"
              onClick={() => {
                setSelectedChat(null);
                setMessages([]);
              }}
            >
              Back
            </button>
          </div>
      
          <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-2">
            {messages.map((msg, index) => {
              const msgDate = new Date(Number(msg.createdAt));
      
              // Check if this is the first message of the day
              const showDate =
                index === 0 ||
                !isSameDay(
                  new Date(Number(messages[index - 1].createdAt)),
                  msgDate
                );
      
              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-500 my-2">
                      {format(msgDate, "EEEE, MMM d yyyy")}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 text-sm rounded-xl ${
                      msg.senderId === userId
                        ? "bg-blue-600 text-white self-end"
                        : "bg-white text-black self-start"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] text-right opacity-60">
                      {format(msgDate, "HH:mm")}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
      
          <div className="flex gap-2 mt-2 px-2 py-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border text-sm"
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
  );
};

export default UserInbox;
