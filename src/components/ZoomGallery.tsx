import React, { useState } from 'react'

export default function ZoomGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [last, setLast] = useState({ x: 0, y: 0 })

  const src = images[index]

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    const next = Math.max(1, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)))
    setZoom(Number(next.toFixed(2)))
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
  function toggleZoom() { setZoom(zoom === 1 ? 2 : 1); setPos({ x: 0, y: 0 }) }

  return (
    <div className="grid gap-4">
      <div className="text-lg font-semibold">{title}</div>
      <div className="relative">
        <div className="aspect-[4/3] bg-black/5 overflow-hidden rounded-xl"
             onWheel={onWheel}
             onPointerDown={onPointerDown}
             onPointerMove={onPointerMove}
             onPointerUp={onPointerUp}
             onPointerCancel={onPointerUp}
             onPointerLeave={onPointerUp}
             onDoubleClick={toggleZoom}
             role="img" aria-label={`${title} image ${index + 1} of ${images.length}`}>
          <img
            src={src}
            alt=""
            className="h-full w-full object-contain select-none touch-none"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
            onClick={toggleZoom}
            draggable={false}
          />
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button className="px-2.5 py-1.5 rounded-md border bg-white/90" onClick={() => setZoom(Math.max(1, +(zoom - 0.2).toFixed(2)))}>-</button>
          <div className="px-2 py-1 rounded bg-white/90 text-sm">{Math.round(zoom*100)}%</div>
          <button className="px-2.5 py-1.5 rounded-md border bg-white/90" onClick={() => setZoom(Math.min(3, +(zoom + 0.2).toFixed(2)))}>+</button>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {images.map((u, i) => (
          <button key={u} onClick={() => { setIndex(i); setZoom(1); setPos({ x: 0, y: 0 }) }}
                  className={`aspect-[4/3] overflow-hidden rounded ${i===index ? 'ring-2 ring-black/60' : 'ring-1 ring-black/10'}`}>
            <img src={u} className="h-full w-full object-cover" alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
