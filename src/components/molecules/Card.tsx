import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Image } from "@/components/atoms/Image";

export type CardProps = {
  image: { url: string; alt: string };
  heading: string;
  link?: { label: string; href: string };
};

export function Card({ image, heading, link }: CardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-site bg-white text-site-text shadow-sm">
      <Image src={image.url} alt={image.alt} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Heading level={3}>{heading}</Heading>
        {link && (
          <Button
            href={link.href}
            variant="secondary"
            className="mt-auto self-start"
          >
            {link.label}
          </Button>
        )}
      </div>
    </article>
  );
}
