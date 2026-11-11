import { Heading } from "@/components/atoms/Heading";
import { Card, type CardProps } from "@/components/molecules/Card";

export type CardGridProps = {
  title: string;
  cards: CardProps[];
};

export function CardGrid({ title, cards }: CardGridProps) {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={2}>{title}</Heading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </div>
  );
}
