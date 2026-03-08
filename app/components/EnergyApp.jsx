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



const RadarChart = ({ data, dark = true }) => {
  const size = 200; const center = size / 2; const radius = center * 0.65;
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const r = (Math.max(0.1, d.value / 5)) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), labelX: center + (radius + 25) * Math.cos(angle), labelY: center + (radius + 20) * Math.sin(angle), name: d.name };
  });
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <div className="flex justify-center py-6 text-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible mx-auto">
        {[0.2, 0.4, 0.6, 0.8, 1].map(r => (<circle key={r} cx={center} cy={center} r={radius * r} fill="none" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />))}
        {points.map((p, i) => { const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2; return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />; })}
        <polygon points={polygonPath} fill="rgba(99, 102, 241, 0.2)" stroke="#818cf8" strokeWidth="2" />
        {points.map((p, i) => (<text key={i} x={p.labelX} y={p.labelY} fontSize="8" textAnchor="middle" fill={dark ? "#94a3b8" : "#64748b"} fontWeight="bold">{String(p.name)}</text>))}
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
    let roleName;
    if (scoreA <= 44 && scoreB <= 16) {
      roleName = "关系清醒者";
    } else if (topDim === "情绪倾倒" && topScore > 20) {
      roleName = "情绪垃圾桶";
    } else if (topDim === "情绪倾倒") {
      roleName = "情感代偿者";
    } else if (topDim === "自我消耗" && scoreB > 27) {
      roleName = "共情透支者";
    } else if (topDim === "自我消耗") {
      roleName = "自我压缩者";
    } else if (topDim === "冲突激发" && topScore > 20) {
      roleName = "冲突吸引者";
    } else if (topDim === "冲突激发" && dimScores["情绪倾倒"] >= 10) {
      roleName = "情绪循环者";
    } else if (topDim === "冲突激发") {
      roleName = "关系修复者";
    } else if (topDim === "责任转移" && dimScores["自我消耗"] >= 10) {
      roleName = "自我压缩者";
    } else if (topDim === "责任转移") {
      roleName = "责任承担者";
    } else if (topDim === "依赖绑定") {
      roleName = "依赖支柱";
    } else if (topDim === "受害叙述") {
      roleName = "情绪守护者";
    } else {
      roleName = "关系消耗者";
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
      <div className="min-h-screen bg-slate-950 text-white flex flex-col p-8 font-sans overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-indigo-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-purple-600 rounded-full blur-[150px]"></div>
        </div>

        <div className="flex flex-col items-center mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-8 bg-white/5 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div> 流失追踪 · 能量损耗分析
          </div>
          <h1 className="text-[2.2rem] font-bold mb-6 leading-[1.15] text-center" style={{letterSpacing: '-0.01em'}}>关系能量与<br/>心理防御双维度测评</h1>
          <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed opacity-70">这段关系，正在消耗你吗？<br/>你是在被消耗，还是正在索取？</p>
        </div>

        <div className="flex-1"></div>

        <div className="w-full max-w-sm mx-auto mb-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <button onClick={handleStartIdentity} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40 shadow-2xl active:scale-95 transition-all rounded-[2.2rem] font-black text-xl flex items-center justify-center gap-3 cursor-pointer">
              开启测评
            </button>
            <button onClick={previewResult} className="w-full py-2 text-white/20 text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5 hover:text-white/40 transition-colors">
              <span className="w-1 h-1 rounded-full bg-white/20"></span> DEV · 预览结果页
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem] backdrop-blur-sm text-left">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-bold leading-relaxed">Stéphane Clerget 核心理论支持</p>
                <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-80">整合情绪劳动理论、依恋与关系动力学理论、家庭动力学及边界理论。<br/>不仅看"你在被谁吸取能量"，更看"你为何会成为目标"。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- [2] Identity Step ---
  if (step === 'identity') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
        <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-indigo-500/5">
           <Heart className="w-10 h-10 text-rose-500 animate-pulse" fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter text-center">锁定分析对象</h2>
        <p className="text-slate-400 text-sm mb-12 text-center opacity-70">告诉我们，你最想扫描哪段互动的能量流失？</p>
        
        <div className="w-full max-w-sm space-y-6">
          <div className="relative">
             <input 
               autoFocus
               type="text" 
               placeholder="例如：妈妈 / 爱人 / 同事" 
               className="w-full bg-white/5 border border-white/10 p-6 rounded-[2.2rem] text-lg text-center focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" 
               value={targetPerson} 
               onChange={(e) => setTargetPerson(e.target.value)} 
             />
          </div>
          
          <button 
            disabled={!targetPerson.trim()}
            onClick={handleStartQuiz} 
            className={`w-full py-5 rounded-[2.2rem] font-black text-lg transition-all flex items-center justify-center gap-2 ${targetPerson.trim() ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 active:scale-95' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'}`}
          >
             进入扫描仪式 →
          </button>
          
          <button onClick={() => setStep('welcome')} className="w-full text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">返回首页</button>
        </div>
      </div>
    );
  }

  // --- 其余 Quiz, Transition, Result 渲染逻辑保持不变 ---
  if (step === 'quiz') {
    const q = QUESTIONS[currentIndex]; if (!q) return null;
    const currentVal = answers[q.id]; const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 font-sans">
        <div className="max-w-md mx-auto w-full px-2">
            <div className="flex items-center justify-between mb-2 mt-4 px-1 text-center">
              <div className="flex flex-col text-left"><span className="text-lg font-black tracking-tighter text-left"><span className="text-indigo-500 font-black">{currentIndex + 1}</span><span className="text-slate-700 font-bold"> / {QUESTIONS.length}</span></span></div>
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">PART {String(q.part)}</div>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full mb-5 overflow-hidden relative mx-auto"><div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} /></div>
            <div className="flex items-center gap-2 mb-8 text-left pl-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div><span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{String(q.dim)}</span></div>
        </div>
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          <div className="bg-white/[0.03] border border-white/[0.05] px-10 rounded-[2.5rem] mb-12 shadow-2xl backdrop-blur-sm relative h-56 flex flex-col justify-center overflow-hidden text-left">
             <span className="absolute top-10 left-10 text-[10px] font-bold text-indigo-500/40 block tracking-[0.2em] font-mono text-left">Q{String(currentIndex+1).padStart(2,'0')}</span>
             <h2 className="text-2xl font-bold text-slate-100 leading-snug w-full text-left">{String(q.text).replace('{target}', finalTarget)}</h2>
          </div>
          <div className="flex justify-between items-start gap-2 mb-12 px-2 text-center">
            {OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="flex flex-col items-center gap-3 flex-1 group">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 font-black text-lg ${currentVal === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110' : 'bg-white/5 border-white/10 text-slate-500 group-hover:border-indigo-500/50 active:scale-90'}`}>{opt.value}</div>
                <span className={`text-[10px] font-bold tracking-tight text-center ${currentVal === opt.value ? 'text-indigo-400 font-black' : 'text-slate-600'}`}>{String(opt.label)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mb-6 mt-auto max-w-md mx-auto w-full text-center">
            <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 border-white/10 text-slate-500 active:scale-90'}`}><ArrowLeft className="w-6 h-6" /></button>
            <button onClick={() => currentVal && navigateToNext(currentIndex)} disabled={!currentVal} className={`flex-1 h-16 rounded-[1.5rem] font-black text-lg transition-all ${!currentVal ? 'bg-slate-900 text-slate-700 border border-white/5' : 'bg-indigo-600 text-white active:scale-95'}`}>{currentIndex === QUESTIONS.length - 1 ? '完成分析' : '下一题'}</button>
        </div>
      </div>
    );
  }

  if (step === 'transition') return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-12 text-center font-sans">
      <Fingerprint className="w-16 h-16 text-indigo-400 mb-8 animate-pulse" />
      <h2 className="text-2xl font-black mb-4 tracking-tighter text-white">关系损耗扫描已完成</h2>
      <p className="text-slate-500 text-sm mb-12 leading-relaxed italic opacity-80 text-center">接下来扫描你当前的<span className="text-indigo-400 font-bold">内在能量补给状态</span></p>
      <button onClick={() => { setStep('quiz'); setCurrentIndex(QUESTIONS.findIndex(q => q.part === 'B')); }} className="w-full max-w-xs py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg active:scale-95 shadow-xl">继续内在扫描</button>
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

    return (
      <div className={`min-h-screen bg-gradient-to-b ${bg} via-slate-950 to-black text-white px-5 py-10 font-sans`}>
        <div className="max-w-md mx-auto space-y-4">

          {/* ① 主角色卡片（含副机制） */}
          <section className={`bg-gradient-to-b from-black/30 via-black/20 ${bg} rounded-3xl border border-white/10 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none rounded-3xl" />
            <div className="relative z-10 p-7 text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[9px] font-black tracking-widest mb-5 ${color} bg-black/20`}>
                {String(status)}
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">关系能量分析</p>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-2 leading-none">{String(roleName)}</h2>
              <p className={`text-sm font-black mb-5 ${color}`}>{String(tag)}</p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">{String(definition)}</p>
              {scene && <p className={`text-sm font-bold italic leading-relaxed ${color} opacity-75`}>"{String(scene)}"</p>}
            </div>
            {subRole && (
              <div className="relative z-10 mx-5 mb-5 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-4 flex items-start gap-3">
                <div className="flex-shrink-0 px-2 py-1 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">副机制</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-black ${subRole.color}`}>{String(subRole.name)}</span>
                    <span className="text-[9px] text-white/30 font-bold">· {String(subRole.dim)} 维度</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{String(subRole.definition)}</p>
                </div>
              </div>
            )}
          </section>

          {/* ② 关系图形 placeholder */}
          <section>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">关系互动模式</p>
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 h-48 flex items-center justify-center backdrop-blur-sm">
              <p className="text-white/20 text-xs font-bold">关系图形设计区域</p>
            </div>
          </section>

          {/* ③ 大卡片：常见互动 + 能量影响 */}
          <section className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            {/* 常见互动表现 */}
            <div className="p-5 border-b border-white/8">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">常见互动表现</p>
              <div className="space-y-2.5">
                {behaviors.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${color.replace('text-', 'bg-')}`}></div>
                    <p className="text-sm text-white/70">{String(b)}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* 能量影响 */}
            <div className="p-5 relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">这种关系可能带来的消耗</p>
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-black text-white">能量损耗</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{String(impact)}</p>
            </div>
          </section>

          {/* ④ 大卡片 Part A：关系能量结构 */}
          <section className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-black text-indigo-400">A</span>
                </div>
                <div>
                  <p className="text-xs font-black text-white/70">外部能量损耗分析</p>
                  <p className="text-[9px] text-white/30">这段关系对你的消耗程度</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">关系消耗程度</span>
                  <span className={`text-[10px] font-black ${color}`}>{Math.round((scoreA / 120) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/10">
                  <div className={`h-full rounded-full transition-all duration-700 ${ROLE_BAR_COLOR[roleName] || 'bg-indigo-400'}`} style={{ width: `${Math.round((scoreA / 120) * 100)}%` }} />
                </div>
              </div>
              <RadarChart data={radarData} />
            </div>
            {/* 01–06 维度卡片 */}
            <div className="px-4 pb-4 space-y-2">
              {DIMENSIONS.slice(0, 6).map((dim, idx) => {
                const maxVal = 25;
                const score = dimScores[dim] || 0;
                const ratio = score / maxVal;
                let stateLabel = "平稳"; let stateColor = "text-emerald-400"; let levelKey = "stable";
                if (ratio > 0.75) { stateLabel = "过载"; stateColor = "text-rose-400"; levelKey = "overload"; }
                else if (ratio > 0.5) { stateLabel = "活跃"; stateColor = "text-orange-400"; levelKey = "active"; }
                const numLabel = `0${idx + 1}`;
                const levelDesc = DIMENSION_LEVEL_DESC[dim]?.[levelKey] || "";
                const scoreDesc = DIMENSION_SCORE_DESC[dim] || "";
                return (
                  <div key={idx} className="rounded-2xl border bg-black/20 border-white/8 p-4 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tabular-nums text-white/25">{numLabel}</span>
                        <Activity className="w-3 h-3 text-white/25" />
                        <span className="text-sm font-black text-white/80">{String(dim)}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 bg-black/20 ${stateColor}`}>{stateLabel}</span>
                      </div>
                      <span className="text-[10px] font-black tabular-nums text-white/40">{score} / {maxVal}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden bg-white/10">
                      <div className={`h-full rounded-full transition-all duration-700 ${ROLE_BAR_COLOR[roleName] || 'bg-indigo-400'}`} style={{ width: `${ratio * 100}%` }} />
                    </div>
                    <div className="mb-3 pb-3 border-b border-white/5">
                      <p className="text-xs text-white/50 leading-relaxed mb-1">{String(DIMENSION_DESCS[dim])}</p>
                      <p className="text-[10px] text-white/30 leading-relaxed">{scoreDesc}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="text-sm text-white/70 leading-relaxed">{levelDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ⑤ 大卡片 Part B：内在补能模式 */}
          {(() => {
            const dim = DIMENSIONS[6];
            const maxVal = 40;
            const score = dimScores[dim] || 0;
            const ratio = score / maxVal;
            let stateLabel = "平稳"; let stateColor = "text-emerald-400"; let levelKey = "stable";
            if (ratio > 0.75) { stateLabel = "需关注"; stateColor = "text-rose-400"; levelKey = "overload"; }
            else if (ratio > 0.5) { stateLabel = "活跃"; stateColor = "text-orange-400"; levelKey = "active"; }
            const levelDesc = DIMENSION_LEVEL_DESC[dim]?.[levelKey] || "";
            const scoreDesc = DIMENSION_SCORE_DESC[dim] || "";
            return (
              <section className="bg-white/[0.04] backdrop-blur-sm border border-white/15 rounded-3xl overflow-hidden ring-1 ring-white/8">
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-black text-purple-400">B</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white/70">内在能量状态</p>
                      <p className="text-[9px] text-white/30">你是否正在无意识地消耗身边的人</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Fingerprint className={`w-3 h-3 ${color}`} />
                      <span className="text-sm font-black text-white">{String(dim)}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 bg-black/20 ${stateColor}`}>{stateLabel}</span>
                    </div>
                    <span className={`text-[10px] font-black tabular-nums ${color}`}>{score} / {maxVal}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-4 overflow-hidden bg-white/10">
                    <div className={`h-full rounded-full transition-all duration-700 ${ROLE_BAR_COLOR[roleName] || 'bg-indigo-400'}`} style={{ width: `${ratio * 100}%` }} />
                  </div>
                  <div className="mb-3 pb-3 border-b border-white/10">
                    <p className="text-xs text-white/50 leading-relaxed mb-1">{String(DIMENSION_DESCS[dim])}</p>
                    <p className="text-[10px] text-white/30 leading-relaxed">{scoreDesc}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-white/70 leading-relaxed">{levelDesc}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">
                    <Fingerprint className={`w-3 h-3 ${color} opacity-50`} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${color} opacity-50`}>当前能量状态</span>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ⑥ 建议 */}
          <section>
            <div className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 relative overflow-hidden`}>
              <Sparkles className={`absolute -right-2 -top-2 w-16 h-16 opacity-10 rotate-12 ${color}`} />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">你可以尝试</p>
              <p className="text-sm font-bold italic leading-relaxed text-white/80 relative z-10">"{String(advice)}"</p>
            </div>
          </section>

          {/* ⑦ 操作按钮 */}
          <section className="flex gap-3 pb-8">
            <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-black/20 backdrop-blur-sm text-white/50 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border border-white/10">
              <RefreshCcw className="w-4 h-4" /> 重测
            </button>
            <button onClick={() => setShowPoster(true)} className="flex-[2] py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-black text-xs shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all border border-white/15">
              <Share2 className="w-4 h-4" /> 导出卡片报告
            </button>
          </section>

        </div>
      </div>
    );
  }
  return null;
}
