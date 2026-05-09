const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

const ROOT = "/Users/ahs/Desktop/Git/ppt-master/projects";

const FORBIDDEN = [
  "LTV",
  "CPI",
  "CPA",
  "买量",
  "投放",
  "留存",
  "付费",
  "授权",
  "合规",
  "变现",
  "IAP",
  "广告",
  "ARPU",
  "ARPDAU",
  "ROI",
  "风险",
];

const OPTIONAL_SLIDE_PATTERNS = [
  {
    label: "商业化/投放/付费数据",
    re: /(LTV|CPI|CPA|CPS|VR|IAP|IAA|ARPU|ARPDAU|ROI|ROAS|D1|D7|D30|D60|D90|留存|付费|买量|投放|变现|广告|素材|UA|预算|现金流|KPI|回收|payback|monetization|cash\s*flow|retention)/i,
  },
  {
    label: "风险/授权/合规",
    re: /(风险|合规|授权|版权|审查|未成年|发行|坑位|risk|legal|license|countermeasure|pitfall)/i,
  },
  {
    label: "细部展开/后续阅读",
    re: /(DAY|Day|D\d+|第\s*\d+[-–]?\d*\s*天|时间线|节奏|矩阵|路线图|roadmap|愿景|收尾|结尾|summary|one\s*slide|摘要|验证建议|原型验证|Q&A|QA|ask|落地|细节|扩展|社区|粉丝|剧情|人物|画风|音效|UI)/i,
  },
];

const OPTIONAL_SOURCE_SLIDES = {
  A: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  B: [12, 13, 14, 15, 16],
  C: [14, 15, 19, 20, 21, 22, 23, 24],
  D: [17, 18, 19, 20, 21, 22, 23, 24],
  E: [22, 23, 24, 25, 26, 27, 28, 29],
  G: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  H: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  I: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  J: [11, 12, 13, 14, 15, 16, 17],
};

const decks = [
  {
    id: "A",
    project: "A_港口开箱_集装箱沉没成本+Storage-Auctions+My-Perfect-Hotel",
    file: "A_港口开箱_研发对接精简版.pptx",
    title: "港口开箱",
    subtitle: "集装箱盲拍 × 鉴宝转卖 × 港口扩张",
    tone: "从一间拍卖小屋，把未知揭晓做成全球港口经营。",
    colors: { bg: "0B1826", accent: "F3B23A", accent2: "2FB7C5", soft: "E9F3F5" },
    keep: ["盲拍沉没成本", "45°俯视经营", "海关/劫匪短事件", "港口到航线的扩张"],
    layers: [
      { tag: "小屋", name: "拍卖小屋", verbs: "出价 / 开锁 / 鉴宝 / 转卖", payoff: "60 秒一次未知揭晓" },
      { tag: "内城", name: "港口街区", verbs: "仓储 / 二手市场 / 员工调度", payoff: "从亲手开箱变成老板调度" },
      { tag: "大地图", name: "全球航线", verbs: "签路线 / 开新港 / 调奖池", payoff: "每个港口都是新盲盒池" },
    ],
    c3: {
      camera: "45°俯视为主，开箱时局部推近，但不切第一视角。",
      character: "玩家是拍卖商兼港口老板，先亲手下注，再管理员工。",
      control: "单指点按、长按出价、拖动鉴宝；所有操作 1-3 秒完成。",
      qte: "海关/劫匪事件做俯视弹窗 QTE：30 秒内三选一处理。",
    },
    early: ["0:00 继承码头拍卖小屋", "0:30 长按出价，金币可见扣减", "1:30 开锁揭晓，货物价值翻牌", "3:00 鉴宝定价并完成第一单", "5:00 第四箱后弹出鉴宝员试用"],
    automation: {
      trigger: "连续开 4 箱后，重复感开始出现。",
      changes: ["鉴宝员接手低价值货", "仓库按货类自动分拣", "二手市场开始吃库存", "镜头第一次拉高看到港区"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "仓库塞满、人工鉴宝排队，玩家自然需要员工和二手市场。" },
      { from: "内城 → 大地图", why: "本港奖池被看懂后，用新港口奖池和航线合同给新目标。" },
    ],
    mid: ["D0 1h：海关检查，玩家学会伪装与快速决策", "D0 夜：劫匪来袭，轻塔防验证仓储布局", "D2：每日任务与未完成订单把玩家带回港区", "D5：第一条跨港航线打开，大地图成为奖池扩容工具"],
    prototype: ["一箱完整开箱闭环 ≤ 75 秒", "俯视 QTE 不打断经营节奏", "第 15 分钟必须看到港区全貌", "第 1 小时必须出现一次事件压力"],
  },
  {
    id: "B",
    project: "B_大陆酒店_John-Wick+Continental+My-Perfect-Hotel",
    file: "B_大陆酒店_研发对接精简版.pptx",
    title: "大陆酒店",
    subtitle: "中立规则酒店 × 街区服务 × 城市秩序网络",
    tone: "玩家经营的不是房间，而是一套危险世界的规则。",
    colors: { bg: "11100E", accent: "D9B56D", accent2: "7A3E2F", soft: "F3E7D0" },
    keep: ["酒店不得开火", "规则事件", "主楼外溢成街区", "城市中立节点"],
    layers: [
      { tag: "小屋", name: "主楼酒店", verbs: "接待 / 房间 / 礼宾 / 医务 / 装备", payoff: "第一轮规则经营成立" },
      { tag: "内城", name: "酒店街区", verbs: "洗衣房 / 地下诊所 / 夜宵街 / 附楼", payoff: "主楼服务自然外溢" },
      { tag: "大地图", name: "中立网络", verbs: "节点 / 停火 / 会谈 / 交易入口", payoff: "争夺制定规则的资格" },
    ],
    c3: {
      camera: "等距俯视主楼剖面，关键事件用房间/走廊局部放大。",
      character: "玩家是酒店经理兼秩序维护者，不是战斗执行者。",
      control: "点按排房、拖动路线、切换功能区，强调调度而非动作。",
      qte: "规则事件是俯视调度 QTE：敌对贵客同时入住时调整动线。",
    },
    early: ["0:00 接第一位危险贵客", "2:00 第二位敌对贵客抵达", "4:00 排房、封泳池、转存装备", "8:00 医务和礼宾开始协同", "15:00 玩家理解自己在经营规则"],
    automation: {
      trigger: "单纯客房经营无法证明题材，必须早出规则事件。",
      changes: ["礼宾自动拖延会面", "医务间处理冲突后果", "装备室暂存高危物", "住客故事接入外部委托"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "洗衣、诊所、后场仓储不该塞进主楼，只能长成依赖酒店的街。" },
      { from: "内城 → 大地图", why: "当街区都依赖酒店秩序，玩家才有资格进入城市节点网络。" },
    ],
    mid: ["15-60 分钟：健身馆、泳池、医务间逐步开放", "1-2 小时：住客故事与外部委托敲门", "3-4 小时：街区设施接上主楼服务", "D2 夜：午夜议会邀请函点亮城市节点"],
    prototype: ["首个规则事件必须在 15 分钟内出现", "每个功能区都要反哺酒店秩序", "街区不是新模式，而是主楼外溢", "大地图资源必须是规则权而非普通地块"],
  },
  {
    id: "C",
    project: "C_地下拳馆_Undisputed+Rocky+Fight-Tycoon+My-Perfect-Hotel",
    file: "C_地下拳馆_研发对接精简版.pptx",
    title: "地下拳馆",
    subtitle: "复仇经营链 × 格斗街区 × 城市联盟",
    tone: "训练不是数值动作，比赛是把尊严打回来的证明场。",
    colors: { bg: "16110F", accent: "E4572E", accent2: "E0B15A", soft: "F0E5DA" },
    keep: ["复仇主线", "训练到比赛闭环", "馆外街区外溢", "赛事化城市层"],
    layers: [
      { tag: "小屋", name: "地下拳馆", verbs: "招募 / 训练 / 恢复 / 排赛 / 升级", payoff: "第一位拳手被练起来" },
      { tag: "内城", name: "格斗街", verbs: "健身房 / 医务馆 / 酒吧 / 赛事点", payoff: "拳馆生态反哺比赛" },
      { tag: "大地图", name: "城市格斗联盟", verbs: "赛事节点 / 头牌拳手 / 冠军席位", payoff: "争的是赛程和规则" },
    ],
    c3: {
      camera: "经营层 45°俯视；训练和比赛关键击打切近景。",
      character: "玩家是馆主，代表拳手做调度，比赛时短暂代入拳手。",
      control: "经营用点按拖拽；击打训练用节奏点击和方向滑动。",
      qte: "击打 QTE 可用近景第一视角；扩张和排赛保持俯视。",
    },
    early: ["0:00 接手破拳馆与第一位拳手", "2:00 训练沙袋，看到数值即时变化", "6:00 第一场证明赛开打", "12:00 奖金到账，升级拳台/医务", "15:00 地头蛇试探，街区线索露头"],
    automation: {
      trigger: "第一场比赛证明训练价值后，玩家需要更稳定的培养链。",
      changes: ["训练计划可排队", "恢复馆处理赛后状态", "经纪人承接低级赛程", "头牌拳手开始带来街区机会"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "单馆收入、医务、赌盘和头牌成长都会把玩家推出拳馆。" },
      { from: "内城 → 大地图", why: "街区赛事打通后，城市层自然变成冠军席位和赛事规则之争。" },
    ],
    mid: ["Day 1：第一位头牌拳手需要更大舞台", "Day 2：复仇目标改变下一步经营目标", "Day 3-7：吞并街区赛事节点", "Day 7+：城市联盟把赛事资源放大"],
    prototype: ["前 15 分钟必须完成训练→比赛→升级", "QTE 只服务击打反馈，不做硬核格斗", "街区设施必须回流训练/恢复/赛事", "城市层仍然要像拳击题材"],
  },
  {
    id: "D",
    project: "d_nightking毒枭_empire_ppt169_20260417",
    file: "D_夜王毒枭_研发对接精简版.pptx",
    title: "夜王毒枭",
    subtitle: "车库起步 × 街头体验馆 × 夜之城势力图",
    tone: "前 5 分钟靠亲手做第一单，第一周靠人物、资产和地盘牵住玩家。",
    colors: { bg: "0D1117", accent: "34D399", accent2: "8B5CF6", soft: "E4F7EF" },
    keep: ["五击五动词", "生产分销体验馆咬合", "人物/资产/地缘三钩", "D7 入桌"],
    layers: [
      { tag: "小屋", name: "车库与体验店", verbs: "接单 / 调配 / 出货 / 收钱 / 藏货", payoff: "亲手完成第一单" },
      { tag: "内城", name: "街区网络", verbs: "分销点 / 店员 / 路线 / 邻街抢点", payoff: "经营感长成统治感" },
      { tag: "大地图", name: "夜之城", verbs: "家族 / 饭桌 / 街区控制 / 城市规则", payoff: "这条街的规则由玩家定" },
    ],
    c3: {
      camera: "车库调配用桌面第一视角；街区经营和地图保持俯视。",
      character: "玩家先是欠债的小店主，后成为街区组织者。",
      control: "混合、加热、包装用短 QTE；分销与排班用俯视点按。",
      qte: "初期 QTE 是第一视角工作台，30 秒内完成调配与藏货。",
    },
    early: ["0:00 欠账与车库使命落地", "1:00 工作台调配 QTE", "2:30 卖出第一单，钱等于续命", "4:00 雇第一个 helper 排班", "5:00 第一次警情，学会藏货和伪装"],
    automation: {
      trigger: "一个人同时做货、卖货、藏货会形成压力。",
      changes: ["helper 接管基础打包", "体验店承接稳定客流", "街头分销给店铺导入名声", "地图路线预告 D7 家族化"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "体验店名声提升后，分销路线和邻街抢点自然出现。" },
      { from: "内城 → 大地图", why: "D7 家族饭桌空位把个人经营转成城市势力结构。" },
    ],
    mid: ["0-7 分钟：使命、第一单、第一个 helper", "7-15 分钟：基地扩建、警情要求、包装优化", "15-30 分钟：势力树、地图路线、第一次抢点", "Day 7：家族入桌，夜之城骨架显形"],
    prototype: ["前 5 分钟必须一动词一反馈", "第一视角只用于工作台 QTE", "人物、钱、地盘三条回流入口都要可点", "D7 入桌必须有清晰镜头"],
  },
  {
    id: "E",
    project: "E_TCG卡店帝国_TCG-Card-Shop-Simulator+My-Perfect-Hotel",
    file: "E_TCG卡店帝国_研发对接精简版.pptx",
    title: "TCG 卡店帝国",
    subtitle: "爷爷卡店 × 多店扩张 × 职业俱乐部",
    tone: "开包惊喜不是孤立爽点，而是把顾客、剧情、城市扩张咬起来。",
    colors: { bg: "101827", accent: "F59E0B", accent2: "3B82F6", soft: "EAF2FF" },
    keep: ["继承小卡店", "开包与收银", "员工自动化", "城市染色与俱乐部"],
    layers: [
      { tag: "小屋", name: "街角卡店", verbs: "摆货 / 收银 / 开包 / 定价", payoff: "第一张闪卡建立惊喜预期" },
      { tag: "内城", name: "同城多店", verbs: "员工 / 货源 / 行情 / 店面复制", payoff: "店主升级为区域经理" },
      { tag: "大地图", name: "全球 TCG 城市", verbs: "城市地标 / 战队冠名 / 赛事推进", payoff: "卡店生意长成 TCG 帝国" },
    ],
    c3: {
      camera: "店铺经营 45°俯视；开包时切桌面近景。",
      character: "玩家是继承卡店的店主，逐步成为多城经理。",
      control: "拖卡包上架、点按收银、滑动开包、拖动员工排班。",
      qte: "开包 QTE 用桌面近景，不做全程第一视角；经营仍俯视。",
    },
    early: ["0:00 爷爷钥匙与第一箱卡包", "2:00 摆货架，第一位顾客进店", "5:00 收银机响，第一笔收入到账", "10:00 开包出第一张闪卡", "30:00 新手核心卡锁定长期目标"],
    automation: {
      trigger: "手动收银可撑开局，但很快需要调度员工和货源。",
      changes: ["收银/补货/清洁/安保分岗", "每日卡包变成固定仪式", "行情看板改变定价策略", "第二店打开城市染色"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "第一店现金流稳定后，员工和第二店自然接管重复劳动。" },
      { from: "内城 → 大地图", why: "多店收入支持俱乐部冠名，城市地标成为外层目标。" },
    ],
    mid: ["D7-D10：街角空铺亮起，开第二家店", "D14-D18：同城第三店与跨城首店", "D21-D30：城市地标绑定核心选手", "D30+：自研卡牌系列成为终局方向"],
    prototype: ["前 30 分钟必须有开店、开包、定价、挂机回报", "开包动画短而强，不拖节奏", "员工要带名字和表情反馈", "城市染色要让扩张可见"],
  },
  {
    id: "G",
    project: "G_禁酒令私酒帝国_Schedule-I+Peaky-Blinders+My-Perfect-Hotel",
    file: "G_禁酒令私酒帝国_研发对接精简版.pptx",
    title: "禁酒令私酒帝国",
    subtitle: "小酒馆 × 地下酒路 × 家族城市",
    tone: "横屏版不靠按钮快切，而靠空间连续：第一瓶酒到第一条街。",
    colors: { bg: "17120C", accent: "D8A441", accent2: "7C2D12", soft: "F2E5CB" },
    keep: ["小酒馆空间", "酿造与售卖", "警察搜查 QTE", "家族化过渡"],
    layers: [
      { tag: "小屋", name: "酒馆与地下室", verbs: "接待 / 点单 / 酿造 / 补货 / 收钱", payoff: "第一瓶酒救活今晚" },
      { tag: "内城", name: "街区酒路", verbs: "工位 / 雇员 / 客户点 / 固定路线", payoff: "酒馆长成街区生意" },
      { tag: "大地图", name: "家族城市", verbs: "饭桌 / 家族 / 街区控制 / 城市规则", payoff: "禁酒令下的地下王朝" },
    ],
    c3: {
      camera: "全局 45°俯视横屏，保持酒馆、地下室、后巷连续。",
      character: "玩家是小酒馆老板，后续成为家族经营者。",
      control: "点单、补货、酿造、排班都单指完成。",
      qte: "搜查事件是俯视 30 秒伪装 QTE，不做第一视角。",
    },
    early: ["0:00 今晚必须活下去", "1:00 做出第一瓶酒", "3:00 卖出第一单，钱变成续命", "8:00 雇人并开第二工位", "15:00 警察和 rival 事件具象化"],
    automation: {
      trigger: "玩家守住第一晚后，单人经营不够支撑街区需求。",
      changes: ["第二工位承接产能", "雇员负责基础服务", "固定客户点带来路线", "地图亮出第二势力"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "酒馆、地下室、后巷在同一空间链上，自然接成街区。" },
      { from: "内城 → 大地图", why: "D7 之前埋介绍信和饭桌空位，D7 入家族不是突变。" },
    ],
    mid: ["0-3 分钟：先活下今晚", "3-8 分钟：一个人干不过来，雇人开工位", "8-15 分钟：街区赚钱，搜查和 rival 成系统", "15-30 分钟：地图、客户点、固定酒路亮出"],
    prototype: ["横屏空间必须连续可读", "搜查 QTE ≤ 30 秒且可重玩", "D7 前必须看到家族饭桌伏笔", "酒馆收入要推动街区路线"],
  },
  {
    id: "H",
    project: "H_深海守望者_DREDGE+克苏鲁+My-Perfect-Hotel",
    file: "H_深海守望者_研发对接精简版.pptx",
    title: "深海守望者",
    subtitle: "第一人称海怪射击 × 第三人称方舟成长",
    tone: "先把枪口立住，再让玩家看见船一点点长大。",
    colors: { bg: "061B24", accent: "38BDF8", accent2: "A3E635", soft: "DDF5FF" },
    keep: ["1P 枪感开局", "返船建造", "方舟自动化", "远海大地图"],
    layers: [
      { tag: "小屋", name: "船舱与甲板", verbs: "射击 / 回收 / 安装 / 修复", payoff: "5 分钟内看到船变了" },
      { tag: "内城", name: "方舟船体", verbs: "模块 / 船员 / 自动化 / 双线升级", payoff: "角色和船共同成长" },
      { tag: "大地图", name: "远海航区", verbs: "海域 / 巨怪 / 资源点 / 远征", payoff: "更大的船打更强的怪" },
    ],
    c3: {
      camera: "开局明确第一视角；中后期切第三人称展示方舟成长。",
      character: "玩家先是幸存者，随后成为方舟船长。",
      control: "瞄准、开火、回收、安装模块构成第一轮手感。",
      qte: "战斗不是纯 QTE，入口是 1P 射击；建造用第三人称/俯视面板。",
    },
    early: ["0:00 怪潮逼近，直接给枪口压迫", "1:00 命中、停顿、掉落资源", "3:00 返船安装第一个模块", "5:00 船体外观发生可见变化", "15:00 岗位开始自动运转"],
    automation: {
      trigger: "打到、捡到、装上之后，玩家开始关心船怎么继续长大。",
      changes: ["回收资源自动入仓", "船员岗位跑基础产出", "模块容量限制 build 选择", "第三人称展示甲板和船员流转"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "武器资源回到船上，模块安装把战斗结果变成船体成长。" },
      { from: "内城 → 大地图", why: "船变大后需要更远海域和更强巨怪验证 build。" },
    ],
    mid: ["D4：第一武装甲板", "D7：第一生活舱", "D10：船体第一次抬高", "D11-D14：巨怪战验证防线并露出方舟雏形"],
    prototype: ["前 5 分钟必须打到、捡到、装上", "1P 与 3P 职责不能互抢", "方舟成长必须肉眼可见", "资源选择要同时影响火力和船体"],
  },
  {
    id: "I",
    project: "I_动物联盟_动物庇护所+Zootopia情感叙事+My-Perfect-Hotel",
    file: "I_动物联盟_研发对接精简版.pptx",
    title: "动物联盟",
    subtitle: "庇护所治愈 × 夜间守护 × 全球救援联盟",
    tone: "白天治愈，夜晚战斗，让玩家把一间庇护所养成全球守护网络。",
    colors: { bg: "102018", accent: "72C66B", accent2: "F4B740", soft: "EDF8EA" },
    keep: ["受伤小猫开局", "治愈四步循环", "夜间塔防首战", "全球救援联盟"],
    layers: [
      { tag: "小屋", name: "动物庇护所", verbs: "喂食 / 治疗 / 陪玩 / 领养", payoff: "第一只动物被治好" },
      { tag: "内城", name: "街区救援基地", verbs: "兽医 / 陪玩区 / 动物园 / 后场", payoff: "庇护所升级为救援中心" },
      { tag: "大地图", name: "全球动物联盟", verbs: "区域 / 反派线 / 联盟共守 / 救援赛季", payoff: "治愈行动放大到全球" },
    ],
    c3: {
      camera: "经营层俯视；包扎、喂食等 mini-game 用局部近景。",
      character: "玩家是庇护所所长，带 NPC 团队完成救援。",
      control: "拖绷带、点喂食、排兽医、布置夜间防线。",
      qte: "治愈 QTE 用近景；夜间塔防保持俯视，不做第一视角。",
    },
    early: ["0:00 雨夜抵达，祖母遗嘱与受伤小猫出现", "0:30 拖动绷带完成第一次包扎", "5:00 第二只动物入住", "10:00 升级治疗室并排班", "15:00 陪玩 mini-game 与领养弹窗"],
    automation: {
      trigger: "5-15 分钟后，玩家从按指引点转为自己排班和扩建。",
      changes: ["兽医值班自动处理基础治疗", "陪玩区提高动物状态", "领养反馈形成情感回路", "公益面板把救助结果可视化"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "动物数量、兽医排班和领养需求把小屋推成救援基地。" },
      { from: "内城 → 大地图", why: "D1 夜袭后，反派线和联盟共守把救援扩成区域行动。" },
    ],
    mid: ["D1 夜：打手偷袭庇护所，第一次塔防", "D2 早：小猫被劫持，第一次潜入救援", "D3-D7：反派故事弧与雨林扩张", "D7-D14：联盟共守和新区域打开"],
    prototype: ["治愈四步循环 45-90 秒可闭合", "夜间战斗不能破坏治愈主轴", "每个反派节点都要改变救援目标", "大地图要服务救援而非抽象扩张"],
  },
  {
    id: "J",
    project: "J_防疫区_Quarantine-Zone+Papers-Please+Tower-Defense+My-Perfect-Hotel_ppt169_20260429",
    file: "J_防疫区_研发对接精简版.pptx",
    title: "防疫区",
    subtitle: "检查站经营 × 夜间防线 × 城市哨站网络",
    tone: "白天亲手判断，晚上亲手守住；每一次误判都会在防线上显形。",
    colors: { bg: "0B1F1F", accent: "55D6A6", accent2: "F2B84B", soft: "E6F7F1" },
    keep: ["检查判断", "日夜因果", "第一人称夜战", "第二哨站预告"],
    layers: [
      { tag: "小屋", name: "检疫哨站", verbs: "看证 / 扫描 / 判定 / 隔离 / 放行", payoff: "第一轮判断马上有后果" },
      { tag: "内城", name: "防疫区基地", verbs: "隔离区 / 实验室 / 生活区 / 防御塔", payoff: "检查站长成可经营基地" },
      { tag: "大地图", name: "城市防线", verbs: "第二哨站 / 区域联防 / 物资线 / 城市节点", payoff: "防线从一个门口扩成城市网络" },
    ],
    c3: {
      camera: "白天检查台用近景第一视角；基地经营保持俯视。",
      character: "玩家是哨站负责人，既做判断，也承担夜间防线后果。",
      control: "拖证件、点扫描、划分隔离、夜里瞄准开火。",
      qte: "检查不是纯 QTE，是短判断链；夜战明确第一视角开火。",
    },
    early: ["0:00 第一批难民到门口", "1:00 核对证件并扫描体征", "3:00 第一次隔离或放行", "8:00 夜间警报响起", "15:00 误判结果反打防线"],
    automation: {
      trigger: "单人逐个检查很快会变慢，基地需要分区和工具承接压力。",
      changes: ["扫描台承担基础识别", "隔离区接住高疑似对象", "实验室给出二次判断", "防御塔把白天结果转成夜间压力"],
    },
    bridges: [
      { from: "小屋 → 内城", why: "检查口拥堵、隔离人数增加，玩家自然需要实验室、生活区和防御设施。" },
      { from: "内城 → 大地图", why: "第一哨站稳定后，第二哨站和区域物资线成为新的压力来源。" },
    ],
    mid: ["0-15 分钟：看、扫、判、隔离、开火一条链跑通", "D1：白天检查质量改变夜晚战况", "D2-D7：一片防疫区和第二哨站出现", "D14+：城市防线和区域联防打开"],
    prototype: ["前 15 分钟必须跑通日夜因果", "检查规则必须一眼可读", "夜战手感要兑现第一视角承诺", "第二哨站只做预告，不提前扩成大地图"],
  },
];

const VISUALS = {
  A: {
    cover: ["images/cropped/main-city_SA_01.jpg", "images/cropped/screenshot_02.jpg"],
    layers: [
      ["images/cropped/shop-gacha_SA_01.jpg", "images/cropped/shop-gacha_SA_02.jpg"],
      ["images/cropped/main-city_SA_01.jpg", "images/cropped/main-city_MPH_01.jpg"],
      ["images/cropped/map-world_SA_01.jpg"],
    ],
    c3: ["images/cropped/shop-gacha_SA_02.jpg", "images/cropped/character_SA_01.jpg"],
    early: ["images/cropped/shop-gacha_SA_01.jpg"],
    automation: ["images/cropped/main-city_MPH_01.jpg"],
    bridge: ["images/cropped/main-city_SA_01.jpg"],
    mid: ["images/cropped/map-world_SA_01.jpg"],
    checklist: ["images/cropped/screenshot_03.jpg", "images/cropped/main-city_SA_01.jpg"],
  },
  B: {
    cover: ["images/cropped/continental_exterior_16x9.jpg", "images/cropped/continental_exterior.jpg"],
    layers: [
      ["images/cropped/continental_exterior_card_3x4.jpg", "images/cropped/continental_exterior.jpg"],
      ["images/cropped/continental_bar.jpg", "images/cropped/continental_accounts_room.jpg"],
      ["images/cropped/continental_exterior_competition_29x10.jpg", "images/cropped/header.jpg"],
    ],
    c3: ["images/cropped/continental_accounts_room.jpg"],
    early: ["images/cropped/continental_bar_chip_32x15.jpg", "images/cropped/continental_bar.jpg"],
    automation: ["images/cropped/continental_accounts_room_card_3x4.jpg"],
    bridge: ["images/cropped/continental_exterior_competition_29x10.jpg"],
    mid: ["images/cropped/continental_exterior_16x9.jpg"],
    checklist: ["images/cropped/continental_bar.jpg"],
  },
  C: {
    cover: ["images/cropped/slide_01_cover_hero.jpg", "images/cropped/cover_gritty_gym.jpg"],
    layers: [
      ["images/cropped/slide_16_daily_loop.jpg", "images/cropped/slide_07_gym_zones.jpg"],
      ["images/cropped/slide_17_district_ecosystem.jpg", "images/cropped/fight_district_i2i.jpg"],
      ["images/cropped/slide_18_city_league.jpg", "images/cropped/league_map_i2i_clean.jpg"],
    ],
    c3: ["images/cropped/slide_05_first_60_min.jpg", "images/reselect_contacts/battle_ring.jpg"],
    early: ["images/cropped/slide_19_first_15_retention.jpg", "images/cropped/slide_05_first_60_min.jpg"],
    automation: ["images/cropped/slide_16_daily_loop.jpg"],
    bridge: ["images/cropped/slide_20_day1_street.jpg", "images/cropped/slide_17_district_ecosystem.jpg"],
    mid: ["images/cropped/slide_21_day2_revenge.jpg", "images/cropped/slide_18_city_league.jpg"],
    checklist: ["images/cropped/slide_24_prototype_plan.jpg"],
  },
  D: {
    cover: ["images/cropped/narco_empire_cover_wide.jpg", "images/cropped/cover_poster.png"],
    layers: [
      ["images/lab_garage.jpg", "images/cropped/experience_club.png"],
      ["images/cropped/narco_main_city_wide.jpg", "images/cropped/narcos_conflict_wide.jpg"],
      ["images/cropped/narco_map_route_wide.jpg", "images/cropped/narcos_city_wakeup_wide.jpg"],
    ],
    c3: ["images/lab_garage.jpg", "images/cropped/narco_police_countdown_portrait.jpg"],
    early: ["images/cropped/narco_first30_triptych_1280x720.jpg", "images/cropped/narco_intro_wide.jpg"],
    automation: ["images/cropped/experience_club.png", "images/cropped/narco_main_city_wide.jpg"],
    bridge: ["images/cropped/narco_map_route_wide.jpg"],
    mid: ["images/cropped/narcos_city_wakeup_wide.jpg", "images/cropped/narco_map_route_wide.jpg"],
    checklist: ["images/cropped/narco_police_raid_wide.jpg"],
  },
  E: {
    cover: ["images/cropped/cover_hero.jpg", "images/_remix/cover_hero.jpg"],
    layers: [
      ["images/cropped/ipad_01.jpg", "images/cropped/screenshot_01.jpg"],
      ["images/cropped/main-city_MPH_01.jpg", "images/cropped/ipad_04.jpg"],
      ["images/cropped/map-world_MPH_01.jpg", "images/cropped/screenshot_09.jpg"],
    ],
    c3: ["images/cropped/ssr_burst.jpg", "images/_remix/ssr_burst.jpg"],
    early: ["images/cropped/loop_storyboard.jpg", "images/_remix/loop_storyboard.jpg"],
    automation: ["images/cropped/main-city_MPH_01.jpg"],
    bridge: ["images/cropped/ipad_09.jpg", "images/cropped/map-world_MPH_01.jpg"],
    mid: ["images/cropped/map-world_MPH_01.jpg"],
    checklist: ["images/cropped/cover_hero.jpg"],
  },
  G: {
    cover: ["images/cropped/narco_empire_cover_wide.jpg", "images/cropped/frame_0014.jpg"],
    layers: [
      ["images/cropped/screenshot_01.jpg", "images/cropped/frame_0001.jpg"],
      ["images/cropped/narco_main_city_wide.jpg", "images/cropped/screenshot_03.jpg"],
      ["images/cropped/narco_map_route_wide.jpg", "images/cropped/narcos_city_wakeup_wide.jpg"],
    ],
    c3: ["images/cropped/narco_police_countdown_portrait.jpg", "images/cropped/narco_police_raid_wide.jpg"],
    early: ["images/cropped/narco_first30_triptych_1280x720.jpg", "images/cropped/narco_intro_wide.jpg"],
    automation: ["images/cropped/narco_main_city_wide.jpg", "images/cropped/frame_0305.jpg"],
    bridge: ["images/cropped/narco_map_route_wide.jpg"],
    mid: ["images/cropped/narcos_city_wakeup_wide.jpg", "images/cropped/gentlemen_empire_wide.jpg"],
    checklist: ["images/cropped/narco_police_raid_wide.jpg"],
  },
  H: {
    cover: ["images/cropped/cover_bg.jpg", "images/_remix/cover_bg.jpg"],
    layers: [
      ["images/cropped/battle_1p_ark.jpg"],
      ["images/cropped/battle_3p_deck.jpg", "images/cropped/chapter_intro_bg.jpg"],
      ["images/cropped/screenshot_05.jpg", "images/cropped/chapter_part5_bg.jpg"],
    ],
    c3: ["images/cropped/battle_1p_ark.jpg"],
    early: ["images/cropped/battle_1p_ark.jpg", "images/cropped/screenshot_01.jpg"],
    automation: ["images/cropped/battle_3p_deck.jpg"],
    bridge: ["images/cropped/chapter_intro_bg.jpg", "images/cropped/battle_3p_deck.jpg"],
    mid: ["images/cropped/chapter_part5_bg.jpg", "images/cropped/battle_3p_deck.jpg"],
    checklist: ["images/cropped/screenshot_05.jpg"],
  },
  I: {
    cover: ["images/cropped/cover_bg.jpg", "images/_remix/cover_bg.jpg"],
    layers: [
      ["images/cropped/screenshot_01.jpg", "images/cropped/cover_bg.jpg"],
      ["images/cropped/cycle_hero.jpg", "images/cropped/screenshot_03.jpg"],
      ["images/cropped/closing_vision.jpg", "images/cropped/chapter_part5_bg.jpg"],
    ],
    c3: ["images/cropped/screenshot_02.jpg", "images/cropped/cycle_hero.jpg"],
    early: ["images/cropped/cover_bg.jpg", "images/cropped/screenshot_01.jpg"],
    automation: ["images/cropped/cycle_hero.jpg"],
    bridge: ["images/cropped/cover_night_overlay.jpg", "images/cropped/chapter_intro_bg.jpg"],
    mid: ["images/cropped/cover_night_overlay.jpg", "images/cropped/chapter_part5_bg.jpg"],
    checklist: ["images/cropped/closing_vision.jpg"],
  },
  J: {
    cover: ["images/cropped/qz_checkpoint_gate.jpg", "images/curated/qz_checkpoint_gate.jpg"],
    layers: [
      ["images/cropped/qz_body_scan.jpg", "images/cropped/qz_scan_tool.jpg"],
      ["images/cropped/qz_base_topdown.jpg", "images/cropped/qz_turret_battle.jpg"],
      ["images/cropped/qz_strategy_map.jpg", "images/curated/qz_strategy_map.jpg"],
    ],
    c3: ["images/cropped/qz_body_scan.jpg", "images/cropped/qz_first_person_shooting.jpg"],
    early: ["images/cropped/qz_checkpoint_gate.jpg", "images/cropped/qz_scan_tool.jpg"],
    automation: ["images/cropped/qz_base_topdown.jpg", "images/cropped/qz_turret_battle.jpg"],
    bridge: ["images/cropped/qz_strategy_map.jpg", "images/cropped/qz_base_topdown.jpg"],
    mid: ["images/cropped/qz_night_battle.jpg", "images/cropped/qz_drone_minigun.jpg"],
    checklist: ["images/cropped/qz_first_person_shooting.jpg", "images/cropped/qz_night_battle.jpg"],
  },
};

function addText(slide, text, opt) {
  slide.addText(text, {
    fontFace: "PingFang SC",
    breakLine: false,
    fit: "shrink",
    margin: 0.04,
    ...opt,
  });
}

function addBg(slide, cfg) {
  slide.background = { color: cfg.colors.bg };
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: cfg.colors.bg }, line: { color: cfg.colors.bg } });
  slide.addShape("rect", { x: 0, y: 7.12, w: 13.333, h: 0.38, fill: { color: cfg.colors.accent, transparency: 18 }, line: { color: cfg.colors.accent, transparency: 100 } });
}

function imagePanel(slide, cfg, key, x, y, w, h, label, opts = {}) {
  const img = cfg.renderedImages?.[key];
  if (!img) return false;
  slide.addImage({ path: img, x, y, w, h });
  if (opts.scrim) {
    slide.addShape("rect", { x, y, w, h, fill: { color: cfg.colors.bg, transparency: opts.scrim }, line: { color: cfg.colors.bg, transparency: 100 } });
  }
  slide.addShape("rect", { x, y, w, h, fill: { color: "FFFFFF", transparency: 100 }, line: { color: opts.lineColor || cfg.colors.accent, transparency: 32, width: 1 } });
  if (label) {
    addText(slide, label, {
      x: x + 0.14,
      y: y + h - 0.42,
      w: Math.min(w - 0.28, 3.2),
      h: 0.26,
      fontSize: 9.6,
      bold: true,
      color: cfg.colors.bg,
      align: "center",
      fill: { color: cfg.colors.accent, transparency: 4 },
      line: { color: cfg.colors.accent, transparency: 100 },
    });
  }
  return true;
}

function header(slide, cfg, title, page) {
  addText(slide, cfg.id, { x: 0.42, y: 0.3, w: 0.42, h: 0.32, fontSize: 12, bold: true, color: cfg.colors.bg, align: "center", fill: { color: cfg.colors.accent }, line: { color: cfg.colors.accent } });
  addText(slide, title, { x: 0.95, y: 0.24, w: 9.7, h: 0.45, fontSize: 20, bold: true, color: "FFFFFF" });
  addText(slide, "研发对接精简版", { x: 10.72, y: 0.29, w: 1.45, h: 0.25, fontSize: 9.5, color: cfg.colors.soft, align: "right" });
  addText(slide, String(page).padStart(2, "0"), { x: 12.28, y: 0.29, w: 0.55, h: 0.25, fontSize: 9.5, color: cfg.colors.accent, align: "right" });
  slide.addShape("line", { x: 0.42, y: 0.82, w: 12.48, h: 0, line: { color: cfg.colors.accent, transparency: 40, width: 0.8 } });
}

function pill(slide, text, x, y, w, color, bg, size = 11) {
  addText(slide, text, {
    x, y, w, h: 0.35,
    fontSize: size,
    bold: true,
    color,
    align: "center",
    fill: { color: bg, transparency: 7 },
    line: { color: bg, transparency: 8 },
    radius: 0.12,
  });
}

function card(slide, cfg, x, y, w, h, title, body, accent = cfg.colors.accent) {
  slide.addShape("roundRect", {
    x, y, w, h,
    rectRadius: 0.06,
    fill: { color: "FFFFFF", transparency: 92 },
    line: { color: accent, transparency: 38, width: 1 },
  });
  slide.addShape("rect", { x, y, w: 0.08, h, fill: { color: accent }, line: { color: accent } });
  addText(slide, title, { x: x + 0.22, y: y + 0.18, w: w - 0.34, h: 0.3, fontSize: 13.5, bold: true, color: accent });
  addText(slide, body, { x: x + 0.22, y: y + 0.58, w: w - 0.36, h: h - 0.72, fontSize: 11.7, color: "EEF2F7", valign: "top", breakLine: false });
}

function bulletText(items, prefix = "• ") {
  return items.map((item) => `${prefix}${item}`).join("\n");
}

function cover(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  slide.addShape("rect", { x: 0, y: 0, w: 4.7, h: 7.5, fill: { color: cfg.colors.accent, transparency: 12 }, line: { color: cfg.colors.accent, transparency: 100 } });
  imagePanel(slide, cfg, "cover", 6.15, 0.72, 6.25, 3.95, "主题视觉", { scrim: 32 });
  addText(slide, "精简版", { x: 0.68, y: 0.7, w: 1.15, h: 0.32, fontSize: 13, bold: true, color: cfg.colors.bg, align: "center", fill: { color: cfg.colors.accent }, line: { color: cfg.colors.accent } });
  addText(slide, cfg.title, { x: 0.66, y: 1.55, w: 6.0, h: 0.82, fontSize: 36, bold: true, color: "FFFFFF" });
  addText(slide, cfg.subtitle, { x: 0.69, y: 2.42, w: 6.9, h: 0.45, fontSize: 17, color: cfg.colors.soft });
  addText(slide, cfg.tone, { x: 0.72, y: 3.32, w: 4.95, h: 0.94, fontSize: 18, bold: true, color: "FFFFFF", breakLine: false });
  addText(slide, "给研发团队看的核心版：删去外围叙述，只保留玩法闭环、视角手感、三层过渡和原型验收。", { x: 0.74, y: 5.72, w: 5.25, h: 0.62, fontSize: 12.5, color: "D6DEE8", breakLine: false });
  const x0 = 6.75;
  cfg.layers.forEach((layer, i) => {
    const y = 4.9 + i * 0.68;
    slide.addShape("roundRect", { x: x0, y, w: 5.25, h: 0.52, fill: { color: cfg.colors.bg, transparency: 8 }, line: { color: cfg.colors.accent, transparency: 38, width: 0.8 } });
    pill(slide, layer.tag, x0 + 0.25, y + 0.09, 0.78, cfg.colors.bg, cfg.colors.accent, 10);
    addText(slide, layer.name, { x: x0 + 1.2, y: y + 0.16, w: 1.45, h: 0.2, fontSize: 12.2, bold: true, color: "FFFFFF" });
    addText(slide, layer.payoff, { x: x0 + 2.75, y: y + 0.17, w: 2.0, h: 0.18, fontSize: 8.7, color: "D7DEE8" });
  });
  slide.addNotes(`${cfg.title} 精简版封面。重点是三层循环与研发可执行范围。`);
}

function scopeSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "本版只保留研发需要决策的内容", 2);
  const items = [
    ["体验闭环", "玩家每 1-5 分钟到底做什么，什么反馈让他继续。"],
    ["视角手感", "初期 Camera / Character / Control 与 QTE 形态一次定清。"],
    ["三层过渡", "小屋、内城、大地图不是硬切，而是责任与空间放大。"],
    ["原型验收", "研发先做哪些可玩片段，看到什么算闭环成立。"],
  ];
  items.forEach((it, i) => {
    const x = 0.72 + (i % 2) * 6.05;
    const y = 1.35 + Math.floor(i / 2) * 1.62;
    card(slide, cfg, x, y, 5.45, 1.15, it[0], it[1], i % 2 === 0 ? cfg.colors.accent : cfg.colors.accent2);
  });
  addText(slide, "保留关键词", { x: 0.78, y: 4.72, w: 1.18, h: 0.28, fontSize: 12.5, bold: true, color: cfg.colors.accent });
  cfg.keep.forEach((k, i) => pill(slide, k, 2.04 + i * 2.45, 4.66, 2.15, "FFFFFF", i % 2 ? cfg.colors.accent2 : cfg.colors.accent, 10.5));
  addText(slide, "阅读方式：每页只回答一个研发问题。看完后应能直接进入原型拆分，而不是继续讨论外围条件。", { x: 0.78, y: 5.75, w: 11.6, h: 0.45, fontSize: 16, bold: true, color: "FFFFFF" });
  slide.addNotes("本页说明精简范围：只保留体验闭环、视角手感、三层过渡和原型验收。");
}

function layersSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "三层循环：小屋 → 内城 → 大地图", 3);
  cfg.layers.forEach((layer, i) => {
    const x = 0.68 + i * 4.25;
    const w = 3.75;
    slide.addShape("roundRect", { x, y: 1.35, w, h: 3.85, fill: { color: "FFFFFF", transparency: 91 }, line: { color: cfg.colors.accent, transparency: 24, width: 1.2 } });
    imagePanel(slide, cfg, `layer${i + 1}`, x + 0.24, 1.57, w - 0.48, 1.18, layer.tag);
    addText(slide, layer.name, { x: x + 0.28, y: 2.95, w: w - 0.56, h: 0.34, fontSize: 18, bold: true, color: "FFFFFF" });
    addText(slide, layer.verbs, { x: x + 0.3, y: 3.52, w: w - 0.6, h: 0.42, fontSize: 12.5, bold: true, color: cfg.colors.soft });
    slide.addShape("line", { x: x + 0.28, y: 4.15, w: w - 0.56, h: 0, line: { color: cfg.colors.accent, transparency: 38, width: 1 } });
    addText(slide, layer.payoff, { x: x + 0.3, y: 4.38, w: w - 0.6, h: 0.5, fontSize: 11.8, color: "E8EEF6", breakLine: false });
    if (i < 2) {
      addText(slide, "→", { x: x + w + 0.12, y: 2.95, w: 0.36, h: 0.34, fontSize: 20, bold: true, color: cfg.colors.accent });
    }
  });
  addText(slide, "核心判断：三层不是三套模式，而是同一套玩家身份逐级放大。", { x: 0.78, y: 6.02, w: 11.6, h: 0.38, fontSize: 17, bold: true, color: cfg.colors.accent });
  slide.addNotes("本页用小屋、内城、大地图说明核心循环结构。");
}

function c3Slide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "初期视角 3C 与 QTE 形态", 4);
  imagePanel(slide, cfg, "c3", 8.35, 1.22, 4.0, 3.58, "初期操作画面", { scrim: 8 });
  const rows = [
    ["Camera", cfg.c3.camera],
    ["Character", cfg.c3.character],
    ["Control", cfg.c3.control],
    ["QTE", cfg.c3.qte],
  ];
  rows.forEach((row, i) => {
    const y = 1.2 + i * 1.12;
    slide.addShape("roundRect", { x: 0.85, y, w: 2.0, h: 0.78, fill: { color: i === 3 ? cfg.colors.accent : "FFFFFF", transparency: i === 3 ? 8 : 92 }, line: { color: cfg.colors.accent, transparency: 20 } });
    addText(slide, row[0], { x: 1.08, y: y + 0.22, w: 1.5, h: 0.24, fontSize: 13.5, bold: true, color: i === 3 ? cfg.colors.bg : cfg.colors.accent, align: "center" });
    addText(slide, row[1], { x: 3.12, y: y + 0.13, w: 4.72, h: 0.52, fontSize: 14.2, color: "FFFFFF", breakLine: false });
  });
  addText(slide, "研发边界", { x: 0.88, y: 5.9, w: 1.1, h: 0.25, fontSize: 12, bold: true, color: cfg.colors.accent });
  addText(slide, "先把首局手感做小、做准、做可重复；中后期镜头再放大，不在初期同时塞满所有系统。", { x: 2.05, y: 5.82, w: 10.2, h: 0.45, fontSize: 16.2, bold: true, color: cfg.colors.soft });
  slide.addNotes("本页明确初期 3C、QTE 是第一视角还是俯视。");
}

function earlySlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "前 5 分钟：第一轮闭环必须可玩", 5);
  cfg.early.forEach((item, i) => {
    const x = 0.7 + i * 2.45;
    slide.addShape("ellipse", { x, y: 1.62, w: 0.54, h: 0.54, fill: { color: cfg.colors.accent }, line: { color: cfg.colors.accent } });
    addText(slide, String(i + 1), { x: x + 0.12, y: 1.78, w: 0.3, h: 0.16, fontSize: 9.5, bold: true, color: cfg.colors.bg, align: "center" });
    if (i < cfg.early.length - 1) slide.addShape("line", { x: x + 0.54, y: 1.89, w: 1.8, h: 0, line: { color: cfg.colors.accent, transparency: 28, width: 1.4 } });
    addText(slide, item, { x: x - 0.05, y: 2.45, w: 2.05, h: 1.2, fontSize: 14, bold: true, color: "FFFFFF", breakLine: false });
  });
  imagePanel(slide, cfg, "early", 0.86, 4.28, 4.8, 1.55, "前期画面");
  slide.addShape("roundRect", { x: 6.0, y: 4.45, w: 6.15, h: 1.06, fill: { color: cfg.colors.accent, transparency: 82 }, line: { color: cfg.colors.accent, transparency: 22 } });
  addText(slide, "验收口径", { x: 6.3, y: 4.69, w: 1.1, h: 0.22, fontSize: 12.5, bold: true, color: cfg.colors.accent });
  addText(slide, "玩家在 5 分钟内必须完成一次“操作 → 反馈 → 资源变化 → 新目标出现”的闭环。", { x: 7.55, y: 4.56, w: 4.15, h: 0.55, fontSize: 15.2, bold: true, color: "FFFFFF", breakLine: false });
  slide.addNotes("本页压缩 notes 中的前 5 分钟内容，形成研发可验收闭环。");
}

function automationSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "5-30 分钟：从亲手操作到调度", 6);
  slide.addShape("roundRect", { x: 0.75, y: 1.28, w: 4.6, h: 3.95, fill: { color: cfg.colors.accent, transparency: 82 }, line: { color: cfg.colors.accent, transparency: 20 } });
  addText(slide, "触发点", { x: 1.1, y: 1.62, w: 1.2, h: 0.28, fontSize: 15, bold: true, color: cfg.colors.accent });
  addText(slide, cfg.automation.trigger, { x: 1.1, y: 2.0, w: 3.85, h: 1.2, fontSize: 19, bold: true, color: "FFFFFF", breakLine: false });
  imagePanel(slide, cfg, "automation", 1.08, 3.55, 3.8, 1.18, "调度/自动化");
  addText(slide, "设计目标：重复劳动出现之前，把玩家身份从操作者抬到管理者。", { x: 1.1, y: 4.92, w: 3.75, h: 0.28, fontSize: 11.4, color: cfg.colors.soft, breakLine: false });
  addText(slide, "变化", { x: 6.0, y: 1.42, w: 0.8, h: 0.26, fontSize: 14, bold: true, color: cfg.colors.accent });
  cfg.automation.changes.forEach((item, i) => {
    const y = 1.95 + i * 0.82;
    slide.addShape("roundRect", { x: 6.0, y, w: 5.85, h: 0.52, fill: { color: "FFFFFF", transparency: 91 }, line: { color: i % 2 ? cfg.colors.accent2 : cfg.colors.accent, transparency: 42 } });
    addText(slide, `${i + 1}. ${item}`, { x: 6.28, y: y + 0.13, w: 5.2, h: 0.18, fontSize: 12.8, color: "FFFFFF" });
  });
  addText(slide, "关键：不是把手动玩法删掉，而是让手动结果变成自动系统的输入。", { x: 0.82, y: 6.02, w: 11.55, h: 0.34, fontSize: 16.5, bold: true, color: cfg.colors.accent });
  slide.addNotes("本页说明 5-30 分钟由亲手操作过渡到调度和自动化。");
}

function bridgeSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "自然过渡：空间、责任、镜头一起放大", 7);
  imagePanel(slide, cfg, "bridge", 8.72, 1.26, 3.62, 3.05, "过渡空间", { scrim: 10 });
  cfg.bridges.forEach((b, i) => {
    const y = 1.25 + i * 2.05;
    slide.addShape("roundRect", { x: 0.86, y, w: 7.48, h: 1.42, fill: { color: "FFFFFF", transparency: 91 }, line: { color: cfg.colors.accent, transparency: 28, width: 1 } });
    addText(slide, b.from, { x: 1.18, y: y + 0.26, w: 2.35, h: 0.36, fontSize: 18, bold: true, color: cfg.colors.accent });
    addText(slide, b.why, { x: 3.65, y: y + 0.23, w: 4.25, h: 0.58, fontSize: 13.8, color: "FFFFFF", breakLine: false });
    addText(slide, "不是系统跳转，是玩家责任扩大", { x: 3.67, y: y + 0.97, w: 3.5, h: 0.24, fontSize: 10.2, bold: true, color: cfg.colors.soft });
  });
  const rules = ["新空间必须由旧空间的问题推出来", "新系统必须反哺旧循环", "镜头拉远前，玩家先感到责任变大"];
  rules.forEach((r, i) => pill(slide, r, 1.0 + i * 4.08, 5.77, 3.62, "FFFFFF", i === 1 ? cfg.colors.accent2 : cfg.colors.accent, 10));
  slide.addNotes("本页说明小屋到内城、大地图的自然过渡方式。");
}

function midSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "中期玩法：不换赛道，放大同一个动词", 8);
  imagePanel(slide, cfg, "mid", 8.85, 1.25, 3.45, 3.72, "中期/大空间", { scrim: 10 });
  cfg.mid.forEach((item, i) => {
    const y = 1.25 + i * 1.05;
    slide.addShape("roundRect", { x: 0.92, y, w: 1.55, h: 0.48, fill: { color: cfg.colors.accent, transparency: 8 }, line: { color: cfg.colors.accent } });
    addText(slide, `阶段 ${i + 1}`, { x: 1.13, y: y + 0.15, w: 1.1, h: 0.16, fontSize: 9.4, bold: true, color: cfg.colors.bg, align: "center" });
    addText(slide, item, { x: 2.75, y: y + 0.05, w: 5.55, h: 0.38, fontSize: 14.2, bold: true, color: "FFFFFF", breakLine: false });
  });
  slide.addShape("line", { x: 1.69, y: 1.73, w: 0, h: 3.2, line: { color: cfg.colors.accent, transparency: 48, width: 1.3 } });
  addText(slide, "研发含义：中期不要突然换成另一个游戏；让玩家熟悉的核心动词在更大空间里产生新后果。", { x: 0.95, y: 5.94, w: 11.35, h: 0.42, fontSize: 16.2, bold: true, color: cfg.colors.accent });
  slide.addNotes("本页说明前期到中期的玩法与过渡。");
}

function checklistSlide(pptx, cfg) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  header(slide, cfg, "研发原型验收清单", 9);
  imagePanel(slide, cfg, "checklist", 8.9, 1.26, 3.38, 2.6, "原型视觉锚", { scrim: 8 });
  cfg.prototype.forEach((item, i) => {
    const x = 0.88 + (i % 2) * 3.88;
    const y = 1.32 + Math.floor(i / 2) * 1.22;
    slide.addShape("roundRect", { x, y, w: 3.48, h: 0.82, fill: { color: "FFFFFF", transparency: 91 }, line: { color: cfg.colors.accent, transparency: 30 } });
    slide.addShape("ellipse", { x: x + 0.28, y: y + 0.23, w: 0.28, h: 0.28, fill: { color: cfg.colors.accent }, line: { color: cfg.colors.accent } });
    addText(slide, item, { x: x + 0.72, y: y + 0.16, w: 2.42, h: 0.42, fontSize: 11.5, bold: true, color: "FFFFFF", breakLine: false });
  });
  addText(slide, "下一步建议", { x: 0.92, y: 5.55, w: 1.2, h: 0.27, fontSize: 12.5, bold: true, color: cfg.colors.accent });
  addText(slide, "先做 15 分钟 vertical slice：第一轮手动闭环 + 第一次自动化 + 一次短事件 + 镜头/空间放大。", { x: 2.15, y: 5.45, w: 9.8, h: 0.48, fontSize: 17, bold: true, color: "FFFFFF" });
  slide.addNotes("本页是研发拆分和验收清单。");
}

function optionalSeparator(pptx, cfg, optionalCount, originalName) {
  const slide = pptx.addSlide();
  addBg(slide, cfg);
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: cfg.colors.bg }, line: { color: cfg.colors.bg } });
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: cfg.colors.accent, transparency: 86 }, line: { color: cfg.colors.accent, transparency: 100 } });
  addText(slide, "Optional", { x: 0.78, y: 1.05, w: 2.0, h: 0.36, fontSize: 15, bold: true, color: cfg.colors.bg, align: "center", fill: { color: cfg.colors.accent }, line: { color: cfg.colors.accent } });
  addText(slide, "可选阅读部分", { x: 0.78, y: 1.82, w: 5.8, h: 0.72, fontSize: 38, bold: true, color: "FFFFFF" });
  addText(slide, "前 9 页是强制对齐的核心重点；从下一页开始是原版里的延伸细节页，只用于补充理解，不作为研发必须逐条对齐的范围。", {
    x: 0.82,
    y: 2.9,
    w: 6.25,
    h: 1.05,
    fontSize: 18,
    bold: true,
    color: cfg.colors.soft,
    breakLine: false,
  });
  slide.addShape("roundRect", { x: 8.0, y: 1.34, w: 3.95, h: 3.55, fill: { color: "FFFFFF", transparency: 91 }, line: { color: cfg.colors.accent, transparency: 30 } });
  addText(slide, cfg.title, { x: 8.42, y: 1.78, w: 3.1, h: 0.42, fontSize: 20, bold: true, color: "FFFFFF", align: "center" });
  addText(slide, `后接可选延伸\n${optionalCount} 页`, { x: 8.48, y: 2.56, w: 3.05, h: 0.62, fontSize: 22, bold: true, color: cfg.colors.accent, align: "center", breakLine: false });
  addText(slide, "来源文件", { x: 8.48, y: 3.55, w: 0.75, h: 0.18, fontSize: 9.5, bold: true, color: cfg.colors.accent });
  addText(slide, originalName, { x: 8.48, y: 3.85, w: 3.05, h: 0.42, fontSize: 8.8, color: "DCE5EE", align: "center", breakLine: false });
  slide.addNotes("Optional 可选阅读部分。前 9 页为核心对齐内容，后续为原版中的商业化、投放、风险、剧情细节等展开材料。");
}

function buildDeck(cfg, options = {}) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Codex";
  pptx.company = "Game PPT Master";
  pptx.subject = `${cfg.title} 研发对接精简版`;
  pptx.title = `${cfg.title} 研发对接精简版`;
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: "PingFang SC",
    bodyFontFace: "PingFang SC",
    lang: "zh-CN",
  };
  cover(pptx, cfg);
  scopeSlide(pptx, cfg);
  layersSlide(pptx, cfg);
  c3Slide(pptx, cfg);
  earlySlide(pptx, cfg);
  automationSlide(pptx, cfg);
  bridgeSlide(pptx, cfg);
  midSlide(pptx, cfg);
  checklistSlide(pptx, cfg);
  if (options.includeOptionalSeparator) {
    optionalSeparator(pptx, cfg, options.optionalCount || 0, options.originalName || "");
  }
  return pptx;
}

async function extractText(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const parts = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name) || /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  let text = "";
  for (const part of parts) {
    const xml = await zip.files[part].async("string");
    const matches = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)];
    text += matches.map((m) => m[1]).join("\n") + "\n";
  }
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function decodeText(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function xmlPlainText(xml) {
  const matches = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)];
  return decodeText(matches.map((m) => m[1]).join("\n"));
}

async function extractSlideTexts(file) {
  if (!file || !fs.existsSync(file)) return [];
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const parts = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const slides = [];
  for (const part of parts) {
    const xml = await zip.files[part].async("string");
    const sourceSlide = Number(part.match(/slide(\d+)\.xml$/)?.[1] || 0);
    const text = xmlPlainText(xml);
    const title = text.split(/\n+/).map((s) => s.trim()).find(Boolean) || `Slide ${sourceSlide}`;
    slides.push({ sourceSlide, title, text });
  }
  return slides;
}

function classifyOptionalSlide(text) {
  const categories = OPTIONAL_SLIDE_PATTERNS
    .filter((pattern) => pattern.re.test(text))
    .map((pattern) => pattern.label);
  return [...new Set(categories)];
}

async function selectOptionalSlides(originalFile, cfg) {
  const slides = await extractSlideTexts(originalFile);
  const override = OPTIONAL_SOURCE_SLIDES[cfg.id];
  if (override) {
    return override
      .map((sourceSlide) => slides.find((slide) => slide.sourceSlide === sourceSlide))
      .filter(Boolean)
      .map((slide) => ({
        ...slide,
        categories: classifyOptionalSlide(slide.text).length
          ? classifyOptionalSlide(slide.text)
          : ["人工后置：延伸细节"],
      }));
  }
  return slides
    .filter((slide) => slide.sourceSlide > 9)
    .map((slide) => {
      return {
        ...slide,
        categories: classifyOptionalSlide(slide.text),
      };
    })
    .filter((slide) => slide.categories.length > 0);
}

async function readZipText(zip, name) {
  const file = zip.file(name);
  return file ? file.async("string") : "";
}

async function countSlides(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  return Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)).length;
}

async function countSlidesInFile(file) {
  if (!file || !fs.existsSync(file)) return 0;
  return countSlides(file);
}

function findOriginalDeck(cfg) {
  const exportsDir = path.join(ROOT, cfg.project, "exports");
  const files = fs.readdirSync(exportsDir)
    .filter((name) => name.endsWith(".pptx"))
    .filter((name) => !name.includes("_svg"))
    .filter((name) => !name.includes("精简"))
    .filter((name) => !name.includes("最终版"))
    .map((name) => path.join(exportsDir, name))
    .filter((file) => fs.statSync(file).isFile())
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
  return files[files.length - 1] || null;
}

function ensureDefaultTypes(baseXml, origXml) {
  const existing = new Set([...baseXml.matchAll(/<Default\s+[^>]*Extension="([^"]+)"/g)].map((m) => m[1]));
  const defaults = [...origXml.matchAll(/<Default\s+[^>]*Extension="([^"]+)"[^>]*ContentType="([^"]+)"\s*\/>/g)];
  let additions = "";
  for (const [, ext, contentType] of defaults) {
    if (existing.has(ext)) continue;
    existing.add(ext);
    additions += `<Default Extension="${ext}" ContentType="${contentType}"/>`;
  }
  return additions ? baseXml.replace(/<Override\b/, `${additions}<Override`) : baseXml;
}

function ensureOverride(xml, partName, contentType) {
  const escaped = partName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`<Override\\s+[^>]*PartName="${escaped}"`).test(xml)) return xml;
  return xml.replace("</Types>", `<Override PartName="${partName}" ContentType="${contentType}"/></Types>`);
}

function maxRid(relsXml) {
  let max = 0;
  for (const match of relsXml.matchAll(/Id="rId(\d+)"/g)) max = Math.max(max, Number(match[1]));
  return max;
}

function maxSlideId(presXml) {
  let max = 255;
  for (const match of presXml.matchAll(/<p:sldId\b[^>]*\sid="(\d+)"/g)) max = Math.max(max, Number(match[1]));
  return max;
}

function copyZipPart(fromZip, toZip, partName) {
  const part = fromZip.file(partName);
  if (!part || toZip.file(partName)) return;
  toZip.file(partName, part.async("nodebuffer"));
}

function updateRelationshipTargets(xml, updater) {
  return xml.replace(/<Relationship\b[^>]*\/>/g, (rel) => {
    const targetMatch = rel.match(/\sTarget="([^"]+)"/);
    if (!targetMatch) return rel;
    const nextTarget = updater(targetMatch[1], rel);
    if (!nextTarget || nextTarget === targetMatch[1]) return rel;
    return rel.replace(`Target="${targetMatch[1]}"`, `Target="${nextTarget}"`);
  });
}

function copyInternalTargets(fromZip, toZip, relsXml, baseDir) {
  return updateRelationshipTargets(relsXml, (target, rel) => {
    if (/TargetMode="External"/.test(rel)) return target;
    if (target.includes("slideLayout") || target.includes("notesSlide") || target.includes("slides/slide")) return target;
    const partName = path.posix.normalize(path.posix.join(baseDir, target));
    if (!fromZip.file(partName)) return target;
    copyZipPart(fromZip, toZip, partName);
    const relsPart = `${path.posix.dirname(partName)}/_rels/${path.posix.basename(partName)}.rels`;
    if (fromZip.file(relsPart) && !toZip.file(relsPart)) {
      copyZipPart(fromZip, toZip, relsPart);
    }
    return target;
  });
}

async function appendOriginalOptionalSlides(baseFile, originalFile, outputFile, sourceSlides = []) {
  const baseZip = await JSZip.loadAsync(fs.readFileSync(baseFile));
  const originalZip = await JSZip.loadAsync(fs.readFileSync(originalFile));
  const baseSlideCount = Object.keys(baseZip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)).length;
  let presXml = await readZipText(baseZip, "ppt/presentation.xml");
  let presRelsXml = await readZipText(baseZip, "ppt/_rels/presentation.xml.rels");
  let contentTypesXml = await readZipText(baseZip, "[Content_Types].xml");
  const originalContentTypesXml = await readZipText(originalZip, "[Content_Types].xml");
  contentTypesXml = ensureDefaultTypes(contentTypesXml, originalContentTypesXml);
  let nextRid = maxRid(presRelsXml) + 1;
  let nextSlideId = maxSlideId(presXml) + 1;
  let newSlideNum = baseSlideCount + 1;
  const appended = [];

  for (const sourceSlide of sourceSlides) {
    const sourceSlidePart = `ppt/slides/slide${sourceSlide}.xml`;
    if (!originalZip.file(sourceSlidePart)) continue;
    const targetSlidePart = `ppt/slides/slide${newSlideNum}.xml`;
    baseZip.file(targetSlidePart, originalZip.file(sourceSlidePart).async("nodebuffer"));

    const sourceRelsPart = `ppt/slides/_rels/slide${sourceSlide}.xml.rels`;
    const targetRelsPart = `ppt/slides/_rels/slide${newSlideNum}.xml.rels`;
    let slideRelsXml = await readZipText(originalZip, sourceRelsPart);
    if (slideRelsXml) {
      slideRelsXml = updateRelationshipTargets(slideRelsXml, (target, rel) => {
        if (/TargetMode="External"/.test(rel)) return target;
        if (target.match(/\.\.\/notesSlides\/notesSlide\d+\.xml/)) return `../notesSlides/notesSlide${newSlideNum}.xml`;
        return target;
      });
      slideRelsXml = copyInternalTargets(originalZip, baseZip, slideRelsXml, "ppt/slides");
      baseZip.file(targetRelsPart, slideRelsXml);
    }

    const sourceNotesPart = `ppt/notesSlides/notesSlide${sourceSlide}.xml`;
    if (originalZip.file(sourceNotesPart)) {
      const targetNotesPart = `ppt/notesSlides/notesSlide${newSlideNum}.xml`;
      baseZip.file(targetNotesPart, originalZip.file(sourceNotesPart).async("nodebuffer"));
      const sourceNotesRelsPart = `ppt/notesSlides/_rels/notesSlide${sourceSlide}.xml.rels`;
      const targetNotesRelsPart = `ppt/notesSlides/_rels/notesSlide${newSlideNum}.xml.rels`;
      let notesRelsXml = await readZipText(originalZip, sourceNotesRelsPart);
      if (notesRelsXml) {
        notesRelsXml = updateRelationshipTargets(notesRelsXml, (target, rel) => {
          if (/TargetMode="External"/.test(rel)) return target;
          if (target.match(/\.\.\/slides\/slide\d+\.xml/)) return `../slides/slide${newSlideNum}.xml`;
          return target;
        });
        notesRelsXml = copyInternalTargets(originalZip, baseZip, notesRelsXml, "ppt/notesSlides");
        baseZip.file(targetNotesRelsPart, notesRelsXml);
      }
      contentTypesXml = ensureOverride(
        contentTypesXml,
        `/ppt/notesSlides/notesSlide${newSlideNum}.xml`,
        "application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"
      );
    }

    const rid = `rId${nextRid}`;
    presRelsXml = presRelsXml.replace(
      "</Relationships>",
      `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${newSlideNum}.xml"/></Relationships>`
    );
    presXml = presXml.replace("</p:sldIdLst>", `<p:sldId id="${nextSlideId}" r:id="${rid}"/></p:sldIdLst>`);
    contentTypesXml = ensureOverride(
      contentTypesXml,
      `/ppt/slides/slide${newSlideNum}.xml`,
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml"
    );
    appended.push({ sourceSlide, newSlide: newSlideNum });
    nextRid += 1;
    nextSlideId += 1;
    newSlideNum += 1;
  }

  baseZip.file("ppt/presentation.xml", presXml);
  baseZip.file("ppt/_rels/presentation.xml.rels", presRelsXml);
  baseZip.file("[Content_Types].xml", contentTypesXml);
  const buffer = await baseZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(outputFile, buffer);
  return appended;
}

function firstExisting(projectDir, candidates = []) {
  for (const rel of candidates) {
    const abs = path.join(projectDir, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
}

async function makeFittedAsset(src, dest, width, height) {
  await sharp(src)
    .rotate()
    .resize(width, height, { fit: "cover", position: "centre" })
    .flatten({ background: "#0B0F16" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);
}

async function prepareVisuals(cfg, outDir) {
  const projectDir = path.join(ROOT, cfg.project);
  const visualSpec = VISUALS[cfg.id] || {};
  const assetDir = path.join(outDir, "assets");
  fs.mkdirSync(assetDir, { recursive: true });
  const rendered = {};
  const jobs = [
    ["cover", visualSpec.cover, 1600, 1000],
    ["c3", visualSpec.c3, 1200, 900],
    ["early", visualSpec.early, 1200, 700],
    ["automation", visualSpec.automation, 1200, 700],
    ["bridge", visualSpec.bridge, 1200, 900],
    ["mid", visualSpec.mid, 1200, 900],
    ["checklist", visualSpec.checklist, 1200, 800],
  ];
  (visualSpec.layers || []).forEach((candidates, idx) => jobs.push([`layer${idx + 1}`, candidates, 900, 520]));
  for (const [key, candidates, width, height] of jobs) {
    const src = firstExisting(projectDir, candidates);
    if (!src) continue;
    const dest = path.join(assetDir, `${key}.jpg`);
    await makeFittedAsset(src, dest, width, height);
    rendered[key] = dest;
  }
  cfg.renderedImages = rendered;
  return rendered;
}

async function renderPreviews(file, outDir) {
  const { PresentationFile } = await import("@oai/artifact-tool");
  fs.mkdirSync(outDir, { recursive: true });
  for (const name of fs.readdirSync(outDir)) {
    if (/^slide_\d+\.png$/.test(name) || name === "montage.png") {
      fs.rmSync(path.join(outDir, name), { force: true });
    }
  }
  const deck = await PresentationFile.importPptx(fs.readFileSync(file));
  const previews = [];
  const thumbs = [];
  for (let i = 0; i < deck.slides.count; i += 1) {
    const slide = deck.slides.getItem(i);
    const blob = await slide.export({ format: "png" });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const out = path.join(outDir, `slide_${String(i + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(out, buffer);
    const meta = await sharp(buffer).metadata();
    const stats = await sharp(buffer).stats();
    const stdev = stats.channels.reduce((sum, channel) => sum + (channel.stdev || 0), 0);
    if (!meta.width || !meta.height || stdev < 1) {
      throw new Error(`Preview render failed or blank: ${out}`);
    }
    previews.push({ out, width: meta.width, height: meta.height, stdev: Math.round(stdev) });
    thumbs.push(await sharp(buffer).resize({ width: 420 }).png().toBuffer());
  }
  const thumbMeta = await sharp(thumbs[0]).metadata();
  const gap = 18;
  const cols = 3;
  const rows = Math.ceil(thumbs.length / cols);
  const cellW = thumbMeta.width;
  const cellH = thumbMeta.height;
  await sharp({
    create: {
      width: cols * cellW + (cols + 1) * gap,
      height: rows * cellH + (rows + 1) * gap,
      channels: 4,
      background: "#0b0f16",
    },
  })
    .composite(thumbs.map((input, idx) => ({
      input,
      left: gap + (idx % cols) * (cellW + gap),
      top: gap + Math.floor(idx / cols) * (cellH + gap),
    })))
    .png()
    .toFile(path.join(outDir, "montage.png"));
  return previews;
}

async function main() {
  const results = [];
  const comparisons = [];
  for (const cfg of decks) {
    const outDir = path.join(ROOT, cfg.project, "exports", "精简版");
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, cfg.file);
    const renderedImages = await prepareVisuals(cfg, outDir);
    const pptx = buildDeck(cfg);
    await pptx.writeFile({ fileName: out, compression: true });
    const slideCount = await countSlides(out);
    const text = await extractText(out);
    const hits = FORBIDDEN.filter((term) => text.includes(term));
    if (slideCount > 10) throw new Error(`${cfg.id} has ${slideCount} slides`);
    if (hits.length) throw new Error(`${cfg.id} forbidden terms in output: ${hits.join(", ")}`);
    const previews = await renderPreviews(out, path.join(outDir, "previews"));

    const originalDeck = findOriginalDeck(cfg);
    const originalSlides = await countSlidesInFile(originalDeck);
    const optionalSlides = originalDeck ? await selectOptionalSlides(originalDeck, cfg) : [];
    const optionalCount = optionalSlides.length;
    const finalBase = path.join(outDir, `._${cfg.id}_final_base.pptx`);
    const finalOut = path.join(outDir, cfg.file.replace(".pptx", "_最终版_核心+可选.pptx"));
    const finalPptx = buildDeck(cfg, {
      includeOptionalSeparator: true,
      optionalCount,
      originalName: originalDeck ? path.basename(originalDeck) : "",
    });
    await finalPptx.writeFile({ fileName: finalBase, compression: true });
    let appended = [];
    if (originalDeck && optionalCount > 0) {
      appended = await appendOriginalOptionalSlides(
        finalBase,
        originalDeck,
        finalOut,
        optionalSlides.map((slide) => slide.sourceSlide)
      );
    } else {
      fs.copyFileSync(finalBase, finalOut);
    }
    fs.rmSync(finalBase, { force: true });
    const finalSlideCount = await countSlides(finalOut);
    const finalPreviews = await renderPreviews(finalOut, path.join(outDir, "final_previews"));
    results.push({
      id: cfg.id,
      out,
      finalOut,
      slideCount,
      finalSlideCount,
      chars: text.length,
      images: Object.keys(renderedImages).length,
      optionalFromOriginal: appended.length,
      previews: previews.length,
      finalPreviews: finalPreviews.length,
      firstPreview: previews[0].out,
      optionalSourceSlides: optionalSlides.map((slide) => slide.sourceSlide),
    });
    comparisons.push({
      id: cfg.id,
      title: cfg.title,
      project: cfg.project,
      original: originalDeck ? path.basename(originalDeck) : "(missing)",
      originalSlides,
      coreSlides: 9,
      separatorSlides: 1,
      optionalSlides: appended.length,
      optionalSourceSlides: optionalSlides.map((slide) => slide.sourceSlide),
      optionalCategories: [...new Set(optionalSlides.flatMap((slide) => slide.categories))],
      finalSlides: finalSlideCount,
      finalOut,
    });
  }
  const reportPath = path.join(ROOT, "精简最终版对比_FINAL_CORE_OPTIONAL_COMPARISON.md");
  const report = [
    "# 精简最终版对比 FINAL CORE OPTIONAL COMPARISON",
    "",
    "本报告记录 9 个项目从原版到最终版的结构变化：前 9 页为核心对齐内容，第 10 页为 `Optional 可选阅读部分` 分隔页，后续只接原版中识别为延伸细节的页面。",
    "",
    "可选页筛选口径：商业化 / 投放 / IAP / IAA / LTV / CPI / 现金流 / KPI / 风险 / 授权 / 合规 / 细部剧情 / day-by-day / 画风 UI / 路线图等内容后置；玩法闭环、视角 3C、三层过渡、前中期过渡等核心内容保留在前 9 页。",
    "",
    "| 项目 | 原版页数 | 核心页 | 可选页 | 最终页数 | 可选原版页码 | 原版来源 | 最终输出 |",
    "|---|---:|---:|---:|---:|---|---|---|",
    ...comparisons.map((row) => `| ${row.id} · ${row.title} | ${row.originalSlides} | ${row.coreSlides} | ${row.optionalSlides} | ${row.finalSlides} | ${row.optionalSourceSlides.join(", ") || "-"} | ${row.original} | ${row.finalOut} |`),
    "",
    "说明：可选页使用原版现有 PPT 页面复制到最终版后段，保留原图、配图和原有排版；不重新生成或替换原版材料。前 9 页仍是需要研发优先对齐的核心版。",
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
