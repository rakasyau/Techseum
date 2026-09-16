/* Server-only environment access.
 *
 * Nothing here may be imported from a client component. Every value is read
 * from the server environment and is never prefixed with NEXT_PUBLIC_, so it
 * cannot be inlined into the browser bundle.
 *
 * Validation is lazy rather than at module load: importing this file during a
 * build must not fail just because a runtime secret is absent from the build
 * environment.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Set it in .env.local for local development, or in your host's ` +
        `environment settings for deployments. See .env.example.`
    );
  }
  return value;
}

export const serverEnv = {
  get mongodbUri(): string {
    return required("MONGODB_URI");
  },
  get mongodbDb(): string {
    return process.env.MONGODB_DB?.trim() || "techseum";
  },
  get authSecret(): string {
    const secret = required("AUTH_SECRET");
    if (secret.length < 32) {
      throw new Error(
        'AUTH_SECRET is too short. Use at least 32 characters, for example: ' +
          'node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"'
      );
    }
    return secret;
  },
  get aiApiKey(): string {
    return required("AI_API_KEY");
  },
  get aiModel(): string {
    return process.env.AI_MODEL?.trim() || "gemini-2.5-flash";
  },
  /** Returns null when newsletter sending is not configured. */
  get resendApiKey(): string | null {
    const value = process.env.RESEND_API_KEY?.trim();
    return value ? value : null;
  },
  get newsletterFrom(): string {
    return (
      process.env.NEWSLETTER_FROM?.trim() ||
      "Techseum <onboarding@resend.dev>"
    );
  },
  get newsletterAudienceId(): string | null {
    const value = process.env.NEWSLETTER_AUDIENCE_ID?.trim();
    return value ? value : null;
  },
};

/* Reports which secrets are configured, without revealing any value. Used by
 * a health endpoint so a misconfigured deployment is diagnosable. */
export function envHealth() {
  const check = (name: string) => Boolean(process.env[name]?.trim());
  return {
    mongodb: check("MONGODB_URI"),
    auth: check("AUTH_SECRET"),
    ai: check("AI_API_KEY"),
    newsletter: check("RESEND_API_KEY"),
  };
}
