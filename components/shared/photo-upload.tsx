'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  label?: string;
  multiple?: boolean;
  onChange?: (photos: string[]) => void;
  existingPhotos?: string[];
  className?: string;
}

export function PhotoUpload({
  label = 'Upload Photos',
  multiple = true,
  onChange,
  existingPhotos,
  className,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>(existingPhotos || []);
  const [loading, setLoading] = useState(false);

  const existingPhotosKey = existingPhotos?.join(',') || '';

  useEffect(() => {
    if (existingPhotos && existingPhotos.length > 0) {
      setPhotos(existingPhotos);
    }
  }, [existingPhotosKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const fileList = Array.from(files);
    const readPromises = fileList.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises)
      .then((dataUrls) => {
        const updated = multiple ? [...photos, ...dataUrls] : dataUrls;
        setPhotos(updated);
        onChange?.(updated);
      })
      .catch((err) => {
        console.error('Error reading photo files:', err);
      })
      .finally(() => {
        setLoading(false);
        if (inputRef.current) inputRef.current.value = '';
      });
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onChange?.(updated);
  };

  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm font-medium">{label}</p>}
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="group relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`Upload ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-[#FF5500] hover:text-[#FF5500] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#FF5500]" />
          ) : photos.length === 0 ? (
            <>
              <Upload className="h-5 w-5" />
              <span className="text-xs font-bold">Upload</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs font-bold">Add</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
