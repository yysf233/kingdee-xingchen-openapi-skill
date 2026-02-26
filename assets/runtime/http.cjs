// runtime/http.cjs
function redactSecrets(input) {
  const text = String(input ?? "");
  // Redact common secret/token fields in JSON-like text.
  return text
    .replace(
      /("(?:CLIENT_SECRET|APP_SECRET|clientSecret|appSecret|app-token|app_token|appToken|X-Api-Signature)"\s*:\s*")([^"]*)(")/gi,
      '$1***$3'
    )
    .replace(/(app-token=)[^&\s]+/gi, "$1***")
    .replace(/(client_secret=)[^&\s]+/gi, "$1***")
    .replace(/(app_secret=)[^&\s]+/gi, "$1***");
}

function safeJson(obj, maxLen = 2000) {
  try {
    const s = JSON.stringify(obj, null, 2);
    const redacted = redactSecrets(s);
    return redacted.length > maxLen ? redacted.slice(0, maxLen) + "\n...<truncated>..." : redacted;
  } catch {
    return redactSecrets(String(obj));
  }
}

function printError(prefix, err) {
  const status = err?.status || err?.response?.status;
  const body = err?.body || err?.response?.data || err?.data;
  const msg = err?.message || String(err);

  console.log(`[ERROR] ${prefix}`);
  if (status) console.log(`  status: ${status}`);
  console.log(`  message: ${msg}`);
  if (body !== undefined) console.log(`  body: ${safeJson(body)}`);
}

module.exports = { printError, safeJson };
