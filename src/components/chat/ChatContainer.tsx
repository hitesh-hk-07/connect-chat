import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  content: string;
  sender: string;
  avatar?: string;
  timestamp: Date;
  isOwn: boolean;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hey everyone! Welcome to the chat 👋",
    sender: "Alex",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: "2",
    content: "Hi Alex! Great to be here. This looks amazing!",
    sender: "Jordan",
    timestamp: new Date(Date.now() - 3000000),
    isOwn: false,
  },
  {
    id: "3",
    content: "Thanks! I've been working on this realtime chat app",
    sender: "Alex",
    timestamp: new Date(Date.now() - 2400000),
    isOwn: false,
  },
  {
    id: "4",
    content: "The design is really sleek! Love the dark theme 🌙",
    sender: "You",
    timestamp: new Date(Date.now() - 1800000),
    isOwn: true,
  },
];

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "You",
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate a reply after a short delay
    setTimeout(() => {
      const replies = [
        "That's interesting! Tell me more 🤔",
        "I totally agree with you!",
        "Great point! 👍",
        "Thanks for sharing that!",
        "Awesome! Keep going 🚀",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomReply,
        sender: "Alex",
        timestamp: new Date(),
        isOwn: false,
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen max-h-screen bg-background"
      style={{
        background: "linear-gradient(135deg, hsl(225 25% 8%) 0%, hsl(230 30% 12%) 100%)",
      }}
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </motion.div>
  );
};

export default ChatContainer;
