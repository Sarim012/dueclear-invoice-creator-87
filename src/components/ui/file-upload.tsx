
import { useRef, useState } from "react";
import { Button } from "./button";
import { Upload, Check, AlertCircle, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
  showFormatInfo?: boolean;
  buttonVariant?: "default" | "outline" | "secondary" | "custom" | "black";
  buttonText?: string;
}

export function FileUpload({
  onFileSelected,
  maxSizeMB = 1,
  allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"],
  className,
  showFormatInfo = true,
  buttonVariant = "outline",
  buttonText = "Upload",
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

  const getButtonClassName = () => {
    if (buttonVariant === "custom") {
      return "w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2.5 rounded-md";
    }
    if (buttonVariant === "black") {
      return "w-full bg-black text-white hover:bg-gray-800 font-medium py-2.5 rounded-md";
    }
    return cn(
      "w-full",
      buttonVariant === "outline" && "border-dashed",
      error ? "border-destructive" : success ? "border-green-500" : ""
    );
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
        variant={buttonVariant === "black" ? "default" : buttonVariant === "custom" ? "outline" : buttonVariant}
        className={getButtonClassName()}
      >
        {success ? (
          <Check className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {buttonText}
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
      
      {showFormatInfo && (
        <div className="text-center text-gray-500 text-xs mt-4">
          Max upload size: {maxSizeMB} MB
        </div>
      )}
    </div>
  );
}
