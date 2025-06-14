import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  field: {
    value: File | string | null;
    onChange: (value: File | string | null) => void;
  };
  previewImage?: string | null;
}

export const ImageUploader = ({ field, previewImage }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Local state to manage preview image (initially from prop)
  const [localPreviewImage, setLocalPreviewImage] = useState<string | null>(
    previewImage || null
  );

  // Object URL for File preview
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // When field.value changes, update local preview accordingly
  useEffect(() => {
    if (field.value instanceof File) {
      const url = URL.createObjectURL(field.value);
      setObjectUrl(url);
      setLocalPreviewImage(null); // clear localPreviewImage if new file

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof field.value === "string") {
      setLocalPreviewImage(null); // clear local if field.value is string URL (assumed new source)
      setObjectUrl(null);
    } else if (field.value === null) {
      setObjectUrl(null);
      setLocalPreviewImage(null);
    }
  }, [field.value]);

  // If previewImage prop changes (external), update localPreviewImage state
  useEffect(() => {
    setLocalPreviewImage(previewImage || null);
  }, [previewImage]);

  // Determine which preview to show:
  // Priority: File preview URL > localPreviewImage (initialized from previewImage prop)
  const previewSrc = objectUrl || localPreviewImage || "";

  const handleFileChange = (file: File | null) => {
    if (file) {
      field.onChange(file);
      // localPreviewImage will be cleared by effect when field.value changes
    } else {
      field.onChange(null);
      setObjectUrl(null);
      setLocalPreviewImage(null);
    }
  };

  // Remove image handler clears both file and local preview
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
  };

  return (
    <div className="w-full space-y-2">
      <div
        onClick={() => !field.value && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0] ?? null;
          if (file) {
            handleFileChange(file);
          }
        }}
        className={`relative w-full flex justify-center items-center px-4 py-6 border-2 border-dashed rounded-md cursor-pointer transition text-center ${
          dragActive ? "border-purple-500 bg-card" : "border-primary"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
        />

        {previewSrc ? (
          <div className="relative group">
            <Image
              src={previewSrc}
              alt="Preview"
              width={150}
              height={150}
              className="object-cover rounded-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 rounded-full bg-foreground shadow hover:bg-foreground/80 transition cursor-pointer text-rose-700"
              aria-label="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to upload image
          </p>
        )}
      </div>
    </div>
  );
};
