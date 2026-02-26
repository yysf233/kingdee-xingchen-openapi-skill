# QUICKSTART

本文件用于在**其他项目**中快速验收/使用本仓库：从项目的 OpenAPI 资料生成端点标签与 SDK，并用 sample 跑通读/写链路。

---

## 1) 把 skill 仓库引入到你的项目

推荐 submodule（也可直接 clone）：

```bash
git submodule add https://github.com/yysf233/kingdee-xingchen-openapi-js.git tools/kingdee-xingchen-openapi-js
```

后文用：
- `SKILL_DIR=tools/kingdee-xingchen-openapi-js`
- `PROJ_DIR=你的项目根目录`

---

## 2) 安装运行时依赖

在你的项目根目录执行（保证 `kingdee-sdk`、`dotenv` 可被本 skill 解析到）：

```bash
cd PROJ_DIR
npm i kingdee-sdk dotenv
```

> Node 模块解析会从脚本目录向上找 `node_modules/`。把 skill 作为工程子目录时，依赖通常会被解析到工程的 `node_modules`。

---

## 3) 准备 OpenAPI 资料（在你的项目里）

在 `PROJ_DIR` 下准备：
- `api.manifest.jsonl`（必需）
- `docs/`（建议）

本 skill 会优先从 `--cwd` 指向的目录（及祖先）发现这些文件；找不到才回退到 skill 自带 `references/openapi/`。

---

## 4) 生成端点标签（1.2）

```bash
cd SKILL_DIR
node tools/tag_endpoints.cjs --cwd "PROJ_DIR" --debug
```

成功标志（console）：
- `[OK] tagged <N> endpoints`
- `[OK] wrote: .../references/openapi/_derived/endpoints.tagged.json`
- `[OK] wrote: .../references/openapi/_derived/tag.summary.json`

建议快速检查：
- `references/openapi/_derived/tag.summary.json` 的模块/对象数量是否符合预期
- `sync` 是否标出 `incremental-ok`（能否做增量）

---

## 5) 生成 SDK（1.3）

```bash
cd SKILL_DIR
node tools/gen_sdk.cjs
```

输出：
- `generated/sdk/`
- `generated/scripts/`

---

## 6) 配置环境变量（.env）

建议在 **SKILL_DIR 根目录**放置 `.env`（因为 sample 与 runtime 默认读取当前工作目录的 `.env`）：

```ini
CLIENT_ID=...
CLIENT_SECRET=...
APP_KEY=...
APP_SECRET=...
DOMAIN=...

# 可选：你的环境不是默认 host 时再设置
OPENAPI_HOST=https://api.kingdee.com
```

---

## 7) 跑 sample（最短验收闭环）

进入 `SKILL_DIR` 运行某个 sample（文件名以实际生成的 objectKey 为准）：

```bash
cd SKILL_DIR
node generated/scripts/customer.sample.cjs
```

sample 行为（按生成模板）：
- 如果存在 `list`：调用 list
- 如果存在 `detail`：需要你提供 `SAMPLE_ID` 或 `SAMPLE_NUMBER`
- 如果存在 `save`：需要你提供 `SAMPLE_SAVE_MODEL`（JSON 字符串）

### 7.1 运行 detail（可选）
```bash
SAMPLE_ID=123 node generated/scripts/customer.sample.cjs
# 或
SAMPLE_NUMBER=C0001 node generated/scripts/customer.sample.cjs
```

### 7.2 运行 save（可选，带写后读验证）
```bash
SAMPLE_SAVE_MODEL='{"number":"C0001","name":"测试客户"}' node generated/scripts/customer.sample.cjs
```

> 注意：save 内部会做“写后读验证”，并且写请求默认注入 Content-Type/Idempotency-Key，429 会退避重试。

---

## 8) 在你的项目里直接调用生成 SDK

你可以在你的工程中新建脚本，例如 `scripts/xingchen_poc.cjs`：

```js
require("dotenv").config();

const path = require("path");

// 把 SKILL_DIR 换成你的实际路径（绝对/相对都可）
const SKILL_DIR = path.resolve(__dirname, "../tools/kingdee-xingchen-openapi-js");

const { createClient } = require(path.join(SKILL_DIR, "assets/runtime/kdClient.cjs"));
const { createApi } = require(path.join(SKILL_DIR, "generated/sdk/index.cjs"));

async function main() {
  const { client, domain } = await createClient();
  const openapiHost = process.env.OPENAPI_HOST || "https://api.kingdee.com";

  // ctx 形态：{ client, openapiHost, overrideHost? }
  const api = createApi({ client, openapiHost });

  console.log(`[INFO] DOMAIN=${domain}`);
  console.log(`[INFO] OPENAPI_HOST=${openapiHost}`);

  // 示例：客户列表
  if (!api.customer?.list) throw new Error("api.customer.list not generated");
  console.log(`[URL] list -> ${api.customer.getRequestUrl("list")}`);
  const resp = await api.customer.list({ page: 1, pageSize: 5, filters: {} });
  console.log("[OK] list keys:", Object.keys(resp || {}).join(", "));
}

main().catch((e) => {
  console.error("[ERROR]", e.message);
  process.exit(1);
});
```

---

## 9) 写入/状态动作推荐 opts

对 save/audit/submit 等写请求，可用 `opts` 控制幂等、重试与 header：

```js
await api.saleOrder.save(model, {
  idempotencyKey: "SO-2026-0001",
  idempotencyTimeoutSec: 30,
  retry: { maxRetries: 3, baseDelayMs: 500 },
  headers: { "Content-Type": "application/json" }, // 一般不需要，默认已注入
  enableIdempotency: true,                          // 默认 true；可设为 false 禁用
});
```

---

## 10) 常见问题

### 10.1 discovery 没命中你的项目资料
- 检查 `PROJ_DIR` 是否有 `api.manifest.jsonl`
- `--cwd` 是否指向正确目录
- 文件名/扩展名是否正确

### 10.2 401/403/签名失败
- 检查 `.env` 是否齐全：CLIENT_ID/CLIENT_SECRET/APP_KEY/APP_SECRET/DOMAIN
- 检查应用授权、IP 白名单、权限范围

### 10.3 429 限流
- 默认会退避重试；仍失败则降低并发/频率，或增大 `retry.baseDelayMs/maxRetries`

### 10.4 “写成功但界面看不到”
- 以写后读回查结果为准，重点核对 DOMAIN/组织字段/单据状态（未审核/草稿）
