// ─── Official YC Post-Money SAFE Templates ──────────────────────────────────
// Source: https://ycombinator.com/documents
// Three variants: Valuation Cap Only, Discount Only, MFN Only

import type { SAFETerms } from '../types';

export type YCSAFEVariant = 'valuation-cap' | 'discount' | 'mfn';

// ─── Valuation Cap Only ─────────────────────────────────────────────────────

export const YC_VALUATION_CAP_SAFE = `THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE "SECURITIES ACT"), OR UNDER THE SECURITIES LAWS OF CERTAIN STATES. THESE SECURITIES MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED, PLEDGED OR HYPOTHECATED EXCEPT AS PERMITTED IN THIS SAFE AND UNDER THE ACT AND APPLICABLE STATE SECURITIES LAWS PURSUANT TO AN EFFECTIVE REGISTRATION STATEMENT OR AN EXEMPTION THEREFROM.

{{company_name}}

SAFE
(Simple Agreement for Future Equity)

THIS CERTIFIES THAT in exchange for the payment by {{investor_name}} (the "Investor") of {{investment_amount}} (the "Purchase Amount") on or about {{date}}, {{company_name}}, a {{state}} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.

This Safe is one of the forms available at http://ycombinator.com/documents and the Company and the Investor agree that neither one has modified the form, except to fill in blanks and bracketed terms.

The "Post-Money Valuation Cap" is {{valuation_cap}}. See Section 2 for certain additional defined terms.

1. Events

(a) Equity Financing. If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the greater of: (1) the number of shares of Standard Preferred Stock equal to the Purchase Amount divided by the lowest price per share of the Standard Preferred Stock; or (2) the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Safe Price.

In connection with the automatic conversion of this Safe into shares of Standard Preferred Stock or Safe Preferred Stock, the Investor will execute and deliver to the Company all of the transaction documents related to the Equity Financing; provided, that such documents (i) are the same documents to be entered into with the purchasers of Standard Preferred Stock, with appropriate variations for the Safe Preferred Stock if applicable, and (ii) have customary exceptions to any drag-along applicable to the Investor, including (without limitation) limited representations, warranties, liability and indemnification obligations for the Investor.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, the Investor will automatically be entitled (subject to the liquidation priority set forth in Section 1(d) below) to receive a portion of Proceeds, due and payable to the Investor immediately prior to, or concurrent with, the consummation of such Liquidity Event, equal to the greater of (i) the Purchase Amount (the "Cash-Out Amount") or (ii) the amount payable on the number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price (the "Conversion Amount"). If any of the Company's securityholders are given a choice as to the form and amount of Proceeds to be received in a Liquidity Event, the Investor will be given the same choice, provided that the Investor may not choose to receive a form of consideration that the Investor would be ineligible to receive as a result of the Investor's failure to satisfy any requirement or limitation generally applicable to the Company's securityholders, or under any applicable laws.

Notwithstanding the foregoing, in connection with a Change of Control intended to qualify as a tax-free reorganization, the Company may reduce the cash portion of Proceeds payable to the Investor by the amount determined by its board of directors in good faith for such Change of Control to qualify as a tax-free reorganization for U.S. federal income tax purposes, provided that such reduction (A) does not reduce the total Proceeds payable to such Investor and (B) is applied in the same manner and on a pro rata basis to all securityholders who have equal priority to the Investor under Section 1(d).

(c) Dissolution Event. If there is a Dissolution Event before the termination of this Safe, the Investor will automatically be entitled (subject to the liquidation priority set forth in Section 1(d) below) to receive a portion of Proceeds equal to the Cash-Out Amount, due and payable to the Investor immediately prior to the consummation of the Dissolution Event.

(d) Liquidation Priority. In a Liquidity Event or Dissolution Event, this Safe is intended to operate like standard non-participating Preferred Stock. The Investor's right to receive its Cash-Out Amount is:
(i) Junior to payment of outstanding indebtedness and creditor claims, including contractual claims for payment and convertible promissory notes (to the extent such convertible promissory notes are not actually or notionally converted into Capital Stock);
(ii) On par with payments for other Safes and/or Preferred Stock, and if the applicable Proceeds are insufficient to permit full payments to the Investor and such other Safes and/or Preferred Stock, the applicable Proceeds will be distributed pro rata to the Investor and such other Safes and/or Preferred Stock in proportion to the full payments that would otherwise be due; and
(iii) Senior to payments for Common Stock.

The Investor's right to receive its Conversion Amount is (A) on par with payments for Common Stock and other Safes and/or Preferred Stock who are also receiving Conversion Amounts or Proceeds on a similar as-converted to Common Stock basis, and (B) junior to payments described in clauses (i) and (ii) above (in the latter case, to the extent such payments are Cash-Out Amounts or similar liquidation preferences).

(e) Termination. This Safe will automatically terminate (without relieving the Company of any obligations arising from a prior breach of or non-compliance with this Safe) immediately following the earliest to occur of: (i) the issuance of Capital Stock to the Investor pursuant to the automatic conversion of this Safe under Section 1(a); or (ii) the payment, or setting aside for payment, of amounts due the Investor pursuant to Section 1(b) or Section 1(c).

2. Definitions

"Capital Stock" means the capital stock of the Company, including, without limitation, the "Common Stock" and the "Preferred Stock."

"Change of Control" means (i) a transaction or series of related transactions in which any "person" or "group" (within the meaning of Section 13(d) and 14(d) of the Securities Exchange Act of 1934, as amended), becomes the "beneficial owner" (as defined in Rule 13d-3 under the Securities Exchange Act of 1934, as amended), directly or indirectly, of more than 50% of the outstanding voting securities of the Company having the right to vote for the election of members of the Company's board of directors, (ii) any reorganization, merger or consolidation of the Company, other than a transaction or series of related transactions in which the holders of the voting securities of the Company outstanding immediately prior to such transaction or series of related transactions retain, immediately after such transaction or series of related transactions, at least a majority of the total voting power represented by the outstanding voting securities of the Company or such other surviving or resulting entity or (iii) a sale, lease or other disposition of all or substantially all of the assets of the Company.

"Company Capitalization" is calculated as of immediately prior to the Equity Financing and (without double-counting, in each case calculated on an as-converted to Common Stock basis): Includes all shares of Capital Stock issued and outstanding; Includes all Converting Securities; Includes all (i) issued and outstanding Options and (ii) Promised Options; and Includes the Unissued Option Pool, except that any increase to the Unissued Option Pool in connection with the Equity Financing will only be included to the extent that the number of Promised Options exceeds the Unissued Option Pool prior to such increase.

"Converting Securities" includes this Safe and other convertible securities issued by the Company, including but not limited to: (i) other Safes; (ii) convertible promissory notes and other convertible debt instruments; and (iii) convertible securities that have the right to convert into shares of Capital Stock.

"Direct Listing" means the Company's initial listing of its Common Stock (other than shares of Common Stock not eligible for resale under Rule 144 under the Securities Act) on a national securities exchange by means of an effective registration statement on Form S-1 filed by the Company with the SEC that registers shares of existing capital stock of the Company for resale, as approved by the Company's board of directors. For the avoidance of doubt, a Direct Listing will not be deemed to be an underwritten offering and will not involve any underwriting services.

"Dissolution Event" means (i) a voluntary termination of operations, (ii) a general assignment for the benefit of the Company's creditors or (iii) any other liquidation, dissolution or winding up of the Company (excluding a Liquidity Event), whether voluntary or involuntary.

"Equity Financing" means a bona fide transaction or series of transactions with the principal purpose of raising capital, pursuant to which the Company issues and sells Preferred Stock at a fixed valuation, including but not limited to, a pre-money or post-money valuation.

"Initial Public Offering" means the closing of the Company's first firm commitment underwritten initial public offering of Common Stock pursuant to a registration statement filed under the Securities Act.

"Liquidity Capitalization" is calculated as of immediately prior to the Liquidity Event, and (without double-counting, in each case calculated on an as-converted to Common Stock basis): Includes all shares of Capital Stock issued and outstanding; Includes all (i) issued and outstanding Options and (ii) to the extent receiving Proceeds, Promised Options; Includes all Converting Securities, other than any Safes and other convertible securities (including without limitation shares of Preferred Stock) where the holders of such securities are receiving Cash-Out Amounts or similar liquidation preference payments in lieu of Conversion Amounts or similar "as-converted" payments; and Excludes the Unissued Option Pool.

"Liquidity Event" means a Change of Control, a Direct Listing or an Initial Public Offering.

"Liquidity Price" means the price per share equal to the Post-Money Valuation Cap divided by the Liquidity Capitalization.

"Safe Price" means the price per share equal to the Post-Money Valuation Cap divided by the Company Capitalization.

"Safe Preferred Stock" means the shares of the series of Preferred Stock issued to the Investor in an Equity Financing, having the identical rights, privileges, preferences, seniority, liquidation multiple and restrictions as the shares of Standard Preferred Stock, except that any price-based preferences will be based on the Safe Price.

"Standard Preferred Stock" means the shares of the series of Preferred Stock issued to the investors investing new money in the Company in connection with the initial closing of the Equity Financing.

3. Company Representations

(a) The Company is a corporation duly organized, validly existing and in good standing under the laws of its state of incorporation, and has the power and authority to own, lease and operate its properties and carry on its business as now conducted.

(b) The execution, delivery and performance by the Company of this Safe is within the power of the Company and has been duly authorized by all necessary actions on the part of the Company. This Safe constitutes a legal, valid and binding obligation of the Company, enforceable against the Company in accordance with its terms, except as limited by bankruptcy, insolvency or other laws of general application relating to or affecting the enforcement of creditors' rights generally and general principles of equity.

(c) The performance and consummation of the transactions contemplated by this Safe do not and will not: (i) violate any material judgment, statute, rule or regulation applicable to the Company; (ii) result in the acceleration of any material debt or contract to which the Company is a party or by which it is bound; or (iii) result in the creation or imposition of any lien on any property, asset or revenue of the Company or the suspension, forfeiture, or nonrenewal of any material permit, license or authorization applicable to the Company, its business or operations.

(d) No consents or approvals are required in connection with the performance of this Safe, other than: (i) the Company's corporate approvals; (ii) any qualifications or filings under applicable securities laws; and (iii) necessary corporate approvals for the authorization of Capital Stock issuable pursuant to Section 1.

4. Investor Representations

(a) The Investor has full legal capacity, power and authority to execute and deliver this Safe and to perform its obligations hereunder. This Safe constitutes a valid and binding obligation of the Investor, enforceable in accordance with its terms, except as limited by bankruptcy, insolvency or other laws of general application relating to or affecting the enforcement of creditors' rights generally and general principles of equity.

(b) The Investor is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act. The Investor is purchasing this Safe and the securities to be acquired by the Investor hereunder for its own account for investment, not as a nominee or agent, and not with a view to, or for resale in connection with, the distribution thereof.

5. Miscellaneous

(a) Any provision of this Safe may be amended, waived or modified by written consent of the Company and either (i) the Investor or (ii) the majority-in-interest of all then-outstanding Safes with the same terms.

(b) Any notice required or permitted by this Safe will be deemed sufficient when delivered personally or by overnight courier or sent by email to the relevant address listed on the signature page.

(c) The Investor is not entitled, as a holder of this Safe, to vote or be deemed a holder of Capital Stock for any purpose other than tax purposes, until shares have been issued on the terms described in Section 1.

(d) Neither this Safe nor the rights in this Safe are transferable or assignable, by operation of law or otherwise, by either party without the prior written consent of the other.

(e) In the event any one or more of the provisions of this Safe is for any reason held to be invalid, illegal or unenforceable, such provision(s) only will be deemed null and void and will not affect any other provision of this Safe.

(f) All rights and obligations hereunder will be governed by the laws of the State of {{state}}, without regard to the conflicts of law provisions of such jurisdiction.

IN WITNESS WHEREOF, the undersigned have caused this Safe to be duly executed and delivered.

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

// ─── Discount Only ──────────────────────────────────────────────────────────

export const YC_DISCOUNT_SAFE = `THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE "SECURITIES ACT"), OR UNDER THE SECURITIES LAWS OF CERTAIN STATES. THESE SECURITIES MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED, PLEDGED OR HYPOTHECATED EXCEPT AS PERMITTED IN THIS SAFE AND UNDER THE ACT AND APPLICABLE STATE SECURITIES LAWS PURSUANT TO AN EFFECTIVE REGISTRATION STATEMENT OR AN EXEMPTION THEREFROM.

{{company_name}}

SAFE
(Simple Agreement for Future Equity)

THIS CERTIFIES THAT in exchange for the payment by {{investor_name}} (the "Investor") of {{investment_amount}} (the "Purchase Amount") on or about {{date}}, {{company_name}}, a {{state}} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.

This Safe is one of the forms available at http://ycombinator.com/documents and the Company and the Investor agree that neither one has modified the form, except to fill in blanks and bracketed terms.

The "Discount Rate" is {{discount_rate}}%. See Section 2 for certain additional defined terms.

1. Events

(a) Equity Financing. If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Discount Price.

In connection with the automatic conversion of this Safe into shares of Safe Preferred Stock, the Investor will execute and deliver to the Company all of the transaction documents related to the Equity Financing; provided, that such documents (i) are the same documents to be entered into with the purchasers of Standard Preferred Stock, with appropriate variations for the Safe Preferred Stock if applicable, and (ii) have customary exceptions to any drag-along applicable to the Investor, including (without limitation) limited representations, warranties, liability and indemnification obligations for the Investor.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, the Investor will automatically be entitled (subject to the liquidation priority set forth in Section 1(d) below) to receive a portion of Proceeds, due and payable to the Investor immediately prior to, or concurrent with, the consummation of such Liquidity Event, equal to the greater of (i) the Purchase Amount (the "Cash-Out Amount") or (ii) the amount payable on the number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price (the "Conversion Amount").

Notwithstanding the foregoing, in connection with a Change of Control intended to qualify as a tax-free reorganization, the Company may reduce the cash portion of Proceeds payable to the Investor by the amount determined by its board of directors in good faith for such Change of Control to qualify as a tax-free reorganization for U.S. federal income tax purposes, provided that such reduction (A) does not reduce the total Proceeds payable to such Investor and (B) is applied in the same manner and on a pro rata basis to all securityholders who have equal priority to the Investor under Section 1(d).

(c) Dissolution Event. If there is a Dissolution Event before the termination of this Safe, the Investor will automatically be entitled (subject to the liquidation priority set forth in Section 1(d) below) to receive a portion of Proceeds equal to the Cash-Out Amount, due and payable to the Investor immediately prior to the consummation of the Dissolution Event.

(d) Liquidation Priority. In a Liquidity Event or Dissolution Event, this Safe is intended to operate like standard non-participating Preferred Stock. The Investor's right to receive its Cash-Out Amount is:
(i) Junior to payment of outstanding indebtedness and creditor claims;
(ii) On par with payments for other Safes and/or Preferred Stock; and
(iii) Senior to payments for Common Stock.

(e) Termination. This Safe will automatically terminate immediately following the earliest to occur of: (i) the issuance of Capital Stock to the Investor pursuant to the automatic conversion of this Safe under Section 1(a); or (ii) the payment, or setting aside for payment, of amounts due the Investor pursuant to Section 1(b) or Section 1(c).

2. Definitions

"Capital Stock" means the capital stock of the Company, including, without limitation, the "Common Stock" and the "Preferred Stock."

"Discount Price" means the lowest price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate.

"Discount Rate" means {{discount_rate}}%.

"Liquidity Price" means the price per share equal to the fair market value of the Common Stock at the time of the Liquidity Event, multiplied by the Discount Rate.

"Safe Preferred Stock" means the shares of the series of Preferred Stock issued to the Investor in an Equity Financing, having the identical rights, privileges, preferences, seniority, liquidation multiple and restrictions as the shares of Standard Preferred Stock, except that any price-based preferences will be based on the Discount Price.

"Standard Preferred Stock" means the shares of a series of Preferred Stock issued to the investors investing new money in the Company in connection with the initial closing of the Equity Financing.

3. Company Representations

(a) The Company is a corporation duly organized, validly existing and in good standing under the laws of its state of incorporation.

(b) The execution, delivery and performance by the Company of this Safe is within the power of the Company and has been duly authorized by all necessary actions. This Safe constitutes a legal, valid and binding obligation of the Company.

(c) The performance and consummation of the transactions contemplated by this Safe do not and will not violate any material judgment, statute, rule or regulation applicable to the Company.

(d) No consents or approvals are required in connection with the performance of this Safe, other than: (i) the Company's corporate approvals; (ii) any qualifications or filings under applicable securities laws; and (iii) necessary corporate approvals for the authorization of Capital Stock issuable pursuant to Section 1.

4. Investor Representations

(a) The Investor has full legal capacity, power and authority to execute and deliver this Safe. This Safe constitutes a valid and binding obligation of the Investor.

(b) The Investor is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act. The Investor is purchasing this Safe for its own account for investment, not with a view to distribution.

5. Miscellaneous

(a) Any provision of this Safe may be amended, waived or modified by written consent of the Company and the Investor.

(b) All rights and obligations hereunder will be governed by the laws of the State of {{state}}, without regard to the conflicts of law provisions of such jurisdiction.

IN WITNESS WHEREOF, the undersigned have caused this Safe to be duly executed and delivered.

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

// ─── MFN Only ───────────────────────────────────────────────────────────────

export const YC_MFN_SAFE = `THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE "SECURITIES ACT"), OR UNDER THE SECURITIES LAWS OF CERTAIN STATES. THESE SECURITIES MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED, PLEDGED OR HYPOTHECATED EXCEPT AS PERMITTED IN THIS SAFE AND UNDER THE ACT AND APPLICABLE STATE SECURITIES LAWS PURSUANT TO AN EFFECTIVE REGISTRATION STATEMENT OR AN EXEMPTION THEREFROM.

{{company_name}}

SAFE
(Simple Agreement for Future Equity)

THIS CERTIFIES THAT in exchange for the payment by {{investor_name}} (the "Investor") of {{investment_amount}} (the "Purchase Amount") on or about {{date}}, {{company_name}}, a {{state}} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.

This Safe is one of the forms available at http://ycombinator.com/documents and the Company and the Investor agree that neither one has modified the form, except to fill in blanks and bracketed terms.

1. Events

(a) Equity Financing. If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Standard Preferred Stock equal to the Purchase Amount divided by the lowest price per share of the Standard Preferred Stock.

In connection with the automatic conversion of this Safe into shares of Standard Preferred Stock, the Investor will execute and deliver to the Company all of the transaction documents related to the Equity Financing; provided, that such documents (i) are the same documents to be entered into with the purchasers of Standard Preferred Stock, and (ii) have customary exceptions to any drag-along applicable to the Investor.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, the Investor will automatically be entitled (subject to the liquidation priority set forth in Section 1(d) below and the "MFN" Amendment Provision in Section 3 below) to receive a portion of Proceeds equal to the Purchase Amount (the "Cash-Out Amount").

Notwithstanding the foregoing, in connection with a Change of Control intended to qualify as a tax-free reorganization, the Company may reduce the cash portion of Proceeds payable to the Investor by the amount determined by its board of directors in good faith.

(c) Dissolution Event. If there is a Dissolution Event before the termination of this Safe, the Investor will automatically be entitled to receive a portion of Proceeds equal to the Cash-Out Amount, due and payable immediately prior to the consummation of the Dissolution Event.

(d) Liquidation Priority. In a Liquidity Event or Dissolution Event, this Safe is intended to operate like standard non-participating Preferred Stock. The Investor's right to receive its Cash-Out Amount is:
(i) Junior to payment of outstanding indebtedness and creditor claims;
(ii) On par with payments for other Safes and/or Preferred Stock; and
(iii) Senior to payments for Common Stock.

(e) Termination. This Safe will automatically terminate immediately following the earliest to occur of: (i) the issuance of Capital Stock to the Investor pursuant to the automatic conversion of this Safe under Section 1(a); or (ii) the payment, or setting aside for payment, of amounts due the Investor pursuant to Section 1(b) or Section 1(c).

2. Definitions

"Capital Stock" means the capital stock of the Company, including, without limitation, the "Common Stock" and the "Preferred Stock."

"Subsequent Convertible Securities" means convertible securities that the Company may issue after the issuance of this instrument with the principal purpose of raising capital, including but not limited to, other Safes, convertible debt instruments and other convertible securities.

3. "MFN" Amendment Provision. If the Company issues any Subsequent Convertible Securities with terms more favorable than those of this Safe (including, without limitation, a valuation cap and/or discount) prior to termination of this Safe, the Company will promptly provide the Investor with written notice thereof, together with a copy of such Subsequent Convertible Securities. In the event the Investor determines that the terms of the Subsequent Convertible Securities are preferable, the Investor will notify the Company in writing within 10 days. Promptly after receipt of such notice, the Company agrees to amend and restate this instrument to be identical to the instrument(s) evidencing the Subsequent Convertible Securities.

4. Company Representations

(a) The Company is a corporation duly organized, validly existing and in good standing under the laws of its state of incorporation.

(b) The execution, delivery and performance by the Company of this Safe is within the power of the Company and has been duly authorized. This Safe constitutes a legal, valid and binding obligation of the Company.

(c) No consents or approvals are required in connection with the performance of this Safe, other than: (i) the Company's corporate approvals; (ii) any qualifications or filings under applicable securities laws; and (iii) necessary corporate approvals for the authorization of Capital Stock issuable pursuant to Section 1.

5. Investor Representations

(a) The Investor has full legal capacity, power and authority to execute and deliver this Safe.

(b) The Investor is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act. The Investor is purchasing this Safe for its own account for investment, not with a view to distribution.

6. Miscellaneous

(a) Any provision of this Safe may be amended, waived or modified by written consent of the Company and the Investor.

(b) All rights and obligations hereunder will be governed by the laws of the State of {{state}}, without regard to the conflicts of law provisions of such jurisdiction.

IN WITNESS WHEREOF, the undersigned have caused this Safe to be duly executed and delivered.

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

// Keep old names as aliases for backward compatibility
export const YC_POST_MONEY_SAFE = YC_VALUATION_CAP_SAFE;

// ─── Template Selection ─────────────────────────────────────────────────────

export function selectTemplate(terms: Pick<SAFETerms, 'valuation_cap' | 'discount'>): {
  variant: YCSAFEVariant;
  template: string;
  label: string;
} {
  const hasCap = (terms.valuation_cap ?? 0) > 0;
  const hasDiscount = (terms.discount ?? 0) > 0;

  if (hasCap) {
    return { variant: 'valuation-cap', template: YC_VALUATION_CAP_SAFE, label: 'YC Post-Money SAFE — Valuation Cap' };
  }
  if (hasDiscount) {
    return { variant: 'discount', template: YC_DISCOUNT_SAFE, label: 'YC Post-Money SAFE — Discount' };
  }
  return { variant: 'mfn', template: YC_MFN_SAFE, label: 'YC Post-Money SAFE — MFN' };
}

// ─── Template Rendering ─────────────────────────────────────────────────────

export function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return vars[key] ?? match;
  });
}

// ─── Build Template Variables from Deal Data ────────────────────────────────

export function buildTemplateVars(
  deal: {
    investment_amount?: number;
    safe_terms?: {
      valuation_cap?: number;
      discount?: number;
      investment_amount?: number;
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
  const investmentAmt = terms.investment_amount ?? deal.investment_amount ?? 0;

  const formatCurrency = (amount: number): string =>
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const state = startup.location?.split(',').pop()?.trim() || 'Delaware';

  return {
    company_name: startup.name ?? 'Company',
    investor_name: talent.user?.full_name ?? 'Investor',
    investor_title: talent.title ?? 'Contributor',
    founder_name: startup.founder?.full_name ?? 'Founder',
    founder_title: 'CEO & Founder',
    investment_amount: formatCurrency(investmentAmt),
    valuation_cap: formatCurrency(valuationCap),
    discount_rate: discount > 0 ? (100 - discount).toString() : '100',
    state,
    date: formatDate(deal.created_at),
  };
}
