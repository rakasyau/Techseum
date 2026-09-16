/*
 * Diagnostic for the Resend integration.
 *
 *   node scripts/test-email.mjs [recipient@example.com]
 *
 * Sends the real account-welcome email through every From address that could
 * be in play, and prints the exact HTTP status and Resend response body for
 * each attempt. Run this first whenever "the email did not arrive": it
 * separates a bad API key (401) from a rejected From address (403) from a
 * genuine success (200).
 *
 * Defaults to the recipient passed on the command line, or RESEND_TEST_TO,
 * or the account owner's address.
 */

import fs from "node:fs";
import path from "node:path";

for (const file of [".env.local", ".env"]) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const KEY = process.env.RESEND_API_KEY;
if (!KEY) throw new Error("RESEND_API_KEY is not set in .env.local");

const TO =
  process.argv[2] || process.env.RESEND_TEST_TO || "rakafile29@gmail.com";

const CONFIGURED =
  process.env.NEWSLETTER_FROM || "Techseum <news@techseum.rakasyau.my.id>";

const CANDIDATES = [
  CONFIGURED,
  "Techseum <onboarding@resend.dev>",
].filter((v, i, a) => a.indexOf(v) === i);

const subject = "Your Techseum account is ready";
const html = `<!doctype html><html><body style="margin:0;background:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding-bottom:24px;"><span style="font-size:18px;font-weight:700;letter-spacing:-0.04em;color:#0A0A0A;">&#9678; Techseum</span></td></tr>
<tr><td style="border:1px solid #ECECEC;border-radius:20px;padding:32px;">
<h1 style="margin:0 0 16px;font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:#0A0A0A;">Welcome to Techseum.</h1>
<p style="margin:0;font-size:15px;line-height:1.7;color:#6B6B70;">This is a delivery test from <strong>scripts/test-email.mjs</strong>. If you can read it, the Resend integration works.</p>
</td></tr>
</table></td></tr></table></body></html>`;

async function attempt(from) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [TO], subject, html }),
  });

  const raw = await res.text();
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  return { ok: res.ok, status: res.status, body: parsed ?? raw };
}

async function main() {
  console.log(`Key length: ${KEY.length}  prefix: ${KEY.slice(0, 6)}...`);
  console.log(`Recipient:  ${TO}`);
  console.log("");

  let anySuccess = false;

  for (const from of CANDIDATES) {
    const r = await attempt(from);
    console.log(`FROM ${from}`);
    console.log(`  -> HTTP ${r.status} ${r.ok ? "OK" : "ERROR"}`);
    console.log(`  -> ${JSON.stringify(r.body)}`);
    console.log("");
    if (r.ok) anySuccess = true;
  }

  if (!anySuccess) {
    console.log(
      "No attempt succeeded. If every status is 401, the API key itself is " +
        "invalid or revoked and must be recreated in the Resend dashboard. A " +
        "403 on the custom domain only means that From address is not allowed."
    );
    process.exitCode = 1;
  } else {
    console.log("At least one send succeeded. Check the inbox (and spam).");
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
