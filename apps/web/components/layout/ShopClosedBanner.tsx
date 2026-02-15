import type { SiteSettings } from "@/types";

interface ShopClosedBannerProps {
  status: NonNullable<SiteSettings["shopStatus"]>;
}

export function ShopClosedBanner({ status }: ShopClosedBannerProps) {
  if (status.isOpen) return null;

  return (
    <div className="border-b border-red-200 bg-red-50 text-center text-sm text-red-800">
      <div className="container-page py-3">
        <p className="font-medium">
          Boutique temporairement fermée
        </p>
        {status.closedMessage && (
          <p className="mt-1 text-red-600">{status.closedMessage}</p>
        )}
        {status.reopenDate && (
          <p className="mt-1 text-red-500">
            Réouverture prévue : {new Date(status.reopenDate).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}
