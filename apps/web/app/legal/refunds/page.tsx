import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Politique de retour et remboursement",
};

export default async function RefundsPage() {
  const s = await getSiteSettings();
  const email = s.email || "contact@epicerie-africaine.ca";
  const phone = s.phone || "[Numéro à renseigner]";

  return (
    <>
      <h1>Politique de retour et remboursement</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>
      <p>
        La présente politique complète les dispositions de la{" "}
        <em>Loi sur la protection du consommateur</em> du Québec (LPC)
        relatives aux contrats conclus à distance (articles 54.1 à 54.16).
      </p>

      <h2>1. Droit d&apos;annulation légal (LPC)</h2>
      <p>
        Conformément à la LPC, le consommateur peut annuler un contrat conclu à
        distance dans les cas suivants :
      </p>
      <ul>
        <li>
          Si le commerçant n&apos;a pas divulgué tous les renseignements obligatoires
          avant la commande — <strong>annulation dans les 7 jours</strong>{" "}
          suivant la réception du contrat écrit.
        </li>
        <li>
          Si le contrat écrit n&apos;a pas été transmis dans les 15 jours suivant la
          commande — <strong>annulation dans les 30 jours</strong> suivant la
          commande.
        </li>
        <li>
          Si le bien n&apos;a pas été livré dans les 30 jours suivant la date convenue
          — <strong>annulation avant la livraison</strong>.
        </li>
      </ul>
      <p>
        L&apos;annulation s&apos;effectue par avis écrit (email ou courrier) au
        commerçant. Le remboursement est effectué dans les 15 jours suivant
        l&apos;annulation ou la restitution du bien.
      </p>

      <h2>2. Politique de retour volontaire</h2>
      <p>
        En plus de vos droits légaux, nous offrons une politique de retour
        volontaire de <strong>10 jours</strong> à compter de la réception de
        votre commande.
      </p>
      <h3>2.1 Produits éligibles au retour</h3>
      <ul>
        <li>
          Produits non périssables, non ouverts et dans leur emballage d&apos;origine
        </li>
        <li>Produits cosmétiques et soins non ouverts et scellés</li>
        <li>Épices et produits secs dans leur emballage d&apos;origine non ouvert</li>
      </ul>
      <h3>2.2 Produits non éligibles au retour volontaire</h3>
      <ul>
        <li>
          Produits frais et périssables (fruits, légumes, produits réfrigérés)
        </li>
        <li>Produits surgelés</li>
        <li>Produits ouverts ou entamés</li>
        <li>
          Produits dont la date de péremption est inférieure à 30 jours au
          moment du retour
        </li>
      </ul>
      <p className="text-sm text-foreground/60">
        Note : même si un produit n&apos;est pas éligible au retour volontaire, vos
        droits légaux en vertu de la LPC et de la garantie légale du Québec
        demeurent pleinement applicables.
      </p>

      <h2>3. Produits défectueux, endommagés ou non conformes</h2>
      <p>
        Conformément à la garantie légale du Québec (LPC, art. 37-38), si vous
        recevez un produit :
      </p>
      <ul>
        <li>Endommagé lors du transport</li>
        <li>Non conforme à la description ou à votre commande</li>
        <li>Impropre à l&apos;usage auquel il est destiné</li>
        <li>Dont la qualité ne correspond pas aux attentes raisonnables</li>
      </ul>
      <p>
        Contactez-nous <strong>dans les 48 heures</strong> suivant la réception
        avec des photos du produit. Nous procéderons au choix à :
      </p>
      <ul>
        <li>Un remplacement du produit (sans frais)</li>
        <li>Un remboursement intégral incluant les frais de livraison</li>
      </ul>

      <h2>4. Procédure de retour</h2>
      <ol>
        <li>
          Contactez-nous à{" "}
          <a href={`mailto:${email}`}>
            {email}
          </a>{" "}
          en indiquant votre numéro de commande, les produits concernés et le
          motif du retour.
        </li>
        <li>
          Nous confirmerons l&apos;éligibilité du retour sous 48 heures ouvrables et
          vous transmettrons les instructions de retour.
        </li>
        <li>
          Retournez les produits dans leur emballage d&apos;origine à l&apos;adresse qui
          vous sera communiquée, ou déposez-les en magasin.
        </li>
        <li>
          Après réception et vérification, le remboursement sera traité.
        </li>
      </ol>

      <h2>5. Remboursement</h2>
      <ul>
        <li>
          <strong>Délai :</strong> le remboursement est effectué dans un délai
          de <strong>10 jours ouvrables</strong> après réception et vérification
          des produits retournés.
        </li>
        <li>
          <strong>Mode :</strong> le remboursement est crédité sur le moyen de
          paiement utilisé lors de la commande (via Stripe).
        </li>
        <li>
          <strong>Montant :</strong> le remboursement inclut le prix du produit
          et les taxes applicables. Les frais de livraison initiaux sont
          remboursés uniquement en cas de produit défectueux ou d&apos;erreur de
          notre part.
        </li>
      </ul>

      <h2>6. Frais de retour</h2>
      <ul>
        <li>
          <strong>Retour volontaire :</strong> les frais de retour sont à la
          charge du client.
        </li>
        <li>
          <strong>Produit défectueux ou erreur :</strong> les frais de retour
          sont à notre charge.
        </li>
        <li>
          <strong>Retrait en magasin :</strong> le dépôt en magasin pour les
          retours est toujours gratuit.
        </li>
      </ul>

      <h2>7. Annulation avant expédition</h2>
      <p>
        Si votre commande n&apos;a pas encore été expédiée ou préparée, vous pouvez
        l&apos;annuler sans frais en nous contactant par email. Le remboursement
        intégral sera effectué dans les 5 jours ouvrables.
      </p>

      <h2>8. Contact</h2>
      <p>
        Pour toute question relative aux retours et remboursements :
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
        En cas de litige, vous pouvez vous adresser à l&apos;
        <strong>Office de la protection du consommateur du Québec</strong> :{" "}
        <a
          href="https://www.opc.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.opc.gouv.qc.ca
        </a>
      </p>
    </>
  );
}
