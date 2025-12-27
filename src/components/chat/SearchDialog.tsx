import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Hash, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResult {
  id: string;
  content: string;
  sender: string;
  roomId: string;
  roomName: string;
  timestamp: Date;
  isDm: boolean;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: SearchResult[];
  onSelectMessage: (roomId: string) => void;
}

const SearchDialog = ({ open, onOpenChange, messages, onSelectMessage }: SearchDialogProps) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.content.toLowerCase().includes(lowerQuery) ||
        msg.sender.toLowerCase().includes(lowerQuery)
    ).slice(0, 20);
  }, [query, messages]);

  const handleSelect = (roomId: string) => {
    onSelectMessage(roomId);
    onOpenChange(false);
    setQuery("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Messages
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, users..."
            className="pl-10 pr-10 bg-secondary/50 border-border/50"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px] -mx-6 px-6">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => handleSelect(result.roomId)}
                    className="w-full p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {result.isDm ? (
                          <MessageCircle className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Hash className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">{result.roomName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(result.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium mb-0.5">{result.sender}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {highlightMatch(result.content)}
                    </p>
                  </motion.button>
                ))}
              </div>
            ) : query ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Search className="h-12 w-12 mb-3 opacity-30" />
                <p>No messages found</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Search className="h-12 w-12 mb-3 opacity-30" />
                <p>Type to search messages</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
