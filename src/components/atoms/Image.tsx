import { cn } from "@/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Plain <img> rather than next/image: editors can paste any URL, and
 * next/image would need every remote domain whitelisted in config.
 * (Trade-off worth a README line.)
 */
export function Image({ src, alt, className }: ImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("h-auto w-full object-cover", className)}
    />
  );
}
