import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default async function PrivacyPage() {
  const s = await getSiteSettings();
  const privacyEmail = s.supportEmail || "confidentialite@epicerie-africaine.ca";
  const addr = s.address;
  const fullAddress =
    addr?.line1
      ? [addr.line1, addr.line2, [addr.city, addr.province, addr.postalCode].filter(Boolean).join(" "), addr.country]
          .filter(Boolean)
          .join(", ")
      : "[Adresse complète à renseigner]";

  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="text-sm text-foreground/50">
        Dernière mise à jour : février 2026
      </p>
      <p>
        La présente politique de confidentialité est établie conformément à la{" "}
        <em>
          Loi sur la protection des renseignements personnels dans le secteur
          privé
        </em>{" "}
        du Québec, telle que modernisée par la{" "}
        <strong>Loi 25</strong> (Loi modernisant des dispositions législatives en
        matière de protection des renseignements personnels), ainsi qu&apos;à la{" "}
        <em>
          Loi sur la protection des renseignements personnels et les documents
          électroniques
        </em>{" "}
        (LPRPDE) du Canada.
      </p>

      <h2>1. Responsable de la protection des renseignements personnels</h2>
      <p>
        Conformément à la Loi 25, {s.shopName} a désigné un responsable
        de la protection des renseignements personnels :
      </p>
      <p>
        <strong>{s.shopName}</strong>
        <br />
        Responsable : [Nom du responsable à renseigner]
        <br />
        Email :{" "}
        <a href={`mailto:${privacyEmail}`}>
          {privacyEmail}
        </a>
        <br />
        Adresse : {fullAddress}
      </p>

      <h2>2. Renseignements personnels collectés</h2>
      <p>
        Nous collectons uniquement les renseignements nécessaires aux fins
        déterminées ci-dessous :
      </p>
      <h3>2.1 Lors de la création de compte</h3>
      <ul>
        <li>Nom et prénom</li>
        <li>Adresse email</li>
        <li>Mot de passe (chiffré, jamais stocké en clair)</li>
      </ul>
      <h3>2.2 Lors d&apos;une commande</h3>
      <ul>
        <li>Numéro de téléphone</li>
        <li>Adresse de livraison (si applicable)</li>
        <li>Historique et détails de commandes</li>
      </ul>
      <h3>2.3 Lors de la navigation</h3>
      <ul>
        <li>
          Données techniques : adresse IP, type de navigateur, pages visitées
        </li>
        <li>Contenu du panier (stocké localement dans votre navigateur)</li>
      </ul>
      <p>
        Les informations de paiement (numéro de carte, etc.) sont traitées
        exclusivement par notre prestataire{" "}
        <strong>Stripe, Inc.</strong> (certifié PCI DSS niveau 1) et ne
        transitent jamais par nos serveurs.
      </p>

      <h2>3. Finalités du traitement</h2>
      <p>Vos renseignements personnels sont utilisés pour :</p>
      <ul>
        <li>Traiter, préparer et livrer vos commandes</li>
        <li>Gérer votre compte client et votre programme de fidélité</li>
        <li>Vous envoyer des confirmations de commande et des notifications</li>
        <li>Gérer vos rendez-vous via Cal.com</li>
        <li>Répondre à vos demandes de service à la clientèle</li>
        <li>Respecter nos obligations légales et fiscales</li>
        <li>
          Améliorer nos services et l&apos;expérience utilisateur (données
          anonymisées)
        </li>
      </ul>

      <h2>4. Consentement</h2>
      <p>
        Conformément à la Loi 25, nous obtenons votre consentement de manière
        manifeste, libre et éclairée avant de collecter vos renseignements
        personnels. Le consentement est demandé pour chaque finalité distincte.
        Vous pouvez retirer votre consentement à tout moment en nous contactant.
      </p>

      <h2>5. Communication à des tiers</h2>
      <p>
        Vos renseignements personnels ne sont jamais vendus. Ils peuvent être
        communiqués aux tiers suivants, uniquement dans le cadre des finalités
        décrites :
      </p>
      <ul>
        <li>
          <strong>Stripe, Inc.</strong> (États-Unis) — traitement des paiements
        </li>
        <li>
          <strong>Supabase, Inc.</strong> (États-Unis) — hébergement de la base
          de données et authentification
        </li>
        <li>
          <strong>Cal.com, Inc.</strong> — gestion des rendez-vous
        </li>
        <li>
          <strong>Sanity AS</strong> (Norvège) — gestion du contenu (catalogue
          produits)
        </li>
        <li>
          <strong>Service de livraison</strong> — acheminement de vos commandes
          (nom, adresse, téléphone)
        </li>
      </ul>
      <p>
        Lorsque des renseignements sont communiqués à l&apos;extérieur du Québec,
        nous nous assurons qu&apos;un niveau de protection adéquat est offert,
        conformément à l&apos;article 17 de la Loi sur le secteur privé.
      </p>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>
          <strong>Données de compte :</strong> conservées tant que le compte est
          actif, puis supprimées dans les 30 jours suivant la demande de
          suppression.
        </li>
        <li>
          <strong>Données de commande :</strong> conservées pendant 6 ans
          conformément aux obligations fiscales canadiennes (Loi de l&apos;impôt sur
          le revenu).
        </li>
        <li>
          <strong>Données de navigation :</strong> conservées pour une durée
          maximale de 13 mois.
        </li>
      </ul>

      <h2>7. Vos droits (Loi 25)</h2>
      <p>
        Conformément à la Loi 25 et à la LPRPDE, vous disposez des droits
        suivants :
      </p>
      <ul>
        <li>
          <strong>Droit d&apos;accès :</strong> obtenir la communication de vos
          renseignements personnels détenus par nous.
        </li>
        <li>
          <strong>Droit de rectification :</strong> faire corriger des
          renseignements inexacts, incomplets ou équivoques.
        </li>
        <li>
          <strong>Droit de suppression :</strong> demander l&apos;effacement de vos
          renseignements (sous réserve des obligations légales de conservation).
        </li>
        <li>
          <strong>Droit à la portabilité :</strong> recevoir vos renseignements
          dans un format technologique structuré et couramment utilisé.
        </li>
        <li>
          <strong>Droit au retrait du consentement :</strong> retirer votre
          consentement à tout moment pour le traitement futur de vos données.
        </li>
        <li>
          <strong>Droit de déréférencement :</strong> demander la cessation de
          la diffusion d&apos;un renseignement personnel.
        </li>
      </ul>
      <p>
        Pour exercer ces droits, contactez notre responsable de la protection
        des renseignements personnels à{" "}
        <a href={`mailto:${privacyEmail}`}>
          {privacyEmail}
        </a>
        . Nous répondrons dans un délai de 30 jours.
      </p>

      <h2>8. Témoins (cookies) et technologies de suivi</h2>
      <p>
        Le site utilise uniquement des témoins (cookies) techniques nécessaires
        au fonctionnement :
      </p>
      <ul>
        <li>
          <strong>Témoin de session :</strong> maintien de votre session
          d&apos;authentification (durée : session)
        </li>
        <li>
          <strong>Panier :</strong> sauvegarde locale du contenu de votre panier
          (localStorage, aucune transmission à nos serveurs)
        </li>
      </ul>
      <p>
        Aucun témoin de traçage, publicitaire ou analytique n&apos;est utilisé. Aucun
        profilage n&apos;est effectué.
      </p>

      <h2>9. Mesures de sécurité</h2>
      <p>
        Nous mettons en œuvre les mesures techniques et organisationnelles
        appropriées pour protéger vos renseignements personnels :
      </p>
      <ul>
        <li>Chiffrement des communications (HTTPS/TLS)</li>
        <li>Authentification sécurisée avec hachage des mots de passe</li>
        <li>
          Politiques de sécurité au niveau de la base de données (Row Level
          Security)
        </li>
        <li>Accès restreint aux données selon le principe du moindre privilège</li>
        <li>Mises à jour régulières des dépendances et correctifs de sécurité</li>
      </ul>

      <h2>10. Incident de confidentialité</h2>
      <p>
        Conformément à la Loi 25, en cas d&apos;incident de confidentialité
        présentant un risque sérieux de préjudice, nous nous engageons à :
      </p>
      <ul>
        <li>
          Notifier la <strong>Commission d&apos;accès à l&apos;information du Québec</strong>{" "}
          (CAI) dans les plus brefs délais
        </li>
        <li>Aviser les personnes concernées par l&apos;incident</li>
        <li>
          Tenir un registre des incidents de confidentialité
        </li>
      </ul>

      <h2>11. Modifications de la politique</h2>
      <p>
        Nous nous réservons le droit de modifier la présente politique à tout
        moment. La date de dernière mise à jour est indiquée en haut de cette
        page. En cas de modification substantielle, les utilisateurs ayant un
        compte seront notifiés par email.
      </p>

      <h2>12. Plainte et recours</h2>
      <p>
        Si vous estimez que vos droits en matière de protection des
        renseignements personnels n&apos;ont pas été respectés, vous pouvez déposer
        une plainte auprès de la{" "}
        <strong>Commission d&apos;accès à l&apos;information du Québec</strong> :
      </p>
      <p>
        <a
          href="https://www.cai.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.cai.gouv.qc.ca
        </a>
        <br />
        Téléphone : 1-888-528-7741
      </p>
    </>
  );
}
