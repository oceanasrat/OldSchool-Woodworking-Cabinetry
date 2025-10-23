import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ZoomGallery({
  title,
  images,
  onClose,
}: {
  title: string
  images: string[]
  onClose?: () => void
}) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [last, setLast] = useState({ x: 0, y: 0 })

  const src = images[index]

  // --- helper to close WITHOUT editing App.tsx ---
  function requestClose() {
    // 1) use prop if available
    if (onClose) {
      onClose()
      return
    }
    // 2) try clicking the modal backdrop (parent Modal has bg-black/60 on overlay)
    const overlay = document.querySelector('[class*="bg-black/60"]') as HTMLElement | null
    if (overlay) {
      overlay.click()
      return
    }
    // 3) last resort: dispatch Escape (safe no-op if not handled)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  }

  // --- navigation helpers ---
  const next = () => {
    setIndex((i) => (i + 1) % images.length)
    resetView()
  }
  const prev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length)
    resetView()
  }
  const resetView = () => {
    setZoom(1)
    setPos({ x: 0, y: 0 })
    setDragging(false)
  }

  // --- keyboard support ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // --- zoom/pan handlers ---
  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    const nextZoom = Math.max(1, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)))
    setZoom(Number(nextZoom.toFixed(2)))
  }
  function onPointerDown(e: React.PointerEvent) {
    if (zoom === 1) return
    setDragging(true)
    setLast({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return
    setPos({ x: e.clientX - last.x, y: e.clientY - last.y })
  }
  function onPointerUp() { setDragging(false) }
  function toggleZoom() {
    if (zoom === 1) { setZoom(2) } else { setZoom(1); setPos({ x: 0, y: 0 }) }
  }

  return (
    <div className="relative">
      {/* Header row: title + close */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-sm uppercase tracking-wider opacity-60">Gallery</div>
          <div className="text-lg font-semibold truncate">{title}</div>
        </div>
        <button
          onClick={requestClose}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
          style={{ borderColor: '#E5E7EB' }}
          aria-label="Close gallery"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      {/* Main viewer */}
      <div className="relative">
        {/* Prev/Next buttons (overlay) */}
        <button
          onClick={prev}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image canvas */}
        <div
          className="aspect-[4/3] bg-black/5 overflow-hidden rounded-xl relative touch-none select-none"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onDoubleClick={toggleZoom}
          role="img"
          aria-label={`${title} image ${index + 1} of ${images.length}`}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-contain"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
            onClick={toggleZoom}
            draggable={false}
          />
        </div>

        {/* Controls bar */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1.5 rounded-md border bg-white" onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}>−</button>
            <div className="px-2 py-1 rounded bg-white text-sm border">{Math.round(zoom * 100)}%</div>
            <button className="px-2.5 py-1.5 rounded-md border bg-white" onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}>+</button>
          </div>

          <div className="text-sm opacity-70">{index + 1} / {images.length}</div>

          <div className="hidden sm:flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md border bg-white" onClick={prev}>Prev</button>
            <button className="px-3 py-1.5 rounded-md border bg-white" onClick={next}>Next</button>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {images.map((u, i) => (
          <button
            key={u + i}
            onClick={() => { setIndex(i); resetView() }}
            className={`aspect-[4/3] overflow-hidden rounded ${i === index ? 'ring-2 ring-black/60' : 'ring-1 ring-black/10'}`}
            aria-label={`Show image ${i + 1}`}
          >
            <img src={u} className="h-full w-full object-cover" alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
