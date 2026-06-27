const MASTER_CODE_SALT = "study-compass-v2:";
export const ACCESS_CODE_LENGTH = 6;
export const ACCESS_SESSION_TOKEN_LENGTH = 8;
const MAX_VALID_DAYS = 90;
const LOOKBACK_DAYS = MAX_VALID_DAYS * 2;
const ACCESS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SHA256_INITIAL_HASH = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
] as const;
const SHA256_ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

export type AccessCodeValidationReason =
  | "malformed"
  | "signature-mismatch"
  | "expired";

export type AccessCodeValidationResult =
  | {
      ok: true;
      code: string;
      issuedAt: Date;
      validDays: number;
      expiresAt: Date;
      fingerprint: string;
    }
  | {
      ok: false;
      reason: AccessCodeValidationReason;
      code: string;
      expiresAt?: Date;
    };

export type GenerateAccessCodeOptions = {
  issuedAt: Date;
  validDays: number;
  codeSeedDigest: string;
};

export function normalizeAccessCode(input: string): string {
  return input.trim().replace(/[\s\-–—−]/g, "").toUpperCase();
}

export function normalizeAccessSessionId(input: string | null | undefined): string | null {
  const value = normalizeAccessCode(input ?? "");
  if (value.length !== ACCESS_SESSION_TOKEN_LENGTH) return null;
  if (!Array.from(value).every((character) => ACCESS_CODE_ALPHABET.includes(character))) {
    return null;
  }
  return value;
}

export function createAccessSessionToken(): string {
  const bytes = new Uint8Array(ACCESS_SESSION_TOKEN_LENGTH);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((byte) => ACCESS_CODE_ALPHABET[byte % ACCESS_CODE_ALPHABET.length] ?? "A")
    .join("");
}

export function deriveAccessCodeSeed(baseSeedDigest: string, sessionId: string | null): string {
  const normalizedSession = normalizeAccessSessionId(sessionId);
  const normalizedBaseSeed = baseSeedDigest.toLowerCase();
  if (!normalizedSession) return normalizedBaseSeed;
  return sha256Hex(`access-session:${normalizedBaseSeed}:${normalizedSession}`);
}

export function generateAccessCode({
  issuedAt,
  validDays,
  codeSeedDigest,
}: GenerateAccessCodeOptions): string {
  assertValidIssuedAt(issuedAt);
  assertValidDays(validDays);

  return createShortCode(createAccessPayload(startOfLocalDay(issuedAt), validDays), codeSeedDigest);
}

export function validateAccessCode(
  codeInput: string,
  now: Date,
  codeSeedDigest: string,
): AccessCodeValidationResult {
  const code = normalizeAccessCode(codeInput);
  if (!isShortAccessCode(code)) {
    return { ok: false, reason: "malformed", code };
  }

  const match = findAccessCodeMatch(code, now, codeSeedDigest);
  if (!match) return { ok: false, reason: "signature-mismatch", code };
  if (!match.active) return { ok: false, reason: "expired", code, expiresAt: match.expiresAt };

  return {
    ok: true,
    code: match.code,
    issuedAt: match.issuedAt,
    validDays: match.validDays,
    expiresAt: match.expiresAt,
    fingerprint: fingerprintAccessCode(code),
  };
}

export function getAccessExpiry(
  codeInput: string,
  now: Date,
  codeSeedDigest: string,
): Date | null {
  const result = validateAccessCode(codeInput, now, codeSeedDigest);
  if (result.ok) return new Date(result.expiresAt.getTime());
  if (result.reason === "expired" && result.expiresAt) {
    return new Date(result.expiresAt.getTime());
  }
  return null;
}

export function verifyMasterCode(masterCode: string, verifierDigest: string): boolean {
  return safeEqual(sha256Hex(`${MASTER_CODE_SALT}${masterCode}`), verifierDigest.toLowerCase());
}

export function fingerprintAccessCode(codeInput: string): string {
  return sha256Hex(normalizeAccessCode(codeInput));
}

export function fingerprintAccessCodeSeed(codeSeedDigest: string): string {
  return sha256Hex(`access-code-seed:${codeSeedDigest.toLowerCase()}`);
}

type AccessCodeMatch = {
  active: boolean;
  code: string;
  issuedAt: Date;
  validDays: number;
  expiresAt: Date;
};

function assertValidIssuedAt(value: Date): void {
  if (!Number.isFinite(value.getTime())) {
    throw new Error("issuedAt must be a valid Date");
  }
}

function assertValidDays(value: number): void {
  if (!isValidDayCount(value)) {
    throw new Error("validDays must be an integer from 1 to 90");
  }
}

function isValidDayCount(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_VALID_DAYS;
}

function isShortAccessCode(value: string): boolean {
  return (
    value.length === ACCESS_CODE_LENGTH &&
    Array.from(value).every((character) => ACCESS_CODE_ALPHABET.includes(character))
  );
}

function findAccessCodeMatch(
  code: string,
  now: Date,
  codeSeedDigest: string,
): AccessCodeMatch | null {
  if (!Number.isFinite(now.getTime())) return null;

  const today = startOfLocalDay(now);
  let activeMatch: AccessCodeMatch | null = null;
  let expiredMatch: AccessCodeMatch | null = null;

  for (let dayOffset = 0; dayOffset <= LOOKBACK_DAYS; dayOffset += 1) {
    const issuedAt = addLocalDays(today, -dayOffset);

    for (let validDays = 1; validDays <= MAX_VALID_DAYS; validDays += 1) {
      const candidateCode = createShortCode(
        createAccessPayload(issuedAt, validDays),
        codeSeedDigest,
      );
      if (!safeEqual(candidateCode, code)) continue;

      const expiresAt = getExpiryFromIssuedDate(issuedAt, validDays);
      const match: AccessCodeMatch = {
        active: now.getTime() < expiresAt.getTime(),
        code: candidateCode,
        issuedAt,
        validDays,
        expiresAt,
      };

      if (match.active) {
        activeMatch = pickPreferredActiveMatch(activeMatch, match);
      } else {
        expiredMatch = pickPreferredExpiredMatch(expiredMatch, match);
      }
    }
  }

  return activeMatch ?? expiredMatch;
}

function pickPreferredActiveMatch(
  current: AccessCodeMatch | null,
  candidate: AccessCodeMatch,
): AccessCodeMatch {
  if (!current) return candidate;
  if (candidate.issuedAt.getTime() > current.issuedAt.getTime()) return candidate;
  if (
    candidate.issuedAt.getTime() === current.issuedAt.getTime() &&
    candidate.expiresAt.getTime() > current.expiresAt.getTime()
  ) {
    return candidate;
  }
  return current;
}

function pickPreferredExpiredMatch(
  current: AccessCodeMatch | null,
  candidate: AccessCodeMatch,
): AccessCodeMatch {
  if (!current) return candidate;
  return candidate.expiresAt.getTime() > current.expiresAt.getTime() ? candidate : current;
}

function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addLocalDays(value: Date, days: number): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days);
}

function createAccessPayload(issuedAt: Date, validDays: number): string {
  return `${formatDatePart(issuedAt)}:${validDays.toString().padStart(3, "0")}`;
}

function formatDatePart(date: Date): string {
  const year = (date.getFullYear() % 100).toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

function getExpiryFromIssuedDate(issuedAt: Date, validDays: number): Date {
  return new Date(issuedAt.getFullYear(), issuedAt.getMonth(), issuedAt.getDate() + validDays);
}

function createShortCode(payload: string, codeSeedDigest: string): string {
  return base32LikeFromHex(sha256Hex(`${payload}:${codeSeedDigest.toLowerCase()}`));
}

function base32LikeFromHex(hex: string): string {
  const bytes = hexToBytes(hex);
  let value = 0;
  let bitCount = 0;
  let output = "";

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bitCount += 8;

    while (bitCount >= 5 && output.length < ACCESS_CODE_LENGTH) {
      const index = (value >>> (bitCount - 5)) & 31;
      output += ACCESS_CODE_ALPHABET[index] ?? "A";
      bitCount -= 5;
    }

    if (output.length >= ACCESS_CODE_LENGTH) break;
  }

  return output;
}

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let index = 0; index < hex.length; index += 2) {
    bytes.push(Number.parseInt(hex.slice(index, index + 2), 16));
  }
  return bytes;
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function sha256Hex(input: string): string {
  const bytes = utf8Bytes(input);
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);

  const highLength = Math.floor(bitLength / 0x100000000);
  const lowLength = bitLength >>> 0;
  for (let shift = 24; shift >= 0; shift -= 8) {
    bytes.push((highLength >>> shift) & 0xff);
  }
  for (let shift = 24; shift >= 0; shift -= 8) {
    bytes.push((lowLength >>> shift) & 0xff);
  }

  const hash: number[] = Array.from(SHA256_INITIAL_HASH);
  const words = new Array<number>(64).fill(0);

  for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
    for (let index = 0; index < 16; index += 1) {
      const offset = chunkStart + index * 4;
      words[index] =
        (((bytes[offset] ?? 0) << 24) |
          ((bytes[offset + 1] ?? 0) << 16) |
          ((bytes[offset + 2] ?? 0) << 8) |
          (bytes[offset + 3] ?? 0)) >>>
        0;
    }

    for (let index = 16; index < 64; index += 1) {
      const word2 = words[index - 2] ?? 0;
      const word7 = words[index - 7] ?? 0;
      const word15 = words[index - 15] ?? 0;
      const word16 = words[index - 16] ?? 0;
      const s0 = rotateRight(word15, 7) ^ rotateRight(word15, 18) ^ (word15 >>> 3);
      const s1 = rotateRight(word2, 17) ^ rotateRight(word2, 19) ^ (word2 >>> 10);
      words[index] = (word16 + s0 + word7 + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;

    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rotateRight(e ?? 0, 6) ^ rotateRight(e ?? 0, 11) ^ rotateRight(e ?? 0, 25);
      const choose = ((e ?? 0) & (f ?? 0)) ^ (~(e ?? 0) & (g ?? 0));
      const temp1 =
        ((h ?? 0) + sigma1 + choose + (SHA256_ROUND_CONSTANTS[index] ?? 0) + (words[index] ?? 0)) >>>
        0;
      const sigma0 = rotateRight(a ?? 0, 2) ^ rotateRight(a ?? 0, 13) ^ rotateRight(a ?? 0, 22);
      const majority = ((a ?? 0) & (b ?? 0)) ^ ((a ?? 0) & (c ?? 0)) ^ ((b ?? 0) & (c ?? 0));
      const temp2 = (sigma0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = ((d ?? 0) + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = ((hash[0] ?? 0) + (a ?? 0)) >>> 0;
    hash[1] = ((hash[1] ?? 0) + (b ?? 0)) >>> 0;
    hash[2] = ((hash[2] ?? 0) + (c ?? 0)) >>> 0;
    hash[3] = ((hash[3] ?? 0) + (d ?? 0)) >>> 0;
    hash[4] = ((hash[4] ?? 0) + (e ?? 0)) >>> 0;
    hash[5] = ((hash[5] ?? 0) + (f ?? 0)) >>> 0;
    hash[6] = ((hash[6] ?? 0) + (g ?? 0)) >>> 0;
    hash[7] = ((hash[7] ?? 0) + (h ?? 0)) >>> 0;
  }

  return hash.map((value) => value.toString(16).padStart(8, "0")).join("");
}

function rotateRight(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function utf8Bytes(input: string): number[] {
  const bytes: number[] = [];

  for (const character of input) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) continue;

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >>> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >>> 12),
        0x80 | ((codePoint >>> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >>> 18),
        0x80 | ((codePoint >>> 12) & 0x3f),
        0x80 | ((codePoint >>> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    }
  }

  return bytes;
}
