const dotenv = require("dotenv");
dotenv.config();

// 关键：兼容 CJS/ESM 的导出形态
const kdPkg = require("kingdee-sdk");
const kd = kdPkg?.default ?? kdPkg;

function requireEnv(keys) {
  const missing = keys.filter(k => !process.env[k]);
  if (missing.length) {
    console.log("[SKIP] Missing env:", missing.join(", "));
    process.exit(0);
  }
}

async function createClient() {
  requireEnv(["CLIENT_ID", "CLIENT_SECRET", "APP_KEY", "APP_SECRET", "DOMAIN"]);

  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const appKey = process.env.APP_KEY;
  const appSecret = process.env.APP_SECRET;
  const domain = process.env.DOMAIN;

  if (typeof kd.getAppToken !== "function") {
    throw new Error(`kingdee-sdk export shape unexpected. keys=${Object.keys(kdPkg).join(",")}`);
  }

  const tokenResp = await kd.getAppToken({ clientID, clientSecret, appKey, appSecret });

  const errcode = tokenResp?.errcode ?? tokenResp?.code;
  if (typeof errcode === "number" && errcode !== 0) {
    const desc = tokenResp?.description ?? tokenResp?.message ?? "";
    throw new Error(`getAppToken failed: errcode=${errcode} ${desc}`.trim());
  }

  const appToken =
    tokenResp?.data?.["app-token"] ||
    tokenResp?.data?.app_token ||
    tokenResp?.data?.appToken ||
    tokenResp?.["app-token"] ||
    tokenResp?.app_token ||
    tokenResp?.appToken;

  if (!appToken) {
    const topKeys = tokenResp && typeof tokenResp === "object" ? Object.keys(tokenResp) : [];
    const dataKeys = tokenResp?.data && typeof tokenResp.data === "object" ? Object.keys(tokenResp.data) : [];
    console.log("[DEBUG] getAppToken response keys:", topKeys.join(", "));
    if (dataKeys.length) console.log("[DEBUG] getAppToken.data keys:", dataKeys.join(", "));
    throw new Error("getAppToken returned no app-token/app_token/appToken (check response shape and credentials)");
  }

  // 关键：不再依赖 invokeApiWithConfig 的返回类型，自己包一层，保证 client 一定是函数
  const client = (req) => {
    if (typeof kd.invokeApi === "function") {
      return kd.invokeApi({ clientID, clientSecret, appToken, domain, ...req });
    }
    // 兜底：如果只有 invokeApiWithConfig，也用它；但必须保证结果为函数
    const maybe = kd.invokeApiWithConfig?.({ clientID, clientSecret, appToken, domain });
    if (typeof maybe !== "function") {
      throw new Error("kingdee-sdk: neither invokeApi nor functional invokeApiWithConfig is available");
    }
    return maybe(req);
  };

  return { client, appToken, domain, tokenResp };
}

module.exports = { createClient };