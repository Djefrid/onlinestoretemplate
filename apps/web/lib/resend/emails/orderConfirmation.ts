/**
 * Template email — Confirmation de commande
 * Utilisé après un paiement Stripe réussi (webhook checkout.session.completed).
 */

interface OrderItem {
  name: string;
  quantity: number;
  price_cents: number;
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  deliveryMode: "delivery" | "pickup";
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
  } | null;
  pickupSlot?: string | null;
}

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " $";
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
} {
  const subject = `✅ Commande confirmée — ${data.orderId.slice(-8).toUpperCase()}`;

  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #2d2a26; font-size: 14px;">
          ${item.name}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #6b6560; font-size: 14px; text-align: center; width: 50px;">
          ×${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #2d2a26; font-size: 14px; text-align: right; width: 90px; font-weight: 600;">
          ${formatCents(item.price_cents * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const deliverySection =
    data.deliveryMode === "delivery" && data.address
      ? `
      <div style="background: #faf9f7; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #6b6560; text-transform: uppercase;">Adresse de livraison</p>
        <p style="margin: 0; font-size: 14px; color: #2d2a26; line-height: 1.6;">
          ${data.address.line1}${data.address.line2 ? "<br>" + data.address.line2 : ""}<br>
          ${data.address.city}, ${data.address.province} ${data.address.postalCode}<br>
          ${data.address.country}
        </p>
      </div>`
      : data.deliveryMode === "pickup"
        ? `
      <div style="background: #faf9f7; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #6b6560; text-transform: uppercase;">Retrait en boutique</p>
        <p style="margin: 0; font-size: 14px; color: #2d2a26; line-height: 1.6;">
          ${data.pickupSlot ? `Créneau : <strong>${data.pickupSlot}</strong>` : "Nous vous contacterons pour confirmer votre créneau."}
        </p>
      </div>`
        : "";

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f2ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f2ed; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1714 0%, #2d2520 100%); border-radius: 16px 16px 0 0; padding: 36px 40px; text-align: center;">
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                Hawa Exotiques
              </p>
              <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.5);">
                L'Afrique authentique, livrée à votre porte.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px;">

              <!-- Checkmark + Titre -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: #f0fdf4; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 28px; margin-bottom: 16px;">✅</div>
                <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #1a1714; letter-spacing: -0.02em;">
                  Commande confirmée !
                </h1>
                <p style="margin: 0; font-size: 15px; color: #6b6560;">
                  Merci ${data.customerName.split(" ")[0]}, votre paiement a bien été reçu.
                </p>
              </div>

              <!-- Numéro de commande -->
              <div style="background: #faf9f7; border-radius: 10px; padding: 14px 20px; text-align: center; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 12px; color: #9b948e; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">N° de commande</p>
                <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #6858d8; font-family: 'Courier New', monospace; letter-spacing: 0.05em;">
                  #${data.orderId.slice(-8).toUpperCase()}
                </p>
              </div>

              <!-- Articles -->
              <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #6b6560; text-transform: uppercase;">Votre commande</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsRows}
                <!-- Sous-total -->
                <tr>
                  <td colspan="2" style="padding: 16px 0 4px; color: #6b6560; font-size: 14px;">Sous-total</td>
                  <td style="padding: 16px 0 4px; text-align: right; font-size: 14px; color: #2d2a26;">${formatCents(data.subtotalCents)}</td>
                </tr>
                <!-- Livraison -->
                <tr>
                  <td colspan="2" style="padding: 4px 0; color: #6b6560; font-size: 14px;">Livraison</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: ${data.shippingCents === 0 ? "#16a34a" : "#2d2a26"};">
                    ${data.shippingCents === 0 ? "Gratuite" : formatCents(data.shippingCents)}
                  </td>
                </tr>
                <!-- Total -->
                <tr>
                  <td colspan="2" style="padding: 16px 0 0; border-top: 2px solid #f0ede8; font-size: 16px; font-weight: 700; color: #1a1714;">Total payé</td>
                  <td style="padding: 16px 0 0; border-top: 2px solid #f0ede8; text-align: right; font-size: 18px; font-weight: 700; color: #6858d8;">${formatCents(data.totalCents)}</td>
                </tr>
              </table>

              <!-- Adresse / Créneau -->
              ${deliverySection}

              <!-- CTA -->
              <div style="text-align: center; margin-top: 36px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://epicerie-africaine.ca"}/account"
                   style="display: inline-block; background: #6858d8; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;">
                  Voir ma commande →
                </a>
              </div>

              <!-- Message -->
              <p style="margin: 32px 0 0; font-size: 14px; color: #9b948e; text-align: center; line-height: 1.6;">
                Une question ? Contactez-nous par WhatsApp ou par email.<br>
                Nous répondons en moins de 24h.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #b5afa9;">
                © ${new Date().getFullYear()} Hawa Exotiques — Tous droits réservés
              </p>
              <p style="margin: 4px 0 0; font-size: 12px; color: #c5bfb9;">
                Vous recevez cet email car vous avez passé une commande sur notre boutique.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return { subject, html };
}
