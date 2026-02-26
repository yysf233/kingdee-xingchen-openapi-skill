// runtime/config.cjs
// Loads required env vars for kingdee-sdk calling. Never print secrets.
function requireEnv(keys) {
  const missing = keys.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");
  if (missing.length) {
    console.log(`[SKIP] Missing env: ${missing.join(", ")}`);
    console.log("Create a .env file (copy from .env.example) and fill values, then re-run.");
    process.exit(0);
  }
}

function loadConfig() {
  requireEnv(["CLIENT_ID", "CLIENT_SECRET", "APP_KEY", "APP_SECRET", "DOMAIN"]);
  const apiHost = (process.env.OPENAPI_HOST || "https://api.kingdee.com").replace(/\/+$/, "");
  return {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    domain: process.env.DOMAIN,
    apiHost,
  };
}

module.exports = { loadConfig, requireEnv };
