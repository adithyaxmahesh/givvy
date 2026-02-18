// ─── YC Post-Money SAFE Template ─────────────────────────────────────────────

export const YC_POST_MONEY_SAFE = `SAFE
(Simple Agreement for Future Equity)

THIS CERTIFIES THAT in exchange for the payment by {{investor_name}} (the "Investor") of {{investment_amount}} (the "Purchase Amount") on or about {{date}}, {{company_name}}, a {{state}} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.

1. EVENTS

(a) Equity Financing. If there is an Equity Financing before the termination of this SAFE, on the initial closing of such Equity Financing, this SAFE will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.

    The "Conversion Price" means the lesser of:
    (i) the price per share equal to the Post-Money Valuation Cap of \${{valuation_cap}} divided by the Company Capitalization; or
    (ii) the price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate of {{discount_rate}}%.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this SAFE, the Investor will, at its option, either (i) receive a cash payment equal to the Purchase Amount or (ii) automatically receive from the Company a number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price.

(c) Dissolution Event. If there is a Dissolution Event before the termination of this SAFE, the Investor will receive a portion of Remaining Assets equal to the Purchase Amount, due and payable immediately prior to, or concurrent with, the consummation of the Dissolution Event.

2. DEFINITIONS

"Company Capitalization" means the sum of (a) all shares of Capital Stock (on an as-converted basis) issued and outstanding, (b) all outstanding stock options and warrants, (c) shares reserved for future issuance under equity incentive plans, and (d) all shares of Capital Stock issuable upon conversion of all outstanding SAFEs.

"Post-Money Valuation Cap" means \${{valuation_cap}}.

"Discount Rate" means {{discount_rate}}%.

3. COMPANY REPRESENTATIONS

The Company is duly incorporated, validly existing, and in good standing under the laws of the state of {{state}}. The Company has the corporate power to execute and deliver this SAFE and to perform its obligations hereunder. This SAFE constitutes a valid and binding obligation of the Company.

4. INVESTOR REPRESENTATIONS

The Investor has the requisite power and authority to enter into this SAFE. The Investor is an "accredited investor" as defined in Rule 501 of Regulation D under the Securities Act.

5. MISCELLANEOUS

This SAFE sets forth the entire agreement and understanding of the parties relating to the subject matter herein. Any amendment or modification of this SAFE must be in writing and signed by both parties. This SAFE shall be governed by the laws of the State of {{state}}.

IN WITNESS WHEREOF, the undersigned have caused this SAFE to be duly executed and delivered.

COMPANY: {{company_name}}

By: ___________________________
Name: {{founder_name}}
Title: {{founder_title}}
Date: {{date}}

INVESTOR: {{investor_name}}

By: ___________________________
Name: {{investor_name}}
Title: {{investor_title}}
Date: {{date}}`;

// ─── YC MFN (Most-Favored-Nation) SAFE Template ─────────────────────────────

export const YC_MFN_SAFE = `SAFE
(Simple Agreement for Future Equity — Most Favored Nation)

THIS CERTIFIES THAT in exchange for the payment by {{investor_name}} (the "Investor") of {{investment_amount}} (the "Purchase Amount") on or about {{date}}, {{company_name}}, a {{state}} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.

This SAFE includes a Most Favored Nation provision as set forth in Section 4.

1. EVENTS

(a) Equity Financing. If there is an Equity Financing before the termination of this SAFE, on the initial closing of such Equity Financing, this SAFE will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.

    The "Conversion Price" means the price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate of {{discount_rate}}%.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this SAFE, the Investor will, at its option, either (i) receive a cash payment equal to the Purchase Amount or (ii) automatically receive from the Company a number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price.

(c) Dissolution Event. If there is a Dissolution Event before the termination of this SAFE, the Investor will receive a portion of Remaining Assets equal to the Purchase Amount, due and payable immediately prior to, or concurrent with, the consummation of the Dissolution Event.

2. DEFINITIONS

"Discount Rate" means {{discount_rate}}%.

"MFN" means if the Company issues any subsequent SAFE or convertible security with terms more favorable to its holder(s) than the terms of this SAFE, the Company shall promptly notify the Investor and, at the Investor's election, this SAFE will be amended to include such more favorable terms.

3. MOST FAVORED NATION PROVISION

If the Company issues any SAFE, convertible note, or similar instrument (a "Subsequent Convertible Security") after the date of this SAFE and before the conversion or termination of this SAFE with terms that are more favorable to the holder thereof (including, without limitation, a lower valuation cap, higher discount rate, or other more favorable economic terms), the Investor shall have the right to amend this SAFE to incorporate such more favorable terms.

Upon written request by the Investor within thirty (30) days of receiving notice of such issuance, the Company shall execute an amendment to this SAFE reflecting such more favorable terms.

4. COMPANY REPRESENTATIONS

The Company is duly incorporated, validly existing, and in good standing under the laws of the state of {{state}}. The Company has the corporate power to execute and deliver this SAFE and to perform its obligations hereunder.

5. INVESTOR REPRESENTATIONS

The Investor has the requisite power and authority to enter into this SAFE. The Investor is an "accredited investor" as defined in Rule 501 of Regulation D under the Securities Act.

6. MISCELLANEOUS

This SAFE sets forth the entire agreement and understanding of the parties relating to the subject matter herein. Any amendment or modification must be in writing and signed by both parties. This SAFE shall be governed by the laws of the State of {{state}}.

IN WITNESS WHEREOF, the undersigned have caused this SAFE to be duly executed and delivered.

COMPANY: {{company_name}}

By: ___________________________
Name: {{founder_name}}
Title: {{founder_title}}
Date: {{date}}

INVESTOR: {{investor_name}}

By: ___________________________
Name: {{investor_name}}
Title: {{investor_title}}
Date: {{date}}`;

// ─── Template Rendering ──────────────────────────────────────────────────────

/**
 * Replace all `{{key}}` placeholders in a template string with the
 * corresponding values from the provided vars object.
 */
export function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return vars[key] ?? match;
  });
}

// ─── Build Template Variables from Deal Data ─────────────────────────────────

/**
 * Construct the template variables object from deal, startup, and talent
 * data. Handles formatting of monetary amounts and dates.
 */
export function buildTemplateVars(
  deal: {
    equity_percent?: number;
    safe_terms?: {
      valuation_cap?: number;
      discount?: number;
      equity_percent?: number;
    };
    created_at?: string;
  },
  startup: {
    name?: string;
    location?: string;
    founder?: {
      full_name?: string;
    };
  },
  talent: {
    user?: {
      full_name?: string;
    };
    title?: string;
  }
): Record<string, string> {
  const terms = deal.safe_terms ?? {};
  const valuationCap = terms.valuation_cap ?? 0;
  const discount = terms.discount ?? 0;
  const equityPercent = terms.equity_percent ?? deal.equity_percent ?? 0;

  const formatCurrency = (amount: number): string =>
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const state = startup.location?.split(',').pop()?.trim() || 'Delaware';

  const investmentAmount = valuationCap > 0
    ? formatCurrency(Math.round(valuationCap * (equityPercent / 100)))
    : '$0';

  return {
    company_name: startup.name ?? 'Company',
    investor_name: talent.user?.full_name ?? 'Investor',
    investor_title: talent.title ?? 'Contributor',
    founder_name: startup.founder?.full_name ?? 'Founder',
    founder_title: 'CEO & Founder',
    investment_amount: investmentAmount,
    valuation_cap: formatCurrency(valuationCap),
    discount_rate: discount.toString(),
    equity_percent: equityPercent.toFixed(2),
    state,
    date: formatDate(deal.created_at),
  };
}
