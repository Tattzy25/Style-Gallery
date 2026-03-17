"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

// 18 tattoo styles, each with a unique image (no duplicates)
const TATTOO_STYLES = [
  { id: "photo-1", style: "Chicano", rotation: -15, x: -90, y: 10, zIndex: 10 },
  { id: "photo-2", style: "3D", rotation: -3, x: -10, y: -15, zIndex: 20 },
  { id: "photo-3", style: "Realism", rotation: 12, x: 75, y: 5, zIndex: 30 },
  { id: "photo-4", style: "Modern" },
  { id: "photo-5", style: "Modern Realism" },
  { id: "photo-6", style: "American Traditional" },
  { id: "photo-7", style: "Japanese (Irezumi)" },
  { id: "photo-8", style: "Blackwork" },
  { id: "photo-9", style: "Watercolor" },
  { id: "photo-10", style: "Geometric" },
  { id: "photo-11", style: "Neo-traditional" },
  { id: "photo-12", style: "Minimalist / Fine Line" },
  { id: "photo-13", style: "Dotwork" },
  { id: "photo-14", style: "Trash Polka" },
  { id: "photo-15", style: "New School" },
  { id: "photo-16", style: "Biomechanical" },
  { id: "photo-17", style: "Mandala" },
  { id: "photo-18", style: "Tribal" },
];

const BLOB_BASE =
  "https://fqt85eqssy8pdn3k.public.blob.vercel-storage.com/products";

// Your images (first 6); slots 7–18 are placeholders—replace when you send the 12 more
const TATTOO_IMAGES = [
  `${BLOB_BASE}/1.png`,
  `${BLOB_BASE}/2.png`,
  `${BLOB_BASE}/3.png`,
  `${BLOB_BASE}/4.png`,
  `${BLOB_BASE}/5.png`,
  `${BLOB_BASE}/6.png`,
  // Slots 7–18: repeat your 6 until you add the 12 more
  `${BLOB_BASE}/1.png`,
  `${BLOB_BASE}/2.png`,
  `${BLOB_BASE}/3.png`,
  `${BLOB_BASE}/4.png`,
  `${BLOB_BASE}/5.png`,
  `${BLOB_BASE}/6.png`,
  `${BLOB_BASE}/1.png`,
  `${BLOB_BASE}/2.png`,
  `${BLOB_BASE}/3.png`,
  `${BLOB_BASE}/4.png`,
  `${BLOB_BASE}/5.png`,
  `${BLOB_BASE}/6.png`,
];

const PHOTOS = TATTOO_STYLES.map((item, index) => ({
  ...item,
  src: TATTOO_IMAGES[index],
  alt: `${item.style} tattoo style`,
}));

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

function onStyleClick(styleName: string) {
  if (typeof window !== "undefined") {
    window.parent.postMessage({ type: "TATTY_STYLE", style: styleName }, "*");
  }
}

export default function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (photo: { id: string; style: string }) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    const next = selectedId === photo.id ? null : photo.id;
    setSelectedId(next);
    if (next) onStyleClick(photo.style); // notify parent only when selecting
  };

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <section className="relative w-full px-4 md:px-8 bg-transparent flex flex-col items-center justify-start min-h-[850px] overflow-hidden">
      <LayoutGroup id={layoutGroupId}>
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-full h-12 flex items-center justify-between px-4 mb-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group z-50"
                >
                  <div className="p-2 rounded-full bg-muted group-hover:bg-accent transition-colors text-foreground">
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="font-medium">Close Gallery</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            ref={containerRef}
            layout
            className={cn(
              "relative w-full",
              isExpanded
                ? "grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4"
                : "flex flex-col items-center justify-start pt-4"
            )}
            transition={transition}
          >
            <div
              className={cn(
                "relative",
                isExpanded
                  ? "contents"
                  : "h-[450px] w-full flex items-center justify-center mb-8"
              )}
            >
              {PHOTOS.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    key={`card-${photo.id}`}
                    layoutId={`card-container-${photo.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation || 0 : 0,
                      x: !isExpanded ? photo.x || 0 : 0,
                      y: !isExpanded ? photo.y || 0 : 0,
                      zIndex: !isExpanded ? photo.zIndex || index : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: (photo.y || 0) - 15,
                            rotate: (photo.rotation || 0) * 0.8,
                            zIndex: 50,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }
                        : { scale: 1.02 }
                    }
                    className={cn(
                      "cursor-pointer overflow-hidden bg-muted transition-shadow duration-300",
                      isExpanded
                        ? "relative aspect-square rounded-[2rem] md:rounded-[3rem] border-4 md:border-[6px] border-background shadow-lg"
                        : "absolute w-44 h-44 md:w-60 md:h-60 rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-background shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
                      selectedId === photo.id &&
                        "shadow-[0_0_25px_rgba(0,0,0,0.85),0_0_50px_rgba(0,0,0,0.6),0_0_80px_rgba(0,0,0,0.4)] ring-2 ring-black/50"
                    )}
                    onClick={() => handleCardClick(photo)}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id}`}
                      layout="position"
                      className="w-full h-full relative"
                      transition={transition}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover select-none pointer-events-none"
                        sizes={
                          isExpanded
                            ? "(max-width: 1024px) 50vw, 33vw"
                            : "240px"
                        }
                        priority={isPrimary}
                      />
                      <span
                        className="absolute inset-x-0 bottom-0 flex items-center justify-center py-3 text-center text-white pointer-events-none"
                        style={{
                          fontFamily: "var(--font-unbounded), sans-serif",
                          fontSize: "18px",
                          textShadow: "0 1px 2px black, 0 2px 4px black, 0 0 8px black",
                        }}
                      >
                        {photo.style}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-2xl space-y-8"
                >
                  <h2 className="space-y-2">
                    <span
                      className="block text-[72px] leading-tight font-normal tracking-tight text-foreground/90"
                      style={{ fontFamily: "var(--font-shadows-into-light), cursive" }}
                    >
                      2. Your Style
                    </span>
                    <span
                      className="block text-lg font-normal text-foreground/90"
                      style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "18px" }}
                    >
                      Please Choose Your Style
                    </span>
                  </h2>

                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      onClick={() => setIsExpanded(true)}
                      className="rounded-full cursor-pointer py-6 px-8 border-border/40 font-normal group "
                    >
                      Styles
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="transition-transform group-hover:translate-x-1"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </section>
  );
}
