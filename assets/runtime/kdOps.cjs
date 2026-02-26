// runtime/kdOps.cjs
// Thin wrappers around kingdee-sdk client({url, method, params, data})
const { withRetry } = require("./retry.cjs");
const { printError } = require("./http.cjs");

function buildApiUrl(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== "string") {
    throw new Error("url is required and must be a string");
  }
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const host = (process.env.OPENAPI_HOST || "https://api.kingdee.com").replace(/\/+$/, "");
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${host}${path}`;
}

async function call(client, { url, method, params, data }, prefix) {
  const fullUrl = buildApiUrl(url);
  const finalPrefix = prefix || `${method} ${fullUrl}`;
  try {
    return await withRetry(() => client({ url: fullUrl, method, params, data }), { prefix: finalPrefix });
  } catch (err) {
    // withRetry already printed error; keep friendly exit in scripts.
    throw err;
  }
}

async function getByNumber(client, detailUrl, number) {
  // Many *detail APIs accept id OR number.
  try {
    const resp = await call(
      client,
      { url: detailUrl, method: "GET", params: { number }, data: {} },
      `GET detail ${number}`
    );
    return resp;
  } catch (err) {
    // Some endpoints may return 404/业务码; treat as not found if status=404
    const status = err?.status || err?.response?.status;
    if (status === 404) return null;
    // If API returns business error in 200, caller should decide.
    return null;
  }
}

module.exports = { call, getByNumber, printError, buildApiUrl };
