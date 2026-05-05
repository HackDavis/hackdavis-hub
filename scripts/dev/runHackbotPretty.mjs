/*
 Temporary local helper for terminal testing.
 Usage:
   node scripts/dev/runHackbotPretty.mjs \
     --prompt "What workshops are happening today?" \
     --path /schedule \
     --base http://localhost:3000 \
     --cookie /tmp/hackbot.cookies

 Optional:
   --email <email here> --password <password here>
 If not passed, the script auto-loads credentials from .env.
*/

import fs from 'node:fs';
import { prettyPrintHackbotResponse } from './hackbotStreamPretty.mjs';

function argValue(name, fallback = '') {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

function parseCookieFile(cookiePath) {
  if (!fs.existsSync(cookiePath)) return '';
  const txt = fs.readFileSync(cookiePath, 'utf8');

  // Support a simple prebuilt cookie header in addition to Netscape jar format.
  if (!txt.includes('\t')) {
    return txt
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .join('; ');
  }

  const lines = txt
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) => line && (!line.startsWith('#') || line.startsWith('#HttpOnly_'))
    );

  const pairs = [];
  for (const line of lines) {
    const cols = line.split('\t');
    if (cols.length < 7) continue;
    const key = cols[5];
    const value = cols[6];
    if (!key || !value) continue;
    pairs.push(`${key}=${value}`);
  }

  return pairs.join('; ');
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

function extractSetCookieHeaders(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const single = headers.get('set-cookie');
  if (!single) return [];
  return [single];
}

function mergeCookieHeader(existingHeader, setCookieHeaders) {
  const jar = new Map();

  const seed = existingHeader
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const entry of seed) {
    const eq = entry.indexOf('=');
    if (eq <= 0) continue;
    jar.set(entry.slice(0, eq), entry.slice(eq + 1));
  }

  for (const cookie of setCookieHeaders) {
    const first = cookie.split(';')[0]?.trim();
    if (!first) continue;
    const eq = first.indexOf('=');
    if (eq <= 0) continue;
    jar.set(first.slice(0, eq), first.slice(eq + 1));
  }

  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function loginAndGetCookieHeader(base, email, password) {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  if (!csrfRes.ok) {
    throw new Error(`Could not fetch CSRF token (${csrfRes.status}).`);
  }

  const csrfJson = await csrfRes.json();
  const csrfToken = csrfJson?.csrfToken;
  if (!csrfToken) {
    throw new Error('Could not read CSRF token from auth endpoint.');
  }

  let cookieHeader = mergeCookieHeader(
    '',
    extractSetCookieHeaders(csrfRes.headers)
  );

  const form = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${base}/`,
    json: 'true',
  });

  const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader,
    },
    body: form.toString(),
    redirect: 'manual',
  });

  cookieHeader = mergeCookieHeader(
    cookieHeader,
    extractSetCookieHeaders(loginRes.headers)
  );

  if (!/authjs\.session-token=|next-auth\.session-token=/.test(cookieHeader)) {
    throw new Error('Login failed: no auth session token found.');
  }

  return cookieHeader;
}

async function main() {
  const prompt = argValue('--prompt');
  const currentPath = argValue('--path', '/');
  const base = argValue('--base', 'http://localhost:3000');
  const cookiePath = argValue('--cookie', '/tmp/hackbot.cookies');
  const envPath = argValue('--env', '.env');
  const env = parseEnvFile(envPath);

  const email =
    argValue('--email') ||
    env.ADMIN_EMAIL ||
    env.HACKBOT_EMAIL ||
    env.HACKBOT_TEST_EMAIL ||
    '';
  const password =
    argValue('--password') ||
    env.ADMIN_PASSWORD ||
    env.HACKBOT_PASSWORD ||
    env.HACKBOT_TEST_PASSWORD ||
    '';

  if (!prompt) {
    console.error('Missing required --prompt argument.');
    process.exit(1);
  }

  let cookieHeader = '';

  if (email && password) {
    cookieHeader = await loginAndGetCookieHeader(base, email, password);
    fs.writeFileSync(cookiePath, cookieHeader, 'utf8');
  } else {
    cookieHeader = parseCookieFile(cookiePath);
  }

  if (!cookieHeader) {
    console.error(
      `No auth available. Add ADMIN_EMAIL + ADMIN_PASSWORD to ${envPath}, or pass --email/--password, or provide a valid cookie file via --cookie.`
    );
    process.exit(1);
  }

  const response = await fetch(`${base}/api/hackbot/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      currentPath,
    }),
  });

  await prettyPrintHackbotResponse(response);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
