import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  /* Shown centered on the placeholder plinth when the product has no image. */
  title?: string | null
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  title,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-5 rounded-2xl bg-cream border border-ink/5 shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-gold-500/30",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[4/5]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      {/* Gold-tinted plinth glow behind the vial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_18%,theme(colors.gold.50)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-4 h-10 rounded-[100%] bg-gold-500/10 blur-lg"
      />
      <ImageOrPlaceholder image={initialImage} size={size} title={title} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  title,
}: Pick<ThumbnailProps, "size" | "title"> & { image?: string }) => {
  if (image) {
    return (
      <Image
        src={image}
        alt={title || "Thumbnail"}
        className="absolute inset-0 object-contain object-center p-2 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        draggable={false}
        quality={50}
        sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        fill
      />
    )
  }

  return (
    <div
      className="w-full h-full absolute inset-0 flex items-center justify-center p-4"
      data-testid="thumbnail-placeholder"
    >
      <span
        className={clx(
          "font-display font-semibold text-center leading-snug tracking-tight text-ink/80 line-clamp-4",
          {
            "text-xs": size === "small",
            "text-sm": size === "medium" || size === "square",
            "text-base": size === "large" || size === "full",
          }
        )}
      >
        {title}
      </span>
    </div>
  )
}

export default Thumbnail
