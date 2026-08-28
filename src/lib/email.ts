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
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Eksibit Mingguan Techseum</title>
  <style>
    body { margin: 0; padding: 0; background-color: #080C14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    .card { background-color: #0F172A; border: 1px solid #1E293B; border-radius: 16px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .logo { font-size: 20px; font-weight: 800; color: #38BDF8; letter-spacing: -0.5px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #38BDF8; background: rgba(56, 189, 248, 0.15); border-radius: 999px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 800; color: #FFFFFF; line-height: 1.3; margin: 0 0 12px 0; }
    p { font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0 0 24px 0; }
    .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #4F46E5, #38BDF8); color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 999px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #64748B; line-height: 1.5; }
    .footer a { color: #38BDF8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">◉ Techseum</div>
      <div class="badge">Eksibit Baru Minggu Ini</div>
      <h1>${options.featuredExhibitTitle}</h1>
      <p>${options.featuredExhibitDesc}</p>
      <a href="https://techseum.io/explore/${options.exhibitSlug}" class="btn">
        Mulai Simulasi Interaktif →
      </a>
    </div>
    <div class="footer">
      <p>Anda menerima email ini karena terdaftar pada buletin mingguan Techseum.<br>
      Dikirim ke <strong>${options.subscriberEmail}</strong> • <a href="#">Berhenti Berlangganan</a></p>
      <p>© ${currentYear} Techseum. Hak Cipta Dilindungi.</p>
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
      const fromEmail = process.env.EMAIL_FROM || "Techseum <onboarding@resend.dev>";
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
