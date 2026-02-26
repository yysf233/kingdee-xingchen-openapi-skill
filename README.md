# kingdee-xingchen-openapi-js

面向 **金蝶云·星辰 OpenAPI** 的“可执行 skill 仓库”。它把 OpenAPI 的端点目录（`api.manifest.jsonl`）与文档（`docs/*.md`）纳入统一资产，并提供一套工具链：

- **1.2 端点语义标签（tagging）**：对端点做 deterministic 分类（`op/entityType/sync/id/objectKey`），形成能力矩阵与统计摘要；
- **1.3 SDK 骨架生成（generation）**：按业务对象生成可运行的 JS 调用骨架（含**写后读验证**、默认 **Content-Type**、默认 **Idempotency-Key**、**429 限流退避重试**、日志脱敏）；
- **runtime**：复用 `assets/runtime/kdClient.cjs`，统一鉴权与请求调用（保证 `client(req)` 形态稳定）。

> 适用：ERP 二开/系统集成、主数据同步、订单链路打通、WMS/电商/CRM 与星辰对接 PoC 与工程化落地。

---

## 目录结构（核心）

- `SKILL.md`  
  规范与硬规则（**必须按 manifest → docs 选端点**、**URL 必须完整**、**写后读验证**等）。

- `references/openapi/`  
  skill 自带的 OpenAPI 资料库（参考/缓存用）：
  - `api.manifest.jsonl`
  - `docs/`

- `references/openapi/_derived/`（工具生成）
  - `endpoints.tagged.json`：标签化端点清单（generator 输入）
  - `tag.summary.json`：统计摘要（模块/对象/op/sync 覆盖度）
  - `object.map.json`：业务对象映射表（可手工维护）

- `assets/runtime/kdClient.cjs`  
  `createClient()`：获取 `{ client, appToken, domain }`。其中 `client(req)` 是调用 OpenAPI 的函数。

- `tools/`
  - `tag_endpoints.cjs`：生成端点标签（1.2）
  - `gen_sdk.cjs`：生成 SDK（1.3）
  - `discover_sources.cjs`：发现资料源（优先工程目录，其次本 skill）
  - `__tests__/`：node:test 单测

- `generated/`（运行 `gen_sdk` 后生成）
  - `generated/sdk/`：生成的 SDK
  - `generated/scripts/`：可运行 sample（list/detail/save）

---

## 生成 SDK 的导出形态（重要）

`generated/sdk/index.cjs` 会导出：

- `createApi(ctx = {})`：生成所有资源对象的集合
- `create<PascalObjectKey>Api(ctx = {})`：生成单个资源对象

其中 `ctx` 推荐传入：

```js
{
  client,                 // 必需：function(req) => Promise
  openapiHost,            // 可选：默认 https://api.kingdee.com
  overrideHost: false     // 可选：当 endpointUrl 为完整 URL 时，是否用 openapiHost 覆盖 host
}
```

资源对象通常包含：
- `list/detail/save/create/update/delete/...`
- `workflow` 动作（存在则生成）
- `getRequestUrl(actionName, opts?)`：打印/检查完整 URL（便于排错）

---

## 常用命令

### 运行单测
```bash
node --test
```

### 生成端点标签（1.2）
```bash
node tools/tag_endpoints.cjs
# 从“另一个项目”目录读取 api.manifest.jsonl + docs（优先）
node tools/tag_endpoints.cjs --cwd "D:\path\to\other-project" --debug
```

输出：
- `references/openapi/_derived/endpoints.tagged.json`
- `references/openapi/_derived/tag.summary.json`

### 生成 SDK（1.3）
```bash
node tools/gen_sdk.cjs
```

输出：
- `generated/sdk/`
- `generated/scripts/`

---

## 运行时依赖与环境变量

本仓库本身不强制 npm 工程化，但运行 `kdClient.cjs` / sample 需要 Node 能解析到依赖：

- `kingdee-sdk`
- `dotenv`（sample 与 runtime 会读取 `.env`）

通常做法：把本仓库作为 submodule 放到你的工程里，然后在你的工程根目录安装依赖：
```bash
npm i kingdee-sdk dotenv
```

`assets/runtime/kdClient.cjs` 至少需要环境变量：
- `CLIENT_ID`
- `CLIENT_SECRET`
- `APP_KEY`
- `APP_SECRET`
- `DOMAIN`
- （可选）`OPENAPI_HOST`：默认 `https://api.kingdee.com`

---

## 写入/状态动作的默认行为（生成 SDK 内置）

对 `write:*` / `workflow:*`：
- 默认注入 `Content-Type: application/json`（除非 `opts.headers` 覆盖）
- 默认注入 `Idempotency-Key`（可通过 `opts.idempotencyKey` 指定；或从 payload 推断；否则 uuid）
- 429 限流做指数退避重试（可通过 `opts.retry` 配置）
- 日志脱敏（token/secret/signature 等不会被完整输出）
- 写后读验证（read-after-write）失败会 throw

---

## 快速开始

见：[QUICKSTART.md](./QUICKSTART.md)
