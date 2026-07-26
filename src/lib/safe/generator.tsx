import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';
import { selectTemplate, renderTemplate, buildTemplateVars } from './templates';
import type { YCSAFEVariant } from './templates';
import type { SignatureData } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 72,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000000',
  },
  securitiesNotice: {
    fontSize: 8,
    lineHeight: 1.4,
    color: '#000000',
    marginBottom: 24,
    textAlign: 'justify',
  },
  companyName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333',
  },
  certifiesBlock: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 18,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 10,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'justify',
  },
  witnessBlock: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  signatureSection: {
    marginTop: 20,
  },
  signatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  signatureColumn: {
    width: '45%',
  },
  signaturePartyLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  signatureLineLabel: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 2,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 4,
    height: 24,
  },
  signatureNameRendered: {
    fontFamily: 'Times-Italic',
    fontSize: 16,
    color: '#00008B',
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 4,
    paddingBottom: 2,
  },
  signatureDateRendered: {
    fontSize: 10,
    color: '#000000',
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 4,
  },
  signatureFieldLabel: {
    fontSize: 8,
    color: '#555555',
    marginBottom: 12,
  },
  esignBadge: {
    marginTop: 4,
    padding: 4,
    backgroundColor: '#f0f9f0',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 2,
  },
  esignBadgeText: {
    fontSize: 7,
    color: '#15803d',
    fontFamily: 'Helvetica-Bold',
  },
  esignDetails: {
    fontSize: 7,
    color: '#15803d',
    marginTop: 1,
  },
  certificationPage: {
    padding: 72,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000000',
  },
  certificationHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 12,
    marginBottom: 24,
  },
  certificationTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  certificationSubtitle: {
    fontSize: 10,
    color: '#555555',
  },
  certTable: {
    marginTop: 12,
    marginBottom: 24,
  },
  certRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 8,
  },
  certRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
  },
  certCellLabel: {
    width: 140,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  certCellValue: {
    flex: 1,
    fontSize: 9,
    color: '#000000',
  },
  certSectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#000000',
  },
  auditRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  auditTimestamp: {
    width: 160,
    fontSize: 8,
    color: '#555555',
  },
  auditAction: {
    flex: 1,
    fontSize: 8,
    color: '#000000',
  },
  legalNotice: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 4,
  },
  legalNoticeTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  legalNoticeText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: '#333333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 72,
    right: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: '#999999',
  },
});

export interface SignatureInfo {
  signed: boolean;
  signer_name: string;
  signer_title: string;
  signed_at: string | null;
  ip_address?: string;
}

export interface SAFEDocumentData {
  companyName: string;
  founderName: string;
  founderTitle: string;
  investorName: string;
  investorTitle: string;
  investmentAmount: string;
  valuationCap: string;
  discountRate: string;
  vestingMonths: number;
  cliffMonths: number;
  state: string;
  date: string;
  template: string;
  proRata: boolean;
  mfnClause: boolean;
  signatures?: {
    company?: SignatureInfo;
    provider?: SignatureInfo;
  };
  auditTrail?: Array<{
    action: string;
    timestamp: string;
    actor: string;
  }>;
  documentId?: string;
}

const VARIANT_LABELS: Record<YCSAFEVariant, string> = {
  'valuation-cap': 'Post-Money Valuation Cap',
  'discount': 'Post-Money Discount',
  'mfn': 'Most Favored Nation',
};

function formatSignatureDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return dateStr;
  }
}

function SignatureColumnBlock({
  label,
  entityName,
  signerNameDefault,
  signerTitleDefault,
  signatureData,
}: {
  label: string;
  entityName: string;
  signerNameDefault: string;
  signerTitleDefault: string;
  signatureData?: SignatureInfo;
}) {
  const isSigned = signatureData?.signed === true;
  const signerName = isSigned ? signatureData.signer_name : signerNameDefault;
  const signerTitle = isSigned ? signatureData.signer_title : signerTitleDefault;
  const signedAt = isSigned ? signatureData.signed_at : null;

  return (
    <View style={styles.signatureColumn}>
      <Text style={styles.signaturePartyLabel}>
        {label}: {entityName}
      </Text>

      <Text style={styles.signatureFieldLabel}>Signature:</Text>
      {isSigned ? (
        <View>
          <Text style={styles.signatureNameRendered}>
            /s/ {signerName}
          </Text>
          <View style={styles.esignBadge}>
            <Text style={styles.esignBadgeText}>ELECTRONICALLY SIGNED</Text>
            <Text style={styles.esignDetails}>
              Signed: {formatSignatureDate(signedAt)}
            </Text>
            {signatureData?.ip_address && (
              <Text style={styles.esignDetails}>
                IP: {signatureData.ip_address}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.signatureLine} />
      )}

      <Text style={styles.signatureFieldLabel}>Name:</Text>
      <Text style={{ fontSize: 10, marginBottom: 8 }}>{signerName}</Text>

      <Text style={styles.signatureFieldLabel}>Title:</Text>
      <Text style={{ fontSize: 10, marginBottom: 8 }}>{signerTitle}</Text>

      <Text style={styles.signatureFieldLabel}>Date:</Text>
      {isSigned ? (
        <Text style={styles.signatureDateRendered}>
          {formatSignatureDate(signedAt)}
        </Text>
      ) : (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#000000',
            height: 20,
            marginBottom: 4,
          }}
        />
      )}
    </View>
  );
}

function ESignCertificationPage({
  data,
}: {
  data: SAFEDocumentData;
}) {
  const companySig = data.signatures?.company;
  const providerSig = data.signatures?.provider;
  const allSigned = companySig?.signed && providerSig?.signed;

  if (!allSigned) return null;

  return (
    <Page size="LETTER" style={styles.certificationPage}>
      <View style={styles.certificationHeader}>
        <Text style={styles.certificationTitle}>
          Electronic Signature Certification
        </Text>
        <Text style={styles.certificationSubtitle}>
          Certificate of Completion — SAFE Agreement
        </Text>
      </View>

      <View style={styles.certTable}>
        <Text style={styles.certSectionTitle}>Document Details</Text>
        <View style={styles.certRow}>
          <Text style={styles.certCellLabel}>Document Type</Text>
          <Text style={styles.certCellValue}>
            SAFE (Simple Agreement for Future Equity)
          </Text>
        </View>
        <View style={styles.certRow}>
          <Text style={styles.certCellLabel}>Company</Text>
          <Text style={styles.certCellValue}>{data.companyName}</Text>
        </View>
        <View style={styles.certRow}>
          <Text style={styles.certCellLabel}>Investor</Text>
          <Text style={styles.certCellValue}>{data.investorName}</Text>
        </View>
        <View style={styles.certRow}>
          <Text style={styles.certCellLabel}>Investment Amount</Text>
          <Text style={styles.certCellValue}>{data.investmentAmount}</Text>
        </View>
        {data.documentId && (
          <View style={styles.certRow}>
            <Text style={styles.certCellLabel}>Document ID</Text>
            <Text style={styles.certCellValue}>{data.documentId}</Text>
          </View>
        )}
        <View style={styles.certRow}>
          <Text style={styles.certCellLabel}>Status</Text>
          <Text style={styles.certCellValue}>
            FULLY EXECUTED — All parties have signed
          </Text>
        </View>
      </View>

      <View style={styles.certTable}>
        <Text style={styles.certSectionTitle}>Signer Details</Text>

        <View style={styles.certRowHeader}>
          <Text style={{ ...styles.certCellLabel, width: 100 }}>Party</Text>
          <Text style={{ ...styles.certCellLabel, width: 120 }}>Name</Text>
          <Text style={{ ...styles.certCellLabel, width: 80 }}>Title</Text>
          <Text style={{ ...styles.certCellLabel, flex: 1 }}>
            Signed At
          </Text>
          <Text style={{ ...styles.certCellLabel, width: 80 }}>IP Address</Text>
        </View>

        {companySig && (
          <View style={styles.certRow}>
            <Text style={{ ...styles.certCellValue, width: 100 }}>Company</Text>
            <Text style={{ ...styles.certCellValue, width: 120 }}>
              {companySig.signer_name}
            </Text>
            <Text style={{ ...styles.certCellValue, width: 80 }}>
              {companySig.signer_title}
            </Text>
            <Text style={{ ...styles.certCellValue, flex: 1 }}>
              {formatSignatureDate(companySig.signed_at)}
            </Text>
            <Text style={{ ...styles.certCellValue, width: 80 }}>
              {companySig.ip_address || 'N/A'}
            </Text>
          </View>
        )}

        {providerSig && (
          <View style={styles.certRow}>
            <Text style={{ ...styles.certCellValue, width: 100 }}>Investor</Text>
            <Text style={{ ...styles.certCellValue, width: 120 }}>
              {providerSig.signer_name}
            </Text>
            <Text style={{ ...styles.certCellValue, width: 80 }}>
              {providerSig.signer_title}
            </Text>
            <Text style={{ ...styles.certCellValue, flex: 1 }}>
              {formatSignatureDate(providerSig.signed_at)}
            </Text>
            <Text style={{ ...styles.certCellValue, width: 80 }}>
              {providerSig.ip_address || 'N/A'}
            </Text>
          </View>
        )}
      </View>

      {data.auditTrail && data.auditTrail.length > 0 && (
        <View>
          <Text style={styles.certSectionTitle}>Audit Trail</Text>
          {data.auditTrail.map((entry, i) => (
            <View key={i} style={styles.auditRow}>
              <Text style={styles.auditTimestamp}>
                {formatSignatureDate(entry.timestamp)}
              </Text>
              <Text style={styles.auditAction}>{entry.action}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.legalNotice}>
        <Text style={styles.legalNoticeTitle}>
          Electronic Signature Disclosure
        </Text>
        <Text style={styles.legalNoticeText}>
          This document was executed using electronic signatures in compliance
          with the United States Electronic Signatures in Global and National
          Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform
          Electronic Transactions Act (UETA). All parties consented to
          conduct this transaction electronically and agreed that electronic
          signatures carry the same legal weight and enforceability as
          handwritten signatures. Each party has received a copy of this
          fully executed agreement.
        </Text>
        <Text style={{ ...styles.legalNoticeText, marginTop: 6 }}>
          The signing events were captured with timestamps and IP addresses
          to provide a verifiable audit trail. This certificate confirms that
          all signatures shown on this document are valid and were applied by
          the identified signers on the dates and times indicated.
        </Text>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          Electronic Signature Certification — Givvy Platform
        </Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  );
}

export function SAFEDocument({ data }: { data: SAFEDocumentData }) {
  const { variant, template: tmpl } = selectTemplate({
    valuation_cap: parseFloat(data.valuationCap.replace(/[^0-9.]/g, '')) || 0,
    discount: parseFloat(data.discountRate) || 0,
  });

  const rendered = renderTemplate(tmpl, {
    company_name: data.companyName,
    investor_name: data.investorName,
    investor_title: data.investorTitle,
    founder_name: data.founderName,
    founder_title: data.founderTitle,
    investment_amount: data.investmentAmount,
    valuation_cap: data.valuationCap,
    discount_rate: data.discountRate,
    state: data.state,
    date: data.date,
  });

  const allSigned =
    data.signatures?.company?.signed && data.signatures?.provider?.signed;

  const sigBlockMarker = 'IN WITNESS WHEREOF';
  const sigBlockIndex = rendered.indexOf(sigBlockMarker);

  const bodyContent =
    sigBlockIndex >= 0 ? rendered.substring(0, sigBlockIndex) : rendered;

  const paragraphs = bodyContent
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const isNumberedSection = (text: string) =>
    /^\d+\.\s/.test(text) || /^Section\s+\d+/i.test(text);

  const isSubsection = (text: string) =>
    /^\([a-z]\)\s/i.test(text) || /^\([ivxlc]+\)\s/i.test(text);

  const isAllCapsHeading = (text: string) =>
    text === text.toUpperCase() && text.length < 100 && text.length > 3;

  const isDefinitionLine = (text: string) =>
    /^"[^"]+"\s+means\s/i.test(text);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {paragraphs.map((paragraph, index) => {
          if (isAllCapsHeading(paragraph) && paragraph.length < 30) {
            if (
              paragraph.includes('SAFE') &&
              paragraph.includes('SIMPLE AGREEMENT')
            ) {
              return (
                <Text key={index} style={styles.documentTitle}>
                  {paragraph}
                </Text>
              );
            }
            if (paragraph === data.companyName.toUpperCase() || index <= 3) {
              return (
                <Text key={index} style={styles.companyName}>
                  {paragraph}
                </Text>
              );
            }
            return (
              <Text key={index} style={styles.sectionTitle}>
                {paragraph}
              </Text>
            );
          }

          if (
            isAllCapsHeading(paragraph) &&
            paragraph.includes('NOT BEEN REGISTERED')
          ) {
            return (
              <Text key={index} style={styles.securitiesNotice}>
                {paragraph}
              </Text>
            );
          }

          if (isNumberedSection(paragraph)) {
            const match = paragraph.match(/^(\d+\.\s*[^\n.]+?)(?:\n|$)/);
            if (match && paragraph.length > 60) {
              return (
                <View key={index}>
                  <Text style={styles.sectionTitle}>
                    {match[1]}
                  </Text>
                  <Text style={styles.bodyText}>
                    {paragraph.substring(match[1].length).trim()}
                  </Text>
                </View>
              );
            }
            return (
              <Text key={index} style={styles.sectionTitle}>
                {paragraph}
              </Text>
            );
          }

          if (isSubsection(paragraph)) {
            return (
              <Text key={index} style={styles.bodyText}>
                {paragraph}
              </Text>
            );
          }

          if (isDefinitionLine(paragraph)) {
            return (
              <Text key={index} style={styles.bodyText}>
                {paragraph}
              </Text>
            );
          }

          return (
            <Text key={index} style={styles.bodyText}>
              {paragraph}
            </Text>
          );
        })}

        <Text style={styles.witnessBlock}>
          IN WITNESS WHEREOF, the undersigned have caused this Safe to be
          duly executed and delivered.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <SignatureColumnBlock
              label="COMPANY"
              entityName={data.companyName}
              signerNameDefault={data.founderName}
              signerTitleDefault={data.founderTitle}
              signatureData={data.signatures?.company}
            />
            <SignatureColumnBlock
              label="INVESTOR"
              entityName={data.investorName}
              signerNameDefault={data.investorName}
              signerTitleDefault={data.investorTitle}
              signatureData={data.signatures?.provider}
            />
          </View>
        </View>

        {allSigned && (
          <View
            style={{
              marginTop: 20,
              padding: 8,
              backgroundColor: '#f0f9f0',
              borderWidth: 1,
              borderColor: '#22c55e',
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontFamily: 'Helvetica-Bold',
                color: '#15803d',
              }}
            >
              THIS DOCUMENT HAS BEEN FULLY EXECUTED BY ALL PARTIES VIA
              ELECTRONIC SIGNATURE
            </Text>
            <Text style={{ fontSize: 8, color: '#15803d', marginTop: 2 }}>
              Executed in compliance with the E-SIGN Act (15 U.S.C. § 7001) and
              UETA. See attached Electronic Signature Certification for details.
            </Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {allSigned ? 'Fully Executed' : 'Draft'} — SAFE Agreement —{' '}
            {data.companyName}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      <ESignCertificationPage data={data} />
    </Document>
  );
}

export async function generateSAFEPDF(
  data: SAFEDocumentData
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <SAFEDocument data={data} />
  );
  return Buffer.from(buffer);
}

export function buildSAFEDocData(
  deal: any,
  startup: any,
  talent: any,
  safeDoc?: { signatures?: Record<string, any>; audit_trail?: any[]; id?: string } | null
): SAFEDocumentData {
  const vars = buildTemplateVars(deal, startup, talent);

  const signatures: SAFEDocumentData['signatures'] = {};
  if (safeDoc?.signatures) {
    if (safeDoc.signatures.company) {
      signatures.company = {
        signed: safeDoc.signatures.company.signed ?? false,
        signer_name: safeDoc.signatures.company.signer_name ?? '',
        signer_title: safeDoc.signatures.company.signer_title ?? '',
        signed_at: safeDoc.signatures.company.signed_at ?? null,
        ip_address: safeDoc.signatures.company.ip_address,
      };
    }
    if (safeDoc.signatures.provider) {
      signatures.provider = {
        signed: safeDoc.signatures.provider.signed ?? false,
        signer_name: safeDoc.signatures.provider.signer_name ?? '',
        signer_title: safeDoc.signatures.provider.signer_title ?? '',
        signed_at: safeDoc.signatures.provider.signed_at ?? null,
        ip_address: safeDoc.signatures.provider.ip_address,
      };
    }
  }

  return {
    companyName: vars.company_name,
    founderName: vars.founder_name,
    founderTitle: vars.founder_title,
    investorName: vars.investor_name,
    investorTitle: vars.investor_title,
    investmentAmount: vars.investment_amount,
    valuationCap: vars.valuation_cap,
    discountRate: vars.discount_rate,
    vestingMonths: deal.safe_terms?.vesting_schedule ?? deal.vesting_months ?? 48,
    cliffMonths: deal.safe_terms?.cliff_period ?? deal.cliff_months ?? 12,
    state: vars.state,
    date: vars.date,
    template: deal.safe_terms?.template ?? 'yc-standard',
    proRata: deal.safe_terms?.pro_rata ?? false,
    mfnClause: deal.safe_terms?.mfn_clause ?? false,
    signatures: Object.keys(signatures).length > 0 ? signatures : undefined,
    auditTrail: safeDoc?.audit_trail ?? undefined,
    documentId: safeDoc?.id,
  };
}
