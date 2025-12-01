'use client';

import { Camera } from "lucide-react";

interface ImageViewButtonProps {
  imageUrl: string;
  className?: string;
}

export default function ImageViewButton({ imageUrl, className }: ImageViewButtonProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/90 hover:bg-white shadow-md transition-colors ${className}`}
    >
      <Camera className="h-4 w-4" />
    </div>
  );
}