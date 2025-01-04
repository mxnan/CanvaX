import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onImageAdd: (url: string) => void;
}

export const ImageUpload = ({ isOpen, onClose, onImageAdd }: ImageUploadProps) => {
  const { 
    dragActive, 
    handleDrag, 
    handleDrop, 
    handleChange,
    fileInputRef,
    uploadImage,
    isUploading,
    previewUrl
  } = useImageUpload({ onImageAdd, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>
            Upload an image or paste a URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6
              ${dragActive ? 'border-blue-500 bg-blue-50/10' : 'border-neutral-800'}
              transition-colors duration-200 ease-in-out
              flex flex-col items-center justify-center gap-4
              cursor-pointer
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative w-full aspect-video">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-md object-contain w-full h-full"
                />
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-neutral-400" />
                <div className="text-center">
                  <p className="text-sm text-neutral-400">
                    Drag and drop an image, or click to select
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Supports: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadImage}
              disabled={!previewUrl || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-bounce" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Add Image
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};