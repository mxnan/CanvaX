import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseImageUploadProps {
  onImageAdd: (url: string) => void;
  onClose: () => void;
}

export const useImageUpload = ({
  onImageAdd,
  onClose,
}: UseImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetStates = useCallback(() => {
    setPreviewUrl("");
    setDragActive(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const uploadImage = useCallback(async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    try {
      // Here you would typically upload to your server/cloud storage
      // For now, we'll just use the preview URL
      onImageAdd(previewUrl);
      toast.success("image added")
      resetStates();
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, [previewUrl, onImageAdd, resetStates, onClose]);

  return {
    dragActive,
    handleDrag,
    handleDrop,
    handleChange,
    fileInputRef,
    uploadImage,
    isUploading,
    previewUrl,
  };
};
