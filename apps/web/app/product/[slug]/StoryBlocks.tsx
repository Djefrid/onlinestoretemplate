import { MapPin, ChefHat, Quote } from "lucide-react";

interface StoryBlocksProps {
  originCountry: string;
  preparationTips?: string;
  producerNote?: string;
}

export function StoryBlocks({
  originCountry,
  preparationTips,
  producerNote,
}: StoryBlocksProps) {
  const count = [true, !!preparationTips, !!producerNote].filter(Boolean).length;
  const gridCols =
    count === 1 ? "grid-cols-1" : count === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section className={`mt-20 grid gap-6 ${gridCols}`}>
      {/* Origine + description */}
      <div className="rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <MapPin className="h-3.5 w-3.5" />
          Origine
        </div>
        <p className="text-sm leading-relaxed text-foreground/65">{originCountry}</p>
      </div>

      {/* Conseils de préparation */}
      {preparationTips && (
        <div className="rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <ChefHat className="h-3.5 w-3.5" />
            Conseils
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/65">
            {preparationTips}
          </p>
        </div>
      )}

      {/* Note du producteur */}
      {producerNote && (
        <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Quote className="h-3.5 w-3.5" />
            Note du producteur
          </div>
          <blockquote className="text-sm italic leading-relaxed text-foreground/65">
            &ldquo;{producerNote}&rdquo;
          </blockquote>
        </div>
      )}
    </section>
  );
}
