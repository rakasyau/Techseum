/*
 * Newsletter email templates.
 *
 * Both are plain-table HTML with inline styles because email clients do not
 * support modern CSS. They deliberately mirror the site's design language:
 * white ground, near-black display type, one indigo accent, hairline rules.
 *
 * Copy these into Resend as templates, or send them directly from the API by
 * using the `html` field these functions return.
 */

import { TOPICS } from "./data/topics";

const INK = "#0A0A0A";
const MUTED = "#6B6B70";
const LINE = "#ECECEC";
const ACCENT = "#4F46E5";
const PAPER_ALT = "#F7F7F8";

function shell(inner: string, footerNote: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Techseum</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;">

        <!-- Wordmark -->
        <tr>
          <td style="padding-bottom:24px;">
            <span style="font-size:18px;font-weight:700;letter-spacing:-0.04em;color:${INK};">
              &#9678; Techseum
            </span>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="border:1px solid ${LINE};border-radius:20px;padding:32px;">
            ${inner}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:24px;">
            <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:${MUTED};">
              ${footerNote}
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};">
              <a href="https://techseum.rakasyau.my.id/explore" style="color:${ACCENT};text-decoration:none;">Browse exhibits</a>
              &nbsp;&middot;&nbsp;
              <a href="https://techseum.rakasyau.my.id/about" style="color:${ACCENT};text-decoration:none;">About</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Sent the moment someone subscribes. */
export function welcomeEmail(): { subject: string; html: string; text: string } {
  const inner = `
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:${INK};">
      You&rsquo;re on the list.
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${MUTED};">
      Thanks for subscribing. Every week we publish one new exhibit explaining how
      an everyday piece of technology actually works &mdash; as a diagram you can
      operate, a model you can turn over, and a bench where you change one
      variable to see what happens.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER_ALT};border-radius:14px;margin-bottom:24px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${MUTED};">
            Start here
          </p>
          <p style="margin:0 0 6px;font-size:14px;line-height:1.5;">
            <a href="https://techseum.rakasyau.my.id/explore/cpu" style="color:${INK};text-decoration:none;font-weight:600;">How does a CPU work?</a>
          </p>
          <p style="margin:0 0 6px;font-size:14px;line-height:1.5;">
            <a href="https://techseum.rakasyau.my.id/explore/wifi" style="color:${INK};text-decoration:none;font-weight:600;">How Wi-Fi carries data</a>
          </p>
          <p style="margin:0;font-size:14px;line-height:1.5;">
            <a href="https://techseum.rakasyau.my.id/explore/camera" style="color:${INK};text-decoration:none;font-weight:600;">How a camera captures light</a>
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${INK};border-radius:999px;">
          <a href="https://techseum.rakasyau.my.id/explore" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">
            Start exploring
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: "You're on the list — welcome to Techseum",
    html: shell(
      inner,
      "You received this because you subscribed to the Techseum newsletter."
    ),
    text: [
      "You're on the list.",
      "",
      "Thanks for subscribing. Every week we publish one new exhibit explaining",
      "how an everyday piece of technology actually works.",
      "",
      "Start here:",
      "- How does a CPU work? https://techseum.rakasyau.my.id/explore/cpu",
      "- How Wi-Fi carries data https://techseum.rakasyau.my.id/explore/wifi",
      "- How a camera captures light https://techseum.rakasyau.my.id/explore/camera",
      "",
      "Start exploring: https://techseum.rakasyau.my.id/explore",
      "",
      "You received this because you subscribed to the Techseum newsletter.",
    ].join("\n"),
  };
}

/** Sent once, when someone first creates an account. */
export function accountWelcomeEmail(
  displayName: string
): { subject: string; html: string; text: string } {
  // Only the first word is used, so "Ari Wibowo" reads as "Hi Ari".
  const firstName = displayName.trim().split(/\s+/)[0] || "there";

  const inner = `
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:${INK};">
      Welcome to Techseum.
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${MUTED};">
      Hi ${firstName} &mdash; your account is ready. Your progress, XP and
      bookmarks are now saved to it, so everything you explore stays with you.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER_ALT};border-radius:14px;margin-bottom:24px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${MUTED};">
            How to use the museum
          </p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">
            <span style="color:${INK};font-weight:600;">1. Pick an exhibit.</span>
            <span style="color:${MUTED};">${TOPICS.length} of them, across five wings of technology.</span>
          </p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">
            <span style="color:${INK};font-weight:600;">2. Choose a depth.</span>
            <span style="color:${MUTED};">From a plain-language intro to the real engineering constraints.</span>
          </p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">
            <span style="color:${INK};font-weight:600;">3. Take it apart.</span>
            <span style="color:${MUTED};">Drive the diagram, orbit the 3D model, change the values in a lab bench.</span>
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;">
            <span style="color:${INK};font-weight:600;">4. Prove you got it.</span>
            <span style="color:${MUTED};">A short challenge at the end of every exhibit, worth XP.</span>
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${INK};border-radius:999px;">
          <a href="https://techseum.rakasyau.my.id/explore" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">
            Start with the CPU
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:${MUTED};">
      Prefer to look around first? The
      <a href="https://techseum.rakasyau.my.id/lab" style="color:${ACCENT};text-decoration:none;">Lab</a>
      and
      <a href="https://techseum.rakasyau.my.id/scenarios/open-a-website" style="color:${ACCENT};text-decoration:none;">How It Works</a>
      need no account at all.
    </p>
  `;

  return {
    subject: "Your Techseum account is ready",
    html: shell(
      inner,
      "You received this because you created a Techseum account."
    ),
    text: [
      "Welcome to Techseum.",
      "",
      "Hi " + firstName + " - your account is ready. Your progress, XP and",
      "bookmarks are now saved to it.",
      "",
      "How to use the museum:",
      "1. Pick an exhibit. " + TOPICS.length + " of them, across five wings.",
      "2. Choose a depth, from plain language to deep engineering.",
      "3. Take it apart: drive the diagram, orbit the 3D model, use a lab bench.",
      "4. Prove you got it with a short challenge, worth XP.",
      "",
      "Start with the CPU: https://techseum.rakasyau.my.id/explore",
      "",
      "You received this because you created a Techseum account.",
    ].join("\n"),
  };
}

/** Weekly digest template. Pass the exhibits to feature this week. */
export function weeklyDigestEmail(
  exhibits: { title: string; summary: string; url: string }[]
): { subject: string; html: string; text: string } {
  const rows = exhibits
    .map(
      (e) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${LINE};">
          <a href="${e.url}" style="display:block;font-size:16px;font-weight:600;letter-spacing:-0.02em;color:${INK};text-decoration:none;margin-bottom:6px;">
            ${e.title}
          </a>
          <span style="display:block;font-size:14px;line-height:1.65;color:${MUTED};">
            ${e.summary}
          </span>
        </td>
      </tr>`
    )
    .join("");

  const inner = `
    <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};">
      This week at Techseum
    </p>
    <h1 style="margin:0 0 20px;font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:${INK};">
      New exhibits to explore
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
    </table>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:${MUTED};">
      Every exhibit has four depth levels, a diagram you can drive and a short
      challenge at the end.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
      <tr>
        <td style="background:${INK};border-radius:999px;">
          <a href="https://techseum.rakasyau.my.id/explore" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">
            Explore all exhibits
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: "New exhibits to explore this week",
    html: shell(
      inner,
      "You're receiving this because you subscribed to the Techseum newsletter."
    ),
    text: [
      "New exhibits to explore",
      "",
      ...exhibits.flatMap((e) => [`${e.title}`, e.summary, e.url, ""]),
      "Explore all exhibits: https://techseum.rakasyau.my.id/explore",
    ].join("\n"),
  };
}
