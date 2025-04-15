
import { useRef, useState } from "react";
import { Button } from "./button";
import { Upload, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
}

export function FileUpload({
  onFileSelected,
  maxSizeMB = 1,
  allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"],
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setSuccess(false);

    if (!file) return;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`File type not supported. Please upload ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setSuccess(true);
    onFileSelected(file);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(",")}
        className="hidden"
      />
      <Button 
        type="button" 
        onClick={handleClick} 
        variant="outline"
        className={cn(
          "w-full border-dashed",
          error ? "border-destructive" : success ? "border-green-500" : ""
        )}
      >
        {success ? (
          <Check className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Upload
      </Button>
      
      {error && (
        <div className="flex items-center text-destructive text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {success && (
        <p className="text-green-500 text-sm mt-1">File uploaded successfully</p>
      )}
    </div>
  );
}
