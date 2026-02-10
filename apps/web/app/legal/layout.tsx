export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-16">
      <article className="prose prose-neutral mx-auto max-w-3xl prose-headings:font-display prose-h1:text-3xl prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
        {children}
      </article>
    </div>
  );
}
