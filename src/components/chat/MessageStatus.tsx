import { Check, CheckCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export type MessageStatusType = "sending" | "sent" | "delivered" | "read";

interface MessageStatusProps {
  status: MessageStatusType;
}

const MessageStatus = ({ status }: MessageStatusProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground/60" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground/80" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground/80" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center ml-1"
    >
      {getStatusIcon()}
    </motion.span>
  );
};

export default MessageStatus;
