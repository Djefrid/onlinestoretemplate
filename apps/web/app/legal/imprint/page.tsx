import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function ImprintPage() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>Éditeur du site</h2>
      <p>
        <strong>Épicerie Africaine</strong>
        <br />
        Adresse : 1234 Rue Exemple, Montréal, QC H2X 1K4, Canada
        <br />
        Email :{" "}
        <a href="mailto:contact@epicerie-africaine.ca">
          contact@epicerie-africaine.ca
        </a>
        <br />
        Téléphone : +1 (514) 555-0123
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par :
        <br />
        <strong>Hostinger International Ltd</strong>
        <br />
        Kaunas, Lituanie
        <br />
        <a
          href="https://www.hostinger.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.hostinger.com
        </a>
      </p>

      <h2>Paiement en ligne</h2>
      <p>
        Les paiements sont traités de manière sécurisée par{" "}
        <strong>Stripe, Inc.</strong>, certifié PCI DSS niveau 1. Aucune
        donnée bancaire ne transite par nos serveurs.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu du site (textes, images, logos, graphismes) est
        la propriété exclusive d&apos;Épicerie Africaine ou de ses partenaires et
        est protégé par les lois canadiennes et internationales relatives à la
        propriété intellectuelle. Toute reproduction, même partielle, est
        interdite sans autorisation préalable.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        Épicerie Africaine s&apos;efforce de fournir des informations exactes et à
        jour. Toutefois, nous ne garantissons pas l&apos;exhaustivité ni
        l&apos;absence d&apos;erreurs. L&apos;utilisation du site se fait sous votre seule
        responsabilité.
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers. Épicerie
        Africaine n&apos;exerce aucun contrôle sur ces sites et décline toute
        responsabilité quant à leur contenu.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes mentions légales sont soumises au droit québécois. Tout
        litige sera de la compétence exclusive des tribunaux de Montréal,
        Québec, Canada.
      </p>
    </>
  );
}
