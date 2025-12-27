import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  position?: "top" | "bottom";
}

const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"],
  "Gestures": ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💌", "💋", "🫶"],
  "Objects": ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🔔", "🎵", "🎶", "🎤", "🎧", "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "🎥", "📹", "📺", "📻", "⏰", "⌚", "💡", "🔦", "📚", "📖", "✏️", "📝", "📌", "📍", "🔑", "🔒"],
  "Nature": ["🌸", "🌺", "🌹", "🌷", "🌻", "🌼", "🌿", "🍀", "🌳", "🌴", "🌵", "🌾", "🌱", "🍁", "🍂", "🍃", "🔥", "💧", "🌊", "⭐", "🌟", "✨", "⚡", "☀️", "🌙", "🌈", "☁️", "🌤️", "⛅", "🌥️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "🌪️"],
  "Food": ["🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇", "🥞", "🧈", "🍞", "🥐", "🥖", "🥨", "🧀", "🥗", "🥙", "🥪", "🌮", "🌯", "🫔", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "☕", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾"],
};

const EmojiPicker = ({ isOpen, onClose, onEmojiSelect, position = "top" }: EmojiPickerProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) {
      return emojiCategories;
    }
    
    const allEmojis = Object.values(emojiCategories).flat();
    const filtered = allEmojis.filter(() => true); // Emojis don't have text names here, just show all
    return { "Search Results": filtered };
  }, [search]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 10 : -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`absolute ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"} right-0 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden`}
          >
            <div className="p-3 border-b border-border flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emojis..."
                className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 px-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!search && (
              <div className="flex gap-1 p-2 border-b border-border overflow-x-auto scrollbar-thin">
                {Object.keys(emojiCategories).map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs h-7 px-2 whitespace-nowrap"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            <ScrollArea className="h-64 p-2">
              {Object.entries(search ? filteredEmojis : { [activeCategory]: emojiCategories[activeCategory as keyof typeof emojiCategories] }).map(([category, emojis]) => (
                <div key={category}>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1 sticky top-0 bg-card">
                    {category}
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji, index) => (
                      <motion.button
                        key={`${emoji}-${index}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-xl p-1.5 rounded hover:bg-secondary transition-colors"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmojiPicker;
