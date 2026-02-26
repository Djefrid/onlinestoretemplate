"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground/20 text-6xl">
        🛒
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-foreground/5 shadow-xl shadow-foreground/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt || productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              whileTap={{ scale: 0.93 }}
              aria-label={`Image ${i + 1}`}
              className={[
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-primary opacity-100 shadow-md shadow-primary/10"
                  : "border-transparent opacity-50 hover:opacity-80",
              ].join(" ")}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} — vue ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
