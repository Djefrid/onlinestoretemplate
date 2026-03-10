/**
 * Template email — Vérification d'adresse email (création de compte)
 * Utilisé par /api/auth/signup via supabase.auth.admin.generateLink()
 */

interface EmailVerificationData {
  customerName: string;
  verificationUrl: string;
}

export function buildEmailVerificationEmail(data: EmailVerificationData): {
  subject: string;
  html: string;
} {
  const subject = "✉️ Confirmez votre adresse email";
  const firstName = data.customerName.split(" ")[0];

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmez votre email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f2ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

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

              <!-- Icon + Title -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: #eff6ff; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 28px; margin-bottom: 16px;">✉️</div>
                <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #1a1714; letter-spacing: -0.02em;">
                  Confirmez votre email
                </h1>
                <p style="margin: 0; font-size: 15px; color: #6b6560;">
                  Bienvenue ${firstName} ! Plus qu'une étape pour activer votre compte.
                </p>
              </div>

              <!-- Divider -->
              <div style="border-top: 1px solid #f0ede8; margin: 0 0 28px;"></div>

              <!-- Message -->
              <p style="margin: 0 0 24px; font-size: 15px; color: #2d2a26; line-height: 1.7; text-align: center;">
                Cliquez sur le bouton ci-dessous pour confirmer votre adresse email
                et accéder à votre espace client.
              </p>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.verificationUrl}"
                   style="display: inline-block; background: #6858d8; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; letter-spacing: -0.01em;">
                  Confirmer mon email →
                </a>
              </div>

              <!-- Security note -->
              <div style="background: #faf9f7; border-radius: 10px; padding: 16px 20px; margin-top: 28px;">
                <p style="margin: 0; font-size: 13px; color: #9b948e; line-height: 1.6; text-align: center;">
                  🔒 Ce lien est valide pendant <strong>24 heures</strong>.<br>
                  Si vous n'avez pas créé de compte, ignorez simplement cet email.
                </p>
              </div>

              <!-- Fallback link -->
              <p style="margin: 24px 0 0; font-size: 12px; color: #b5afa9; text-align: center; line-height: 1.6;">
                Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :<br>
                <span style="color: #6858d8; word-break: break-all;">${data.verificationUrl}</span>
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
                Vous recevez cet email car vous avez créé un compte sur notre boutique.
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
