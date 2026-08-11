const SALT = "fluent-v1";
const ACCESS_CODE_HASH = "09e1846f188c3f54f610e00056182bbd9c0792a3ffb27276a95ccb663010c3b8";

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
