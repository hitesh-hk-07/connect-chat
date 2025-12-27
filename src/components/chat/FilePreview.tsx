import { motion } from "framer-motion";
import { FileText, Download, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  isImage: boolean;
}

interface FilePreviewProps {
  file: FileAttachment;
  onRemove?: () => void;
  isPreview?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FilePreview = ({ file, onRemove, isPreview = false }: FilePreviewProps) => {
  if (file.isImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <img
          src={file.url}
          alt={file.name}
          className={`rounded-lg object-cover ${
            isPreview ? "max-w-[120px] max-h-[80px]" : "max-w-[300px] max-h-[200px]"
          }`}
        />
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {!isPreview && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                <Download className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50"
    >
      <div className="p-2 bg-primary/10 rounded-lg">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      {onRemove ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Download className="h-4 w-4" />
          </Button>
        </a>
      )}
    </motion.div>
  );
};

export default FilePreview;
