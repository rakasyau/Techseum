/*
 * Sends the weekly digest to every subscribed address.
 *
 *   node scripts/send-digest.mjs
 *
 * Reads MONGODB_URI, RESEND_API_KEY and NEWSLETTER_FROM from .env.local, so it
 * is a local/admin operation rather than a public endpoint. Run it from a cron
 * job or by hand once a week.
 */

import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Minimal .env.local loader so this script has no dependencies.
for (const file of [".env.local", ".env"]) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB || "techseum";
const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.NEWSLETTER_FROM || "Techseum <onboarding@resend.dev>";

if (!URI) throw new Error("MONGODB_URI is not set");
if (!KEY) throw new Error("RESEND_API_KEY is not set");

// A small, hand-picked set of exhibits for this week. Edit before sending.
const FEATURES = [
  {
    title: "How Does a CPU Work?",
    summary:
      "A CPU fetches instructions, decodes them, executes them and writes the result back, billions of times per second.",
    url: "https://techseum.rakasyau.my.id/explore/cpu",
  },
  {
    title: "How Wi-Fi Carries Data",
    summary:
      "Your data is modulated onto carrier waves, sent in tiny time slices across a shared channel, and reassembled at the other end.",
    url: "https://techseum.rakasyau.my.id/explore/wifi",
  },
  {
    title: "How a Camera Captures Light",
    summary:
      "A lens focuses light onto a sensor, and aperture, shutter and ISO set the exposure budget.",
    url: "https://techseum.rakasyau.my.id/explore/camera",
  },
];

function digestHtml() {
  const rows = FEATURES.map(
    (e) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #ECECEC;">
          <a href="${e.url}" style="display:block;font-size:16px;font-weight:600;letter-spacing:-0.02em;color:#0A0A0A;text-decoration:none;margin-bottom:6px;">
            ${e.title}
          </a>
          <span style="display:block;font-size:14px;line-height:1.65;color:#6B6B70;">
            ${e.summary}
          </span>
        </td>
      </tr>`
  ).join("");

  return `<!doctype html><html><body style="margin:0;background:#FFFFFF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;">
<tr><td style="padding-bottom:24px;"><span style="font-size:18px;font-weight:700;letter-spacing:-0.04em;color:#0A0A0A;">&#9678; Techseum</span></td></tr>
<tr><td style="border:1px solid #ECECEC;border-radius:20px;padding:32px;">
<p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#4F46E5;">This week at Techseum</p>
<h1 style="margin:0 0 20px;font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:#0A0A0A;">New exhibits to explore</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr><td style="background:#0A0A0A;border-radius:999px;"><a href="https://techseum.rakasyau.my.id/explore" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">Explore all exhibits</a></td></tr></table>
</td></tr>
<tr><td style="padding-top:24px;"><p style="margin:0;font-size:12px;line-height:1.6;color:#6B6B70;">You&rsquo;re receiving this because you subscribed to the Techseum newsletter.</p></td></tr>
</table></td></tr></table></body></html>`;
}

const SubscriberSchema = new mongoose.Schema(
  { email: String, unsubscribedAt: Date },
  { strict: false }
);

async function main() {
  await mongoose.connect(URI, { dbName: DB });
  const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

  const subs = await Subscriber.find({
    $or: [{ unsubscribedAt: null }, { unsubscribedAt: { $exists: false } }],
  })
    .select("email")
    .lean();

  const recipients = subs.map((s) => s.email).filter(Boolean);
  console.log(`Recipients: ${recipients.length}`);

  if (recipients.length === 0) {
    await mongoose.disconnect();
    return;
  }

  const html = digestHtml();
  const subject = "New exhibits to explore this week";
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (res.ok) {
      sent += 1;
    } else {
      failed += 1;
      const body = await res.text();
      console.log(`  FAILED ${to} ${res.status} ${body.slice(0, 120)}`);
    }
  }

  console.log(`Sent: ${sent}  Failed: ${failed}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
