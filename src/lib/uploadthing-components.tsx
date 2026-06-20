"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const UTUploadDropzone = generateUploadDropzone<OurFileRouter>();

type UploadDropzoneProps = {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (res: { url: string; name: string }[]) => void;
  onUploadError?: (error: Error) => void;
};

export function UploadDropzone({ endpoint, onClientUploadComplete, onUploadError }: UploadDropzoneProps) {
  return (
    <UTUploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (onClientUploadComplete && res) {
          onClientUploadComplete(res.map((r) => ({ url: r.url, name: r.name })));
        }
      }}
      onUploadError={(error: Error) => {
        onUploadError?.(error);
      }}
    />
  );
}
