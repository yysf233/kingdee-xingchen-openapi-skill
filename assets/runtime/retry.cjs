// runtime/retry.cjs
const { printError } = require("./http.cjs");

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, { retries = 2, baseDelayMs = 500, prefix = "request" } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      const status = err?.status || err?.response?.status;
      const retriable = status === 429 || (status >= 500 && status <= 599);
      if (!retriable || attempt === retries) break;

      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`[WARN] ${prefix} failed (status=${status ?? "unknown"}), retry in ${delay}ms...`);
      await sleep(delay);
    }
  }
  printError(prefix, lastErr);
  throw lastErr;
}

module.exports = { withRetry };
