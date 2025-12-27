import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageStatus, { MessageStatusType } from "./MessageStatus";
import FilePreview, { FileAttachment } from "./FilePreview";

interface Message {
  id: string;
  content: string;
  sender: string;
  avatar?: string;
  timestamp: Date;
  isOwn: boolean;
  status?: MessageStatusType;
  attachments?: FileAttachment[];
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar className="h-9 w-9 ring-2 ring-border/50 flex-shrink-0">
        <AvatarImage src={message.avatar} alt={message.sender} />
        <AvatarFallback className="bg-secondary text-xs font-medium">
          {message.sender.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[70%] ${message.isOwn ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {message.sender}
          </span>
          <span className="text-[10px] text-muted-foreground/60 flex items-center">
            {formatTime(message.timestamp)}
            {message.isOwn && message.status && (
              <MessageStatus status={message.status} />
            )}
          </span>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map(file => (
              <FilePreview key={file.id} file={file} />
            ))}
          </div>
        )}

        {message.content && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`px-4 py-2.5 rounded-2xl ${
              message.isOwn
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-secondary-foreground rounded-bl-md"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
