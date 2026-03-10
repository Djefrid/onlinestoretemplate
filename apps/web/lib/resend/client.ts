import { Resend } from "resend";

export const isResendConfigured = !!process.env.RESEND_API_KEY;

export const resend = isResendConfigured
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/** Adresse expéditeur — configurer RESEND_FROM_EMAIL dans .env */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Hawa Exotiques <noreply@djefrid.ca>";
