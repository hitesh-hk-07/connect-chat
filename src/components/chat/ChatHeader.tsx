import { motion } from "framer-motion";
import { Hash, Phone, Video, MoreVertical, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  roomName?: string;
  isDm?: boolean;
}

const ChatHeader = ({ roomName = "General", isDm = false }: ChatHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border/50 glass"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isDm ? (
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Hash className="w-5 h-5 text-muted-foreground" />
          )}
          <h1 className="font-semibold text-foreground">{roomName}</h1>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full lg:hidden"
        >
          <Users className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
