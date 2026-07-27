// Seeds a client portal admin and (optionally) a sample engagement.
//
// Credentials are read from the environment and never written to disk. The
// password is hashed with scrypt before it leaves this process, matching the
// format used by src/lib/portal/auth.ts.
//
// Usage:
//   PORTAL_ADMIN_EMAIL=you@example.com PORTAL_ADMIN_PASSWORD='...' \
//     node scripts/seed-portal.mjs [--with-sample-data]

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

// Must match SCRYPT_PARAMS in src/lib/portal/auth.ts or the hash will not verify.
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;

function loadEnvLocal() {
  try {
    for (const line of readFileSync('.env.local', 'utf-8').split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // .env.local is optional when the variables are already exported.
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password.normalize('NFKC'), salt, KEY_LENGTH, SCRYPT);
  return `scrypt$1$${salt.toString('hex')}$${derived.toString('hex')}`;
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.PORTAL_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.PORTAL_ADMIN_PASSWORD || '';
const fullName = process.env.PORTAL_ADMIN_NAME || 'Givvy Admin';
const withSampleData = process.argv.includes('--with-sample-data');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
if (!email || !password) {
  console.error('Set PORTAL_ADMIN_EMAIL and PORTAL_ADMIN_PASSWORD.');
  process.exit(1);
}

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function upsertAdmin() {
  const existing = await rest(`portal_users?email=eq.${encodeURIComponent(email)}&select=id`);

  if (existing.length > 0) {
    await rest(`portal_users?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      body: {
        password_hash: hashPassword(password),
        role: 'admin',
        status: 'active',
        full_name: fullName,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      },
    });
    console.log(`Updated existing admin ${email}`);
    return existing[0].id;
  }

  const [created] = await rest('portal_users', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      email,
      full_name: fullName,
      company: 'Givvy',
      role: 'admin',
      password_hash: hashPassword(password),
      must_change_password: false,
    },
  });
  console.log(`Created admin ${email}`);
  return created.id;
}

const SAMPLE_TASKS = [
  ['Intake', 'Collect corporate records and cap table', 'done', 'high', -12],
  ['Intake', 'Confirm transaction objectives and constraints', 'done', 'medium', -10],
  ['Modelling', 'Build base-case operating model', 'done', 'high', -6],
  ['Modelling', 'Stress-test leverage and coverage scenarios', 'in_progress', 'high', 3],
  ['Modelling', 'Agree valuation range with sponsor', 'todo', 'medium', 8],
  ['Diligence', 'Quality of earnings review', 'in_progress', 'high', 5],
  ['Diligence', 'Customer concentration analysis', 'todo', 'medium', 11],
  ['Diligence', 'Outstanding legal disclosure schedule', 'blocked', 'high', 2],
  ['Diligence', 'IT and security assessment', 'todo', 'low', 16],
  ['Structuring', 'Draft SPV formation documents', 'in_progress', 'medium', 7],
  ['Structuring', 'Seller note and earnout mechanics', 'todo', 'high', 14],
  ['Close', 'Signature packet and funds flow', 'todo', 'medium', 24],
];

const SAMPLE_DOCUMENTS = [
  ['Confidential Information Memorandum.pdf', 'Diligence', '4.2 MB'],
  ['Quality of Earnings — Draft.xlsx', 'Diligence', '1.8 MB'],
  ['Operating Model v4.xlsx', 'Financial', '2.4 MB'],
  ['SPV Formation Documents.pdf', 'Legal', '860 KB'],
  ['Funds Flow Summary.pdf', 'Closing', '312 KB'],
];

function isoDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function seedSampleData(adminId) {
  const existing = await rest('portal_projects?select=id&limit=1');
  if (existing.length > 0) {
    console.log('Engagements already exist; skipping sample data.');
    return;
  }

  const [project] = await rest('portal_projects', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      name: 'Industrial Services Acquisition',
      client_name: 'Whitmore Capital',
      description:
        'Acquisition of a $62M revenue industrial services platform, including diligence, financing, and SPV formation.',
      status: 'active',
    },
  });

  await rest('portal_project_members', {
    method: 'POST',
    body: { project_id: project.id, user_id: adminId },
  });

  await rest('portal_tasks', {
    method: 'POST',
    body: SAMPLE_TASKS.map(([section, title, status, priority, dueOffset], index) => ({
      project_id: project.id,
      section,
      title,
      status,
      priority,
      assignee_id: adminId,
      due_date: isoDateOffset(dueOffset),
      position: (index + 1) * 10,
    })),
  });

  await rest('portal_documents', {
    method: 'POST',
    body: SAMPLE_DOCUMENTS.map(([name, category, size_label]) => ({
      project_id: project.id,
      name,
      category,
      size_label,
      uploaded_by: adminId,
    })),
  });

  console.log(`Seeded sample engagement "${project.name}" with ${SAMPLE_TASKS.length} tasks.`);
}

try {
  const adminId = await upsertAdmin();
  if (withSampleData) await seedSampleData(adminId);
  console.log('Done.');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
