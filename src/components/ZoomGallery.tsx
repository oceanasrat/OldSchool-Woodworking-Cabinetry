import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ZoomGalleryProps {
  images: string[];
  title?: string;
}

const ZoomGallery: React.FC<ZoomGalleryProps> = ({ images, title }) => {
  const [current, setCurrent] = useState<number | null>(null);

  const open = (index: number) => setCurrent(index);
  const close = () => setCurrent(null);
  const next = () => setCurrent((c) => (c !== null ? (c + 1) % images.length : 0));
  const prev = () => setCurrent((c) => (c !== null ? (c - 1 + images.length) % images.length : 0));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (current === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="relative group overflow-hidden rounded-lg focus:outline-none"
          >
            <img
              src={src}
              alt={`${title || "Project"} photo ${i + 1}`}
              className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>

      {/* Modal view */}
      {current !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-4 w-full max-w-5xl px-4">
            <button
              onClick={prev}
              className="p-2 text-white hover:bg-white/20 rounded-full"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={images[current]}
              alt={`Zoomed ${title || "project"} image ${current + 1}`}
              className="max-h-[85vh] w-auto rounded-md shadow-lg"
            />

            <button
              onClick={next}
              className="p-2 text-white hover:bg-white/20 rounded-full"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <p className="text-gray-300 text-sm mt-3">
            {current + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ZoomGallery;
