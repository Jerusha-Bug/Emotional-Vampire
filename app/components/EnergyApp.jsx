import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, RefreshCcw, ShieldCheck, Zap, Heart,
  ArrowLeft, ArrowRight, Fingerprint, Activity, 
  Sparkles, BookOpen, Timer, ListChecks, BarChart3, UserCheck, HeartPulse,
  AlertTriangle, ShieldAlert, CheckCircle2, X, Download, Lock, Unlock, Key, Eye
} from 'lucide-react';

// --- Supabase 配置 ---
const SUPABASE_URL = 'https://rfazkfbaqmrxcsudefiu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9ksrRzUpTr_nUM4cAwN0WQ_NBD-gcfN';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OPTIONS = [
  { label: "从不", value: 1 }, { label: "很少", value: 2 }, { label: "有时", value: 3 }, { label: "经常", value: 4 }, { label: "总是", value: 5 }
];

const DIMENSIONS = ["情绪倾倒", "受害叙述", "责任转移", "依赖绑定", "冲突激发", "自我消耗", "内在补能模式"];

const DIMENSION_DESCS = {
  "情绪倾倒": "这反映了对方是否将你视为单纯的情绪宣泄口。",
  "受害叙述": "这反映了对方是否通过展示弱势来博取你的同情。",
  "责任转移": "这反映了关系中责任承担的失衡。",
  "依赖绑定": "这反映了对方是否在通过‘没你不行’来捆绑你的自由。",
  "冲突激发": "这反映了互动中的摩擦频率。",
  "自我消耗": "这是最直接的生命力流失，代表你的自我认同感正在被磨损。",
  

  "内在补能模式": "这反映了你当前内在的能量储备状态，以及你是否可能在无意识地向外寻求情绪补给。"
};

const DIMENSION_SCORE_DESC = {
  "情绪倾倒": "分数越高，代表你在这段关系中承受的情绪输出越多，对方越习惯把负面情绪倾倒给你。",
  "受害叙述": "分数越高，代表对方越频繁地通过示弱、诉苦来影响你的判断，让你难以拒绝或表达自己。",
  "责任转移": "分数越高，代表你替对方承担了越多本不属于你的责任，关系中的付出严重失衡。",
  "依赖绑定": "分数越高，代表对方对你的情绪依赖越深，你的自由空间正在被这种依赖慢慢压缩。",
  "冲突激发": "分数越高，代表你们的互动中摩擦越频繁，每一次冲突都在持续消耗你的情绪资源。",
  "自我消耗": "分数越高，代表这段关系对你自我认同的磨损越严重，你越容易在其中迷失自己。",
  "内在补能模式": "分数越高，代表你当前的内在能量越匮乏。当一个人长期处于低能量状态时，会不自觉地向身边的人寻求更多情绪支持与关注——这是一种自然的心理补偿机制，不是你的错。"
};

const DIMENSION_LEVEL_DESC = {
  "情绪倾倒": {
    stable: "你在这个维度目前还算平衡，对方的情绪输出没有明显压过你。继续保持对自己感受的关注，这是健康关系的基础。",
    active: "你已经开始感受到对方情绪的重量了。有时候你可能没意识到，但那种聊完之后很累的感觉，正是情绪被倾倒的信号。",
    overload: "你几乎成了对方的专属情绪容器。每一次对话结束，你都需要消化大量不属于你的情绪，这种长期积累会让你越来越难恢复。"
  },
  "受害叙述": {
    stable: "这段关系里，对方还没有明显用我很可怜来影响你的判断。你的同情心目前是自由的，没有被绑架。",
    active: "你有时候会因为对方的遭遇而压下自己的感受。这不一定是坏事，但值得留意——你的让步，是真心的，还是被触动的？",
    overload: "对方擅长用脆弱来占据道德高地。你很难拒绝一个受害者，但这种模式正在让你失去表达自己的空间。"
  },
  "责任转移": {
    stable: "目前你们之间的责任分配还算合理，你没有明显感到这不是我的问题但我在处理的情况。",
    active: "你开始替对方承担一些本不属于你的事情了。有时候是因为你善良，有时候是因为不想起冲突，但结果都是你多付出了。",
    overload: "你已经习惯性地为对方的行为找理由、善后、道歉。这种模式很消耗人，因为你在用自己的能量填补对方不愿承担的部分。"
  },
  "依赖绑定": {
    stable: "对方目前没有表现出过度依赖你的迹象，你在这段关系里还保有自己的空间和节奏。",
    active: "你开始感觉到对方需要你的频率有点高。只有你懂我听起来像赞美，但也可能是一种无形的绑定。",
    overload: "你已经成为对方情绪系统的核心支撑。离开你，对方会陷入焦虑——而这份责任感，正在一点点压缩你的自由。"
  },
  "冲突激发": {
    stable: "你们的沟通目前比较顺畅，没有频繁的摩擦或升温。这是一个好的信号，说明你们在表达上还有空间。",
    active: "你们之间有些话题变得越来越难聊，容易擦枪走火。每次冲突消耗的不只是时间，还有你的情绪储备。",
    overload: "你们的互动模式已经很容易触发冲突。你可能发现自己在说话前会先想这样说会不会又吵起来，这种预判本身就是一种消耗。"
  },
  "自我消耗": {
    stable: "你的自我状态目前还比较稳定，这段关系还没有明显影响你对自己的看法。",
    active: "你有时候会因为这段关系而怀疑自己——是不是我太敏感了？是不是我要求太多？这些问题值得你认真对待。",
    overload: "你已经在这段关系里丢失了一部分自己。那个不断妥协、不断反思、不断压抑的你，正在付出非常真实的代价。"
  },
  "内在补能模式": {
    stable: "你的内在能量储备目前比较充足，有足够的资源去维持自己的状态，也有余力去关心身边的人。这是一个健康的信号，继续照顾好自己。",
    active: "你的内在能量有些透支了。在这种状态下，人会不自觉地向外寻求更多支持——多一点陪伴、多一点回应、多一点被需要的感觉。觉察到这一点，是很重要的第一步。",
    overload: "你目前的内在能量明显不足。当一个人长期处于匮乏状态时，可能会在不知不觉中向身边的人索取更多情绪资源。这不是你的问题，而是一个需要被关注的信号——你值得先好好照顾自己。"
  }
};

const QUESTIONS = [
  { id: 2, part: "A", dim: "情绪倾倒", text: "我需要花很多精力安抚{target}的情绪。" },
  { id: 3, part: "A", dim: "情绪倾倒", text: "{target}经常向我倾倒负面情绪。" },
  { id: 4, part: "A", dim: "情绪倾倒", text: "我需要压抑自己的真实感受去配合{target}。" },
  { id: 5, part: "A", dim: "情绪倾倒", text: "和{target}沟通让我有心理负担。" },
  { id: 6, part: "A", dim: "受害叙述", text: "我担心向{target}表达真实想法会引发冲突。" },
  { id: 7, part: "A", dim: "受害叙述", text: "我会因为{target}的态度而情绪波动很大。" },
  { id: 8, part: "A", dim: "受害叙述", text: "我经常猜测{target}是不是对我不满。" },
  { id: 9, part: "A", dim: "受害叙述", text: "我在这段关系中缺乏稳定感。" },
  { id: 11, part: "A", dim: "责任转移", text: "{target}会干涉我的决定或生活。" },
  { id: 12, part: "A", dim: "责任转移", text: "我很难拒绝{target}的请求。" },
  { id: 13, part: "A", dim: "责任转移", text: "即使不愿意，我也会答应{target}。" },
  { id: 14, part: "A", dim: "责任转移", text: "我觉得自己需要为{target}的情绪负责。" },
  { id: 16, part: "A", dim: "依赖绑定", text: "我付出的比{target}多。" },
  { id: 17, part: "A", dim: "依赖绑定", text: "{target}很少关心我的感受。" },
  { id: 19, part: "A", dim: "依赖绑定", text: "{target}只在需要时才联系我。" },
  { id: 20, part: "A", dim: "依赖绑定", text: "我很少从这段关系中获得支持。" },
  { id: 22, part: "A", dim: "冲突激发", text: "{target}会指责或否定我。" },
  { id: 23, part: "A", dim: "冲突激发", text: "冲突后通常是我先向{target}道歉。" },
  { id: 24, part: "A", dim: "冲突激发", text: "{target}会回避问题不沟通。" },
  { id: 25, part: "A", dim: "冲突激发", text: "小问题会被放大成大矛盾。" },
  { id: 27, part: "A", dim: "自我消耗", text: "你为了维持关系改变了自己。" },
  { id: 28, part: "A", dim: "自我消耗", text: "你会反复回想{target}说过的话。" },
  { id: 29, part: "A", dim: "自我消耗", text: "你在这段关系中感到内耗。" },
  { id: 30, part: "A", dim: "自我消耗", text: "你有想过疏远{target}。" },
  { id: 31, part: "B", dim: "内在补能模式", text: "我觉得周围的人大多都带着一身麻烦，需要我去关注。" },
  { id: 32, part: "B", dim: "内在补能模式", text: "我觉得自己对人生中发生的大部分事情都无能为力。" },
  { id: 33, part: "B", dim: "内在补能模式", text: "在我真正需要帮助时，身边几乎找不到可以依靠的人。" },
  { id: 34, part: "B", dim: "内在补能模式", text: "相比其他人，我总觉得自己在达成目标的过程中阻碍重重。" },
  { id: 35, part: "B", dim: "内在补能模式", text: "我认为人与人之间很难达成真正的理解，大家并不善于倾听。" },
  { id: 36, part: "B", dim: "内在补能模式", text: "我常觉得我所处环境中，别人生活得比我更艰难，我必须为此做点什么。" },
  { id: 37, part: "B", dim: "内在补能模式", text: "我在人际关系中经常遭遇背叛，或者被我信任的人伤害。" },
  { id: 38, part: "B", dim: "内在补能模式", text: "我觉得自己付出的努力，并没有得到环境应有的认可。" }
];


// --- 12个角色数据 ---
const ROLE_DATA = {
  "情感代偿者": {
    en: "Emotional Compensator",
    tag: "情绪修复 · 单向输出",
    color: "text-rose-400",
    bg: "from-rose-950/80",
    status: "轻度损耗",
    definition: "你在这段关系中承担了大量情绪修复工作。当对方低落、焦虑或崩溃时，你会本能地去安抚、理解和承担。",
    behaviors: ["经常安慰对方", "帮对方解释他的行为", "很少表达自己的需求", "害怕让关系失去稳定"],
    impact: "你的情绪能量不断输出，但回馈很少。久而久之可能出现情绪疲惫、责任过重、自我价值感下降。",
    advice: "停止自动承担别人的情绪责任。当对方情绪失控时，你可以选择不立刻修复它。",
    scene: "你总在关系里多走那一步，久了忘了原来的位置在哪。"
  },
  "情绪垃圾桶": {
    en: "Emotional Dump",
    tag: "单向倾倒 · 极度透支",
    color: "text-red-500",
    bg: "from-red-950/80",
    status: "严重损耗",
    definition: "对方习惯把所有负面情绪倒给你，但并不真正关心你的状态。",
    behaviors: ["对方只在情绪不好时找你", "聊天几乎都是他的烦恼", "你的情绪很少被关注"],
    impact: "你逐渐变成情绪容器，吸收的负面情绪越多，恢复越慢。",
    advice: "开始减少情绪接收。不是所有情绪都需要你去承接。",
    scene: "你习惯承接，但没人承接你。"
  },
  "共情透支者": {
    en: "Empathy Overload",
    tag: "过度共情 · 自我消耗",
    color: "text-fuchsia-400",
    bg: "from-fuchsia-950/80",
    status: "轻度损耗",
    definition: "你拥有很强的共情能力，但在这段关系中，这种能力被过度消耗。",
    behaviors: ["很容易理解对方", "会替对方找理由", "经常忽略自己的感受"],
    impact: "共情如果没有边界，就会变成自我消耗机制。",
    advice: "理解对方不等于为对方负责。",
    scene: "你很擅长感受别人，却越来越不知道自己在感受什么。"
  },
  "关系修复者": {
    en: "Relationship Fixer",
    tag: "主动修复 · 单方维系",
    color: "text-amber-400",
    bg: "from-amber-950/80",
    status: "明显损耗",
    definition: "每当关系出现问题，你都会试图修复它。",
    behaviors: ["主动道歉", "主动解释误会", "不希望关系破裂"],
    impact: "你在不断修复关系，但对方未必愿意改变。",
    advice: "关系是两个人的责任，而不是一个人的修复工程。",
    scene: "每次出现裂缝都是你先去补，久了开始分不清是在乎还是习惯。"
  },
  "冲突吸引者": {
    en: "Conflict Magnet",
    tag: "高频摩擦 · 能量耗散",
    color: "text-orange-500",
    bg: "from-orange-950/80",
    status: "严重损耗",
    definition: "你们的互动很容易从普通交流升级为冲突。",
    behaviors: ["小问题容易变成争吵", "对话经常带有情绪", "很难真正解决问题"],
    impact: "每一次冲突都会消耗大量情绪资源。",
    advice: "观察冲突模式，而不是只关注冲突内容。",
    scene: "你不是喜欢争吵，只是每次沟通都容易走到那一步。"
  },
  "责任承担者": {
    en: "Responsibility Carrier",
    tag: "失衡承担 · 自我怀疑",
    color: "text-yellow-400",
    bg: "from-yellow-950/80",
    status: "明显损耗",
    definition: "当关系出现问题时，你经常承担更多责任。",
    behaviors: ["经常反思是不是自己做错了", "会主动让步", "不希望事情变得更糟"],
    impact: "长期承担责任可能导致自我怀疑。",
    advice: "关系中的责任需要被公平分配。",
    scene: "你不是不累，只是不接的话会更乱。"
  },
  "依赖支柱": {
    en: "Dependency Anchor",
    tag: "情绪依赖 · 逐渐失自由",
    color: "text-blue-400",
    bg: "from-blue-950/80",
    status: "轻度损耗",
    definition: "对方在情绪上高度依赖你。",
    behaviors: ["对方经常说'只有你懂我'", "离开你他会变得很焦虑", "你成为关系的稳定中心"],
    impact: "这种依赖可能让你逐渐失去自由。",
    advice: "支持别人不等于成为对方唯一的支撑。",
    scene: "你知道TA只在需要时才来，但还是每次都在。"
  },
  "情绪守护者": {
    en: "Emotional Guardian",
    tag: "压抑表达 · 内耗积累",
    color: "text-cyan-400",
    bg: "from-cyan-950/80",
    status: "明显损耗",
    definition: "你会主动保护关系中的情绪稳定。",
    behaviors: ["避免冲突", "小心表达意见", "不想让对方难过"],
    impact: "长期压抑真实表达会产生情绪内耗。",
    advice: "健康关系允许真实表达。",
    scene: "你很擅长保护别人的情绪，却忘了自己的也需要被保护。"
  },
  "自我压缩者": {
    en: "Self-Suppressor",
    tag: "需求压缩 · 自我迷失",
    color: "text-purple-400",
    bg: "from-purple-950/80",
    status: "轻度损耗",
    definition: "为了维持关系，你不断压缩自己的需求。",
    behaviors: ["不敢表达真实想法", "经常妥协", "很少坚持自己的界限"],
    impact: "长期压抑可能导致情绪疲惫和自我迷失。",
    advice: "你的需求同样重要。",
    scene: "你把自己的需求放得很后面，以为是暂时的，后来变成了习惯。"
  },
  "关系消耗者": {
    en: "Energy Drained",
    tag: "持续消耗 · 能量黑洞",
    color: "text-slate-400",
    bg: "from-slate-800/40",
    status: "轻度损耗",
    definition: "这段关系正在持续消耗你的能量。",
    behaviors: ["互动后常感到疲惫", "需要很长时间恢复", "情绪波动明显"],
    impact: "关系本身已经成为能量黑洞。",
    advice: "观察这段关系是否仍然值得投入。",
    scene: "你说不清哪里出了问题，只是越来越不想靠近。"
  },
  "情绪循环者": {
    en: "Emotional Loop",
    tag: "重复模式 · 无解循环",
    color: "text-indigo-400",
    bg: "from-indigo-950/80",
    status: "轻度损耗",
    definition: "你们的关系不断重复同样的情绪模式。",
    behaviors: ["冲突 → 和好 → 冲突", "问题没有真正解决", "情绪循环出现"],
    impact: "这种循环会让人逐渐麻木。",
    advice: "识别模式，是打破循环的第一步。",
    scene: "好了又坏，坏了又好，你以为在修复，其实只是在重复。"
  },
  "关系清醒者": {
    en: "Awakened Observer",
    tag: "自我觉察 · 能量恢复",
    color: "text-emerald-400",
    bg: "from-emerald-950/80",
    status: "稳定",
    definition: "你已经开始意识到关系中的能量结构。",
    behaviors: ["开始观察互动模式", "不再盲目承担责任", "想要建立边界"],
    impact: "你的能量正在恢复。",
    advice: "继续保持观察与自我保护。",
    scene: "你学会了把自己放在第一位，哪怕别人不理解。"
  }
};

// 角色颜色到进度条颜色的静态映射（避免 Tailwind 动态类名失效）
const ROLE_BAR_COLOR = {
  "情感代偿者": "bg-rose-400",
  "情绪垃圾桶": "bg-red-500",
  "共情透支者": "bg-fuchsia-400",
  "关系修复者": "bg-amber-400",
  "冲突吸引者": "bg-orange-500",
  "责任承担者": "bg-yellow-400",
  "依赖支柱": "bg-blue-400",
  "情绪守护者": "bg-cyan-400",
  "自我压缩者": "bg-purple-400",
  "关系消耗者": "bg-slate-400",
  "情绪循环者": "bg-indigo-400",
  "关系清醒者": "bg-emerald-400"
};

// 维度到副机制名称的映射
const DIM_TO_ROLE = {
  "情绪倾倒": "情感代偿者",
  "受害叙述": "情绪守护者",
  "责任转移": "责任承担者",
  "依赖绑定": "依赖支柱",
  "冲突激发": "关系修复者",
  "自我消耗": "共情透支者"
};



const RadarChart = ({ data }) => {
  const size = 280; const center = size / 2; const radius = center * 0.56;
  const n = data.length;
  const angleOf = i => (Math.PI * 2 * i) / n - Math.PI / 2;

  const dataPoints = data.map((d, i) => {
    const angle = angleOf(i);
    const r = Math.max(0.08, d.value / 4) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const labelPoints = data.map((d, i) => {
    const angle = angleOf(i);
    return {
      x: center + (radius + 30) * Math.cos(angle),
      y: center + (radius + 24) * Math.sin(angle),
      name: d.name, value: d.value,
    };
  });

  const axisEndPoints = data.map((_, i) => ({
    x: center + radius * Math.cos(angleOf(i)),
    y: center + radius * Math.sin(angleOf(i)),
  }));

  // 贝塞尔曲线有机路径
  const buildOrganicPath = (pts) => {
    const len = pts.length; const tension = 0.32; let d = '';
    for (let i = 0; i < len; i++) {
      const p0 = pts[(i - 1 + len) % len];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const p3 = pts[(i + 2) % len];
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      if (i === 0) d += `M ${p1.x} ${p1.y} `;
      d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }
    return d + 'Z';
  };

  const organicPath = buildOrganicPath(dataPoints);

  const dimColors = [
    'rgba(251,113,133,', // 情绪倾倒 玫红
    'rgba(192,132,252,', // 受害叙述 紫
    'rgba(251,146,60,',  // 责任转移 橙
    'rgba(96,165,250,',  // 依赖绑定 蓝
    'rgba(34,211,238,',  // 冲突激发 青
    'rgba(52,211,153,',  // 自我消耗 绿
  ];

  return (
    <div className="flex flex-col items-center py-2">
      <style>{`
        @keyframes radarBreathe { 0%,100%{opacity:0.75} 50%{opacity:1} }
        @keyframes radarCore { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        @keyframes nodePulse0 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes nodePulse1 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes nodePulse2 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes nodePulse3 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes nodePulse4 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes nodePulse5 { 0%,100%{opacity:0.7;r:3.5} 50%{opacity:1;r:5.5} }
        @keyframes floatA { 0%,100%{transform:translate(0,0);opacity:0.4} 50%{transform:translate(3px,-4px);opacity:0.8} }
        @keyframes floatB { 0%,100%{transform:translate(0,0);opacity:0.3} 50%{transform:translate(-3px,3px);opacity:0.7} }
        @keyframes floatC { 0%,100%{transform:translate(0,0);opacity:0.35} 50%{transform:translate(4px,2px);opacity:0.75} }
        .r-shape { animation: radarBreathe 4s ease-in-out infinite; transform-origin: ${center}px ${center}px; }
        .r-core  { animation: radarCore 3s ease-in-out infinite; transform-origin: ${center}px ${center}px; }
        .rn0 { animation: nodePulse0 3.0s ease-in-out infinite; }
        .rn1 { animation: nodePulse1 3.4s ease-in-out infinite; }
        .rn2 { animation: nodePulse2 2.8s ease-in-out infinite; }
        .rn3 { animation: nodePulse3 3.6s ease-in-out infinite; }
        .rn4 { animation: nodePulse4 3.2s ease-in-out infinite; }
        .rn5 { animation: nodePulse5 2.9s ease-in-out infinite; }
        .fp-a { animation: floatA 5s ease-in-out infinite; }
        .fp-b { animation: floatB 6s ease-in-out infinite; }
        .fp-c { animation: floatC 4.5s ease-in-out infinite; }
      `}</style>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <radialGradient id="rShapeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(251,113,133,0.30)"/>
            <stop offset="45%"  stopColor="rgba(192,132,252,0.18)"/>
            <stop offset="100%" stopColor="rgba(34,211,238,0.06)"/>
          </radialGradient>
          <radialGradient id="rCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.95)"/>
            <stop offset="35%"  stopColor="rgba(251,113,133,0.70)"/>
            <stop offset="100%" stopColor="rgba(192,132,252,0.0)"/>
          </radialGradient>
          <radialGradient id="rHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(251,113,133,0.18)"/>
            <stop offset="100%" stopColor="rgba(251,113,133,0.0)"/>
          </radialGradient>
          <filter id="rBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5"/>
          </filter>
          <filter id="rBlurSoft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
        </defs>

        {/* 外层大光晕 */}
        <circle cx={center} cy={center} r={radius * 1.1}
          fill="url(#rHaloGrad)" filter="url(#rBlurSoft)" className="r-core" opacity="0.6"/>

        {/* 背景网格：极淡有机圆环 */}
        {[0.28, 0.52, 0.76, 1.0].map((lvl, i) => (
          <circle key={i} cx={center} cy={center} r={radius * lvl}
            fill="none" stroke="rgba(255,255,255,0.04)"
            strokeWidth={i === 3 ? 0.8 : 0.5}
            strokeDasharray={i % 2 === 0 ? "none" : "3 6"}/>
        ))}

        {/* 轴线：极淡射线 */}
        {axisEndPoints.map((ep, i) => (
          <line key={i} x1={center} y1={center} x2={ep.x} y2={ep.y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.6"/>
        ))}

        {/* 数据形状：模糊发光底层 */}
        <path d={organicPath} fill="url(#rShapeGrad)" filter="url(#rBlur)" className="r-shape" opacity="0.9"/>

        {/* 数据形状：清晰边线 */}
        <path d={organicPath} fill="url(#rShapeGrad)" className="r-shape"
          stroke="rgba(251,113,133,0.55)" strokeWidth="1.2" strokeLinejoin="round"/>

        {/* 漂浮粒子 */}
        {[
          {cx:center-18, cy:center-22, r:1.5, c:'rgba(251,113,133,0.7)', cls:'fp-a'},
          {cx:center+22, cy:center-14, r:1.2, c:'rgba(192,132,252,0.6)', cls:'fp-b'},
          {cx:center+16, cy:center+20, r:1.5, c:'rgba(34,211,238,0.6)',  cls:'fp-c'},
          {cx:center-20, cy:center+16, r:1.0, c:'rgba(251,146,60,0.5)',  cls:'fp-a'},
          {cx:center+5,  cy:center-28, r:1.2, c:'rgba(96,165,250,0.6)',  cls:'fp-b'},
          {cx:center-8,  cy:center+26, r:1.0, c:'rgba(52,211,153,0.5)',  cls:'fp-c'},
        ].map((p,i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
            fill={p.c} className={p.cls}
            style={{boxShadow:`0 0 6px ${p.c}`}}/>
        ))}

        {/* 维度节点：发光粒子 */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            {/* 外层光晕 */}
            <circle cx={p.x} cy={p.y} r={9}
              fill={`${dimColors[i]}0.15)`} filter="url(#rBlur)"/>
            {/* 节点主体 */}
            <circle cx={p.x} cy={p.y} r={3.5}
              fill={`${dimColors[i]}0.9)`}
              className={`rn${i}`}
              style={{filter:`drop-shadow(0 0 4px ${dimColors[i]}0.9))`}}/>
          </g>
        ))}

        {/* 中心能量核心 */}
        <circle cx={center} cy={center} r={16}
          fill="url(#rCoreGrad)" filter="url(#rBlur)" className="r-core"/>
        <circle cx={center} cy={center} r={4}
          fill="rgba(255,255,255,0.95)"
          style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.8))'}}>
          <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>

        {/* 维度标签 */}
        {labelPoints.map((p, i) => (
          <g key={i}>
            <text x={p.x} y={p.y - 2} fontSize="7.5" textAnchor="middle"
              fill={`${dimColors[i]}0.85)`} fontWeight="700" letterSpacing="0.5">
              {String(p.name)}
            </text>
            <text x={p.x} y={p.y + 9} fontSize="6.5" textAnchor="middle"
              fill="rgba(255,255,255,0.25)" fontWeight="400">
              {Math.round(p.value * 25)}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState('welcome');

  // DEV: 预览结果页，模拟高分场景
  const previewResult = () => {
    const mockAnswers = {};
    QUESTIONS.forEach(q => {
      if (q.part === 'A') {
        if (q.dim === '情绪倾倒') mockAnswers[q.id] = 5;
        else if (q.dim === '受害叙述') mockAnswers[q.id] = 4;
        else if (q.dim === '冲突激发') mockAnswers[q.id] = 4;
        else mockAnswers[q.id] = 3;
      } else {
        mockAnswers[q.id] = 4;
      }
    });
    setAnswers(mockAnswers);
    setTargetPerson('对方');
    setStep('result');
  };
  const [targetPerson, setTargetPerson] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  const finalTarget = targetPerson.trim() || 'TA';

  const navigateToNext = (currentIdx) => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (QUESTIONS[currentIdx]?.part === 'A' && (currentIdx === QUESTIONS.length - 1 || QUESTIONS[currentIdx + 1]?.part === 'B')) setStep('transition');
    else if (currentIdx < QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
    else setStep('result');
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleStartIdentity = async () => { 
     setStep('identity'); 
  };

  const handleStartQuiz = async () => {
    if (finalTarget) {
       setStep('quiz');
    }
  };

  const handleAnswer = async (val) => {
    if (isNavigating) return;
    const currentQ = QUESTIONS[currentIndex];
    if (!currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);

    if (currentIndex === QUESTIONS.length - 1) {
      const dimTotals = {};
      DIMENSIONS.forEach(dim => dimTotals[dim] = 0);
      QUESTIONS.forEach(q => {
        const score = newAnswers[q.id] || 0;
        if (dimTotals[q.dim] !== undefined) dimTotals[q.dim] += score;
      });
      try {
        await supabase.from('test_results').insert([{ 
          relation_type: finalTarget,
          dim_dumping: dimTotals["情绪倾倒"] / 5,
          dim_narrative: dimTotals["受害叙述"] / 5,
          dim_transfer: dimTotals["责任转移"] / 5,
          dim_binding: dimTotals["依赖绑定"] / 5,
          dim_conflict: dimTotals["冲突激发"] / 5,
          dim_consumption: dimTotals["自我消耗"] / 5,
          final_score: Object.values(newAnswers).reduce((a, b) => a + b, 0)
        }]);
      } catch (e) { console.error("Sync Error:", e); }
    }
    setTimeout(() => { navigateToNext(currentIndex); }, 300);
  };

  const resultData = useMemo(() => {
    if (step !== 'result') return null;
    let scoreA = 0; let scoreB = 0; const dimScores = {};
    DIMENSIONS.forEach(dim => dimScores[dim] = 0);
    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 0;
      if (q.part === 'A') { scoreA += val; dimScores[q.dim] += val; }
      else { scoreB += val; dimScores[q.dim] += val; }
    });

    const radarData = DIMENSIONS.slice(0, 6).map(key => ({ name: key, value: dimScores[key] / 5 }));

    // 外部6个维度排序
    const extDims = DIMENSIONS.slice(0, 6);
    const sorted = [...extDims].sort((a, b) => dimScores[b] - dimScores[a]);
    const topDim = sorted[0];
    const secondDim = sorted[1];
    const topScore = dimScores[topDim];
    const secondScore = dimScores[secondDim];

    // 主角色判断逻辑
    // gap：最高维度与第二高维度的差值，差距不显著时用综合逻辑
    const gap = topScore - secondScore;
    const dominated = gap >= 3; // 至少差3分才算"显著领先"

    let roleName;
    if (scoreA <= 44 && scoreB <= 16) {
      roleName = "关系清醒者";

    } else if (dominated && topDim === "情绪倾倒" && topScore >= 16) {
      roleName = "情绪垃圾桶";
    } else if (dominated && topDim === "情绪倾倒") {
      roleName = "情感代偿者";
    } else if (dominated && topDim === "自我消耗" && scoreB > 27) {
      roleName = "共情透支者";
    } else if (dominated && topDim === "自我消耗") {
      roleName = "自我压缩者";
    } else if (dominated && topDim === "冲突激发" && topScore >= 16) {
      roleName = "冲突吸引者";
    } else if (dominated && topDim === "冲突激发" && dimScores["情绪倾倒"] >= 10) {
      roleName = "情绪循环者";
    } else if (dominated && topDim === "冲突激发") {
      roleName = "关系修复者";
    } else if (dominated && topDim === "责任转移" && dimScores["自我消耗"] >= 8) {
      roleName = "自我压缩者";
    } else if (dominated && topDim === "责任转移") {
      roleName = "责任承担者";
    } else if (dominated && topDim === "依赖绑定") {
      roleName = "依赖支柱";
    } else if (dominated && topDim === "受害叙述") {
      roleName = "情绪守护者";

    } else {
      // 差距不显著时，用综合得分最高的两个维度组合判断
      const top2 = sorted.slice(0, 2).map(d => d);
      const avgScore = scoreA / 6; // 平均分

      if (dimScores["自我消耗"] >= avgScore && scoreB > 24) {
        roleName = "共情透支者";
      } else if (dimScores["冲突激发"] >= avgScore && dimScores["情绪倾倒"] >= avgScore) {
        roleName = "情绪循环者";
      } else if (dimScores["责任转移"] >= avgScore && dimScores["自我消耗"] >= avgScore) {
        roleName = "自我压缩者";
      } else if (dimScores["情绪倾倒"] >= avgScore && dimScores["受害叙述"] >= avgScore) {
        roleName = "情感代偿者";
      } else if (dimScores["依赖绑定"] >= avgScore) {
        roleName = "依赖支柱";
      } else if (dimScores["冲突激发"] >= avgScore) {
        roleName = "关系修复者";
      } else if (scoreA >= 80) {
        // 整体高分但无明显维度主导 → 全面消耗型
        roleName = "情绪垃圾桶";
      } else {
        roleName = "关系消耗者";
      }
    }

    // 副机制判断：第二高维度 >= 10分，且对应角色不同于主角色
    const secondRoleName = DIM_TO_ROLE[secondDim];
    const subRole = (secondScore >= 10 && secondRoleName !== roleName)
      ? { name: secondRoleName, dim: secondDim, score: secondScore, ...ROLE_DATA[secondRoleName] }
      : null;

    const role = ROLE_DATA[roleName];
    return { ...role, roleName, subRole, scoreA, scoreB, radarData, dimScores, topDim };
  }, [step, answers]);


  // --- [1] 首页 ---
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#080608] text-white flex flex-col font-sans overflow-hidden relative">
        <style>{`
          @keyframes drift1 {
            0%,100% { transform: translate(0,0) scale(1); border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
            33% { transform: translate(18px,-22px) scale(1.04); border-radius: 40% 60% 30% 70% / 60% 40% 70% 50%; }
            66% { transform: translate(-12px,14px) scale(0.97); border-radius: 70% 30% 60% 40% / 40% 70% 50% 60%; }
          }
          @keyframes drift2 {
            0%,100% { transform: translate(0,0) scale(1); border-radius: 40% 60% 50% 50% / 60% 40% 60% 40%; }
            33% { transform: translate(-20px,16px) scale(1.06); border-radius: 60% 40% 40% 60% / 40% 60% 50% 50%; }
            66% { transform: translate(10px,-20px) scale(0.95); border-radius: 50% 50% 60% 40% / 50% 50% 40% 60%; }
          }
          @keyframes drift3 {
            0%,100% { transform: translate(0,0) scale(1); border-radius: 50% 50% 40% 60% / 40% 60% 50% 50%; }
            50% { transform: translate(14px,18px) scale(1.08); border-radius: 30% 70% 60% 40% / 60% 30% 70% 40%; }
          }
          @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0.6; }
            100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
          }
          @keyframes blobPulse {
            0%,100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.06); opacity: 1; }
          }
          .fluid1 { animation: drift1 12s ease-in-out infinite; }
          .fluid2 { animation: drift2 16s ease-in-out infinite; }
          .fluid3 { animation: drift3 20s ease-in-out infinite; }
          .particle { animation: floatUp linear infinite; }
          .blob-btn { animation: blobPulse 3s ease-in-out infinite; }
        `}</style>

        {/* 背景流体层 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 主流体 - 深红 */}
          <div className="fluid1 absolute top-[-15%] left-[-20%] w-[80%] h-[70%] opacity-[0.18]"
            style={{background: 'radial-gradient(ellipse, #7f1d1d 0%, #450a0a 60%, transparent 100%)'}} />
          {/* 副流体 - 深紫 */}
          <div className="fluid2 absolute bottom-[-20%] right-[-15%] w-[70%] h-[65%] opacity-[0.20]"
            style={{background: 'radial-gradient(ellipse, #581c87 0%, #2e1065 60%, transparent 100%)'}} />
          {/* 点缀流体 - 深青 */}
          <div className="fluid3 absolute top-[30%] right-[-10%] w-[45%] h-[40%] opacity-[0.12]"
            style={{background: 'radial-gradient(ellipse, #164e63 0%, #0c2a32 60%, transparent 100%)'}} />

          {/* SVG 流线装饰 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 390 844" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M-20 200 C 80 180, 150 280, 200 240 S 320 160, 420 200" stroke="white" strokeWidth="1" fill="none"/>
            <path d="M-20 380 C 60 340, 180 420, 250 380 S 360 300, 430 360" stroke="white" strokeWidth="0.8" fill="none"/>
            <path d="M50 600 C 120 560, 200 640, 300 580 S 380 520, 450 560" stroke="white" strokeWidth="0.6" fill="none"/>
            <path d="M100 700 C 160 660, 240 730, 320 690" stroke="white" strokeWidth="0.5" fill="none"/>
          </svg>

          {/* 漂浮粒子 */}
          {[
            {left:'15%', delay:'0s', dur:'6s', size:3, top:'75%'},
            {left:'28%', delay:'1.5s', dur:'8s', size:2, top:'80%'},
            {left:'45%', delay:'0.8s', dur:'7s', size:4, top:'70%'},
            {left:'62%', delay:'2.2s', dur:'9s', size:2, top:'85%'},
            {left:'75%', delay:'0.3s', dur:'6.5s', size:3, top:'78%'},
            {left:'88%', delay:'3s', dur:'7.5s', size:2, top:'72%'},
            {left:'8%', delay:'4s', dur:'8s', size:2, top:'65%'},
            {left:'52%', delay:'5s', dur:'6s', size:3, top:'90%'},
          ].map((p, i) => (
            <div key={i} className="particle absolute rounded-full"
              style={{
                left: p.left, top: p.top,
                width: p.size, height: p.size,
                background: i % 3 === 0 ? 'rgba(251,113,133,0.7)' : i % 3 === 1 ? 'rgba(167,139,250,0.6)' : 'rgba(103,232,249,0.5)',
                animationDelay: p.delay, animationDuration: p.dur,
                boxShadow: `0 0 ${p.size*3}px currentColor`
              }} />
          ))}
        </div>

        {/* 内容层 */}
        <div className="relative z-10 flex flex-col min-h-screen px-8">
          {/* 上方占位 */}
          <div className="flex-[1.2]" />

          {/* 标题区 - 无容器，直接浮在背景上 */}
          <div className="flex flex-col items-center text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-rose-300/50 mb-6">
              流失追踪 · 能量损耗分析
            </p>
            <h1 className="text-[2.6rem] font-bold leading-[1.1] mb-5"
              style={{letterSpacing: '-0.02em', textShadow: '0 0 60px rgba(244,63,94,0.2)'}}>
              关系能量与<br/>心理防御
            </h1>
            <p className="text-white/30 text-sm leading-relaxed max-w-[220px]">
              这段关系，正在消耗你吗？<br/>你是在被消耗，还是正在索取？
            </p>
          </div>

          <div className="flex-[1.5]" />

          {/* 按钮区 */}
          <div className="flex flex-col items-center mb-16 gap-5">
            {/* 主按钮 - 圆角矩形 */}
            <button onClick={handleStartIdentity}
              className="w-full max-w-xs py-5 text-white font-bold text-lg tracking-wide active:scale-95 transition-all rounded-[2rem]"
              style={{
                background: 'linear-gradient(135deg, rgba(127,29,29,0.9), rgba(159,18,57,0.95))',
                boxShadow: '0 0 40px rgba(159,18,57,0.35), 0 0 80px rgba(159,18,57,0.12)',
                border: '1px solid rgba(251,113,133,0.18)',
              }}>
              <span style={{textShadow: '0 0 20px rgba(255,255,255,0.25)'}}>开启测评</span>
            </button>

            {/* 理论来源 - 极淡浮动文字，无卡片 */}
            <p className="text-white/15 text-[10px] text-center leading-relaxed max-w-[240px]">
              基于 Stéphane Clerget 情绪劳动理论<br/>及关系动力学理论
            </p>

            <button onClick={previewResult} className="text-white/15 text-[9px] font-bold tracking-widest hover:text-white/30 transition-colors">
              DEV · 预览结果页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- [2] Identity Step ---
  if (step === 'identity') {
    return (
      <div className="min-h-screen bg-[#0d0a0e] text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
        <div className="w-20 h-20 bg-rose-900/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
           <Heart className="w-10 h-10 text-rose-500 animate-pulse" fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter text-center">锁定分析对象</h2>
        <p className="text-white/35 text-sm mb-12 text-center">告诉我们，你最想扫描哪段互动的能量流失？</p>
        
        <div className="w-full max-w-sm space-y-6">
          <div className="relative">
             <input 
               autoFocus
               type="text" 
               placeholder="例如：妈妈 / 爱人 / 同事" 
               className="w-full bg-white/5 border border-white/10 p-6 rounded-[2.2rem] text-lg text-center focus:outline-none focus:border-rose-500/30 transition-all placeholder:text-white/15" 
               value={targetPerson} 
               onChange={(e) => setTargetPerson(e.target.value)} 
             />
          </div>
          
          <button 
            disabled={!targetPerson.trim()}
            onClick={handleStartQuiz} 
            className={`w-full py-5 rounded-[2.2rem] font-black text-lg transition-all flex items-center justify-center gap-2 ${targetPerson.trim() ? 'bg-rose-900/80 text-white shadow-xl shadow-rose-900/20 active:scale-95' : 'bg-[#120e13] text-slate-700 cursor-not-allowed border border-white/5'}`}
          >
             进入扫描仪式 →
          </button>
          
          <button onClick={() => setStep('welcome')} className="w-full text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">返回首页</button>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = QUESTIONS[currentIndex]; if (!q) return null;
    const currentVal = answers[q.id]; const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    const isPartB = q.part === 'B';
    const bgColor1 = isPartB ? '#0c1a2e' : '#120608';
    const bgColor2 = isPartB ? '#0a1628' : '#0d0408';
    const fluidColor1 = isPartB ? 'rgba(14,116,144,0.25)' : 'rgba(127,29,29,0.25)';
    const fluidColor2 = isPartB ? 'rgba(30,58,138,0.20)' : 'rgba(88,28,135,0.18)';
    return (
      <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden relative"
        style={{background: `linear-gradient(160deg, ${bgColor1} 0%, ${bgColor2} 100%)`}}>

        {/* 背景流体 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="fluid1 absolute top-[-30%] right-[-20%] w-[70%] h-[60%] opacity-80 blur-[80px] rounded-full"
            style={{background: `radial-gradient(ellipse, ${fluidColor1} 0%, transparent 70%)`}} />
          <div className="fluid2 absolute bottom-[-10%] left-[-15%] w-[60%] h-[50%] opacity-80 blur-[100px] rounded-full"
            style={{background: `radial-gradient(ellipse, ${fluidColor2} 0%, transparent 70%)`}} />
          {/* 细线装饰 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 390 844" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M0 300 C 100 260, 200 340, 390 280" stroke="white" strokeWidth="0.8" fill="none"/>
            <path d="M0 500 C 120 460, 250 540, 390 480" stroke="white" strokeWidth="0.6" fill="none"/>
          </svg>
          {/* 漂浮粒子 */}
          {[
            {left:'10%',top:'80%',delay:'0s',dur:'7s',size:2,c:'rgba(251,113,133,0.5)'},
            {left:'30%',top:'85%',delay:'2s',dur:'9s',size:3,c:'rgba(167,139,250,0.4)'},
            {left:'55%',top:'75%',delay:'1s',dur:'6s',size:2,c:'rgba(103,232,249,0.4)'},
            {left:'75%',top:'88%',delay:'3s',dur:'8s',size:2,c:'rgba(251,113,133,0.4)'},
            {left:'88%',top:'70%',delay:'0.5s',dur:'7s',size:3,c:'rgba(167,139,250,0.5)'},
          ].map((p,i) => (
            <div key={i} className="particle absolute rounded-full"
              style={{left:p.left,top:p.top,width:p.size,height:p.size,background:p.c,
                animationDelay:p.delay,animationDuration:p.dur,
                boxShadow:`0 0 ${p.size*4}px ${p.c}`}} />
          ))}
        </div>

        {/* 顶部进度区 */}
        <div className="relative z-10 px-6 pt-8 pb-4 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold" style={{color:'rgba(255,255,255,0.25)'}}>
              <span style={{color: isPartB ? 'rgba(103,232,249,0.6)' : 'rgba(251,113,133,0.6)'}}>{currentIndex + 1}</span>
              <span> / {QUESTIONS.length}</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{color: isPartB ? 'rgba(103,232,249,0.4)' : 'rgba(251,113,133,0.4)'}}>
              PART {String(q.part)}
            </span>
          </div>
          {/* 有机进度条 */}
          <div className="w-full h-[3px] rounded-full overflow-hidden mb-6" style={{background:'rgba(255,255,255,0.06)'}}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width:`${progress}%`,
                background: isPartB
                  ? 'linear-gradient(90deg, rgba(14,116,144,0.8), rgba(103,232,249,0.9))'
                  : 'linear-gradient(90deg, rgba(127,29,29,0.8), rgba(251,113,133,0.9))',
                boxShadow: isPartB ? '0 0 12px rgba(103,232,249,0.4)' : '0 0 12px rgba(251,113,133,0.3)'
              }} />
          </div>
          {/* 维度标签 */}
          <p className="text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{color: isPartB ? 'rgba(103,232,249,0.35)' : 'rgba(251,113,133,0.35)'}}>
            {String(q.dim)}
          </p>
        </div>

        {/* 题目文字区 - 固定在中上方，不随选项动 */}
        <div className="relative z-10 px-8 max-w-md mx-auto w-full mt-2 mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] mb-5 block"
              style={{color:'rgba(255,255,255,0.12)', fontFamily:'monospace'}}>
              Q{String(currentIndex+1).padStart(2,'0')}
            </span>
            <h2 className="text-[1.65rem] font-bold leading-[1.4] text-white/90"
              style={{textShadow:'0 0 40px rgba(255,255,255,0.05)'}}>
              {String(q.text).replace('{target}', finalTarget)}
            </h2>
        </div>

        {/* 选项 - 发光粒子气泡，固定在下方 */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-8 max-w-md mx-auto w-full">
          <div>
            {/* 选项 */}
            <div className="flex justify-between items-end gap-1 mb-10">
              {OPTIONS.map((opt, i) => {
                const isSelected = currentVal === opt.value;
                const glowColor = isPartB ? 'rgba(103,232,249,' : 'rgba(251,113,133,';
                return (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                    className={`flex flex-col items-center gap-2 flex-1 group transition-all duration-300`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}
                      style={{
                        background: isSelected
                          ? `radial-gradient(ellipse, ${glowColor}0.5) 0%, ${glowColor}0.15) 100%)`
                          : 'rgba(255,255,255,0.04)',
                        border: isSelected
                          ? `1px solid ${glowColor}0.6)`
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isSelected
                          ? `0 0 20px ${glowColor}0.4), 0 0 40px ${glowColor}0.15)`
                          : 'none',
                      }}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full"
                          style={{background: glowColor+'0.9)', boxShadow:`0 0 8px ${glowColor}1)`}} />
                      )}
                    </div>
                    <span className="text-[9px] font-bold tracking-tight"
                      style={{color: isSelected ? (isPartB ? 'rgba(103,232,249,0.8)' : 'rgba(251,113,133,0.8)') : 'rgba(255,255,255,0.2)'}}>
                      {String(opt.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="relative z-10 flex gap-3 px-6 pb-10 max-w-md mx-auto w-full">
          <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'active:scale-90'}`}
            style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}>
            <ArrowLeft className="w-5 h-5 text-white/40" />
          </button>
          <button onClick={() => currentVal && navigateToNext(currentIndex)}
            disabled={!currentVal}
            className="flex-1 h-14 rounded-full font-bold text-base transition-all active:scale-95"
            style={{
              background: !currentVal
                ? 'rgba(255,255,255,0.04)'
                : isPartB
                  ? 'linear-gradient(135deg, rgba(14,116,144,0.8), rgba(8,145,178,0.9))'
                  : 'linear-gradient(135deg, rgba(127,29,29,0.85), rgba(159,18,57,0.9))',
              border: !currentVal
                ? '1px solid rgba(255,255,255,0.06)'
                : isPartB ? '1px solid rgba(103,232,249,0.2)' : '1px solid rgba(251,113,133,0.2)',
              color: !currentVal ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
              boxShadow: currentVal ? (isPartB ? '0 0 30px rgba(14,116,144,0.3)' : '0 0 30px rgba(127,29,29,0.4)') : 'none'
            }}>
            {currentIndex === QUESTIONS.length - 1 ? '完成分析' : '下一题'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'transition') return (
    <div className="min-h-screen bg-[#080608] text-white flex flex-col items-center justify-center p-12 text-center font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="fluid1 absolute top-[-20%] left-[-20%] w-[80%] h-[80%] opacity-[0.15] blur-[100px] rounded-full"
          style={{background:'radial-gradient(ellipse, #7f1d1d 0%, transparent 70%)'}} />
        <div className="fluid3 absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] opacity-[0.12] blur-[100px] rounded-full"
          style={{background:'radial-gradient(ellipse, #164e63 0%, transparent 70%)'}} />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full mb-10 flex items-center justify-center"
          style={{background:'radial-gradient(ellipse, rgba(8,145,178,0.4) 0%, transparent 70%)',
            boxShadow:'0 0 40px rgba(8,145,178,0.25)', border:'1px solid rgba(103,232,249,0.2)'}}>
          <Fingerprint className="w-7 h-7" style={{color:'rgba(103,232,249,0.7)'}} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4">PART A 完成</p>
        <h2 className="text-2xl font-bold mb-4 text-white/90" style={{letterSpacing:'-0.02em'}}>关系损耗扫描完成</h2>
        <p className="text-white/30 text-sm mb-14 leading-relaxed max-w-[240px]">
          接下来扫描你当前的<br/>
          <span style={{color:'rgba(103,232,249,0.6)'}}>内在能量补给状态</span>
        </p>
        <button onClick={() => { setStep('quiz'); setCurrentIndex(QUESTIONS.findIndex(q => q.part === 'B')); }}
          className="w-full max-w-xs py-5 font-bold text-base active:scale-95 transition-all rounded-[2rem]"
          style={{
            background:'linear-gradient(135deg, rgba(8,145,178,0.7), rgba(14,116,144,0.8))',
            border:'1px solid rgba(103,232,249,0.18)',
            boxShadow:'0 0 40px rgba(8,145,178,0.22)',
            color:'rgba(255,255,255,0.88)'
          }}>
          继续内在扫描
        </button>
      </div>
    </div>
  );

  if (step === 'result' && resultData) {
    const { roleName, color, bg, status, tag, definition, scene, behaviors, impact, advice, scoreA, radarData, dimScores, subRole } = resultData;

    // 海报弹窗
    if (showPoster) return (
      <div className={`min-h-screen bg-gradient-to-b ${bg} via-slate-950 to-black flex items-center justify-center p-6 font-sans`}>
        <div className="w-full max-w-[340px]">
          <div className="bg-black/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col items-center text-center relative">
            {/* close btn 卡片内右上角 top-6 right-6 */}
            <button onClick={() => setShowPoster(false)} className="absolute top-6 right-6 z-10 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/10"><X className="w-3.5 h-3.5"/></button>
            {/* 顶部 badge */}
            <div className="pt-8 pb-4 px-8 flex flex-col items-center">
              <div className={`px-3 py-1 rounded-full border border-white/10 bg-black/20 ${color} text-[8px] font-black uppercase tracking-widest mb-5`}>{String(status)}</div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">关系能量分析</p>
              <h2 className="text-3xl font-black tracking-tighter text-white leading-tight mb-1">{String(roleName)}</h2>
              <p className={`text-[9px] font-black mb-6 ${color}`}>{String(tag)}</p>
            </div>
            {/* 关系图形区域 placeholder */}
            <div className="w-full px-8 mb-6">
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 h-44 flex items-center justify-center">
                <p className="text-white/20 text-[10px] font-bold">关系图形</p>
              </div>
            </div>
            {/* 角色定义 */}
            <div className="px-8 pb-8 w-full">
              <div className="relative pl-3 border-l-2 border-white/20 text-left">
                <p className="text-white/60 text-xs leading-relaxed">{String(definition)}</p>
              </div>
              <p className="text-white/15 text-[9px] font-medium tracking-[0.2em] flex items-center justify-center gap-2 mt-6"><Download className="w-2.5 h-2.5 opacity-50"/> 截图保存你的报告</p>
            </div>
          </div>
        </div>
      </div>
    );

    // 从 color class 提取实际颜色值用于 inline style
    const roleColorMap = {
      'text-rose-400': 'rgba(251,113,133,', 'text-red-500': 'rgba(239,68,68,',
      'text-fuchsia-400': 'rgba(232,121,249,', 'text-purple-400': 'rgba(192,132,252,',
      'text-orange-500': 'rgba(249,115,22,', 'text-indigo-400': 'rgba(129,140,248,',
      'text-amber-400': 'rgba(251,191,36,', 'text-yellow-400': 'rgba(250,204,21,',
      'text-blue-400': 'rgba(96,165,250,', 'text-cyan-400': 'rgba(34,211,238,',
      'text-emerald-400': 'rgba(52,211,153,', 'text-slate-400': 'rgba(148,163,184,',
    };
    const rc = roleColorMap[color] || 'rgba(251,113,133,';

    // 每个角色的对比色（第二流体）让背景色彩更丰富有辨识度
    const roleAccentMap = {
      'text-rose-400':    'rgba(88,28,135,0.22)',    // 紫
      'text-red-500':     'rgba(30,58,138,0.20)',    // 深蓝
      'text-fuchsia-400': 'rgba(127,29,29,0.20)',    // 深红
      'text-purple-400':  'rgba(14,116,144,0.18)',   // 青
      'text-orange-500':  'rgba(88,28,135,0.20)',    // 紫
      'text-indigo-400':  'rgba(6,78,59,0.22)',      // 深绿
      'text-amber-400':   'rgba(127,29,29,0.18)',    // 深红
      'text-yellow-400':  'rgba(14,116,144,0.16)',   // 青
      'text-blue-400':    'rgba(6,78,59,0.20)',      // 深绿
      'text-cyan-400':    'rgba(30,58,138,0.22)',    // 深蓝
      'text-emerald-400': 'rgba(14,116,144,0.20)',   // 青绿
      'text-slate-400':   'rgba(88,28,135,0.18)',    // 紫
    };
    const rc2 = roleAccentMap[color] || 'rgba(88,28,135,0.18)';

    // 页面底色也跟角色走，极深但有色温差异
    const roleBgBase = {
      'text-rose-400':    '#0e0608', 'text-red-500':     '#0d0508',
      'text-fuchsia-400': '#0d060e', 'text-purple-400':  '#08060e',
      'text-orange-500':  '#0e0906', 'text-indigo-400':  '#06080e',
      'text-amber-400':   '#0e0b04', 'text-yellow-400':  '#0c0b04',
      'text-blue-400':    '#05080e', 'text-cyan-400':    '#04090e',
      'text-emerald-400': '#04090a', 'text-slate-400':   '#070809',
    };
    const pageBg = roleBgBase[color] || '#080608';

    return (
      <div className="min-h-screen text-white font-sans relative overflow-x-hidden"
        style={{background: pageBg}}>

        {/* 全局背景流体 - 跟随角色色 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
          <div className="fluid1 absolute top-[-10%] left-[-20%] w-[90%] h-[60%] blur-[120px]"
            style={{background:`radial-gradient(ellipse, ${rc}0.22) 0%, transparent 70%)`}} />
          <div className="fluid2 absolute bottom-[10%] right-[-20%] w-[70%] h-[50%] blur-[100px]"
            style={{background:`radial-gradient(ellipse, ${rc2} 0%, transparent 70%)`}} />
          <div className="fluid3 absolute top-[40%] left-[20%] w-[60%] h-[40%] blur-[130px]"
            style={{background:`radial-gradient(ellipse, ${rc}0.08) 0%, transparent 70%)`}} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" viewBox="0 0 390 844" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M-20 150 C 100 120, 200 200, 420 140" stroke="white" strokeWidth="0.8" fill="none"/>
            <path d="M-20 400 C 80 360, 220 440, 420 380" stroke="white" strokeWidth="0.6" fill="none"/>
            <path d="M-20 650 C 120 610, 260 680, 420 620" stroke="white" strokeWidth="0.5" fill="none"/>
          </svg>
          {[
            {l:'8%',t:'20%',d:'0s',dur:'8s',s:2,c:rc},
            {l:'25%',t:'40%',d:'3s',dur:'10s',s:3,c:'rgba(192,132,252,'},
            {l:'70%',t:'15%',d:'1s',dur:'7s',s:2,c:'rgba(34,211,238,'},
            {l:'85%',t:'50%',d:'4s',dur:'9s',s:2,c:rc},
            {l:'45%',t:'70%',d:'2s',dur:'8s',s:3,c:'rgba(192,132,252,'},
          ].map((p,i) => (
            <div key={i} className="particle absolute rounded-full"
              style={{left:p.l,top:p.t,width:p.s,height:p.s,
                background:`${p.c}0.6)`,animationDelay:p.d,animationDuration:p.dur,
                boxShadow:`0 0 ${p.s*5}px ${p.c}0.8)`}} />
          ))}
        </div>

        <div className="relative max-w-md mx-auto px-5 py-12" style={{zIndex:1}}>

          {/* ① 主角色 - 无容器，直接浮在背景上 */}
          <section className="text-center mb-16 pt-4">
            <p className="text-[9px] uppercase tracking-[0.4em] mb-4"
              style={{color:`${rc}0.5)`}}>{String(status)}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{color:'rgba(255,255,255,0.2)'}}>关系能量分析</p>
            <h2 className="text-[2.4rem] font-bold mb-3 leading-none"
              style={{letterSpacing:'-0.03em', textShadow:`0 0 80px ${rc}0.35)`}}>
              {String(roleName)}
            </h2>
            <p className="text-sm font-bold mb-8" style={{color:`${rc}0.8)`}}>{String(tag)}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-[280px] mx-auto">{String(definition)}</p>
            {scene && (
              <p className="text-sm font-bold italic leading-relaxed max-w-[260px] mx-auto"
                style={{color:`${rc}0.65)`}}>"{String(scene)}"</p>
            )}

            {/* 副机制 - 轻量浮动，无硬边框 */}
            {subRole && (
              <div className="mt-8 w-full py-4 px-5 text-left"
                style={{background:`${rc}0.06)`, borderRadius:'20px', border:`1px solid ${rc}0.12)`}}>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{color:'rgba(255,255,255,0.35)'}}>副机制</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{color:`${rc}0.85)`}}>{String(subRole.name)}</span>
                  <span className="text-[9px]" style={{color:'rgba(255,255,255,0.25)'}}>· {String(subRole.dim)}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.4)'}}>{String(subRole.definition)}</p>
              </div>
            )}
          </section>

          {/* ② 插画占位区 */}
          <section className="mb-12">
            <div className="relative h-52 flex items-center justify-center"
              style={{background:`radial-gradient(ellipse at center, ${rc}0.08) 0%, transparent 70%)`}}>
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{color:'rgba(255,255,255,0.12)'}}>关系互动模式</p>
              {/* 装饰线条 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 208" fill="none">
                <ellipse cx="170" cy="104" rx="100" ry="60" stroke={`${rc}0.12)`} strokeWidth="0.8" strokeDasharray="4 6"/>
                <ellipse cx="170" cy="104" rx="140" ry="85" stroke={`${rc}0.06)`} strokeWidth="0.6" strokeDasharray="3 8"/>
              </svg>
            </div>
          </section>

          {/* ③ 常见互动 + 消耗 - 软边框卡片 */}
          <section className="mb-4"
            style={{background:'rgba(255,255,255,0.03)', borderRadius:'24px', border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="p-6 pb-5" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{color:'rgba(255,255,255,0.45)'}}>常见互动表现</p>
              <div className="space-y-3">
                {behaviors.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{background:`${rc}0.6)`, boxShadow:`0 0 6px ${rc}0.8)`}} />
                    <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.55)'}}>{String(b)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{color:'rgba(255,255,255,0.45)'}}>能量消耗</p>
              <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.55)'}}>{String(impact)}</p>
            </div>
          </section>

          {/* ④ Part A 维度分析 */}
          <section className="mb-4"
            style={{background:'rgba(255,255,255,0.03)', borderRadius:'24px', border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="p-6 pb-4" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{color:'rgba(255,255,255,0.5)'}}>A · 外部能量损耗</p>
              <div className="flex items-center justify-between mt-3 mb-1">
                <span className="text-[10px] uppercase tracking-widest" style={{color:'rgba(255,255,255,0.2)'}}>关系消耗程度</span>
                <span className="text-[10px] font-bold" style={{color:`${rc}0.8)`}}>{Math.round((scoreA/120)*100)}%</span>
              </div>
              <div className="w-full h-[2px] rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${Math.round((scoreA/120)*100)}%`,
                    background:`linear-gradient(90deg, ${rc}0.5), ${rc}0.9))`,
                    boxShadow:`0 0 10px ${rc}0.4)`}} />
              </div>
            </div>
            <div className="p-4">
              <RadarChart data={radarData} />
            </div>
            {/* 维度卡片 - 更轻薄 */}
            <div className="px-4 pb-5 space-y-2">
              {DIMENSIONS.slice(0,6).map((dim, idx) => {
                const maxVal=25, score=dimScores[dim]||0, ratio=score/maxVal;
                let stateLabel="平稳", stateColor='rgba(52,211,153,0.7)', levelKey="stable";
                if (ratio>0.75){stateLabel="过载";stateColor=`${rc}0.8)`;levelKey="overload";}
                else if(ratio>0.5){stateLabel="活跃";stateColor='rgba(251,146,60,0.8)';levelKey="active";}
                const levelDesc=DIMENSION_LEVEL_DESC[dim]?.[levelKey]||"";
                const scoreDesc=DIMENSION_SCORE_DESC[dim]||"";
                return (
                  <div key={idx} className="p-4"
                    style={{background:'rgba(255,255,255,0.025)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.04)'}}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] tabular-nums" style={{color:'rgba(255,255,255,0.2)'}}>0{idx+1}</span>
                        <span className="text-sm font-bold" style={{color:'rgba(255,255,255,0.75)'}}>{String(dim)}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{color:stateColor, background:`${stateColor.replace('0.7)','0.1)').replace('0.8)','0.1)')}`, border:`1px solid ${stateColor.replace('0.7)','0.2)').replace('0.8)','0.2)')}`}}>
                          {stateLabel}
                        </span>
                      </div>
                      <span className="text-[10px] tabular-nums" style={{color:'rgba(255,255,255,0.3)'}}>{score}/{maxVal}</span>
                    </div>
                    <div className="w-full h-[2px] rounded-full mb-3 overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{width:`${ratio*100}%`, background:`${rc}0.7)`, boxShadow:`0 0 8px ${rc}0.4)`}} />
                    </div>
                    <p className="text-xs mb-1 leading-relaxed" style={{color:'rgba(255,255,255,0.35)'}}>{String(DIMENSION_DESCS[dim])}</p>
                    <p className="text-[10px] mb-3 leading-relaxed" style={{color:'rgba(255,255,255,0.2)'}}>{scoreDesc}</p>
                    <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.6)'}}>{levelDesc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ⑤ Part B */}
          {(() => {
            const dim=DIMENSIONS[6], maxVal=40, score=dimScores[dim]||0, ratio=score/maxVal;
            let stateLabel="平稳", stateColor='rgba(52,211,153,0.7)', levelKey="stable";
            if(ratio>0.75){stateLabel="需关注";stateColor=`${rc}0.8)`;levelKey="overload";}
            else if(ratio>0.5){stateLabel="活跃";stateColor='rgba(251,146,60,0.8)';levelKey="active";}
            const levelDesc=DIMENSION_LEVEL_DESC[dim]?.[levelKey]||"";
            const scoreDesc=DIMENSION_SCORE_DESC[dim]||"";
            return (
              <section className="mb-4 relative overflow-hidden"
                style={{background:`${rc}0.03)`, borderRadius:'24px', border:`1px solid ${rc}0.2)`, boxShadow:`inset 0 0 40px ${rc}0.05)`}}>
                <Fingerprint className="absolute top-2 right-2 pointer-events-none"
                  style={{width:'80px', height:'80px', color:`${rc}0.05)`, strokeWidth:2}} />
                <div className="p-6 pb-4" style={{borderBottom:`1px solid ${rc}0.1)`}}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{color:`${rc}0.85)`}}>B · 内在能量状态</p>
                  <p className="text-[9px] mt-1" style={{color:'rgba(255,255,255,0.25)'}}>你是否正在无意识地消耗身边的人</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{color:'rgba(255,255,255,0.75)'}}>{String(dim)}</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{color:stateColor,background:`${stateColor.replace('0.7)','0.1)').replace('0.8)','0.1)')}`,border:`1px solid ${stateColor.replace('0.7)','0.2)').replace('0.8)','0.2)')}`}}>
                        {stateLabel}
                      </span>
                    </div>
                    <span className="text-[10px] tabular-nums" style={{color:`${rc}0.85)`}}>{score}/{maxVal}</span>
                  </div>
                  <div className="w-full h-[2px] rounded-full mb-4 overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${ratio*100}%`, background:`linear-gradient(90deg, ${rc}0.6), ${rc}1))`,
                        boxShadow:`0 0 12px ${rc}0.5)`}} />
                  </div>
                  <p className="text-xs mb-1 leading-relaxed" style={{color:'rgba(255,255,255,0.35)'}}>{String(DIMENSION_DESCS[dim])}</p>
                  <p className="text-[10px] mb-3 leading-relaxed" style={{color:'rgba(255,255,255,0.2)'}}>{scoreDesc}</p>
                  <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.6)'}}>{levelDesc}</p>
                </div>
              </section>
            );
          })()}

          {/* ⑥ 建议 - 无容器，直接浮动 */}
          <section className="mb-8 text-center px-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{color:'rgba(255,255,255,0.45)'}}>你可以尝试</p>
            <p className="text-base font-bold italic leading-relaxed"
              style={{color:`${rc}0.7)`, textShadow:`0 0 30px ${rc}0.2)`}}>
              "{String(advice)}"
            </p>
          </section>

          {/* ⑦ 操作按钮 */}
          <section className="flex gap-3 pb-10">
            <button onClick={() => window.location.reload()}
              className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-all"
              style={{background:'rgba(255,255,255,0.04)', borderRadius:'50px', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)'}}>
              <RefreshCcw className="w-3.5 h-3.5" /> 重测
            </button>
            <button onClick={() => setShowPoster(true)}
              className="flex-[2] py-4 flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-all"
              style={{background:`${rc}0.12)`, borderRadius:'50px', border:`1px solid ${rc}0.2)`,
                color:'rgba(255,255,255,0.8)', boxShadow:`0 0 20px ${rc}0.1)`}}>
              <Share2 className="w-3.5 h-3.5" /> 导出卡片报告
            </button>
          </section>

        </div>
      </div>
    );
  }
  return null;
}
