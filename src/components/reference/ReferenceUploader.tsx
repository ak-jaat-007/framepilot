"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Check, FileImage, ImagePlus, RefreshCw, UploadCloud, X } from "lucide-react";
import type { ReferenceAsset } from "@/types/studio";

interface ReferenceUploaderProps {
  reference: ReferenceAsset | null;
  onChange: (reference: ReferenceAsset) => void;
  onRemove: () => void;
}

export default function ReferenceUploader({ reference, onChange, onRemove }: ReferenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRequest = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const createPersistedPreview = (sourceUrl: string) => new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxDimension = 720;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Image preview could not be prepared."));
        return;
      }
      context.fillStyle = "#101418";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.76));
    };
    image.onerror = () => reject(new Error("This image could not be read. Try another file."));
    image.src = sourceUrl;
  });

  const acceptFile = async (file?: File) => {
    if (!file) return;
    const requestId = ++uploadRequest.current;
    if (!file.type.startsWith("image/")) {
      setFileError("Choose an image file to use as your visual reference.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFileError("Choose an image under 20 MB.");
      return;
    }
    setFileError("");
    const previewUrl = URL.createObjectURL(file);
    try {
      const persistedUrl = await createPersistedPreview(previewUrl);
      if (requestId !== uploadRequest.current) {
        URL.revokeObjectURL(previewUrl);
        return;
      }
      onChange({ previewUrl, persistedUrl, name: file.name, isObjectUrl: true });
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      if (requestId === uploadRequest.current) setFileError(error instanceof Error ? error.message : "This image could not be read. Try another file.");
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="studio-section reference-section" aria-labelledby="reference-heading">
      <div className="section-heading">
        <div className="section-title-wrap"><span className="section-number">01</span><h2 id="reference-heading">Reference image</h2></div>
        <span className="required-label">Required <span>·</span></span>
      </div>
      <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" onChange={handleInput} aria-label="Upload a reference image" />
      {reference ? (
        <div className="reference-loaded">
          <div className="reference-thumb" style={{ backgroundImage: `url("${reference.previewUrl}")` }} role="img" aria-label={`Preview of ${reference.name}`} />
          <div className="reference-file-info">
            <span className="reference-status"><Check size={12} /> Reference ready</span>
            <span className="reference-filename" title={reference.name}>{reference.name}</span>
            <span className="reference-hint">Image will guide your scene composition</span>
          </div>
          <div className="reference-actions">
            <button className="icon-button small" onClick={() => inputRef.current?.click()} aria-label="Replace reference image" title="Replace image"><RefreshCw size={14} /></button>
            <button className="icon-button small" onClick={() => { uploadRequest.current += 1; onRemove(); }} aria-label="Remove reference image" title="Remove image"><X size={14} /></button>
          </div>
        </div>
      ) : (
        <div className={`upload-zone ${isDragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
          <button className="upload-main" onClick={() => inputRef.current?.click()}>
            <span className="upload-icon"><UploadCloud size={19} /></span>
            <span className="upload-copy"><strong>Drop an image to set the scene</strong><span>or browse your files · JPG, PNG, WebP</span></span>
            <ImagePlus className="upload-trailing" size={16} />
          </button>
          <div className="upload-footer"><span><FileImage size={12} /> A reference helps guide composition</span><span>Up to 20 MB</span></div>
        </div>
      )}
      {fileError && <p className="field-error" role="alert">{fileError}</p>}
      <div className="reference-types" aria-label="Other reference types">
        <span><span className="type-glyph">▶</span> Video <em>Coming soon</em></span>
        <span><span className="type-glyph audio-glyph">〰</span> Audio <em>Coming soon</em></span>
      </div>
    </section>
  );
}
