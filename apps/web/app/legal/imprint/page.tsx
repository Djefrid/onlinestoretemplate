import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default async function ImprintPage() {
  const s = await getSiteSettings();
  const email = s.email || "contact@epicerie-africaine.ca";
  const privacyEmail = s.supportEmail || "confidentialite@epicerie-africaine.ca";
  const phone = s.phone || "[Numéro à renseigner]";
  const addr = s.address;
  const fullAddress =
    addr?.line1
      ? [addr.line1, addr.line2, [addr.city, addr.province, addr.postalCode].filter(Boolean).join(" "), addr.country]
          .filter(Boolean)
          .join(", ")
      : "[Adresse complète à renseigner]";

  return (
    <>
      <h1>Mentions légales</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>Éditeur du site</h2>
      <p>
        <strong>{s.shopName}</strong>
        <br />
        [Forme juridique à renseigner — ex : Entreprise individuelle / Inc. /
        S.E.N.C.]
        <br />
        NEQ : [Numéro d&apos;entreprise du Québec à renseigner]
        <br />
        Adresse : {fullAddress}
        <br />
        Email :{" "}
        <a href={`mailto:${email}`}>
          {email}
        </a>
        <br />
        Téléphone : {phone}
      </p>

      <h2>Responsable de la protection des renseignements personnels</h2>
      <p>
        Conformément à la Loi 25 du Québec, un responsable de la protection des
        renseignements personnels a été désigné :
      </p>
      <p>
        [Nom du responsable à renseigner]
        <br />
        Email :{" "}
        <a href={`mailto:${privacyEmail}`}>
          {privacyEmail}
        </a>
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
        <strong>Stripe, Inc.</strong>, certifié PCI DSS niveau 1. Aucune donnée
        bancaire ne transite par nos serveurs. Pour plus d&apos;informations :{" "}
        <a
          href="https://stripe.com/fr-ca/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Politique de confidentialité de Stripe
        </a>
        .
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu du site (textes, images, logos, graphismes, code
        source) est la propriété exclusive d&apos;{s.shopName} ou de ses
        partenaires et est protégé par les lois canadiennes et internationales
        relatives à la propriété intellectuelle, notamment la{" "}
        <em>Loi sur le droit d&apos;auteur</em> du Canada. Toute reproduction, même
        partielle, est interdite sans autorisation écrite préalable.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        {s.shopName} s&apos;efforce de fournir des informations exactes et à
        jour sur le site. Toutefois, nous ne garantissons pas l&apos;exhaustivité ni
        l&apos;absence d&apos;erreurs. L&apos;utilisation du site se fait sous votre seule
        responsabilité. En cas d&apos;erreur de prix manifeste, la commande pourra
        être annulée et le client remboursé intégralement.
      </p>

      <h2>Accessibilité</h2>
      <p>
        {s.shopName} s&apos;engage à rendre son site accessible au plus grand
        nombre. Si vous rencontrez des difficultés d&apos;accessibilité, veuillez
        nous contacter à{" "}
        <a href={`mailto:${email}`}>
          {email}
        </a>
        .
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers (Stripe, Cal.com,
        etc.). {s.shopName} n&apos;exerce aucun contrôle sur ces sites et
        décline toute responsabilité quant à leur contenu et leurs pratiques en
        matière de protection des renseignements personnels.
      </p>

      <h2>Droit applicable et juridiction</h2>
      <p>
        Les présentes mentions légales sont soumises au droit québécois,
        notamment à la <em>Loi sur la protection du consommateur</em>, à la{" "}
        <em>
          Loi sur la protection des renseignements personnels dans le secteur
          privé
        </em>{" "}
        et au <em>Code civil du Québec</em>. Tout litige sera de la compétence
        exclusive des tribunaux de Montréal, Québec, Canada.
      </p>

      <h2>Recours</h2>
      <p>En cas de litige, vous pouvez contacter :</p>
      <ul>
        <li>
          <strong>Office de la protection du consommateur (OPC) :</strong>{" "}
          <a
            href="https://www.opc.gouv.qc.ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.opc.gouv.qc.ca
          </a>{" "}
          — 1-888-672-2556
        </li>
        <li>
          <strong>
            Commission d&apos;accès à l&apos;information du Québec (CAI) :
          </strong>{" "}
          <a
            href="https://www.cai.gouv.qc.ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.cai.gouv.qc.ca
          </a>{" "}
          — 1-888-528-7741 (pour les questions de vie privée)
        </li>
      </ul>
    </>
  );
}
