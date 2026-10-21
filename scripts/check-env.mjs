import fs from "fs";
import path from "path";

// Verify environment without printing any secret values
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("FAIL: .env.local does not exist!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const lines = envContent.split("\n");

let hasUrl = false;
let hasPubKey = false;
let hasSecretKey = false;
let urlFormatValid = false;

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
  const [key, ...rest] = trimmed.split("=");
  const val = rest.join("=").trim().replace(/^["']|["']$/g, "");

  if (key === "NEXT_PUBLIC_SUPABASE_URL") {
    hasUrl = val.length > 0;
    urlFormatValid = val.startsWith("https://") && val.includes("supabase.co");
  }
  if (key === "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" || key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    hasPubKey = val.length > 10;
  }
  if (key === "SUPABASE_SECRET_KEY" || key === "SUPABASE_SERVICE_ROLE_KEY") {
    hasSecretKey = val.length > 10;
  }
}

const gitignore = fs.readFileSync(path.join(process.cwd(), ".gitignore"), "utf-8");
const isGitignored = gitignore.includes(".env.local");

console.log("=== ENVIRONMENT CONFIGURATION CHECK ===");
console.log(`NEXT_PUBLIC_SUPABASE_URL present: ${hasUrl ? "YES" : "NO"}`);
console.log(`NEXT_PUBLIC_SUPABASE_URL format valid: ${urlFormatValid ? "YES" : "NO"}`);
console.log(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY present: ${hasPubKey ? "YES" : "NO"}`);
console.log(`SUPABASE_SECRET_KEY present: ${hasSecretKey ? "YES" : "NO"}`);
console.log(`.env.local gitignored: ${isGitignored ? "YES" : "NO"}`);

if (hasUrl && urlFormatValid && hasPubKey && hasSecretKey && isGitignored) {
  console.log("RESULT: PASS");
  process.exit(0);
} else {
  console.log("RESULT: FAIL");
  process.exit(1);
}
