import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import MessageStatus, { MessageStatusType } from "./MessageStatus";
import FilePreview, { FileAttachment } from "./FilePreview";
import MessageActions from "./MessageActions";
import MessageReactions from "./MessageReactions";
import { Reaction } from "@/hooks/useSocket";

interface Message {
  id: string;
  content: string;
  sender: string;
  avatar?: string;
  timestamp: Date;
  isOwn: boolean;
  status?: MessageStatusType;
  attachments?: FileAttachment[];
  reactions?: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
}

interface ChatMessageProps {
  message: Message;
  index: number;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

const ChatMessage = ({ message, index, onEdit, onDelete, onReaction }: ChatMessageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
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
      className={`flex gap-3 relative group ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
            {formatTime(message.timestamp)}
            {message.isEdited && !message.isDeleted && (
              <span className="text-muted-foreground/40">(edited)</span>
            )}
            {message.isOwn && message.status && (
              <MessageStatus status={message.status} />
            )}
          </span>
        </div>

        {message.attachments && message.attachments.length > 0 && !message.isDeleted && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map(file => (
              <FilePreview key={file.id} file={file} />
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 h-9"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <>
            {message.content && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`px-4 py-2.5 rounded-2xl ${
                  message.isDeleted
                    ? "bg-muted/50 text-muted-foreground italic"
                    : message.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </motion.div>
            )}

            {message.reactions && message.reactions.length > 0 && (
              <MessageReactions reactions={message.reactions} onReactionClick={handleReaction} />
            )}
          </>
        )}
      </div>

      {/* Message actions on hover */}
      {!message.isDeleted && !isEditing && (
        <AnimatePresence>
          {isHovered && (
            <div className={`absolute top-0 ${message.isOwn ? "left-0" : "right-0"} -translate-y-1/2`}>
              <MessageActions
                isOwn={message.isOwn}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReaction={handleReaction}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ChatMessage;
