---
id: "kdcloud-9c2a2676712511eda0b34535ad178f07"
title: "BOM单详情"
source: "金蝶云社区"
url: "https://open.jdy.com/#/files/api/detail?index=3&categrayId=&id=9c2a2676712511eda0b34535ad178f07"
author: ""
published_at: ""
product: "金蝶云苍穹"
module: ["基础资料", "BOM单"]
language: "Unknown"
version_hint: ["V2"]
keywords: []
quality: "B"
---

# BOM单详情

### 基本信息

-   用途说明：获取BOM单详情
-   请求方式：GET
-   请求地址：https://api.kingdee.com/jdy/v2/bd/bom\_detail

### 请求参数

#### headers参数

| 参数名称 | 参数示例 | 是否必填 | 参数说明 |
| --- | --- | --- | --- |
| Content-Type | application/json | true | 固定传：application/json |
| X-Api-ClientID | 205022 | true | 应用id，[创建指引](https://open.jdy.com/#/files/api/detail?index=3&categrayId=316e1f5bd9d711ed8e36c17691e84ff5&id=a540e3dcd9d811ed8e3677dc79b66e86&noside=true) |
| X-Api-Auth-Version | 2.0 | true | 固定传:2.0 |
| X-Api-TimeStamp | 1655775240000 | true | 当前时间毫秒时间戳，有效期为5min |
| X-Api-SignHeaders | X-Api-TimeStamp,X-Api-Nonce | true | 固定传：X-Api-TimeStamp,X-Api-Nonce |
| X-Api-Nonce | 1655775240000 | true | 随机正整数 |
| X-Api-Signature | xxx | true | [参考加密规则](https://open.jdy.com/#/files/api/detail?index=3&categrayId=5403e0fd6a5811eda819b759130d6d33&id=b5c26557da9d11ed8e36f9799578d2e1&noside=true) |
| app-token | xxx | true | 产品账套级别的token，[获取指引](https://open.jdy.com/#/files/api/detail?index=3&categrayId=5403e0fd6a5811eda819b759130d6d33&id=9076d1a6da9d11ed8e36874bed64e0be&noside=true) |
| X-GW-Router-Addr | https://tf.jdy.com | true | IDC域名，获取appKey返回消息体内的domain字段 |

#### params参数

| 参数名称 | 参数类型 | 是否必填 | 参数说明 |
| --- | --- | --- | --- |
| id | string | false | （id和number二选一） |
| number | string | false | 编码（id与number二选一） |

#### 请求示例

```bash
curl --location --request  get 'https://api.kingdee.com/jdy/v2/bd/bom_detail?id=1&number=001' \
--header 'Content-Type: application/json' \
--header 'X-Api-ClientID: 205022' \
--header 'X-Api-Auth-Version: 2.0' \
--header 'X-Api-TimeStamp: 1655775240000' \
--header 'X-Api-Nonce: 1655775240000' \
--header 'X-Api-SignHeaders: X-Api-TimeStamp,X-Api-Nonce' \
--header 'X-Api-Signature: xxx' \
--header 'app-token: xxx' \
--header 'X-GW-Router-Addr: https://tf.jdy.com'
```

### 响应参数

| 参数名称 | 参数类型 | 参数说明 |
| --- | --- | --- |
| errcode | integer | 返回码，成功时为0 |
| description | string | 返回信息，成功时为success，失败时为具体信息 |
| data | Data | 业务返回具体对象 |

**Data**

| 参数名称 | 参数类型 | 参数说明 |
| --- | --- | --- |
| audit\_time | string | 审核时间 |
| auditor\_id | string | 审核人ID |
| auditor\_name | string | 审核人名称 |
| auditor\_number | string | 审核人编码 |
| billsource | string | 来源PMBD：WEB录入WEBIMPORT:WEB引入 |
| bom\_remark | string | BOM备注 |
| create\_time | string | 创建时间 |
| creator\_id | string | 创建人ID |
| creator\_name | string | 创建人名称 |
| creator\_number | string | 创建人编码 |
| custom\_field | Map <string> | 自定义字段[使用指南](https://open.jdy.com/#/files/api/detail?id=76567ff2a06311edaa4b3d71bf0fce53&noside=true) |
| enable | string | 是否禁用1：启用0：禁用 |
| id | string | BOM单ID |
| isskip | string | 跳过该层级直接领用下级物料1：是0：否 |
| material\_entity | List <MaterialEntity> | 子料分录 |
| modifier\_id | string | 修改人ID |
| modifier\_name | string | 修改人名称 |
| modifier\_number | string | 修改人编码 |
| modify\_time | string | 修改时间 |
| number | string | BOM单编号 |
| product\_aux1\_id | string | 产品属性组1ID |
| product\_aux1\_name | string | 产品属性组1名称 |
| product\_aux1\_number | string | 产品属性组1编码 |
| product\_aux2\_id | string | 产品属性组2ID |
| product\_aux2\_name | string | 产品属性组2名称 |
| product\_aux2\_number | string | 产品属性组2编码 |
| product\_aux3\_id | string | 产品属性组3ID |
| product\_aux3\_name | string | 产品属性组3名称 |
| product\_aux3\_number | string | 产品属性组3编码 |
| product\_aux4\_id | string | 产品属性组4ID |
| product\_aux4\_name | string | 产品属性组4名称 |
| product\_aux4\_number | string | 产品属性组4编码 |
| product\_aux5\_id | string | 产品属性组5ID |
| product\_aux5\_name | string | 产品属性组5名称 |
| product\_aux5\_number | string | 产品属性组5名称 |
| product\_auxprop\_id | string | 辅助属性ID |
| product\_auxprop\_name | string | 辅助属性名称 |
| product\_auxprop\_number | string | 辅助属性编号 |
| product\_baseunit\_id | string | 产品基本单位ID |
| product\_baseunit\_name | string | 产品基本单位名称 |
| product\_baseunit\_number | string | 产品基本单位编码 |
| product\_id | string | 产品ID |
| product\_name | string | 产品名称 |
| product\_number | string | 产品编码 |
| product\_unit\_id | string | 产品单位ID |
| product\_unit\_name | string | 产品单位名称 |
| product\_unit\_number | string | 产品单位编码 |
| status | string | 审核状态Z:未审核C:已审核 |
| version | string | 版本号 |
| yield | number | 成品率% |

**MaterialEntity**

| 参数名称 | 参数类型 | 参数说明 |
| --- | --- | --- |
| issue\_pattern | string | 发料方式D：直接领料 A：倒冲领料 B：不领料 |
| dosage\_numerator | string | 材料用量 |
| material\_id | string | 子料ID |
| material\_unit\_id | string | 单位ID |
| aux1\_id | string | 属性组1ID |
| aux2\_id | string | 属性组2ID |
| aux3\_id | string | 属性组3ID |
| aux4\_id | string | 属性组4ID |
| aux5\_id | string | 属性组5ID |
| custom\_entity\_field | Map <string> | 自定义字段[使用指南](https://open.jdy.com/#/files/api/detail?id=76567ff2a06311edaa4b3d71bf0fce53&noside=true) |
| custom\_txt1 | string | 物料备注1 |
| custom\_txt2 | string | 物料备注2 |
| custom\_txt3 | string | 物料备注3 |
| dosage\_denominator | string | 产品产量 |
| fixed\_loss | number | 固定损耗 |
| id | string | 分录ID |
| iskeypieces | string | 关键件1：是0：否 |
| isrepitem | string | 替代件1：是0：否 |
| machinepos | string | 工位 |
| material\_auxprop\_id | string | 辅助属性ID |
| material\_baseunit\_id | string | 基本单位ID |
| material\_name | string | 子料名称 |
| material\_number | string | 子料编码 |
| material\_remark | string | 物料备注 |
| model | string | 规格型号 |
| scrap | number | 损耗率% |
| seq | number | 分录行号 |
| sp\_id | string | 发料仓位id |
| sp\_name | string | 发料仓位名称 |
| sp\_number | string | 发料仓位编码 |
| stock\_id | string | 发料仓库id |
| stock\_name | string | 发料仓库名称 |
| stock\_number | string | 发料仓库编码 |
| unitqty | number | 单位用量 |

#### 响应示例

```json
{
  "data": {
    "audit_time": "2022-04-01 21:54:47",
    "auditor_id": "1420169116878110000",
    "auditor_name": "名称",
    "auditor_number": "ABC",
    "billsource": "PMBD",
    "bom_remark": "备注",
    "create_time": "2022-04-01 21:54:47",
    "creator_id": "1420169116878110000",
    "creator_name": "名称",
    "creator_number": "ABC",
    "custom_field": {},
    "enable": "1",
    "id": "1420169116878110000",
    "isskip": "1",
    "material_entity": [
      {
        "aux1_id": "1420169116878110000",
        "aux2_id": "1420169116878110000",
        "aux3_id": "1420169116878110000",
        "aux4_id": "1420169116878110000",
        "aux5_id": "1420169116878110000",
        "custom_entity_field": {},
        "custom_txt1": "备注1",
        "custom_txt2": "备注2",
        "custom_txt3": "备注3",
        "dosage_denominator": "1",
        "dosage_numerator": "1",
        "fixed_loss": 1,
        "id": "1420169116878110000",
        "iskeypieces": "1",
        "isrepitem": "1",
        "issue_pattern": "D",
        "machinepos": "LOCx1",
        "material_auxprop_id": "1420169116878110000",
        "material_baseunit_id": "1420169116878110000",
        "material_id": "1420169116878110000",
        "material_name": "10",
        "material_number": "142",
        "material_remark": "备注",
        "material_unit_id": "1420169116878110000",
        "model": "1",
        "scrap": 10,
        "seq": 1,
        "sp_id": "1",
        "sp_name": "仓位A",
        "sp_number": "001",
        "stock_id": "1",
        "stock_name": "仓库A",
        "stock_number": "001",
        "unitqty": 1
      }
    ],
    "modifier_id": "1420169116878110000",
    "modifier_name": "名称",
    "modifier_number": "ABC",
    "modify_time": "2022-04-01 21:54:47",
    "number": "BOM123",
    "product_aux1_id": "1420169116878110000",
    "product_aux1_name": "名称",
    "product_aux1_number": "ABC",
    "product_aux2_id": "1420169116878110000",
    "product_aux2_name": "名称",
    "product_aux2_number": "ABC",
    "product_aux3_id": "1420169116878110000",
    "product_aux3_name": "名称",
    "product_aux3_number": "ABC",
    "product_aux4_id": "1420169116878110000",
    "product_aux4_name": "名称",
    "product_aux4_number": "ABC",
    "product_aux5_id": "1420169116878110000",
    "product_aux5_name": "名称",
    "product_aux5_number": "名称",
    "product_auxprop_id": "1420169116878110000",
    "product_auxprop_name": "名称",
    "product_auxprop_number": "ABC",
    "product_baseunit_id": "1420169116878110000",
    "product_baseunit_name": "名称",
    "product_baseunit_number": "ABC",
    "product_id": "1420169116878110000",
    "product_name": "名称",
    "product_number": "ABC",
    "product_unit_id": "1420169116878110000",
    "product_unit_name": "名称",
    "product_unit_number": "ABC",
    "status": "Z",
    "version": "V1.0",
    "yield": 100
  },
  "description": "success",
  "errcode": 0
}
```

#### 返回码

| 返回码 | 描述 | 解决方案 |
| --- | --- | --- |
| [公告返回码](https://open.jdy.com/#/files/api/detail?index=2&categrayId=1f51c576013945e2af68ef15d4245a48&id=525e704824d24b178ab466530456c037) | 公告返回码 |  |
| 2000002000 | 系统错误,请到开发者社区提单反馈 | [开发者社区](https://vip.kingdee.com/developer?productLineId=29) |
