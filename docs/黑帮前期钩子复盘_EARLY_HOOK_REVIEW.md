# 黑帮前期钩子复盘_EARLY_HOOK_REVIEW

## 目的

基于最新采集器抓到的黑帮/毒枭题材素材，拆出这些游戏在前 `1` 分钟、`5` 分钟、`15` 分钟到 `1` 小时的钩子接力方式，再反推《禁酒令私酒帝国》和《毒枭体验馆》应该怎么改。

重点对应：

- 《禁酒令私酒帝国》当前第 `16` 页：[16_情感钩子.svg](/Users/ahs/Desktop/Git/ppt-master/projects/G_禁酒令私酒帝国_Schedule-I+Peaky-Blinders+My-Perfect-Hotel/svg_output/16_情感钩子.svg)
- 《禁酒令私酒帝国》当前第 `17` 页：[17_头30分钟.svg](/Users/ahs/Desktop/Git/ppt-master/projects/G_禁酒令私酒帝国_Schedule-I+Peaky-Blinders+My-Perfect-Hotel/svg_output/17_头30分钟.svg)
- 《毒枭体验馆》当前第 `11` 页：[11_first_5min.svg](/Users/ahs/Desktop/Git/ppt-master/projects/d_nightking_empire_ppt169_20260417/svg_output/11_first_5min.svg)
- 《毒枭体验馆》当前第 `13` 页：[13_first_30min.svg](/Users/ahs/Desktop/Git/ppt-master/projects/d_nightking_empire_ppt169_20260417/svg_output/13_first_30min.svg)

## 证据等级

### 高置信观察

- `Narco Empire`
  证据来自 walkthrough 时间轴：
  [timeline_summary.md](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narco-Empire/gameplay/timeline_summary.md)

### 中置信推断

- `Narcos: Cartel Wars & Strategy`
  证据来自商店图 + 官方 trailer：
  [metadata.json](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narcos-Cartel-Wars-&-Strategy/metadata.json)

### 低到中置信推断

- `The Gentlemen: Business Empire`
  当前只有商店图，没有 walkthrough：
  [metadata.json](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/The-Gentlemen-Business-Empire/metadata.json)

## 先说结论

这些题材能抓人的，不是“黑帮美术”本身，而是下面这条节奏公式：

`外部压力` -> `立即可执行的手动动作` -> `明确收益` -> `更大的下一层麻烦`

也就是说，玩家不是因为“想经营帝国”才留下，而是因为：

1. 今晚这单必须做成。
2. 做成之后立刻给我钱、人、地盘或尊严。
3. 刚松一口气，新的威胁就来了。

`Fight Tycoon` 那类地下拳击题材好用的地方也在这里：

- 不是“你想成为拳王”，而是“你现在不打这一场就活不下去”
- 不是“未来会很爽”，而是“这一拳下去马上有结果”

这就是《禁酒令》和《毒枭》当前最缺的东西：有题材情绪，但缺“不得不做下一步”的压力链。

## 竞品共性

### 共性 1：先给使命，不先给世界观

玩家进入前 `20-40` 秒，应该先知道“为什么现在就得做”，而不是先知道“这是一个什么世界”。

常见的高压开局：

- 债务要还
- 场子要保
- 家人/兄弟/合伙人要救
- 今晚第一单必须成交
- 第一个点位必须抢下来

### 共性 2：前 5 分钟必须连续换动词

不是一直点经营。

而是：

- 做货
- 交货
- 躲警察/应对突袭
- 雇人
- 守点/打架
- 接电话/接任务

只要动词没变，哪怕数值涨了，玩家也会觉得“还在重复同一件事”。

### 共性 3：双轨推进比单轨经营更强

好的黑帮题材不会只有“生产和升级”。

它至少并行两条轨：

- `经营轨`：做货、扩建、招人、升级
- `威胁轨`：警察、 rival 帮派、追债、任务时限、地盘争夺

只有经营轨，没有威胁轨，就会像和平农场换皮。

### 共性 4：前 15 分钟就要埋“更大系统”的影子

哪怕真正解锁在后面，也要提前露一眼：

- 势力树
- 世界地图
- 客户节点
- 帮派关系
- 角色晋升
- raid / cops / defense

这不是给信息量，而是给“未来还会变大”的预期。

## 逐款拆解

## Narco Empire

### 0 到 1 分钟

高置信观察，见：
[timeline_summary.md](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narco-Empire/gameplay/timeline_summary.md)

实际节奏非常明确：

- `00:00-00:24`
  房车、对话、买家催货、人物关系先出现。
- `00:28-01:12`
  立刻进入手工制作/混合/包装类操作。
- 核心不是“你以后会当帝国老大”，而是：
  `有人在等货，你现在就得把东西做出来。`

这一步的价值：

- 使命感先于世界观
- 第一动词是“做”，不是“看”
- 风险与非法感通过对话和场景先给到

### 1 到 5 分钟

观察到的钩子接力：

- `01:20-02:04`
  用一段追车/爆炸/对抗把“危险世界”抬起来
- `02:20-03:44`
  切回农田/主城/生产/建筑，开始给经营落点
- `03:52-04:08`
  奖励 UI、手机消息、社交对话插进来
- `04:16-05:16`
  城镇、警察、街道事件开始出现

这段的关键优点不是某一个玩法，而是“静和动”交替：

- 做货
- 看剧情
- 遇危险
- 回主城
- 收奖励
- 再遇外部压力

所以前 5 分钟不会平。

### 5 到 15 分钟

这是它最值得学的部分。

- `05:28`
  出现警察遭遇卡/UI，不再只是背景设定
- `06:28`
  警察倒计时与具体要求落成系统
- `07:32-09:20`
  包装、建筑、船员/营地优化等任务继续填充
- `11:36-12:16`
  再来一段明确战斗，把节奏重新拉高
- `12:32-12:56`
  势力/角色树出现
- `13:20-15:04`
  世界地图、客户点、路线、配送节点出现

它真正厉害的是：

- 第一个 `15` 分钟内，已经把 `制作 -> 主城 -> 警察 -> 战斗 -> 角色树 -> 地图配送`
  这几条长线都露了一遍。
- 玩家还没完全学会前一个系统，下一个系统的影子就已经来了。

### 15 分钟到 1 小时

当前我们只有前 `18` 分钟左右的视频证据，后面不能装作已经完全看到了。

但可以高置信推断它的一小时内主循环方向是：

- 订单/客户节点
- 生产与交付
- 警察压力
- 势力树养成
- 主城扩建

也就是典型的“订单驱动的 relay loop”。

## Narcos: Cartel Wars & Strategy

当前证据不是 walkthrough，而是：

- 商店文案
- 商店图
- 官方 trailer

所以这里更适合看“它卖给玩家什么承诺”，不适合假装能复原它的真实新手 `1-5` 分钟。

### 它卖的五个承诺

从商店图和文案能读出来：

- `成为 Capo`
- `建造帝国`
- `组队/联盟`
- `守城/战争`
- `角色与派系`

证据见：

- [metadata.json](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narcos-Cartel-Wars-&-Strategy/metadata.json)
- [screenshot_01.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narcos-Cartel-Wars-&-Strategy/store/googleplay/screenshot_01.jpg)
- [screenshot_04.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narcos-Cartel-Wars-&-Strategy/store/googleplay/screenshot_04.jpg)
- [screenshot_08.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/Narcos-Cartel-Wars-&-Strategy/store/googleplay/screenshot_08.jpg)

### 对我们有用的地方

它的强项不是前 1 分钟的小操作，而是“角色 + 帝国 + 战争”三张牌一起打：

- 你不是小作坊老板
- 你是 cartel leader
- 你不是只做生意
- 你还要结盟、守城、抢地

这对《毒枭体验馆》的启发是：

- 不能只写“做货赚钱”
- 必须更早把 `地盘 / 组织 / 联盟 / 对抗`
  这些大词变成第一天就能摸到的系统影子

## The Gentlemen: Business Empire

当前没有 walkthrough，只能从商店图看它在“承诺层”怎么包装。

证据见：

- [metadata.json](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/The-Gentlemen-Business-Empire/metadata.json)
- [screenshot_01.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/The-Gentlemen-Business-Empire/store/googleplay/screenshot_01.jpg)
- [screenshot_03.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/The-Gentlemen-Business-Empire/store/googleplay/screenshot_03.jpg)
- [screenshot_08.jpg](/Users/ahs/Desktop/Git/game-asset-collector/game_assets_library/2026-04-23_crime_reference_pack_auto/The-Gentlemen-Business-Empire/store/googleplay/screenshot_08.jpg)

### 它在卖什么

- `More Bases, More Power`
- `Defend Your Empire`
- `Run Quests`

这三张图已经说明：

- 它不是纯放置增长
- 它强调多个 base
- 它强调防守事件
- 它强调任务板和奖励推进

### 对我们有用的地方

《禁酒令》现在的问题是“情绪词太多，任务词太少”。

而 The Gentlemen 的商店表达反而更直接：

- 扩基地
- 守基地
- 跑任务

这正是移动端早期体验更需要的表达方式。

## 对当前两个项目的诊断

## 《禁酒令》当前第 16 页的问题

当前页面：
[16_情感钩子.svg](/Users/ahs/Desktop/Git/ppt-master/projects/G_禁酒令私酒帝国_Schedule-I+Peaky-Blinders+My-Perfect-Hotel/svg_output/16_情感钩子.svg)

### 问题 1：是“情绪清单”，不是“接力结构”

现在这页写的是：

- 逆袭幻想
- 西装礼帽
- 警察来了
- 收藏威士忌
- 艾尔卡彭同桌

问题在于这些点没有时间顺序，也没有因果关系。

用户看完还是不知道：

- 玩家第 `30` 秒在干什么
- 第 `2` 分钟为什么继续
- 第 `7` 分钟为什么还不退出

### 问题 2：早期钩子和中后期钩子混在一起

像“收藏百年威士忌、50+ 酒谱、历史人物同桌”更像：

- 中期图鉴钩子
- 长线 fantasy
- 主题包装层

不属于前 `1-15` 分钟的留人钩子。

### 问题 3：缺一个强外压句子

这一页最缺的是一句能顶住前 `30` 秒的使命句。

例如：

- 今晚这单卖不出去，场子就归债主
- 天亮前酒还没送到，你连地下室都保不住
- 今晚警察要来抽查，你必须先把第一批货卖掉

没有这类句子，玩家只是在“体验题材”，不是在“解决眼前危机”。

## 《禁酒令》当前第 17 页的问题

当前页面：
[17_头30分钟.svg](/Users/ahs/Desktop/Git/ppt-master/projects/G_禁酒令私酒帝国_Schedule-I+Peaky-Blinders+My-Perfect-Hotel/svg_output/17_头30分钟.svg)

### 问题 1：每一格像一个点子，但不像一条链

现在写的是：

- 阁楼继承
- 首闭环
- 艾尔卡彭登场
- 首次雇佣
- 警察首巡
- 首条走私

问题不是这些点不好，而是没有说明：

- 为什么 `02` 会自然把人推到 `03`
- 为什么 `03` 会逼出 `04`
- 为什么 `04` 不做，`05` 就会出事

也就是没有 “because / therefore”。

### 问题 2：过度依赖剧本感，不够玩法化

“艾尔卡彭登场”这种点更像设定爽点，不像移动端前半小时的实操驱动。

竞品真正稳定留人的，是这些：

- 订单
- 倒计时
- 警察要求
- 任务板
- 配送路线
- 势力树
- 基地升级

### 问题 3：缺 5-15、15-30、30-60 的接力逻辑

你现在自己也指出来了，这一页最粗糙的地方就是：

- `5-15`
- `15-30`
- `30-60`

彼此没有明确功能分工。

正确做法不是写三个时间盒子，而是写三段不同职责：

- `5-15 分钟`：让玩家忙起来
- `15-30 分钟`：让玩家开始站队和选路
- `30-60 分钟`：让玩家愿意明天回来

## 《毒枭体验馆》当前第 11/13 页的问题

比《禁酒令》好的一点是，它已经在按分钟说事。

但也有两个问题：

### 问题 1：太像编剧分场，不像系统接力

比如：

- 病危通知
- 妻子怀孕
- 第一家店
- 第一个员工
- 第一次警情

这些句子很有戏剧味，但不够“玩法证据化”。

如果要更像竞品，应该落成：

- 第一次做货
- 第一次卖货
- 第一次路线选择
- 第一次雇佣
- 第一次警察要求

### 问题 2：缺少“新动词频率”

当前页面还是偏讲故事，没有明确标出：

- 每 `60-90` 秒新增一个什么动词
- 哪一刻是 QTE
- 哪一刻是主城
- 哪一刻是地图
- 哪一刻是角色/势力

这让页面说服力不如 `Narco Empire` 的时间轴。

## 具体修改方案

## 对《禁酒令》16 页的改法

不要再叫“五大情感钩子”。

建议改成：

`前 15 分钟，玩家为什么不敢退出`

页面结构建议改成五段式，不写大而化之的情绪词，直接写：

- 时间
- 使命问题
- 玩家动作
- 即时反馈
- 下一钩子

### 建议替换内容

#### 0:00-0:40

- 使命问题：今晚卖不出第一批私酒，债主就收走地下室
- 玩家动作：第一瓶酒的混合/装瓶 QTE
- 即时反馈：第一笔现金 + 第一位买家认可
- 下一钩子：后门还有一单等你送

#### 0:40-2:00

- 使命问题：货已经做出来，但必须在警察巡逻前送到
- 玩家动作：后巷配送 / 躲探照灯 / timing 小游戏
- 即时反馈：现金 + reputation
- 下一钩子：酒吧老板愿意给你第二个台面

#### 2:00-5:00

- 使命问题：单子变多，光靠你一个人干不过来
- 玩家动作：雇第一个 runner / bartender
- 即时反馈：自动化开始，玩家第一次有“我在支配人”的感觉
- 下一钩子：警察开始盯上这个街区

#### 5:00-15:00

- 使命问题：第一次搜查来临，不藏货就罚，不交钱就断
- 玩家动作：藏货 / bribe / 切换伪装店面
- 即时反馈：躲过搜查或被罚一次
- 下一钩子：地图开第一个新区，利润更高但风险更大

#### 15:00-60:00

- 使命问题：要不要走出这条街，进入真正的地下网络
- 玩家动作：开地图节点 / 选客户 / 选派系 / 接长线任务
- 即时反馈：主线 promise 从“今晚活下去”变成“明晚我要更大”
- 下一钩子：帮派 rival / 议价 / 保护费 / 长线势力树

## 对《禁酒令》17 页的改法

这一页不要再做“六格平铺剧情”。

建议改成：

`从第一瓶酒到第一条街：30 分钟接力图`

每个阶段都要回答一句：

`上一段解决了什么，所以这一段必须发生什么？`

### 建议改成四段因果链

#### 0-3 分钟：活下今晚

- 做出第一瓶酒
- 卖出第一单
- 建立“钱不是数字，是续命”的感受

#### 3-8 分钟：一个人干不过来

- 引入雇人
- 引入第二个工位
- 让玩家从亲手做，转成半自动经营

#### 8-15 分钟：危险终于具象化

- 第一次 police / rival 事件
- 倒计时 + 藏货/贿赂
- 让压力从背景设定变成玩法

#### 15-30 分钟：明天为什么还回来

- 打开街区地图
- 出现客户点 / 路线 / 第二个势力
- 给玩家一个“明天再来会更大”的明确 promise

## 对《毒枭体验馆》的改法

建议保留它更戏剧化的语气，但必须补玩法证据。

## 第 11 页应该这样改

不是只写“五个瞬间”，而是写：

- `00:00-00:30` 外部使命
- `00:30-01:30` 第一次做货
- `01:30-02:30` 第一次卖货
- `02:30-03:30` 第一次扩编
- `03:30-05:00` 第一次警察压力

每一击都要绑定一个新动词。

## 第 13 页应该这样改

把“30 分钟之后，这游戏已经是你的”落成三段职责：

- `0-7 分钟`
  动机 + 第一单 + 第一个 helper
- `7-15 分钟`
  基地扩建 + 警察要求 + 包装/优化小游戏
- `15-30 分钟`
  势力树 + 世界地图 + 配送路线 + 第一场像样的枪战或抢点

## 必须补的玩法形式

这是当前两个项目都偏少的地方。

竞品强的不是单个大系统，而是前期不断插入“小而新的动作”。

建议优先吸收这几种：

- 漏斗/装瓶/称重/贴标 QTE
- 配送路线选择
- 警察清单式要求卡
- 手机接单/短信回复
- 守点或街头伏击
- 角色/派系晋升树
- 任务板 + 主支线并行
- 世界地图客户节点

## 最终改稿原则

### 原则 1

使命句必须在前 `30` 秒成立。

### 原则 2

前 `5` 分钟每 `60-90` 秒至少新增一个动词或新风险。

### 原则 3

前 `15` 分钟必须让玩家看见：

- 经营
- 风险
- 地图
- 角色/势力

至少三条线中的两条。

### 原则 4

第 `16` 页讲“为什么不退出”，第 `17` 页讲“为什么越玩越深”。

这两页不要再混用。

## 下一步建议

如果按执行优先级排：

1. 先重写《禁酒令》`16/17` 页结构
2. 再把《毒枭体验馆》`11/13` 页从“剧情分场”改成“系统接力”
3. 如果要进一步补强 `The Gentlemen`，下一步必须补抓一条 walkthrough，不然它只能作为题材包装参考，不能作为新手节奏证据

## 备注

用户提到可参考另一个 agent 之前分析过的 `Fight Tycoon`。

当前工作区内没有找到那份现成分析文件，所以本稿只保留了它的可迁移原则：

- 病因/债务/救场/尊严这类高压开局
- 先给“为什么必须打这一场”，再给“以后你会成为谁”

如果后续拿到那份原文路径，可以再把本稿里的使命句模板进一步对齐。
