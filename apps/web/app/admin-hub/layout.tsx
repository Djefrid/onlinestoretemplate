import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Hub",
    template: "%s | Admin Hub",
  },
  description: "Panneau d'administration",
  robots: { index: false, follow: false },
};

export default function AdminHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
