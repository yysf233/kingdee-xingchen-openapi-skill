const NON_RETRY_CODES = new Set([400, 401, 403, 404, 405, 415, 601, 603, 604]);
const NETWORK_CODES = new Set(["ETIMEDOUT", "ECONNRESET", "ENOTFOUND"]);

function toNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
  return null;
}

function collectCodes(err) {
  const values = [
    err?.status,
    err?.statusCode,
    err?.code,
    err?.errorCode,
    err?.errcode,
    err?.response?.status,
    err?.response?.data?.errcode,
    err?.data?.errcode,
  ];
  return values.map(toNumber).filter((v) => v !== null);
}

function hasCode(err, code) {
  return collectCodes(err).includes(code);
}

function isRateLimited(err) {
  const msg = String(err?.message || "");
  return hasCode(err, 429) || msg.includes("429") || msg.includes("限流");
}

function isMediaTypeUnsupported(err) {
  const msg = String(err?.message || "");
  return hasCode(err, 415) || msg.includes("415");
}

function isServerError(err) {
  return collectCodes(err).some((v) => v >= 500 && v <= 599);
}

function isNetworkOrTimeout(err) {
  const name = String(err?.name || "");
  const code = String(err?.code || "").toUpperCase();
  if (/timeout/i.test(name)) return true;
  if (NETWORK_CODES.has(code)) return true;
  return false;
}

function shouldRetry(err, attempt, maxRetries = 3) {
  if (attempt >= maxRetries) return false;
  if (isMediaTypeUnsupported(err)) return false;

  const codes = collectCodes(err);
  if (codes.some((v) => NON_RETRY_CODES.has(v) && v !== 429)) return false;

  if (isRateLimited(err)) return true;
  if (isNetworkOrTimeout(err)) return true;
  if (isServerError(err)) return true;
  return false;
}

function backoffDelayMs(attempt, baseDelayMs = 500, jitterFn = Math.random) {
  const base = Number.isFinite(Number(baseDelayMs)) ? Math.max(0, Number(baseDelayMs)) : 500;
  const jitter = Math.floor((typeof jitterFn === "function" ? jitterFn() : Math.random()) * 101);
  return Math.floor(base * Math.pow(2, Math.max(0, attempt))) + jitter;
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, { maxRetries = 3, baseDelayMs = 500, logger, sleep = defaultSleep, jitterFn } = {}) {
  if (typeof fn !== "function") throw new Error("withRetry requires a function");
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (!shouldRetry(err, attempt, maxRetries)) throw err;
      const delayMs = backoffDelayMs(attempt, baseDelayMs, jitterFn);
      if (typeof logger === "function") {
        logger({
          event: "retry",
          attempt: attempt + 1,
          maxRetries,
          delayMs,
          message: err?.message || String(err),
        });
      }
      await sleep(delayMs);
      attempt += 1;
    }
  }
}

module.exports = {
  shouldRetry,
  backoffDelayMs,
  withRetry,
};
