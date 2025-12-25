import { motion } from "framer-motion";
import { Phone, Video, MoreVertical, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border/50 glass"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-11 w-11 ring-2 ring-primary/30">
            <AvatarImage src="" alt="Chat Room" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>

        <div>
          <h1 className="font-semibold text-foreground">General Chat</h1>
          <p className="text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5" />
            3 members online
          </p>
        </div>
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
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
