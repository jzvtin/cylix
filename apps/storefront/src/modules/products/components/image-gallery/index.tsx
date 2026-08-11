"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const PLINTH =
  "radial-gradient(ellipse 78% 78% at 50% 38%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%), linear-gradient(160deg, #EEF2F8 0%, #E3E9F2 100%)"

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const valid = (images ?? []).filter((i) => !!i.url)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState("50% 50%")
  const frameRef = useRef<HTMLDivElement>(null)

  if (valid.length === 0) {
    return (
      <div
        style={{
          aspectRatio: "1",
          borderRadius: "18px",
          background: PLINTH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: "#9aa4b2",
        }}
      >
        Image coming soon
      </div>
    )
  }

  const current = valid[Math.min(active, valid.length - 1)]

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image on a soft plinth — object-contain so vials are never cropped */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="group relative w-full overflow-hidden rounded-[18px]"
        style={{ aspectRatio: "1", background: PLINTH, cursor: zoom ? "zoom-in" : "default" }}
      >
        {!!current?.url && (
          <Image
            key={current.id}
            src={current.url}
            alt="Product image"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 520px"
            className="select-none p-8 transition-transform duration-200 ease-out"
            style={{
              objectFit: "contain",
              transform: zoom ? "scale(1.9)" : "scale(1)",
              transformOrigin: origin,
            }}
          />
        )}
        {valid.length > 1 && (
          <div
            className="pointer-events-none absolute bottom-3 right-3 rounded-full px-2.5 py-1"
            style={{
              background: "rgba(13,13,13,0.55)",
              color: "#fff",
              fontFamily: "'Outfit',sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.3px",
            }}
          >
            {active + 1} / {valid.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {valid.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {valid.map((image, i) => {
            const selected = i === active
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={selected}
                className="relative shrink-0 overflow-hidden rounded-[10px] transition-all"
                style={{
                  width: "68px",
                  height: "68px",
                  background: PLINTH,
                  border: selected ? "2px solid #C9963A" : "1px solid #E8E4DE",
                  boxShadow: selected ? "0 2px 8px rgba(201,150,58,0.25)" : "none",
                  opacity: selected ? 1 : 0.72,
                }}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="68px"
                    className="p-1.5"
                    style={{ objectFit: "contain" }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
