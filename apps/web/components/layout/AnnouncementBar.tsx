import type { SiteSettings } from "@/types";

interface AnnouncementBarProps {
  bar: NonNullable<SiteSettings["announcementBar"]>;
}

export function AnnouncementBar({ bar }: AnnouncementBarProps) {
  if (!bar.enabled || !bar.text) return null;

  return (
    <div className="bg-accent text-center text-sm font-medium text-white">
      <div className="container-page flex items-center justify-center gap-2 py-2">
        <span>{bar.text}</span>
        {bar.linkLabel && bar.linkUrl && (
          <a
            href={bar.linkUrl}
            className="underline underline-offset-2 hover:no-underline"
          >
            {bar.linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
