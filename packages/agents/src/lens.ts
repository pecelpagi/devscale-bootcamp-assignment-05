import { LensClient } from "@anvia/lens";

let client: LensClient | undefined;

// Anvia Lens records every agent run as a trace. It is optional: without
// ANVIA_LENS_PUBLIC_KEY and ANVIA_LENS_SECRET_KEY, getLens() returns undefined and tracing is off.
export function getLens(): LensClient | undefined {
  if (!process.env.ANVIA_LENS_PUBLIC_KEY || !process.env.ANVIA_LENS_SECRET_KEY) return undefined;
  if (!client) {
    client = new LensClient({
      baseUrl: process.env.ANVIA_LENS_BASE_URL,
      publicKey: process.env.ANVIA_LENS_PUBLIC_KEY,
      secretKey: process.env.ANVIA_LENS_SECRET_KEY,
      serviceName: "study-buddy-agent",
    });
  }
  return client;
}
