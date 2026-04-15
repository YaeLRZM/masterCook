/**
 * Auth helpers — JWT usando Web Crypto API (compatible con Edge runtime de Next.js)
 */

export const SESSION_COOKIE = "mc_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const getSecret = () =>
  process.env.AUTH_SECRET ?? "mastercook-dev-secret-change-in-production";

// ── Base64url ─────────────────────────────────────────────────────────────────

function b64urlEncode(input: Uint8Array | string): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64urlDecode(str: string): string {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return binary;
}

// ── HMAC-SHA256 via Web Crypto API ────────────────────────────────────────────

async function importKey(secret: string): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return b64urlEncode(new Uint8Array(signature));
}

async function hmacVerify(
  data: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const key = await importKey(secret);
  const padded = signature + "=".repeat((4 - (signature.length % 4)) % 4);
  const sigBytes = Uint8Array.from(
    atob(padded.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  return crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(data));
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function signToken(
  payload: Omit<SessionPayload, "iat" | "exp">
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const full: SessionPayload = { ...payload, iat: now, exp: now + 60 * 60 * 24 * 30 };

  const header = b64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64urlEncode(JSON.stringify(full));
  const sig = await hmacSign(`${header}.${body}`, getSecret());

  return `${header}.${body}.${sig}`;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;

    const valid = await hmacVerify(`${header}.${body}`, sig, getSecret());
    if (!valid) return null;

    const payload = JSON.parse(b64urlDecode(body)) as SessionPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
