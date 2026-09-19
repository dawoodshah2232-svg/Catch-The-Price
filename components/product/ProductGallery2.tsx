'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductImage } from '@/lib/types';
import { Bookmark, TrendingDown, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryControl = 'size-11 rounded-full bg-white/95 text-slate-900 border border-slate-300 shadow-md flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors shrink-0';

interface ProductGallery2Props {
  primaryImageUrl: string;
  images?: ProductImage[];
  productTitle: string;
  discountPercent?: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
  selectedIndex?: number;
  onSelectImage?: (index: number) => void;
}

export function ProductGallery2({
  primaryImageUrl,
  images = [],
  productTitle,
  discountPercent = 0,
  isSaved = false,
  onToggleSave,
  selectedIndex,
  onSelectImage,
}: ProductGallery2Props) {
  // Build effective gallery list
  const galleryList: ProductImage[] = images.length > 0
    ? images
    : [
        {
          id: 'primary',
          imageUrl: primaryImageUrl,
          sortOrder: 1,
          imageType: 'front',
          altText: productTitle,
          isPrimary: true,
        },
      ];

  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = typeof selectedIndex === 'number' ? selectedIndex : internalIndex;

  const setActiveIndex = (index: number) => {
    const nextIdx = (index + galleryList.length) % galleryList.length;
    setInternalIndex(nextIdx);
    if (onSelectImage) onSelectImage(nextIdx);
  };

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});

  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [isLightboxOpen]);

  const activeImage = galleryList[activeIndex] || galleryList[0];
  const activeSrc = imgErrorMap[activeIndex] ? primaryImageUrl : activeImage.imageUrl;

  // Handle Keyboard Navigation for Lightbox and Gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIndex(activeIndex + 1);
      if (e.key === 'ArrowLeft') setActiveIndex(activeIndex - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeIndex, galleryList.length]);

  // Handle Mobile Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      setActiveIndex(activeIndex + 1); // Swipe left -> next
    } else if (diff < -40) {
      setActiveIndex(activeIndex - 1); // Swipe right -> prev
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3">
      {/* Main Image Canvas */}
      <div
        className="relative aspect-square max-h-[480px] sm:max-h-[580px] mx-auto w-full rounded-3xl bg-white border border-[#DDE7E3] p-5 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_12px_36px_rgba(25,55,45,0.06)] group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] z-10 shadow-xs">
            <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            <span>{discountPercent}% OFF</span>
          </div>
        )}

        {/* Action Controls: Zoom & Save */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className={galleryControl}
            aria-label="Enlarge image"
            title="Inspect high-resolution view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {onToggleSave && (
            <button
              type="button"
              onClick={onToggleSave}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all shadow-xs ${
                isSaved
                  ? 'bg-[#0B8F58] text-white border-[#0B8F58]'
                  : 'bg-white/90 hover:bg-white text-[#60727A] hover:text-[#08784B] border-[#DDE7E3]'
              }`}
              aria-label={isSaved ? 'Saved to watchlist' : 'Save product'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation Arrows on Canvas (Clickable & Active) */}
        {galleryList.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex(activeIndex - 1)}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-10 ${galleryControl}`}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(activeIndex + 1)}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-10 ${galleryControl}`}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Active Product Image */}
        <img
          src={activeSrc}
          alt={activeImage.altText || productTitle}
          onError={() => setImgErrorMap((prev) => ({ ...prev, [activeIndex]: true }))}
          className="h-full w-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
          onClick={() => setIsLightboxOpen(true)}
          fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
        />

        {/* Bottom Image Counter */}
        {galleryList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#102027]/75 backdrop-blur-xs text-[10px] font-bold text-white pointer-events-none">
            {activeIndex + 1} / {galleryList.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery Strip */}
      {galleryList.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {galleryList.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const thumbSrc = imgErrorMap[idx] ? primaryImageUrl : item.imageUrl;

            let typeLabel: string = item.imageType || `View ${idx + 1}`;
            if (item.altText) {
              if (/desert/i.test(item.altText)) typeLabel = 'Desert';
              else if (/natural/i.test(item.altText)) typeLabel = 'Natural';
              else if (/black/i.test(item.altText)) typeLabel = 'Black';
              else if (/white/i.test(item.altText)) typeLabel = 'White';
              else if (/titanium/i.test(item.altText)) typeLabel = 'Titanium';
              else if (/camera/i.test(item.altText)) typeLabel = 'Camera';
              else if (/display|screen/i.test(item.altText)) typeLabel = 'Display';
              else if (/back/i.test(item.altText)) typeLabel = 'Back';
              else if (/side/i.test(item.altText)) typeLabel = 'Side';
              else if (/angle/i.test(item.altText)) typeLabel = 'Angle';
              else if (/front/i.test(item.altText)) typeLabel = 'Front';
            }

            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-12 h-14 sm:w-14 lg:w-12 rounded-xl bg-white border p-1 shrink-0 transition-all flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-[#0B8F58] ring-2 ring-[#00D27A]/20 shadow-xs'
                    : 'border-[#DDE7E3] hover:border-[#BFD2CA] opacity-75 hover:opacity-100'
                }`}
                aria-label={`View ${item.altText || `image ${idx + 1}`}`}
                aria-pressed={isSelected}
              >
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  className="w-full h-8 sm:h-10 object-contain"
                />
                <span className={`text-[8px] font-extrabold uppercase tracking-tight block truncate max-w-full ${
                  isSelected ? 'text-[#08784B]' : 'text-[#73858D]'
                }`}>
                  {typeLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productTitle} image gallery`}
          ref={dialogRef}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
            if (!buttons?.length) return;
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-4xl min-w-0 w-full max-h-[94dvh] bg-slate-950 border border-slate-700 rounded-3xl p-3 sm:p-6 flex flex-col items-center justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title & Close */}
            <div className="w-full flex items-center justify-between pb-2 border-b border-[#162633]">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00D27A] block">
                  {activeIndex + 1} / {galleryList.length}
                </span>
                <h4 className="text-white font-bold text-xs sm:text-sm truncate">
                  {productTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className={galleryControl}
                aria-label="Close fullscreen gallery"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Lightbox Image View with Arrows */}
            <div className="relative w-full h-[56vh] sm:h-[65vh] flex items-center justify-center my-2">
              <img
                src={activeSrc}
                alt={activeImage.altText || productTitle}
                className="max-h-full max-w-full object-contain rounded-xl"
              />

              {galleryList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex - 1)}
                    className={`absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 ${galleryControl}`}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 ${galleryControl}`}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Lightbox Thumbnail Strip */}
            {galleryList.length > 1 && (
              <div className="w-full flex items-center sm:justify-center gap-2 overflow-x-auto py-2 border-t border-slate-700">
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    aria-pressed={activeIndex === idx}
                    className={`w-11 h-11 rounded-lg bg-white border p-1 shrink-0 transition-all ${
                      activeIndex === idx
                        ? 'border-[#00D27A] ring-1 ring-[#00D27A]'
                        : 'border-[#223743] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
