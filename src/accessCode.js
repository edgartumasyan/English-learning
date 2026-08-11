const SALT = "fluent-v1";
const ACCESS_CODE_HASH = "2133f95bca6522312b9c21ad22d2f2557b4c0b0ea3fbe96ca2d30fc30bbb5af0";

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAccessCode(input) {
  const hash = await sha256Hex(SALT + input);
  return hash === ACCESS_CODE_HASH;
}
