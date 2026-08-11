// The access code is stored only as a salted SHA-256 hash, so the plaintext
// never appears in this (public) repository.
//
// IMPORTANT — this is obfuscation, not real security. The app is a static,
// client-side-only site, so anyone technical can bypass this gate in their own
// browser. It only guards writes to *their own* localStorage; it does not
// protect the repo or any shared data. For real access control you would need a
// backend that verifies the code server-side.
//
// To change the code, regenerate the hash and paste it below:
//   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('fluent-v1'+process.argv[1]).digest('hex'))" YOUR_NEW_CODE

const SALT = "fluent-v1";
const ACCESS_CODE_HASH =
  "09e1846f188c3f54f610e00056182bbd9c0792a3ffb27276a95ccb663010c3b8";

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Resolves to true when the entered code matches the stored hash.
export async function verifyAccessCode(input) {
  const hash = await sha256Hex(SALT + input);
  return hash === ACCESS_CODE_HASH;
}
