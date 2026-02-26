---
id: "kdcloud-9c2b5ef7712511eda0b383902424790b"
title: "BOM单保存"
source: "金蝶云社区"
url: "https://open.jdy.com/#/files/api/detail?index=3&categrayId=&id=9c2b5ef7712511eda0b383902424790b"
author: ""
published_at: ""
product: "金蝶云苍穹"
module: ["基础资料", "BOM单"]
language: "Kingscript"
version_hint: ["V2", "V1.0"]
keywords: []
quality: "B"
---

# BOM单保存

### 基本信息

-   用途说明：BOM单列表新增及修改。审核、删除等详见[通用操作接口](https://open.jdy.com/#/files/api/detail?index=2&categrayId=3cc8ee9a663e11eda5c84b5d383a2b93&id=9e804b8c712511eda0b39f724d124b07)
-   请求方式：POST
-   请求地址：https://api.kingdee.com/jdy/v2/bd/bom

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

#### body参数

| 参数名称 | 参数类型 | 是否必填 | 参数说明 |
| --- | --- | --- | --- |
| material\_entity | List <MaterialEntity> | true | 子料分录 |
| number | string | true | BOM单编号,不传递则由后台生成（不设置有编码规则和更新时必传） |
| product\_id | string | true | 产品ID |
| product\_unit\_id | string | true | 产品单位ID |
| version | string | true | 版本号 |
| version\_value | string | true | 版本值 |
| bom\_remark | string | false | BOM备注 |
| custom\_field | Map <string> | false | 自定义字段[使用指南](https://open.jdy.com/#/files/api/detail?id=76567ff2a06311edaa4b3d71bf0fce53&noside=true) |
| enable | string | false | 是否禁用1：启用0：禁用 |
| id | string | false | 新增不填，更新时必填（id为空时代表新增单据） |
| isskip | string | false | 跳过该层级直接领用下级物料1：是0：否 |
| product\_aux1\_id | string | false | 产品属性组1ID |
| product\_aux2\_id | string | false | 产品属性组2ID |
| product\_aux3\_id | string | false | 产品属性组3ID |
| product\_aux4\_id | string | false | 产品属性组4ID |
| product\_aux5\_id | string | false | 产品属性组5ID |
| product\_auxprop\_id | string | false | 辅助属性ID |
| product\_baseunit\_id | string | false | 产品基本单位ID |
| status | string | false | 审核状态Z:未审核C:已审核 |
| yield | number | false | 成品率 |

**MaterialEntity**

| 参数名称 | 参数类型 | 是否必填 | 参数说明 |
| --- | --- | --- | --- |
| issue\_pattern | string | ture | 发料方式D：直接领料 A：倒冲领料 B：不领料 |
| dosage\_numerator | string | true | 材料用量 |
| material\_id | string | true | 子料ID |
| material\_unit\_id | string | true | 单位ID |
| aux1\_id | string | false | 属性组1ID |
| aux2\_id | string | false | 属性组2ID |
| aux3\_id | string | false | 属性组3ID |
| aux4\_id | string | false | 属性组4ID |
| aux5\_id | string | false | 属性组5ID |
| custom\_entity\_field | Map <string> | false | 自定义字段[使用指南](https://open.jdy.com/#/files/api/detail?id=76567ff2a06311edaa4b3d71bf0fce53&noside=true) |
| custom\_txt1 | string | false | 物料备注1 |
| custom\_txt2 | string | false | 物料备注2 |
| custom\_txt3 | string | false | 物料备注3 |
| dosage\_denominator | string | false | 产品产量 |
| fixed\_loss | number | false | 固定损耗 |
| id | string | false | 分录ID |
| iskeypieces | string | false | 关键件1：是0：否 |
| isrepitem | string | false | 替代件1：是0：否 |
| machinepos | string | false | 工位 |
| material\_auxprop\_id | string | false | 辅助属性ID |
| material\_baseunit\_id | string | false | 基本单位ID |
| material\_name | string | false | 子料名称 |
| material\_number | string | false | 子料编码 |
| material\_remark | string | false | 物料备注 |
| scrap | number | false | 损耗率% |
| seq | number | false | 分录行号 |
| sp\_id | string | false | 发料仓位id |
| sp\_name | string | false | 发料仓位名称 |
| sp\_number | string | false | 发料仓位编码 |
| stock\_id | string | false | 发料仓库id |
| stock\_name | string | false | 发料仓库名称 |
| stock\_number | string | false | 发料仓库编码 |
| unitqty | number | false | 单位用量 |

#### 请求示例

```bash
curl --location --request  post 'https://api.kingdee.com/jdy/v2/bd/bom' \
--header 'Content-Type: application/json' \
--header 'X-Api-ClientID: 205022' \
--header 'X-Api-Auth-Version: 2.0' \
--header 'X-Api-TimeStamp: 1655775240000' \
--header 'X-Api-Nonce: 1655775240000' \
--header 'X-Api-SignHeaders: X-Api-TimeStamp,X-Api-Nonce' \
--header 'X-Api-Signature: xxx' \
--header 'app-token: xxx' \
--header 'X-GW-Router-Addr: https://tf.jdy.com' \
--data-row ' { 	"bom_remark":"备注", 	"custom_field":{}, 	"enable":"1", 	"id":"14201690", 	"isskip":"1", 	"material_entity":[ 		{ 			"aux1_id":"1420169116878110000", 			"aux2_id":"1420169116878110000", 			"aux3_id":"1420169116878110000", 			"aux4_id":"1420169116878110000", 			"aux5_id":"1420169116878110000", 			"custom_entity_field":{}, 			"custom_txt1":"备注1", 			"custom_txt2":"备注2", 			"custom_txt3":"备注3", 			"dosage_denominator":"1", 			"dosage_numerator":"1", 			"fixed_loss":1, 			"id":"1420169116878110000", 			"iskeypieces":"1", 			"isrepitem":"1", 			"issue_pattern":"D", 			"machinepos":"LOCx1", 			"material_auxprop_id":"1420169116878110000", 			"material_baseunit_id":"1420169116878110000", 			"material_id":"1420169116878110000", 			"material_name":"10", 			"material_number":"142", 			"material_remark":"备注", 			"material_unit_id":"1420169116878110000", 			"scrap":10, 			"seq":1, 			"sp_id":"1", 			"sp_name":"仓位A", 			"sp_number":"001", 			"stock_id":"1", 			"stock_name":"仓库A", 			"stock_number":"001", 			"unitqty":1 		} 	], 	"number":"ABC", 	"product_aux1_id":"1420169116878110000", 	"product_aux2_id":"1420169116878110000", 	"product_aux3_id":"1420169116878110000", 	"product_aux4_id":"1420169116878110000", 	"product_aux5_id":"1420169116878110000", 	"product_auxprop_id":"1420169116878110000", 	"product_baseunit_id":"1420169116878110000", 	"product_id":"1420169116878110000", 	"product_unit_id":"1420169116878110000", 	"status":"Z", 	"version":"V1.0", 	"version_value":"1", 	"yield":100 }'
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
| id\_number\_map | Map <string> | id与编码map |
| ids | List <string> | 单据id数组对象 |

#### 响应示例

```json
{
  "data": {
    "id_number_map": {},
    "ids": [
      "1"
    ]
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
