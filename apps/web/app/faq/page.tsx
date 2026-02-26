import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description:
    "Retrouvez les réponses aux questions les plus fréquentes sur nos produits, la livraison, les paiements, les retours et nos rendez-vous.",
};

const sections = [
  {
    id: "livraison",
    title: "Livraison & expédition",
    icon: "🚚",
    items: [
      {
        q: "Livrez-vous partout au Québec ?",
        a: "Oui, nous livrons dans toute la province du Québec. Les délais habituels sont de 2 à 5 jours ouvrables à partir de la date d'expédition.",
      },
      {
        q: "Quel est le coût de la livraison ?",
        a: "La livraison standard est à 5,99 $ (taxes incluses). Elle est offerte gratuitement pour toute commande de 75 $ et plus avant taxes.",
      },
      {
        q: "Comment puis-je suivre ma commande ?",
        a: "Vous recevez un email de confirmation avec un numéro de suivi dès que votre colis est pris en charge par le transporteur. Vous pouvez également consulter votre historique de commandes depuis votre espace compte.",
      },
      {
        q: "Livrez-vous en dehors du Québec ?",
        a: "Actuellement, nos livraisons sont limitées au Québec. Nous travaillons à étendre notre zone de livraison — restez à l'affût de nos annonces.",
      },
    ],
  },
  {
    id: "produits",
    title: "Nos produits",
    icon: "🌿",
    items: [
      {
        q: "D'où viennent vos produits ?",
        a: "Nous sélectionnons nos produits directement auprès de producteurs et fournisseurs africains de confiance. Le pays d'origine est indiqué sur chaque fiche produit.",
      },
      {
        q: "Proposez-vous des produits halal ou biologiques ?",
        a: "Plusieurs de nos produits sont certifiés halal ou biologiques. Utilisez les filtres de la boutique pour les repérer facilement, ou consultez les étiquettes sur chaque fiche produit.",
      },
      {
        q: "Les produits frais et surgelés sont-ils livrés en bon état ?",
        a: "Oui. Nous utilisons un emballage isotherme adapté pour maintenir la chaîne du froid pendant le transport. En cas de problème à la livraison, contactez-nous dans les 48 heures avec des photos.",
      },
      {
        q: "Comment sont gérés les produits avec allergènes ?",
        a: "Les informations sur les allergènes sont indiquées sur chaque fiche produit. En cas de doute, n'hésitez pas à nous contacter avant de passer commande.",
      },
    ],
  },
  {
    id: "commande",
    title: "Commande & paiement",
    icon: "💳",
    items: [
      {
        q: "Dois-je créer un compte pour commander ?",
        a: "Non, vous pouvez commander en tant qu'invité. Créer un compte vous permet toutefois de suivre vos commandes, d'accumuler des points de fidélité et de laisser des avis sur vos achats.",
      },
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons les cartes Visa, Mastercard, American Express et les cartes de débit, via la plateforme sécurisée Stripe (certifiée PCI DSS niveau 1). Aucune information bancaire n'est stockée sur notre site.",
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        a: "Vous pouvez annuler votre commande gratuitement avant son expédition en nous contactant rapidement par email. Une fois le colis expédié, la politique de retours s'applique.",
      },
      {
        q: "Ma commande est-elle confirmée immédiatement ?",
        a: "Oui. Vous recevez un email de confirmation dès la validation de votre paiement. Si vous ne le recevez pas dans les 15 minutes, vérifiez vos courriers indésirables ou contactez-nous.",
      },
    ],
  },
  {
    id: "retours",
    title: "Retours & remboursements",
    icon: "↩️",
    items: [
      {
        q: "Puis-je retourner un produit ?",
        a: "Oui, dans les 10 jours suivant la réception, pour les produits non ouverts, non périssables et dans leur emballage d'origine. Les produits frais, surgelés ou dont la date de péremption est inférieure à 30 jours ne sont pas retournables.",
      },
      {
        q: "Que faire si je reçois un produit endommagé ou défectueux ?",
        a: "Contactez-nous dans les 48 heures suivant la réception, avec des photos du produit et de l'emballage. Nous vous remplacerons le produit ou vous rembourserons intégralement, frais de retour à notre charge.",
      },
      {
        q: "Combien de temps prend un remboursement ?",
        a: "Une fois le retour validé, le remboursement est effectué sous 10 jours ouvrables sur le mode de paiement utilisé lors de la commande.",
      },
      {
        q: "Qui paie les frais de retour ?",
        a: "Les frais de retour sont à votre charge pour un retour volontaire. Pour un produit défectueux ou une erreur de notre part, nous prenons en charge l'intégralité des frais.",
      },
    ],
  },
  {
    id: "retrait",
    title: "Retrait en boutique & rendez-vous",
    icon: "📅",
    items: [
      {
        q: "Puis-je retirer ma commande en boutique ?",
        a: "Oui, le retrait en boutique est disponible. Lors du paiement, sélectionnez l'option « Retrait » et choisissez un créneau parmi ceux proposés. Comptez 2 à 3 heures de préparation.",
      },
      {
        q: "Comment prendre rendez-vous pour une consultation ?",
        a: (
          <>
            Depuis la page{" "}
            <Link href="/appointments" className="text-primary underline hover:no-underline">
              Rendez-vous
            </Link>
            , vous pouvez réserver un créneau pour une consultation personnalisée,
            une dégustation ou un retrait de commande.
          </>
        ),
      },
      {
        q: "Puis-je venir sans rendez-vous ?",
        a: "Oui, notre boutique est ouverte aux horaires affichés. Pour une consultation personnalisée ou un retrait assuré, nous recommandons toutefois de prendre rendez-vous.",
      },
    ],
  },
  {
    id: "fidelite",
    title: "Programme de fidélité",
    icon: "⭐",
    items: [
      {
        q: "Comment fonctionne le programme de fidélité ?",
        a: "Chaque dollar dépensé vous rapporte 1 point. Vos points sont visibles dans votre espace compte. Des récompenses seront disponibles prochainement — nous vous en informerons par email.",
      },
      {
        q: "Dois-je avoir un compte pour accumuler des points ?",
        a: "Oui, les points de fidélité sont liés à votre compte client. Les commandes passées en mode invité ne génèrent pas de points.",
      },
      {
        q: "Mes points expirent-ils ?",
        a: "Non, vos points n'expirent pas tant que votre compte est actif.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Questions fréquentes
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="mt-3 text-foreground/55">
            Retrouvez les réponses aux questions les plus courantes. Vous ne
            trouvez pas votre réponse ?{" "}
            <Link href="/contact" className="text-primary underline hover:no-underline">
              Contactez-nous
            </Link>
            .
          </p>
        </div>

        {/* Sections FAQ */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id}>
              {/* Section header */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {section.icon}
                </span>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>

              <Accordion type="multiple" className="rounded-xl border border-foreground/[0.08] bg-white px-2">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.id}-${i}`}
                    className="border-foreground/[0.08] last:border-0"
                  >
                    <AccordionTrigger className="px-4 text-[0.9rem] font-semibold text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-[0.875rem] leading-relaxed text-foreground/65">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA bas de page */}
        <div className="mt-14 rounded-2xl bg-primary/[0.06] px-8 py-10 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            Vous n&apos;avez pas trouvé votre réponse ?
          </p>
          <p className="mt-2 text-sm text-foreground/60">
            Notre équipe est disponible pour vous aider.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Nous contacter
            </Link>
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
