import { Resend } from 'resend';

// ─── Configuration ───────────────────────────────────────────────────────────

const FROM_ADDRESS = 'Givvy <noreply@givvy.io>';

/** Base URL for links in emails (dashboard, deals, etc.). Use NEXT_PUBLIC_APP_URL in production. */
function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://givvy.vercel.app').replace(/\/$/, '');
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

// ─── HTML Email Wrapper ──────────────────────────────────────────────────────

export function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Givvy</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#6d28d9 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Givvy
              </h1>
              <p style="margin:4px 0 0;font-size:13px;color:#e9d5ff;">
                The Equity-for-Talent Marketplace
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f3f0ff;border-top:1px solid #ede9fe;text-align:center;">
              <p style="margin:0;font-size:12px;color:#7c3aed;">
                &copy; ${new Date().getFullYear()} Givvy. All rights reserved.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
                You're receiving this email because you have a Givvy account.
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

// ─── Send Helper ─────────────────────────────────────────────────────────────

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log(`[Email] RESEND_API_KEY not set — skipping email to ${to}`);
    console.log(`[Email] Subject: ${subject}`);
    return { success: false };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send:', error);
      return { success: false };
    }

    console.log(`[Email] Sent "${subject}" to ${to} — ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Unexpected error:', error);
    return { success: false };
  }
}

// ─── Email Functions ─────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean; id?: string }> {
  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;">
      Welcome to Givvy, ${name}! 🚀
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
      You've joined the premier marketplace where startups find exceptional talent
      through equity-based partnerships. Here's what you can do next:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
      <li><strong>Complete your profile</strong> to attract the best matches</li>
      <li><strong>Browse opportunities</strong> or talent depending on your role</li>
      <li><strong>Get AI-powered matches</strong> based on your skills and goals</li>
      <li><strong>Negotiate and sign SAFEs</strong> directly on the platform</li>
    </ul>
    <div style="text-align:center;margin:32px 0;">
      <a href="${getBaseUrl()}/dashboard" style="display:inline-block;padding:14px 32px;background-color:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
        Go to Dashboard
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      If you have any questions, reply to this email or visit our help center.
    </p>
  `);

  return sendEmail(to, 'Welcome to Givvy! 🚀', html);
}

export async function sendMatchNotification(
  to: string,
  matchData: {
    startupName: string;
    talentName: string;
    score: number;
    role?: string;
  }
): Promise<{ success: boolean; id?: string }> {
  const scoreColor =
    matchData.score >= 85 ? '#10b981' : matchData.score >= 70 ? '#f59e0b' : '#ef4444';

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;">
      New Match Found! 🎯
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      Our AI has identified a strong potential match for you:
    </p>
    <div style="background-color:#f5f3ff;border-radius:8px;padding:24px;margin:0 0 24px;">
      <div style="text-align:center;margin-bottom:16px;">
        <span style="display:inline-block;background-color:${scoreColor};color:#ffffff;font-size:28px;font-weight:700;padding:12px 24px;border-radius:12px;">
          ${matchData.score}% Match
        </span>
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:100px;">Startup:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${matchData.startupName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Talent:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${matchData.talentName}</td>
        </tr>
        ${matchData.role ? `<tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Role:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${matchData.role}</td>
        </tr>` : ''}
      </table>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${getBaseUrl()}/matches" style="display:inline-block;padding:14px 32px;background-color:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
        View Match Details
      </a>
    </div>
  `);

  return sendEmail(to, `New Match: ${matchData.score}% compatibility found!`, html);
}

export async function sendDealProposal(
  to: string,
  dealData: {
    startupName: string;
    roleName: string;
    equityPercent: number;
    vestingMonths: number;
    proposedBy: string;
  }
): Promise<{ success: boolean; id?: string }> {
  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;">
      New Deal Proposal 📋
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      ${dealData.proposedBy} has proposed a new equity deal:
    </p>
    <div style="background-color:#f5f3ff;border-radius:8px;padding:24px;margin:0 0 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:120px;">Startup:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${dealData.startupName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Role:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${dealData.roleName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Equity Offered:</td>
          <td style="padding:8px 0;font-size:14px;color:#7c3aed;font-weight:700;">${dealData.equityPercent}%</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Vesting:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${dealData.vestingMonths} months</td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${getBaseUrl()}/deals" style="display:inline-block;padding:14px 32px;background-color:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
        Review Proposal
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      You have 7 days to respond before this proposal expires.
    </p>
  `);

  return sendEmail(to, `Deal Proposal: ${dealData.equityPercent}% equity at ${dealData.startupName}`, html);
}

export async function sendMilestoneApproved(
  to: string,
  milestone: {
    title: string;
    dealTitle: string;
    equityUnlock: number;
    approvedBy: string;
  }
): Promise<{ success: boolean; id?: string }> {
  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;">
      Milestone Approved! ✅
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      Great news — a milestone has been approved and equity is unlocking:
    </p>
    <div style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:24px;margin:0 0 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:120px;">Milestone:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${milestone.title}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Deal:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${milestone.dealTitle}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Equity Unlocked:</td>
          <td style="padding:8px 0;font-size:16px;color:#059669;font-weight:700;">${milestone.equityUnlock}%</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Approved By:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${milestone.approvedBy}</td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${getBaseUrl()}/portfolio" style="display:inline-block;padding:14px 32px;background-color:#059669;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
        View Portfolio
      </a>
    </div>
  `);

  return sendEmail(to, `Milestone Approved: "${milestone.title}" — ${milestone.equityUnlock}% unlocked`, html);
}

export async function sendSAFEReady(
  to: string,
  safeData: {
    companyName: string;
    investorName: string;
    valuationCap: string;
    equityPercent: number;
    documentUrl?: string;
  }
): Promise<{ success: boolean; id?: string }> {
  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;">
      Your SAFE is Ready for Signature 📄
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      The SAFE agreement between <strong>${safeData.companyName}</strong> and
      <strong>${safeData.investorName}</strong> has been generated and is ready
      for review and signature.
    </p>
    <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:24px;margin:0 0 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:120px;">Company:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${safeData.companyName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Investor:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${safeData.investorName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Valuation Cap:</td>
          <td style="padding:8px 0;font-size:14px;color:#1f2937;font-weight:600;">${safeData.valuationCap}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">Equity:</td>
          <td style="padding:8px 0;font-size:14px;color:#7c3aed;font-weight:700;">${safeData.equityPercent}%</td>
        </tr>
      </table>
    </div>
    <div style="background-color:#fef3c7;border-radius:8px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
        <strong>⚠️ Important:</strong> Please review the document carefully before signing.
        We recommend consulting with legal counsel if you have any questions about the terms.
      </p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${safeData.documentUrl || `${getBaseUrl()}/deals`}" style="display:inline-block;padding:14px 32px;background-color:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
        Review &amp; Sign SAFE
      </a>
    </div>
  `);

  return sendEmail(to, `SAFE Ready: ${safeData.companyName} — Review & Sign`, html);
}
