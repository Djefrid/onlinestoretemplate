import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
};

export default function TermsPage() {
  return (
    <>
      <h1>Conditions Générales de Vente</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble
        des ventes réalisées sur le site <strong>epicerie-africaine.ca</strong>{" "}
        (ci-après « le Site »), exploité par Épicerie Africaine.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les produits proposés à la vente sont décrits avec la plus grande
        exactitude possible. Les photographies illustratives ne font pas partie
        du champ contractuel. En cas d&apos;erreur manifeste sur le prix d&apos;un
        produit, la commande pourra être annulée.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en dollars canadiens (CAD), toutes taxes
        comprises (TTC). Les frais de livraison sont indiqués avant la
        confirmation de la commande. La livraison est gratuite pour toute
        commande supérieure à 75,00 $.
      </p>

      <h2>4. Commande</h2>
      <p>
        La validation de la commande implique l&apos;acceptation des présentes CGV.
        Le paiement est effectué via la plateforme sécurisée Stripe. La
        commande est confirmée par l&apos;envoi d&apos;un email de confirmation.
      </p>

      <h2 id="livraison">5. Livraison</h2>
      <p>
        Les livraisons sont effectuées dans la région de Montréal et ses
        environs. Les délais de livraison sont donnés à titre indicatif
        (généralement 2 à 5 jours ouvrables). Le retrait en magasin est
        disponible sur rendez-vous aux créneaux proposés lors de la commande.
      </p>

      <h2>6. Droit de rétractation</h2>
      <p>
        Conformément à la Loi sur la protection du consommateur du Québec,
        vous disposez d&apos;un droit de rétractation de 10 jours à compter de la
        réception de votre commande pour les produits non périssables et non
        ouverts. Les produits frais et surgelés ne sont pas éligibles au retour.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Épicerie Africaine ne saurait être tenue responsable des dommages
        résultant d&apos;une mauvaise utilisation des produits achetés. Nos
        produits alimentaires doivent être conservés conformément aux
        indications figurant sur l&apos;emballage.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est détaillé dans notre{" "}
        <a href="/legal/privacy">Politique de confidentialité</a>.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit québécois. Tout litige
        relatif à leur interprétation et/ou leur exécution relève des
        tribunaux compétents de Montréal, Québec, Canada.
      </p>
    </>
  );
}
