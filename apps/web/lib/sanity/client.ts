import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * Returns true if Sanity is configured (projectId is set).
 * Used to skip Sanity calls and fall back to mock data during dev/build.
 */
export const isSanityConfigured = Boolean(projectId);

function buildClient(token?: string): SanityClient {
  return createClient({
    projectId: projectId || "placeholder",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
    useCdn: !token && process.env.NODE_ENV === "production",
    token,
  });
}

/** Read-only client for fetching content */
export const sanityClient = isSanityConfigured
  ? buildClient()
  : (null as unknown as SanityClient);

/**
 * Write-enabled client for server-side mutations (webhook → create order).
 * Only use in API routes / server actions.
 */
export const sanityWriteClient = isSanityConfigured
  ? buildClient(process.env.SANITY_API_TOKEN)
  : (null as unknown as SanityClient);
