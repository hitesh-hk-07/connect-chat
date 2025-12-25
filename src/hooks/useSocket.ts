import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
}

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface TypingUser {
  id: string;
  username: string;
  roomId: string;
}

// Mock Socket implementation - replace with real Socket.IO connection
// To use real Socket.IO: npm install socket.io-client
// Then: import { io } from "socket.io-client";
// const socket = io("YOUR_SERVER_URL");

export const useSocket = (userId: string, username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: "1", username: "Alex", isOnline: true },
    { id: "2", username: "Jordan", isOnline: true },
    { id: "3", username: "Sam", isOnline: false },
    { id: "4", username: "Taylor", isOnline: true },
  ]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [isConnected, setIsConnected] = useState(true);

  // Mock initial messages per room
  const [roomMessages] = useState<Record<string, Message[]>>({
    general: [
      { id: "1", content: "Welcome to the general chat! 👋", sender: "Alex", senderId: "1", roomId: "general", timestamp: new Date(Date.now() - 3600000) },
      { id: "2", content: "Hey everyone! How's it going?", sender: "Jordan", senderId: "2", roomId: "general", timestamp: new Date(Date.now() - 1800000) },
    ],
    random: [
      { id: "3", content: "Random thoughts here 🎲", sender: "Sam", senderId: "3", roomId: "random", timestamp: new Date(Date.now() - 7200000) },
    ],
    tech: [
      { id: "4", content: "Anyone working on cool projects?", sender: "Taylor", senderId: "4", roomId: "tech", timestamp: new Date(Date.now() - 5400000) },
    ],
  });

  useEffect(() => {
    setMessages(roomMessages[currentRoom] || []);
  }, [currentRoom, roomMessages]);

  const sendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: username,
      senderId: userId,
      roomId: currentRoom,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate reply
    setTimeout(() => {
      const replies = ["That's cool!", "Interesting 🤔", "Nice! 👍", "Tell me more!"];
      const randomUser = users.filter(u => u.id !== userId && u.isOnline)[0];
      if (randomUser) {
        setMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          content: replies[Math.floor(Math.random() * replies.length)],
          sender: randomUser.username,
          senderId: randomUser.id,
          roomId: currentRoom,
          timestamp: new Date(),
        }]);
      }
    }, 1500 + Math.random() * 2000);
  }, [userId, username, currentRoom, users]);

  const joinRoom = useCallback((roomId: string) => {
    setCurrentRoom(roomId);
  }, []);

  const startTyping = useCallback(() => {
    // In real implementation, emit typing event to server
  }, []);

  const stopTyping = useCallback(() => {
    // In real implementation, emit stop typing event to server
  }, []);

  // Simulate random typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const onlineUsers = users.filter(u => u.id !== userId && u.isOnline);
      if (onlineUsers.length > 0 && Math.random() > 0.7) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        setTypingUsers([{ id: randomUser.id, username: randomUser.username, roomId: currentRoom }]);
        setTimeout(() => setTypingUsers([]), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [users, userId, currentRoom]);

  return {
    messages,
    users,
    typingUsers: typingUsers.filter(t => t.roomId === currentRoom),
    currentRoom,
    isConnected,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping,
  };
};
