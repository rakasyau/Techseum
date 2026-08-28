/**
 * Techseum Email Dispatcher Service
 * Supports Resend API, SMTP, or Local Dev Preview Simulation
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export function generateWeeklyExhibitNewsletterHtml(options: {
  subscriberEmail: string;
  featuredExhibitTitle: string;
  featuredExhibitDesc: string;
  exhibitSlug: string;
}): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techseum Weekly Exhibit</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .card { background-color: #0B1120; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6); }
    .header { padding: 32px 32px 24px; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, transparent 100%); }
    .brand { font-size: 20px; font-weight: 800; color: #38BDF8; letter-spacing: -0.5px; text-decoration: none; display: inline-block; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #38BDF8; background-color: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 999px; margin-top: 14px; }
    .content { padding: 32px; }
    .title { font-size: 26px; font-weight: 800; color: #FFFFFF; line-height: 1.25; margin: 0 0 16px 0; letter-spacing: -0.02em; }
    .lead { font-size: 15px; line-height: 1.65; color: #94A3B8; margin: 0 0 24px 0; }
    .feature-box { background-color: #0F172A; border: 1px solid #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .feature-item { font-size: 14px; line-height: 1.6; color: #CBD5E1; margin: 8px 0; }
    .feature-item strong { color: #38BDF8; }
    .btn-wrapper { text-align: center; margin: 32px 0 16px; }
    .btn { display: inline-block; padding: 15px 32px; font-size: 15px; font-weight: 700; color: #FFFFFF !important; text-decoration: none; border-radius: 999px; background: linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%); box-shadow: 0 4px 20px rgba(14, 165, 233, 0.35); text-align: center; }
    .footer { text-align: center; padding: 24px 16px 0; font-size: 12px; line-height: 1.6; color: #64748B; }
    .footer a { color: #38BDF8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="https://techseum.rakasyau.my.id" class="brand">◉ Techseum</a>
        <br>
        <span class="badge">Featured Exhibit of the Week</span>
      </div>

      <div class="content">
        <h1 class="title">${options.featuredExhibitTitle}</h1>
        <p class="lead">${options.featuredExhibitDesc}</p>

        <div class="feature-box">
          <div class="feature-item">
            ⚡ <strong>Interactive 2D & 3D Simulations:</strong> Explore continuous 60 FPS state machine diagrams and 3D spatial models with Exploded Views.
          </div>
          <div class="feature-item">
            🤖 <strong>Ask AI Guide:</strong> Ask contextual and deep-dive technical questions to our intelligent AI docent powered by Google Gemini.
          </div>
          <div class="feature-item">
            🏆 <strong>Mini Challenge:</strong> Test your mental model, earn +50 XP, and climb the Global Explorer Leaderboard.
          </div>
        </div>

        <div class="btn-wrapper">
          <a href="https://techseum.rakasyau.my.id/explore/${options.exhibitSlug}" class="btn">
            Launch Interactive Simulation &rarr;
          </a>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>
        You are receiving this email because you subscribed to the <strong>Techseum</strong> weekly newsletter.<br>
        Sent to: <strong>${options.subscriberEmail}</strong> • <a href="https://techseum.rakasyau.my.id">Unsubscribe</a>
      </p>
      <p style="margin-top: 10px; opacity: 0.7;">
        &copy; ${currentYear} Techseum. Built for curious minds.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{
  success: boolean;
  provider: "resend" | "mock";
  messageId?: string;
  error?: string;
}> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || "Techseum <newsletter@techseum.rakasyau.my.id>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true, provider: "resend", messageId: data.id };
      } else {
        return { success: false, provider: "resend", error: data.message || "Failed to dispatch via Resend" };
      }
    } catch (err) {
      return { success: false, provider: "resend", error: (err as Error).message };
    }
  }

  // Local Dev / Mock Simulation
  console.log(`[Email Dispatcher Simulation] Sending "${subject}" to <${to}>... [OK]`);
  return {
    success: true,
    provider: "mock",
    messageId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
}
