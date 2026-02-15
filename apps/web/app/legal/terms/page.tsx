import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
};

export default async function TermsPage() {
  const s = await getSiteSettings();
  const email = s.email || "contact@epicerie-africaine.ca";
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
      <h1>Conditions Générales de Vente</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>1. Objet et champ d&apos;application</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble
        des ventes réalisées sur le site <strong>epicerie-africaine.ca</strong>{" "}
        (ci-après « le Site »), exploité par {s.shopName}. Conformément à
        la <em>Loi sur la protection du consommateur</em> du Québec (LPC), la
        vente en ligne constitue un contrat conclu à distance.
      </p>
      <p>
        En passant commande sur le Site, le client reconnaît avoir pris
        connaissance des présentes CGV et les accepter sans réserve. Les CGV
        applicables sont celles en vigueur au jour de la commande.
      </p>

      <h2>2. Identification du commerçant</h2>
      <p>
        <strong>{s.shopName}</strong>
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

      <h2>3. Produits</h2>
      <h3>3.1 Description</h3>
      <p>
        Les produits proposés à la vente sont décrits avec la plus grande
        exactitude possible (dénomination, composition, origine, poids, prix).
        Les photographies illustratives ne font pas partie du champ contractuel.
        En cas d&apos;erreur manifeste sur le prix d&apos;un produit, la commande pourra
        être annulée et le client sera remboursé intégralement.
      </p>
      <h3>3.2 Disponibilité</h3>
      <p>
        Les produits sont proposés dans la limite des stocks disponibles. En cas
        d&apos;indisponibilité après validation de la commande, le client sera informé
        dans les plus brefs délais et pourra choisir entre un produit de
        substitution équivalent ou un remboursement intégral.
      </p>
      <h3>3.3 Allergènes et conservation</h3>
      <p>
        Les informations relatives aux allergènes sont indiquées sur la fiche
        produit et/ou sur l&apos;emballage. Le client est tenu de vérifier la liste
        des ingrédients avant consommation. Les produits alimentaires doivent
        être conservés conformément aux indications figurant sur l&apos;emballage.
      </p>

      <h2>4. Prix et taxes</h2>
      <p>
        Les prix sont indiqués en dollars canadiens (CAD). La TPS (5 %) et la
        TVQ (9,975 %) applicables sont calculées et affichées lors de la
        validation de la commande. Les frais de livraison sont indiqués
        séparément avant la confirmation. La livraison est gratuite pour toute
        commande dont le sous-total atteint 75,00 $.
      </p>

      <h2>5. Commande et paiement</h2>
      <h3>5.1 Processus de commande</h3>
      <p>
        Conformément à la LPC (articles 54.1 à 54.16), avant de conclure le
        contrat, le commerçant doit fournir au consommateur les renseignements
        suivants de manière évidente et compréhensible :
      </p>
      <ul>
        <li>L&apos;identité et les coordonnées du commerçant</li>
        <li>Une description détaillée des produits</li>
        <li>Le prix total incluant les taxes et frais de livraison</li>
        <li>Les modalités de livraison et la date prévue</li>
        <li>Les conditions d&apos;annulation, de retour et de remboursement</li>
      </ul>
      <p>
        Le consommateur doit avoir la possibilité d&apos;accepter ou de refuser la
        commande et d&apos;en corriger les erreurs avant de la confirmer.
      </p>
      <h3>5.2 Paiement</h3>
      <p>
        Le paiement est effectué via la plateforme sécurisée Stripe, certifiée
        PCI DSS niveau 1. Aucune donnée bancaire ne transite par nos serveurs.
        La commande est confirmée après validation du paiement.
      </p>
      <h3>5.3 Confirmation</h3>
      <p>
        Conformément à la LPC, un exemplaire du contrat est envoyé au
        consommateur par email dans les 15 jours suivant la conclusion du
        contrat. Ce document contient toutes les informations requises par la
        loi.
      </p>

      <h2 id="livraison">6. Livraison et retrait</h2>
      <h3>6.1 Livraison</h3>
      <p>
        Les livraisons sont effectuées dans la région de Montréal et ses
        environs. Les délais de livraison sont de 2 à 5 jours ouvrables et sont
        donnés à titre indicatif. En cas de retard supérieur à 30 jours par
        rapport à la date convenue, le consommateur peut annuler la commande
        (LPC, art. 54.8).
      </p>
      <h3>6.2 Retrait en magasin</h3>
      <p>
        Le retrait en magasin est disponible aux créneaux horaires proposés lors
        de la commande. Les commandes sont préparées dans un délai de 2 à 3
        heures ouvrées après validation.
      </p>
      <h3>6.3 Réception et conformité</h3>
      <p>
        Le client doit vérifier l&apos;état des produits à la réception. Tout produit
        endommagé ou non conforme doit être signalé dans les 48 heures avec
        photos à l&apos;appui.
      </p>

      <h2>7. Droit de résolution (annulation)</h2>
      <p>
        Conformément à la LPC (art. 54.8 à 54.16), le consommateur peut annuler
        un contrat conclu à distance dans les cas suivants :
      </p>
      <ul>
        <li>
          Le commerçant n&apos;a pas transmis les renseignements obligatoires avant la
          conclusion du contrat — annulation possible dans les 7 jours suivant
          la réception du contrat.
        </li>
        <li>
          Le commerçant n&apos;a pas envoyé le contrat dans les 15 jours suivant la
          commande — annulation possible dans les 30 jours suivant la commande.
        </li>
        <li>
          Le bien n&apos;a pas été livré dans les 30 jours suivant la date convenue —
          annulation possible avant la livraison.
        </li>
      </ul>
      <p>
        En plus de ces dispositions légales, nous offrons un droit de retour de
        10 jours pour les produits non périssables et non ouverts. Consultez
        notre{" "}
        <a href="/legal/refunds">Politique de retour et remboursement</a> pour
        les détails.
      </p>

      <h2>8. Garantie légale</h2>
      <p>
        Conformément aux articles 37 et 38 de la LPC, tous nos produits sont
        couverts par la garantie légale du Québec. Le produit vendu doit être
        conforme à sa description, propre à l&apos;usage auquel il est destiné et
        d&apos;une durabilité raisonnable.
      </p>

      <h2>9. Programme de fidélité</h2>
      <p>
        {s.shopName} offre un programme de fidélité attribuant des points
        sur chaque achat (1 point par dollar dépensé). Les points accumulés ne
        sont pas monnayables et sont soumis aux conditions du programme en
        vigueur.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est détaillé dans notre{" "}
        <a href="/legal/privacy">Politique de confidentialité</a>, conforme à la
        Loi 25 du Québec sur la protection des renseignements personnels.
      </p>

      <h2>11. Service à la clientèle et réclamations</h2>
      <p>
        Pour toute question ou réclamation, contactez notre service client :
      </p>
      <ul>
        <li>
          Email :{" "}
          <a href={`mailto:${email}`}>
            {email}
          </a>
        </li>
        <li>Téléphone : {phone}</li>
      </ul>
      <p>
        En cas de litige non résolu, le consommateur peut s&apos;adresser à
        l&apos;<strong>Office de la protection du consommateur du Québec</strong>{" "}
        (OPC) :{" "}
        <a
          href="https://www.opc.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.opc.gouv.qc.ca
        </a>
      </p>

      <h2>12. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit québécois, notamment à la{" "}
        <em>Loi sur la protection du consommateur</em> et au{" "}
        <em>Code civil du Québec</em>. Tout litige relatif à leur
        interprétation et/ou leur exécution relève des tribunaux compétents de
        Montréal, Québec, Canada.
      </p>

      <h2>13. Modification des CGV</h2>
      <p>
        {s.shopName} se réserve le droit de modifier les présentes CGV à
        tout moment. Les CGV applicables sont celles en vigueur au jour de la
        passation de la commande par le client.
      </p>
    </>
  );
}
