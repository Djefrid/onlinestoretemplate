import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de retour et remboursement",
};

export default function RefundsPage() {
  return (
    <>
      <h1>Politique de retour et remboursement</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>1. Délai de rétractation</h2>
      <p>
        Vous disposez d&apos;un délai de <strong>10 jours</strong> à compter de la
        réception de votre commande pour nous signaler tout problème ou
        demander un retour.
      </p>

      <h2>2. Produits éligibles au retour</h2>
      <p>Les retours sont acceptés pour :</p>
      <ul>
        <li>Les produits non périssables, non ouverts et dans leur emballage d&apos;origine</li>
        <li>Les produits cosmétiques et soins non ouverts</li>
        <li>Les produits reçus endommagés ou non conformes à la commande</li>
      </ul>

      <h2>3. Produits non éligibles</h2>
      <p>Les produits suivants ne peuvent pas être retournés :</p>
      <ul>
        <li>Produits frais et périssables</li>
        <li>Produits surgelés</li>
        <li>Produits ouverts ou entamés</li>
        <li>Produits dont la date de péremption est proche (moins de 30 jours)</li>
      </ul>

      <h2>4. Procédure de retour</h2>
      <ol>
        <li>
          Contactez-nous à{" "}
          <a href="mailto:contact@epicerie-africaine.ca">
            contact@epicerie-africaine.ca
          </a>{" "}
          en indiquant votre numéro de commande et le motif du retour.
        </li>
        <li>
          Nous vous confirmerons l&apos;éligibilité du retour sous 48 heures.
        </li>
        <li>
          Retournez les produits dans leur emballage d&apos;origine à l&apos;adresse qui
          vous sera communiquée.
        </li>
      </ol>

      <h2>5. Remboursement</h2>
      <p>
        Le remboursement est effectué dans un délai de{" "}
        <strong>10 jours ouvrables</strong> après réception et vérification
        des produits retournés. Le remboursement est crédité sur le moyen de
        paiement utilisé lors de la commande (via Stripe).
      </p>

      <h2>6. Produits endommagés ou non conformes</h2>
      <p>
        Si vous recevez un produit endommagé ou non conforme à votre commande,
        contactez-nous immédiatement avec des photos du produit. Nous
        procéderons à un remplacement ou un remboursement intégral, frais de
        retour inclus.
      </p>

      <h2>7. Frais de retour</h2>
      <p>
        Les frais de retour sont à la charge du client, sauf en cas de produit
        endommagé ou d&apos;erreur de notre part. Le retrait en magasin pour
        les retours est toujours gratuit.
      </p>
    </>
  );
}
