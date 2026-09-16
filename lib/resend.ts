import { serverEnv } from "./env";
import { welcomeEmail, accountWelcomeEmail } from "./email-templates";

/*
 * Resend integration.
 *
 * Two independent effects on subscribe:
 *   1. Add the address to a Resend audience, if one is configured.
 *   2. Send the welcome email.
 *
 * Both are best-effort. The subscriber is already persisted locally before
 * this runs, so a Resend outage loses nothing; the route reports the provider
 * state separately so the UI can still confirm the subscription.
 */

const RESEND_API = "https://api.resend.com";

export interface ProviderResult {
  audience: "added" | "duplicate" | "skipped" | "failed";
  email: "sent" | "skipped" | "failed";
}

export function newsletterConfigured(): boolean {
  return serverEnv.resendApiKey !== null;
}

async function resend(
  path: string,
  init: RequestInit
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const key = serverEnv.resendApiKey;
  if (!key) return { ok: false, status: 0, body: { message: "not configured" } };

  try {
    const response = await fetch(RESEND_API + path, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      signal: AbortSignal.timeout(15000),
    });

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: { message: error instanceof Error ? error.message : "network error" },
    };
  }
}

/** Adds the address to the configured audience. No-op when none is set. */
export async function addToAudience(email: string): Promise<ProviderResult["audience"]> {
  const audienceId = serverEnv.newsletterAudienceId;
  if (!audienceId) return "skipped";

  const result = await resend(`/audiences/${audienceId}/contacts`, {
    method: "POST",
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (result.ok) return "added";

  const body = result.body as { message?: string; name?: string } | null;
  const message = (body?.message ?? "").toLowerCase();

  // 409 / "already exists" means the contact is already there, which is fine.
  if (result.status === 409 || message.includes("already exists")) {
    return "duplicate";
  }

  /*
   * A key scoped to "send emails only" cannot manage audiences. That is a
   * deliberate key configuration rather than a failure, so treat it as
   * skipped: the subscriber is still stored locally, which is the source of
   * truth for the newsletter list.
   */
  if (result.status === 401 || result.status === 403) return "skipped";

  return "failed";
}

/** Sends the welcome email. */
export async function sendWelcomeEmail(
  email: string
): Promise<ProviderResult["email"]> {
  if (!serverEnv.resendApiKey) return "skipped";

  const { subject, html, text } = welcomeEmail();
  const result = await resend("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: serverEnv.newsletterFrom,
      to: [email],
      subject,
      html,
      text,
    }),
  });

  return result.ok ? "sent" : "failed";
}

/**
 * Sends the account-creation welcome. Distinct from the newsletter welcome:
 * this one explains the product to someone who just signed up.
 *
 * Never throws. A registration must succeed even if the email provider is
 * down, so the route treats a failure here as non-fatal.
 */
export async function sendAccountWelcomeEmail(
  email: string,
  displayName: string
): Promise<ProviderResult["email"]> {
  if (!serverEnv.resendApiKey) return "skipped";

  const { subject, html, text } = accountWelcomeEmail(displayName);
  const result = await resend("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: serverEnv.newsletterFrom,
      to: [email],
      subject,
      html,
      text,
    }),
  });

  return result.ok ? "sent" : "failed";
}

/** Sends an arbitrary template to a list of recipients. Used for the digest. */
export async function sendToRecipients(
  recipients: string[],
  template: { subject: string; html: string; text: string }
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    const result = await resend("/emails", {
      method: "POST",
      body: JSON.stringify({
        from: serverEnv.newsletterFrom,
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });
    if (result.ok) sent += 1;
    else failed += 1;
  }

  return { sent, failed };
}
