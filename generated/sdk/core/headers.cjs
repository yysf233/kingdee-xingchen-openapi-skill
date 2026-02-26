const { randomUUID } = require("crypto");

const IDEMPOTENCY_HINT_KEYS = [
  "number",
  "no",
  "code",
  "billno",
  "externalno",
  "extno",
  "thirdno",
  "编码",
  "单号",
];

function isObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function hasHeader(headers, name) {
  const lower = String(name || "").toLowerCase();
  return Object.keys(headers || {}).some((k) => String(k).toLowerCase() === lower);
}

function findValueByHints(input) {
  const queue = [input];
  const seen = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!isObject(current) && !Array.isArray(current)) continue;
    if (seen.has(current)) continue;
    seen.add(current);

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    for (const [k, v] of Object.entries(current)) {
      const key = String(k).toLowerCase();
      if (IDEMPOTENCY_HINT_KEYS.includes(key) && v !== undefined && v !== null && String(v) !== "") {
        return String(v);
      }
      if (isObject(v) || Array.isArray(v)) queue.push(v);
    }
  }
  return null;
}

function makeUuid(uuidFn) {
  if (typeof uuidFn === "function") return String(uuidFn());
  if (typeof randomUUID === "function") return randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function resolveIdempotencyKey({ idempotencyKey, payload, uuidFn } = {}) {
  if (idempotencyKey !== undefined && idempotencyKey !== null && String(idempotencyKey) !== "") {
    return String(idempotencyKey);
  }
  const fromPayload = findValueByHints(payload);
  if (fromPayload) return fromPayload;
  return makeUuid(uuidFn);
}

function buildHeaders({
  defaultHeaders = {},
  extraHeaders = {},
  isWrite = false,
  isBodyMethod = false,
  idempotencyKey,
  idempotencyTimeoutSec,
  payload,
  enableIdempotency = true,
  uuidFn,
} = {}) {
  const headers = Object.assign({}, defaultHeaders || {}, extraHeaders || {});
  if (!isWrite) return headers;

  if (isBodyMethod && !hasHeader(headers, "Content-Type")) {
    headers["Content-Type"] = "application/json";
  }

  if (enableIdempotency !== false) {
    headers["Idempotency-Key"] = resolveIdempotencyKey({
      idempotencyKey,
      payload,
      uuidFn,
    });
  }

  if (idempotencyTimeoutSec !== undefined && idempotencyTimeoutSec !== null && idempotencyTimeoutSec !== "") {
    const n = Number(idempotencyTimeoutSec);
    if (Number.isFinite(n) && n > 0) {
      headers["Idempotency-Timeout"] = String(Math.floor(n));
    }
  }

  return headers;
}

function maskValue(key, value) {
  const lower = String(key || "").toLowerCase();
  const text = String(value ?? "");
  if (lower === "idempotency-key") {
    if (!text) return "***";
    return text.slice(0, 6) + "***";
  }
  if (
    lower.includes("token") ||
    lower.includes("secret") ||
    lower.includes("signature") ||
    lower.includes("authorization")
  ) {
    return "***";
  }
  return value;
}

function maskSensitiveHeadersForLog(headers) {
  const out = {};
  const input = headers || {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = maskValue(k, v);
  }
  return out;
}

module.exports = {
  buildHeaders,
  maskSensitiveHeadersForLog,
  resolveIdempotencyKey,
};
