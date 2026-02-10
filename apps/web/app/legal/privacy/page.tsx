import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est Épicerie
        Africaine, dont le siège est situé à Montréal, Québec, Canada.
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les données suivantes lors de votre commande :</p>
      <ul>
        <li>Nom et prénom</li>
        <li>Adresse email</li>
        <li>Numéro de téléphone</li>
        <li>Adresse de livraison (si applicable)</li>
        <li>Historique de commandes</li>
      </ul>
      <p>
        Les informations de paiement (numéro de carte, etc.) sont traitées
        exclusivement par notre prestataire Stripe et ne transitent jamais par
        nos serveurs.
      </p>

      <h2>3. Finalités du traitement</h2>
      <p>Vos données sont utilisées pour :</p>
      <ul>
        <li>Traiter et livrer vos commandes</li>
        <li>Vous envoyer des confirmations de commande par email</li>
        <li>Gérer vos rendez-vous (Cal.com)</li>
        <li>Respecter nos obligations légales et fiscales</li>
      </ul>

      <h2>4. Partage des données</h2>
      <p>
        Vos données personnelles ne sont jamais vendues à des tiers. Elles
        peuvent être partagées avec :
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> — pour le traitement des paiements
        </li>
        <li>
          <strong>Cal.com</strong> — pour la gestion des rendez-vous
        </li>
        <li>
          <strong>Service de livraison</strong> — pour l&apos;acheminement de vos
          commandes
        </li>
      </ul>

      <h2>5. Durée de conservation</h2>
      <p>
        Les données de commande sont conservées pendant 5 ans conformément
        aux obligations fiscales canadiennes. Les données de compte peuvent
        être supprimées sur demande.
      </p>

      <h2>6. Vos droits</h2>
      <p>
        Conformément à la Loi 25 du Québec sur la protection des
        renseignements personnels, vous disposez des droits suivants :
      </p>
      <ul>
        <li>Droit d&apos;accès à vos données personnelles</li>
        <li>Droit de rectification des données inexactes</li>
        <li>Droit de suppression (sous réserve des obligations légales)</li>
        <li>Droit à la portabilité de vos données</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{" "}
        <a href="mailto:contact@epicerie-africaine.ca">
          contact@epicerie-africaine.ca
        </a>
        .
      </p>

      <h2>7. Cookies</h2>
      <p>
        Le site utilise uniquement des cookies techniques nécessaires au
        fonctionnement (panier, session). Aucun cookie de tracking ou
        publicitaire n&apos;est utilisé.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre les mesures techniques et organisationnelles
        appropriées pour protéger vos données personnelles contre tout accès
        non autorisé, modification, divulgation ou destruction.
      </p>
    </>
  );
}
