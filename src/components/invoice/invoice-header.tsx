
import { useState } from "react";
import { Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../ui/file-upload";

interface InvoiceHeaderProps {
  logoUrl: string | undefined;
  onLogoChange: (file: File) => void;
}

export function InvoiceHeader({ logoUrl, onLogoChange }: InvoiceHeaderProps) {
  const handleLogoUpload = (file: File) => {
    onLogoChange(file);
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Logo</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center space-y-4">
            {logoUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={logoUrl}
                  alt="Uploaded logo"
                  className="w-24 h-24 object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onLogoChange(null as any)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 w-full">
                <Image className="h-16 w-16 text-gray-400" />
                <div className="text-center space-y-2">
                  <p className="text-base text-gray-500">Upload logo</p>
                  <p className="text-sm text-gray-400">
                    Supported formats: JPG, PNG, SVG
                  </p>
                  <p className="text-sm text-gray-400">
                    Recommended size: 500px × 500px
                  </p>
                  <FileUpload
                    onFileSelected={handleLogoUpload}
                    maxSizeMB={1}
                    allowedTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                    buttonVariant="black"
                    buttonText="Upload"
                    showFormatInfo={false}
                    className="mt-4"
                  />
                  <p className="text-xs text-gray-400 mt-4">
                    Max upload size: 1 MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
