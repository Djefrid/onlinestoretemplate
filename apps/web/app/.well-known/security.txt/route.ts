/**
 * RFC 9116 — security.txt
 * Allows security researchers to know how to report vulnerabilities.
 * Accessible at: /.well-known/security.txt
 */
export async function GET() {
  const contactEmail =
    process.env.SECURITY_CONTACT_EMAIL || "security@example.com";
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const content = `Contact: mailto:${contactEmail}
Expires: ${expires}
Preferred-Languages: fr, en
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
