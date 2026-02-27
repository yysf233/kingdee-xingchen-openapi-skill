---
name: kingdee-xingchen-openapi-skill
description: （全局技能）用于生成/调试金蝶云星辰 OpenAPI 的可运行 JS/TS（Node.js）代码：基于工程内 kingdee-sdk 调用接口；自动在工程内与全局 references 中发现 OpenAPI manifest/docs；强制“写后读验证”；提供稳定的排错流程（token/domain/组织/状态/筛选）。
---

# kingdee-xingchen-openapi-skill

本 skill 用于：在任意工程中，根据金蝶云星辰 OpenAPI 文档生成**可运行**的 Node.js（JS/TS）代码，并在出现“脚本看似成功但界面看不到数据”等情况时提供可证据化排查流程。

> 本 skill 为 **全局（user-scoped）** 形态：优先使用“当前工程”里的资源；找不到时回退到本 skill 自带的 `references/openapi/` 文档库。

---

## 适用场景（何时必须用本 skill）

当用户提出以下需求之一时，应触发本 skill：

- 需要用 JS/TS 对接金蝶云星辰 OpenAPI（查询/新增/更新/审核/下推等）。
- 需要编写客户、物料（商品）、销售出库单等同步脚本或集成代码。
- API 调用“看似 OK”，但在账套页面找不到新增/更新结果，需要排查 token、domain 路由、组织/状态/界面筛选等问题。
- 需要根据本地 OpenAPI 文档（382+ md + manifest）选对端点并生成正确请求。

---

## 安全红线（必须遵守）

- **禁止**打印、记录或写入任何敏感信息：
  - `CLIENT_SECRET`、`APP_SECRET`、`app-token`（或任何 token）、`access_token`、`X-Api-Signature`、完整请求签名串等。
- 允许输出的诊断信息（非敏感）：
  - `DOMAIN`（完整打印）
  - 请求 URL、method、query 参数（必要时）
  - HTTP status
  - `errcode` / `description` / `message`
  - 响应对象的 key 列表、以及 `id/number/name` 等非敏感字段
- 所有日志若可能包含敏感值，必须脱敏为 `***`。

---

## 资源发现（Resource Discovery，生成代码前必做）

每次生成/排查都必须按以下优先级定位 OpenAPI 资料：

### 1) 工程本地优先（从当前工作目录向上搜索）

优先使用当前工程（repo）中的：

- `api.manifest.jsonl`
- `docs/`（OpenAPI Markdown 文档目录）

> 目的：同一个工程可能绑定了特定版本文档或补丁，优先使用工程内资料可避免版本错配。

### 2) 全局 skill 回退（若工程内找不到）

若工程内未找到，回退使用本 skill 自带 references：

- `references/openapi/api.manifest.jsonl`
- `references/openapi/docs/`
- 可选：`references/openapi/report.json`

### 3) 两者都找不到时的硬规则

- **不允许猜接口端点（endpoint）**，不允许凭经验编造 URL。
- 只能输出 scaffold（代码骨架），并明确提示用户补齐 `api.manifest.jsonl + docs/` 或提供其路径。

---

## SDK 与依赖规则（必须遵守）

### 使用工程自己的 kingdee-sdk

生成代码必须依赖工程自身的 `node_modules`：

- 始终使用：`require("kingdee-sdk")`
- CommonJS/ESM 兼容导入方式（必须采用）：

```js
const kdPkg = require("kingdee-sdk");
const kd = kdPkg?.default ?? kdPkg;
```

### URL 规范（强制）

- `kingdee-sdk` 的 `invokeApi`/`invokeApiWithConfig` 传入的 `url` **必须是完整 URL**（例如 `https://api.kingdee.com/jdy/v2/bd/customer`）。
- **禁止**只传相对路径（例如 `/jdy/v2/bd/customer`），否则会触发 `Invalid URL`。
- 建议统一使用：
  - `OPENAPI_HOST`（可选，默认 `https://api.kingdee.com`）拼接接口 path；
  - `DOMAIN` 仅用于请求头 `X-GW-Router-Addr`（IDC 路由），不是 OpenAPI host。
- 建议生成代码内置 URL 规范化函数：输入相对 path 时自动补全为完整 URL。

### runtime 使用策略（不强制输出结构，但必须可落地）

- 若工程中存在 `./runtime/kdClient.cjs`（及相关 runtime 模块），允许生成依赖工程 runtime 的代码。
- 若工程中不存在 runtime，则生成 **standalone 单文件脚本**（依赖仅限 `dotenv` + `kingdee-sdk`），不得引用不存在的 `./runtime/*` 路径。
- 任何情况下，都必须输出“运行命令 + 必需 env 列表 + 验证步骤”。

---

## 端点选择流程（强制：manifest → docs）

生成代码必须按以下顺序做接口选型：

1. 先查 `api.manifest.jsonl`（工程内优先，否则用 references）定位候选端点：
   - 使用 `target + 关键词（详情/列表/保存/审核/删除/下推）` 检索
2. 再打开对应 `docs/*.md` 抽取：
   - `method` / `url`
   - 必填字段（params/body）
   - 成功/失败字段（如 `errcode/description`）
3. 生成代码时在注释中写明引用的 `doc_path`，便于审计与回溯。

---

## 成功判定（必须“写后读验证”）

对所有写入类动作（save/create/update/audit/submit/push 等），“成功”必须满足：

1. **业务成功**：`errcode == 0`（或 docs 明确的成功标识）
2. **写后读验证（Read-after-write）**：
   - 保存后必须用 detail 或 list 回查确认目标实体存在/状态正确
   - **只有验证通过**才能输出 `[OK]`

失败时必须：

- 打印 `errcode/description` 或 HTTP status + body 摘要（不含敏感信息）
- `process.exit(1)`（或抛错并最终以非 0 退出）

---

## “OK 但界面看不到”的标准排查清单（必须输出证据）

当出现“脚本 OK 但 UI 看不到”时，必须按顺序排查并给出证据化输出：

1. **DOMAIN 是否一致**
   - 打印当前 `.env` 的 `DOMAIN`
   - 确认与网页登录的账套环境一致（测试域/生产域/不同租户路由会导致 UI 看不到）
2. **API 侧是否能查到（证据）**
   - 用 detail（按编码/单号）回查，打印：HTTP status、errcode、data keys、id/number/name
   - 若 detail 查不到，再用 list 搜索（按 number/name/关键字）
3. **组织/状态/启用/审核字段**
   - 从 detail 返回中打印相关字段（只打印字段与取值，不输出敏感信息）
   - 判断是否被 UI 默认筛选隐藏（例如禁用、非当前组织、未审核等）
4. **结论**
   - 明确写出：是“没写入/写入失败/写入到别的环境/写入存在但被 UI 筛选隐藏”等之一，并附证据。

---

## 输出契约（生成代码必须包含）

无论输出结构为何（脚本/模块/服务），生成结果必须包含：

- 运行命令（例如 `node generated/<task>.cjs --input ...`）
- 必需环境变量列表：`CLIENT_ID`、`CLIENT_SECRET`、`APP_KEY`、`APP_SECRET`、`DOMAIN`
- 可选环境变量：`OPENAPI_HOST`（默认 `https://api.kingdee.com`）
- 端点与文档来源（manifest + docs 的引用路径）
- 写入动作的“写后读验证”步骤
- 可读的错误输出（errcode/description 或 HTTP status + body 摘要）
- 不泄露敏感信息的日志策略
- 输出中应打印最终请求的完整 URL（或 host + path 组合结果），便于快速定位 `Invalid URL`/路由问题

---

## 目录标签与骨架生成（1.2/1.3）

本 skill 内置两个 CLI，用于先标注端点再生成调用骨架：

1. 语义标签（1.2）  
   `node tools/tag_endpoints.cjs`  
   可选参数：`--cwd <path>`（从指定目录向上优先发现 `api.manifest.jsonl` + `docs/`），`--debug`（打印首条 manifest keys）。

2. 调用骨架生成（1.3）  
   `node tools/gen_sdk.cjs`  
   默认读取 `references/openapi/_derived/endpoints.tagged.json` 并生成 `generated/` 目录。

产物路径约定：

- 标签与统计：`references/openapi/_derived/`
- 代码骨架：`generated/`

硬约束保持不变：

- 端点选型必须 manifest → docs；
- `kingdee-sdk` 调用 url 必须完整 URL；
- `DOMAIN` 用于路由，不等于 OpenAPI host；
- 写入/状态动作必须“写后读验证”通过才算成功。

---

## 本 skill 自带参考资料与资产位置

- OpenAPI 索引：`references/openapi/api.manifest.jsonl`
- OpenAPI 文档：`references/openapi/docs/`
- 抓取报告（可选）：`references/openapi/report.json`
- 可复用 runtime 资产：`assets/runtime/`

## 官方 OpenAPI 规范要点（必须遵守）

> 来源：金蝶官方《苍穹平台 OpenAPI 接口规范》《苍穹平台 OpenAPI 开发规范》。
> 注意：星辰/苍穹在具体 path 上可能不同，但**方法、header、返回结构、幂等/限流/数据量约束**对“写脚本做集成”具备通用指导意义；最终仍以 `manifest → docs` 为准。

### 协议、报文与 URL

- 传输协议推荐 **HTTPS**；OpenAPI 支持 HTTPS/HTTP，通过 GET/POST 交互，常见报文为 JSON（也可能是 XML/文件流，以 docs 为准）。:contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}
- 报文大小限制（苍穹 V6.0.14+）：请求/响应 body 最大 **20M**，文件流最大 **50M**；可由租户 MC 参数调整：`OpenApi.MaxBodySize`、`OpenApi.FileItem.MaxSize`。:contentReference[oaicite:2]{index=2}
- URL 构造：平台常提供 **URI**，需要拼接域名与 `/kapi` 形成完整地址（示例：`https://<host>/kapi/v2/...`）。 :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
  - 苍穹 V2 URL 结构参考：`kapi/v2/{isv}/{appId}/{formId}/{API编码}`（自定义 API 可能没有 `formId` 段）。:contentReference[oaicite:5]{index=5}
  - **禁止猜 URL**：仍然必须按本 skill 的硬规则：`manifest → docs` 抽取 `method/url`。

### GET/POST 使用边界（生成代码必须体现）

- GET 仅用于获取数据；参数暴露在 URL，且长度有约束（文档提到 2048 字符）。POST 用于保存/修改等写入，参数放在 request body。:contentReference[oaicite:6]{index=6}

### 公共 Header 与幂等（写入/状态动作强制考虑）

- 公共 header 概念：`Content-Type`（如 `application/json`）、`accesstoken`（鉴权令牌）。:contentReference[oaicite:7]{index=7}
- 写入/状态动作建议使用 `Idempotency-Key` 防重复提交；检测到重复 key 系统会拒绝请求。接口规范提到 key 有效期 30 分钟。:contentReference[oaicite:8]{index=8}
  - 开发规范还补充：`Idempotency-Key` 可由 uuid/业务单号生成，并支持 `Idempotency-Timeout`（V6.0.12+）。:contentReference[oaicite:9]{index=9}
- 高并发/强一致场景，规范更推荐“业务侧数据库唯一索引”从源头避免重复写入。:contentReference[oaicite:10]{index=10}

### 通用返回结构（成功判定不能只看 HTTP 200）

- 通用返回字段：`data`、`errorCode`、`message`、`status`。:contentReference[oaicite:11]{index=11}
- 规范调用成功判定：HTTP=200 且 `errorCode==0`（或 docs 指定的成功标识）。:contentReference[oaicite:12]{index=12}
- 分页返回常见字段（位于 `data`）：`rows`、`pageNo`、`pageSize`、`filter`、`lastPage`、`totalCount`。:contentReference[oaicite:13]{index=13}

### 错误码与重试分类（生成代码应内置）

- 常见错误码：400/401/403/404/405/415/429/500/601/602/603/604/611 等；其中 415 通常是 Content-Type 不正确，429 表示限流。:contentReference[oaicite:14]{index=14} :contentReference[oaicite:15]{index=15}
- 推荐重试：仅对网络/超时、429（指数退避）、部分 500/999 做小次数重试；400/401/403/404/405/415/601/603/604 不应盲目重试。

### 性能、数据量与限流（写同步脚本必须兜底）

- 服务端建议单次调用最长响应不超过 **50 秒**；大数据量必须分页：单次查询（含分录）不超过 **1 万条**，保存不超过 **2000 条**。:contentReference[oaicite:16]{index=16}
- 公有云频控示例：每租户账套 accountId **600 次/分**，每第三方应用客户端 **30 次/秒**。:contentReference[oaicite:17]{index=17}

### 安全（调用侧必须遵守）

- accessToken 默认 2 小时有效；客户端应缓存 token，避免每次调用都去获取；文档提示“每小时重新获取 token 的次数不应超过 100 次”。:contentReference[oaicite:18]{index=18}
- token 推荐放在请求头；可配 IP 黑白名单与签名/加密/脱敏策略（按平台能力）。:contentReference[oaicite:19]{index=19} :contentReference[oaicite:20]{index=20}

（可选扩展）当你需要开发/配置自定义 OpenAPI：发布后需向下兼容、出入参不可随意变更、校验逻辑写在操作插件、并配套单元测试。:contentReference[oaicite:21]{index=21}
