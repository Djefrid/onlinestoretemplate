import type { LucideIcon } from "lucide-react";

interface AdminHubCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accentColor: string; // Tailwind arbitrary color class e.g. "text-orange-400"
  accentBorder: string; // e.g. "hover:border-orange-400/50"
  accentGlow: string; // e.g. "hover:shadow-orange-400/10"
}

export function AdminHubCard({
  title,
  description,
  href,
  icon: Icon,
  accentColor,
  accentBorder,
  accentGlow,
}: AdminHubCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col justify-between rounded-2xl border border-[#1F2937] bg-[#111827] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${accentBorder} ${accentGlow}`}
    >
      <div>
        <div
          className={`mb-4 inline-flex rounded-xl bg-[#1F2937] p-3 ${accentColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          {description}
        </p>
      </div>
      <p
        className={`mt-4 text-sm font-medium ${accentColor} opacity-0 transition-opacity group-hover:opacity-100`}
      >
        Ouvrir &rarr;
      </p>
    </a>
  );
}
