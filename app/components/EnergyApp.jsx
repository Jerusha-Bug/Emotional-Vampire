import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, RefreshCcw, ShieldCheck, Zap, Heart,
  ArrowLeft, ArrowRight, Fingerprint, Activity, 
  Sparkles, BookOpen, Timer, ListChecks, BarChart3, UserCheck, HeartPulse,
  AlertTriangle, ShieldAlert, CheckCircle2, X, Download, Lock, Unlock, Key, Eye
} from 'lucide-react';

const SUPABASE_URL = 'https://rfazkfbaqmrxcsudefiu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9ksrRzUpTr_nUM4cAwN0WQ_NBD-gcfN';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DS = {
  pageBg: 'linear-gradient(to bottom, #2C2541 0%, #685066 40%, #C4784E 75%, #D9A876 100%)',
  space: { xs: '8px', sm: '16px', md: '24px', lg: '32px' },
  type: {
    t1: { fontSize: '2.4rem',   fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    t2: { fontSize: '1rem',     fontWeight: 700, letterSpacing: '0em',     lineHeight: 1.4 },
    t3: { fontSize: '0.875rem', fontWeight: 400, letterSpacing: '0em',     lineHeight: 1.75 },
    t4: { fontSize: '0.75rem',  fontWeight: 400, letterSpacing: '0em',     lineHeight: 1.6 },
  },
  text: {
    primary:   '#FFFFFF',
    secondary: 'rgba(255,255,255,0.90)',
    tertiary:  'rgba(255,255,255,0.65)',
    muted:     'rgba(255,255,255,0.50)',
    ghost:     'rgba(255,255,255,0.55)',
  },
  btnPrimary: (glowColor = 'rgba(146,141,171,') => ({
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.30)',
    border: 'none',
    borderRadius: '9999px',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.02em',
    transition: 'transform 0.15s, box-shadow 0.15s',
    padding: '0 24px',
  }),
  btnSecondary: {
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '9999px',
    color: 'rgba(255,255,255,0.70)',
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.04em',
    transition: 'transform 0.15s, opacity 0.15s',
    padding: '0 20px',
  },
  btnRole: (rc) => ({
    background: `linear-gradient(135deg, ${rc}0.20), ${rc}0.10))`,
    borderRadius: '9999px',
    border: `1px solid ${rc}0.28)`,
    color: '#F2F3FB',
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.04em',
    boxShadow: `0 4px 20px rgba(0,0,0,0.28), 0 0 14px ${rc}0.14)`,
    transition: 'transform 0.15s',
    padding: '0 20px',
  }),
  progressTrack: {
    height: '3px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  progressFillA: (pct) => ({
    width: `${pct}%`,
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, rgba(30,58,95,0.85), rgba(146,141,171,0.95))',
    boxShadow: '0 0 10px rgba(146,141,171,0.45)',
    transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
  }),
  progressFillB: (pct) => ({
    width: `${pct}%`,
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, rgba(83,78,100,0.9), rgba(188,190,229,0.95))',
    boxShadow: '0 0 10px rgba(188,190,229,0.4)',
    transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
  }),
  label: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
  },
  card: {
    background: 'rgba(0,0,0,0.12)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  cardInner: {
    background: 'rgba(0,0,0,0.22)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  divider: { borderTop: '1px solid rgba(255,255,255,0.08)' },
  waveSvg: (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      style={{opacity: 0.045}} viewBox="0 0 390 844" fill="none" preserveAspectRatio="xMidYMid slice">
      <path d="M-20 200 C 80 180, 150 280, 200 240 S 320 160, 420 200" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M-20 380 C 60 340, 180 420, 250 380 S 360 300, 430 360" stroke="white" strokeWidth="0.8" fill="none"/>
      <path d="M50 600 C 120 560, 200 640, 300 580 S 380 520, 450 560" stroke="white" strokeWidth="0.6" fill="none"/>
    </svg>
  ),
};

const Particles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[
      {left:'15%', delay:'0s',  dur:'6s',  size:2, top:'75%'},
      {left:'28%', delay:'1.5s',dur:'8s',  size:2, top:'80%'},
      {left:'45%', delay:'0.8s',dur:'7s',  size:3, top:'70%'},
      {left:'62%', delay:'2.2s',dur:'9s',  size:2, top:'85%'},
      {left:'75%', delay:'0.3s',dur:'6.5s',size:2, top:'78%'},
      {left:'88%', delay:'3s',  dur:'7.5s',size:2, top:'72%'},
    ].map((p, i) => (
      <div key={i} className="particle absolute rounded-full"
        style={{left:p.left, top:p.top, width:p.size, height:p.size,
          background:'rgba(255,255,255,0.45)',
          animationDelay:p.delay, animationDuration:p.dur}} />
    ))}
  </div>
);

const OPTIONS = [
  { label: "从不", value: 1 }, { label: "很少", value: 2 }, { label: "有时", value: 3 }, { label: "经常", value: 4 }, { label: "总是", value: 5 }
];

const DIMENSIONS = ["情绪倾倒", "受害叙述", "责任转移", "依赖绑定", "冲突激发", "自我消耗", "内在补能模式"];

const DIMENSION_DESCS = {
  "情绪倾倒": "这反映了对方是否将你视为单纯的情绪宣泄口。",
  "受害叙述": "这反映了对方是否通过展示弱势来博取你的同情。",
  "责任转移": "这反映了关系中责任承担的失衡。",
  "依赖绑定": "这反映了对方是否在通过'没你不行'来捆绑你的自由。",
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

const ROLE_DATA = {
  "情感代偿者": {
    image: "/illustrations/compensator.webp",
    imageResult: "/illustrations-result/compensator_small.webp",
    en: "Emotional Compensator",
    tag: "情绪承接 · 单向消耗",
    color: "text-rose-400",
    bg: "from-rose-950/80",
    status: "轻度损耗",
    definition: "你在这段关系中承担了大量情绪修复工作。当对方低落、焦虑或崩溃时，你会本能地去安抚、理解和承担。",
    behaviors: ["经常成为对方倾诉的容器，不限于负面情绪", "帮对方解释他的行为", "很少表达自己的需求", "害怕让关系失去稳定"],
    impact: "你的情绪能量不断输出，但回馈很少。久而久之可能出现情绪疲惫、责任过重、自我价值感下降。",
    advice: "停止自动承担别人的情绪责任。当对方情绪失控时，你可以选择不立刻修复它。\n\n**你可以做的第一步：** 下次对方向你倾倒情绪时，先深呼吸，告诉自己：「我可以关心，但我不需要解决。」试着用「我听到了你的感受」代替立刻给建议或道歉。\n\n**边界练习：** 每周给自己划出一段「不接收情绪」的时间——可以是睡前一小时，也可以是某个固定的休息日。告诉对方你需要这段时间，不是拒绝他，而是照顾自己。\n\n**长期建议：** 关注自己真实的感受，当你发现自己压抑了某个想法时，试着把它写下来。不需要说出口，但要承认它存在。慢慢地，你会找回自己在关系中的位置。",
    scene: "你总在关系里多走那一步，久了忘了原来的位置在哪。"
  },
  "情绪倾倒者": {
    image: "/illustrations/dump.webp",
    imageResult: "/illustrations-result/dump_small.webp",
    en: "Emotional Dump",
    tag: "单向倾倒 · 极度透支",
    color: "text-red-500",
    bg: "from-red-950/80",
    status: "严重损耗",
    definition: "对方习惯把所有情绪和想法单向倒给你，不管是烦恼还是日常，但并不真正关心你的状态。",
    behaviors: ["对方只在需要倾诉时找你", "聊天几乎都围绕着他", "对方分享时不需要你回应，只需要你在场", "你的情绪很少被关注"],
    impact: "你逐渐变成情绪容器，吸收的负面情绪越多，恢复越慢。",
    advice: "开始减少情绪接收。不是所有情绪都需要你去承接。\n\n**你可以做的第一步：** 下次对方开始倾倒情绪时，试着在心里设一个「容量上限」——当你感到开始疲惫时，可以温和地说：「我现在状态不太好，稍后再聊好吗？」\n\n**边界练习：** 观察一周，记录每次和对方互动后你的感受。是累了还是轻松了？这个记录会帮你看清这段关系的真实能量流向。\n\n**长期建议：** 你值得有人关心你的感受。如果这段关系里几乎没有人问过「你今天怎么样」，这是需要认真思考的信号。关系是双向的，如果它一直是单向的，你需要决定这是否是你想要的。",
    scene: "你习惯承接，但没人承接你。"
  },
  "共情透支者": {
    image: "/illustrations/empathy.webp",
    imageResult: "/illustrations-result/empathy_small.webp",
    en: "Empathy Overload",
    tag: "过度共情 · 自我消耗",
    color: "text-fuchsia-400",
    bg: "from-fuchsia-950/80",
    status: "轻度损耗",
    definition: "你拥有很强的共情能力，但在这段关系中，这种能力被过度消耗。",
    behaviors: ["很容易理解对方", "会替对方找理由", "经常忽略自己的感受"],
    impact: "共情如果没有边界，就会变成自我消耗机制。",
    advice: "理解对方不等于为对方负责。\n\n**你可以做的第一步：** 当你发现自己在替对方辩护时，停下来问自己：「如果这件事发生在朋友身上，我会怎么看？」用旁观者的视角看自己的处境，往往会更清晰。\n\n**边界练习：** 练习「共情但不解救」。你可以感受到对方的痛苦，但不代表你必须解决它。试着说「我理解你很难过」而不是「我来帮你想办法」。\n\n**长期建议：** 你的共情是一种珍贵的能力，但它需要被保护。每天花5分钟问自己：「今天我自己的感受是什么？」把注意力放回自己身上，是照顾好共情能力的基础。",
    scene: "你很擅长感受别人，却越来越不知道自己在感受什么。"
  },
  "关系修复者": {
    image: "/illustrations/fixer.webp",
    imageResult: "/illustrations-result/fixer_small.webp",
    en: "Relationship Fixer",
    tag: "主动维系 · 单方努力",
    color: "text-amber-400",
    bg: "from-amber-950/80",
    status: "明显损耗",
    definition: "每当关系出现问题，你都会试图修复它。",
    behaviors: ["主动道歉", "主动解释误会", "不希望关系破裂"],
    impact: "你在不断修复关系，但对方未必愿意改变。",
    advice: "关系是两个人的责任，而不是一个人的修复工程。\n\n**你可以做的第一步：** 下次出现矛盾时，先等一等，不要第一个道歉。给对方空间，也给自己空间。看看如果你不主动，会发生什么。\n\n**边界练习：** 问自己：「这个问题，是我造成的，还是我在承担不属于我的部分？」如果是后者，你不需要道歉，你需要的是表达。\n\n**长期建议：** 一段健康的关系里，双方都愿意修复。如果每次都是你先伸手，试着直接告诉对方你的感受：「我发现每次出问题都是我先来找你，这让我有点累。」看看对方的反应，会告诉你很多。",
    scene: "每次出现裂缝都是你先去补，久了开始分不清是在乎还是习惯。"
  },
  "冲突吸引者": {
    image: "/illustrations/conflict.webp",
    imageResult: "/illustrations-result/conflict_small.webp",
    en: "Conflict Magnet",
    tag: "高频摩擦 · 能量耗散",
    color: "text-orange-500",
    bg: "from-orange-950/80",
    status: "严重损耗",
    definition: "你们的互动很容易从普通交流升级为冲突。",
    behaviors: ["小问题容易变成争吵", "对话经常带有情绪", "很难真正解决问题"],
    impact: "每一次冲突都会消耗大量情绪资源。",
    advice: "观察冲突模式，而不是只关注冲突内容。\n\n**你可以做的第一步：** 记录下最近三次冲突的触发点。不是内容本身，而是：什么时候说的？什么语气？什么状态下？你会发现冲突往往有固定的触发条件。\n\n**边界练习：** 当感到对话开始升温时，试着说：「我现在情绪有点激动，我们过一会儿再聊好吗？」暂停不是逃避，是给双方降温的空间。\n\n**长期建议：** 高频冲突往往意味着关系里有一些没被说清楚的需求。试着在平静的时候问对方：「你觉得我们为什么总是在这件事上起冲突？」把对话从内容层移到模式层，才能真正解决问题。",
    scene: "你不是喜欢争吵，只是每次沟通都容易走到那一步。"
  },
  "责任承担者": {
    image: "/illustrations/responsibility.webp",
    imageResult: "/illustrations-result/responsibility_small.webp",
    en: "Responsibility Carrier",
    tag: "失衡承担 · 自我怀疑",
    color: "text-yellow-400",
    bg: "from-yellow-950/80",
    status: "明显损耗",
    definition: "当关系出现问题时，你经常承担更多责任。",
    behaviors: ["经常反思是不是自己做错了", "会主动让步", "不希望事情变得更糟"],
    impact: "长期承担责任可能导致自我怀疑。",
    advice: "关系中的责任需要被公平分配。\n\n**你可以做的第一步：** 下次当你开始自我反思「是不是我的问题」时，先把这个问题换一换：「这件事里，对方有没有需要负责的部分？」两个问题都问，才是完整的。\n\n**边界练习：** 试着在一件小事上，不主动让步。不是为了争，而是练习让自己的感受有被表达的空间。\n\n**长期建议：** 长期承担责任会让你的自我评价越来越低，因为你会习惯性地把问题归咎于自己。找一个信任的朋友，把你们关系里的一些情况讲给他听，听听外部视角的判断——有时候你需要有人帮你确认，这真的不是你的错。",
    scene: "你不是不累，只是不接的话会更乱。"
  },
  "依赖支柱": {
    image: "/illustrations/dependency.webp",
    imageResult: "/illustrations-result/dependency_small.webp",
    en: "Dependency Anchor",
    tag: "情绪依赖 · 逐渐失自由",
    color: "text-blue-400",
    bg: "from-blue-950/80",
    status: "轻度损耗",
    definition: "对方在情绪和生活上高度依赖你，不只是在低落时，日常的分享、决定、安慰都需要你在场。",
    behaviors: ["对方经常说'只有你懂我'", "离开你他会变得很焦虑", "你成为关系的稳定中心"],
    impact: "这种依赖可能让你逐渐失去自由。",
    advice: "支持别人不等于成为对方唯一的支撑。\n\n**你可以做的第一步：** 试着在一件小事上，不给对方立即的回应。不是消失，而是给对方一点时间自己处理，也给自己一点空间。\n\n**边界练习：** 当对方说「只有你懂我」时，温和地说：「我很高兴能帮到你，但我也希望你能有更多支持的人。」这不是拒绝，而是在帮对方建立更健康的支持系统。\n\n**长期建议：** 你不能成为一个人的全部。这对你不公平，对对方也不健康。试着鼓励对方拓展他的支持网络，同时重新找回你在关系以外的自己——你的爱好、你的朋友、你自己的节奏。",
    scene: "你知道TA只在需要时才来，但还是每次都在。"
  },
  "情绪守护者": {
    image: "/illustrations/guardian.webp",
    imageResult: "/illustrations-result/guardian_small.webp",
    en: "Emotional Guardian",
    tag: "压抑表达 · 内耗积累",
    color: "text-cyan-400",
    bg: "from-cyan-950/80",
    status: "明显损耗",
    definition: "你会主动保护关系中的情绪稳定。",
    behaviors: ["避免冲突", "小心表达意见", "不想让对方难过"],
    impact: "长期压抑真实表达会产生情绪内耗。",
    advice: "健康关系允许真实表达。\n\n**你可以做的第一步：** 找一件你一直想说但没说的事，不需要当面说——先写下来。把它写出来，是承认它存在的第一步。\n\n**边界练习：** 试着在一件低风险的事上表达真实意见。从小事开始：「我今天不太想吃这个」「我更喜欢另一个」——练习让自己的声音被听见。\n\n**长期建议：** 你可能是在一个不安全的环境里学会了「不表达才安全」。但压抑情绪的代价是内耗，久了会让你越来越疲惫。找一个安全的人或者安全的方式（比如日记、咨询）开始表达——你的感受值得被说出来。",
    scene: "你很擅长保护别人的情绪，却忘了自己的也需要被保护。"
  },
  "自我压缩者": {
    image: "/illustrations/suppressor.webp",
    imageResult: "/illustrations-result/suppressor_small.webp",
    en: "Self-Suppressor",
    tag: "需求压缩 · 自我迷失",
    color: "text-purple-400",
    bg: "from-purple-950/80",
    status: "轻度损耗",
    definition: "为了维持关系，你不断压缩自己的需求。",
    behaviors: ["不敢表达真实想法", "经常妥协", "很少坚持自己的界限"],
    impact: "长期压抑可能导致情绪疲惫和自我迷失。",
    advice: "你的需求同样重要。\n\n**你可以做的第一步：** 今天问自己一个问题：「我现在真正想要的是什么？」不是对方想要什么，不是关系需要什么，是你自己。把答案写下来。\n\n**边界练习：** 试着把一个被你压缩掉的需求说出来——不需要很大，可以是「我想今晚一个人待着」或者「我想先做自己的事」。说出来，看看会发生什么。\n\n**长期建议：** 你压缩自己的需求，可能是因为曾经学到「我的需求会给别人带来麻烦」。但一段真正的关系，是可以容纳你的需求的。如果你发现每次表达需求都会引发问题，这个关系本身值得被重新审视。",
    scene: "你把自己的需求放得很后面，以为是暂时的，后来变成了习惯。"
  },
  "关系消耗者": {
    image: "/illustrations/drained.webp",
    imageResult: "/illustrations-result/drained_small.webp",
    en: "Energy Drained",
    tag: "持续消耗 · 能量黑洞",
    color: "text-slate-400",
    bg: "from-slate-800/40",
    status: "轻度损耗",
    definition: "这段关系正在持续消耗你的能量。",
    behaviors: ["互动后常感到疲惫", "需要很长时间恢复", "情绪波动明显"],
    impact: "关系本身已经成为能量黑洞。",
    advice: "观察这段关系是否仍然值得投入。\n\n**你可以做的第一步：** 用一周时间，每次和对方互动后记录你的感受：是充电了还是耗电了？不需要评判，只是观察。\n\n**边界练习：** 试着减少一次「不必要」的互动——不是冷漠，而是看看当你不主动维持时，这段关系会自然流向哪里。\n\n**长期建议：** 一段关系如果长期让你感到疲惫，这不是你的性格问题，也不是你不够努力。有些关系消耗你，是因为它的结构本身不平衡。你值得有让你感到轻盈的关系，而不只是让你感到有义务的关系。",
    scene: "你说不清哪里出了问题，只是越来越不想靠近。"
  },
  "情绪循环者": {
    image: "/illustrations/loop.webp",
    imageResult: "/illustrations-result/loop_small.webp",
    en: "Emotional Loop",
    tag: "重复模式 · 无解循环",
    color: "text-indigo-400",
    bg: "from-indigo-950/80",
    status: "轻度损耗",
    definition: "你们的关系不断重复同样的情绪模式。",
    behaviors: ["冲突 → 和好 → 冲突", "问题没有真正解决", "情绪循环出现"],
    impact: "这种循环会让人逐渐麻木。",
    advice: "识别模式，是打破循环的第一步。\n\n**你可以做的第一步：** 把你们最近重复出现的冲突或问题写下来。你会发现它们惊人地相似——相同的触发点，相同的反应，相同的结局。\n\n**边界练习：** 下次循环开始时，试着做一件不一样的事——不是平时的反应，而是暂停，说：「我们好像又到了这个地方，我想换一种方式。」打破固定脚本，是循环改变的开始。\n\n**长期建议：** 循环往往意味着有一个核心问题从来没有被真正解决过。找一个平静的时机，和对方谈这个模式本身，而不是每次发生时谈内容。如果循环无法打破，可以考虑寻求专业帮助——心理咨询师可以帮你们找到循环背后真正的结，然后一起解开它。",
    scene: "好了又坏，坏了又好，你以为在修复，其实只是在重复。"
  },
  "关系清醒者": {
    image: "/illustrations/awakened.webp",
    imageResult: "/illustrations-result/awakened_small.webp",
    en: "Awakened Observer",
    tag: "自我觉察 · 能量恢复",
    color: "text-emerald-400",
    bg: "from-emerald-950/80",
    status: "稳定",
    definition: "你已经开始意识到关系中的能量结构。",
    behaviors: ["开始观察互动模式", "不再盲目承担责任", "想要建立边界"],
    impact: "你的能量正在恢复。",
    advice: "继续保持观察与自我保护。\n\n**你现在做得很好：** 能看见关系里发生了什么，本身就是最重要的能力。很多人在消耗中待了很久，才慢慢意识到。你已经走到了觉察这一步。\n\n**下一步：** 觉察之后是选择。你可以开始想：这段关系里，有哪些模式我想改变？有哪些边界我想建立？不需要一次做完，一次一小步就好。\n\n**长期建议：** 清醒是一种力量，但也可能带来孤独——当你看见了别人没看见的东西，有时会感到疲惫。记得照顾自己的感受，不只是分析局势。你的感受也值得被关注，不只是你的判断力。",
    scene: "你学会了把自己放在第一位，哪怕别人不理解。"
  }
};

const ROLE_BAR_COLOR = {
  "情感代偿者": "bg-rose-400", "情绪倾倒者": "bg-red-500",
  "共情透支者": "bg-fuchsia-400", "关系修复者": "bg-amber-400",
  "冲突吸引者": "bg-orange-500", "责任承担者": "bg-yellow-400",
  "依赖支柱": "bg-blue-400", "情绪守护者": "bg-cyan-400",
  "自我压缩者": "bg-purple-400", "关系消耗者": "bg-slate-400",
  "情绪循环者": "bg-indigo-400", "关系清醒者": "bg-emerald-400"
};

const DIM_TO_ROLE = {
  "情绪倾倒": "情感代偿者", "受害叙述": "情绪守护者",
  "责任转移": "责任承担者", "依赖绑定": "依赖支柱",
  "冲突激发": "关系修复者", "自我消耗": "共情透支者"
};

const WaveTexture = ({ seed = 0, opacity = 0.12 }) => {
  const w = 340; const h = 160;
  const rows = 8;
  const amp   = [6, 8, 5, 9, 6, 7, 5, 8][seed % 8];
  const freq  = [18, 22, 16, 20, 24, 18, 14, 20][seed % 8];
  const phase = [0, 0.4, 0.8, 1.2, 0.2, 0.6, 1.0, 0.3][seed % 8];
  const curl  = [0.4, 0.6, 0.3, 0.5, 0.7, 0.4, 0.5, 0.6][seed % 8];
  const buildWavePath = (rowIdx) => {
    const y0 = (h / (rows + 1)) * (rowIdx + 1);
    const pts = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = (w / steps) * i;
      const t = (x / w) * Math.PI * 2 * (w / freq) + phase + rowIdx * 0.3;
      const y = y0 + Math.sin(t) * amp + Math.sin(t * 2 + curl) * (amp * 0.4);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const uid = `wt${seed}`;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice"
      style={{borderRadius:'inherit'}}>
      <defs>
        <linearGradient id={`wm${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="black" stopOpacity="1"/>
          <stop offset="45%"  stopColor="black" stopOpacity="1"/>
          <stop offset="75%"  stopColor="white" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        <mask id={`wmask${uid}`}>
          <rect width={w} height={h} fill={`url(#wm${uid})`}/>
        </mask>
      </defs>
      <g mask={`url(#wmask${uid})`} opacity={opacity}>
        {Array.from({length: rows}, (_, i) => (
          <path key={i} d={buildWavePath(i)} fill="none"
            stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
        ))}
      </g>
    </svg>
  );
};

const RadarChart = ({ data }) => {
  const size = 300; const center = size / 2; const maxR = center * 0.62;
  const n = data.length;
  const angleOf = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const buildPath = (scale) => {
    const pts = data.map((d, i) => {
      const angle = angleOf(i);
      const r = Math.max(0.12, d.value / 4) * maxR * scale;
      return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
    });
    const len = pts.length; const tension = 0.38; let path = '';
    for (let i = 0; i < len; i++) {
      const p0 = pts[(i - 1 + len) % len];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const p3 = pts[(i + 2) % len];
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      if (i === 0) path += `M ${p1.x} ${p1.y} `;
      path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }
    return path + 'Z';
  };
  const layers = 20;
  const contours = Array.from({ length: layers }, (_, i) => {
    const t = (i + 1) / layers;
    const scale = 0.12 + t * 0.88;
    const rVal = Math.round(210 - t * 60);
    const gVal = Math.round(180 - t * 60);
    const bVal = 255;
    const opacity = t < 0.25 ? 0.70 - t * 0.4 : t > 0.82 ? (1 - t) * 2.2 : 0.38 - t * 0.10;
    return { path: buildPath(scale), opacity: Math.max(0.04, opacity), strokeW: 0.45, r: rVal, g: gVal, b: bVal };
  });
  const labelPoints = data.map((d, i) => {
    const angle = angleOf(i);
    return { x: center + (maxR + 26) * Math.cos(angle), y: center + (maxR + 20) * Math.sin(angle), name: d.name };
  });
  return (
    <div className="flex flex-col items-center py-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <radialGradient id="fillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(180,160,255,0.10)"/>
            <stop offset="55%"  stopColor="rgba(160,140,255,0.05)"/>
            <stop offset="100%" stopColor="rgba(140,120,240,0.01)"/>
          </radialGradient>
        </defs>
        {data.map((_, i) => {
          const angle = angleOf(i);
          const x2 = center + maxR * Math.cos(angle);
          const y2 = center + maxR * Math.sin(angle);
          return <line key={i} x1={center} y1={center} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" strokeLinecap="round"/>;
        })}
        <path d={buildPath(1.0)} fill="url(#fillGrad)" stroke="none"/>
        {contours.map((c, i) => (
          <path key={i} d={c.path} fill="none"
            stroke={`rgba(${c.r},${c.g},${c.b},${c.opacity})`}
            strokeWidth={c.strokeW} strokeLinejoin="round"/>
        ))}
        {labelPoints.map((p, i) => (
          <text key={i} x={p.x} y={p.y + 4} fontSize="7.5" textAnchor="middle"
            fill="rgba(255,255,255,0.55)" fontWeight="600" letterSpacing="0.3">
            {String(p.name)}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('welcome');
  const [targetPerson, setTargetPerson] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
    const extDims = DIMENSIONS.slice(0, 6);
    const sorted = [...extDims].sort((a, b) => dimScores[b] - dimScores[a]);
    const topDim = sorted[0]; const secondDim = sorted[1];
    const topScore = dimScores[topDim]; const secondScore = dimScores[secondDim];
    const gap = topScore - secondScore; const dominated = gap >= 3;
    let roleName;
    const avgPerQ_A = scoreA / 24;
    const avgPerQ_B = scoreB / 8;
    if (avgPerQ_A <= 2.5 && avgPerQ_B <= 2.5) { roleName = "关系清醒者"; }
    else if (dominated && topDim === "情绪倾倒" && topScore >= 16) { roleName = "情绪倾倒者"; }
    else if (dominated && topDim === "情绪倾倒") { roleName = "情感代偿者"; }
    else if (dominated && topDim === "自我消耗" && scoreB > 27) { roleName = "共情透支者"; }
    else if (dominated && topDim === "自我消耗") { roleName = "自我压缩者"; }
    else if (dominated && topDim === "冲突激发" && topScore >= 16) { roleName = "冲突吸引者"; }
    else if (dominated && topDim === "冲突激发" && dimScores["情绪倾倒"] >= 10) { roleName = "情绪循环者"; }
    else if (dominated && topDim === "冲突激发") { roleName = "关系修复者"; }
    else if (dominated && topDim === "责任转移" && dimScores["自我消耗"] >= 8) { roleName = "自我压缩者"; }
    else if (dominated && topDim === "责任转移") { roleName = "责任承担者"; }
    else if (dominated && topDim === "依赖绑定") { roleName = "依赖支柱"; }
    else if (dominated && topDim === "受害叙述") { roleName = "情绪守护者"; }
    else {
      const avgScore = scoreA / 6;
      if (avgPerQ_A <= 3.0 && avgPerQ_B <= 3.0) { roleName = "关系消耗者"; }
      else if (dimScores["自我消耗"] >= avgScore && scoreB > 24) { roleName = "共情透支者"; }
      else if (dimScores["冲突激发"] >= avgScore && dimScores["情绪倾倒"] >= avgScore) { roleName = "情绪循环者"; }
      else if (dimScores["责任转移"] >= avgScore && dimScores["自我消耗"] >= avgScore) { roleName = "自我压缩者"; }
      else if (dimScores["情绪倾倒"] >= avgScore && dimScores["受害叙述"] >= avgScore) { roleName = "情感代偿者"; }
      else if (dimScores["依赖绑定"] >= avgScore) { roleName = "依赖支柱"; }
      else if (dimScores["冲突激发"] >= avgScore) { roleName = "关系修复者"; }
      else if (scoreA >= 80) { roleName = "情绪倾倒者"; }
      else { roleName = "关系消耗者"; }
    }
    const secondRoleName = DIM_TO_ROLE[secondDim];
    const subRole = (secondScore >= 10 && secondRoleName !== roleName)
      ? { name: secondRoleName, dim: secondDim, score: secondScore, ...ROLE_DATA[secondRoleName] } : null;
    const role = ROLE_DATA[roleName];
    return { ...role, roleName, subRole, scoreA, scoreB, radarData, dimScores, topDim };
  }, [step, answers]);

  const finalTarget = targetPerson.trim() || 'TA';

  const navigateToNext = (currentIdx) => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (QUESTIONS[currentIdx]?.part === 'A' && (currentIdx === QUESTIONS.length - 1 || QUESTIONS[currentIdx + 1]?.part === 'B')) setStep('transition');
    else if (currentIdx < QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
    else setStep('result');
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleStartIdentity = async () => { setStep('quiz'); };
  const handleStartQuiz = async () => { if (finalTarget) setStep('quiz'); };

  const handleAnswer = async (val) => {
    if (isNavigating) return;
    const currentQ = QUESTIONS[currentIndex];
    if (!currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);
    if (currentIndex === QUESTIONS.length - 1) {
      const dimTotals = {};
      DIMENSIONS.forEach(dim => dimTotals[dim] = 0);
      QUESTIONS.forEach(q => { const score = newAnswers[q.id] || 0; if (dimTotals[q.dim] !== undefined) dimTotals[q.dim] += score; });
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const avgPerQ = (totalScore - (dimTotals["内在补能模式"] || 0)) / 24;
      const sorted2 = Object.entries(dimTotals).filter(([k]) => k !== "内在补能模式").sort((a,b) => b[1]-a[1]);
      const topD = sorted2[0]?.[0]; const topS = sorted2[0]?.[1] || 0;
      const secS = sorted2[1]?.[1] || 0; const dom = (topS - secS) >= 3;
      let insertRole = "关系消耗者";
      if (avgPerQ <= 2.5) insertRole = "关系清醒者";
      else if (dom && topD === "情绪倾倒" && topS >= 16) insertRole = "情绪倾倒者";
      else if (dom && topD === "情绪倾倒") insertRole = "情感代偿者";
      else if (dom && topD === "冲突激发" && topS >= 16) insertRole = "冲突吸引者";
      else if (dom && topD === "依赖绑定") insertRole = "依赖支柱";
      else if (dom && topD === "责任转移") insertRole = "责任承担者";
      else if (dom && topD === "受害叙述") insertRole = "情绪守护者";
      else if (dom && topD === "自我消耗") insertRole = "自我压缩者";
      try {
        await supabase.from('test_results').insert([{
          relation_type: finalTarget,
          role_name: insertRole,
          dim_dumping: dimTotals["情绪倾倒"] / 5,
          dim_narrative: dimTotals["受害叙述"] / 5,
          dim_transfer: dimTotals["责任转移"] / 5,
          dim_binding: dimTotals["依赖绑定"] / 5,
          dim_conflict: dimTotals["冲突激发"] / 5,
          dim_consumption: dimTotals["自我消耗"] / 5,
          final_score: totalScore
        }]);
      } catch (e) { console.error("Sync Error:", e); }
    }
    setTimeout(() => { navigateToNext(currentIndex); }, 300);
  };

  if (!mounted) return null;

  // [1] 首页
  if (step === 'welcome') {
    return (
      <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden relative"
        style={{background: DS.pageBg}}>
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0.5; }
            100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
          }
          .particle { animation: floatUp linear infinite; }
        `}</style>
        <div className="absolute inset-0 pointer-events-none"
          style={{background: 'radial-gradient(ellipse at 30% 20%, rgba(146,141,171,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(31,28,44,0.4) 0%, transparent 60%)'}}/>
        {DS.waveSvg}
        <Particles />
        <div className="relative z-10 flex flex-col min-h-screen px-8">
          <div className="flex-[1.2]" />
          <div className="flex flex-col items-center text-center">
            <p style={{...DS.label, color: 'rgba(255,255,255,0.80)', marginBottom: DS.space.md}}>
              流失追踪 · 能量损耗分析
            </p>
            <h1 style={{...DS.type.t1, color: DS.text.primary, marginBottom: DS.space.sm}}>
              关系能量测评
            </h1>
            <p style={{...DS.type.t3, color: 'rgba(255,255,255,0.75)', maxWidth:'220px'}}>
              在这段关系里，你是谁
            </p>
          </div>
          <div className="flex-[1.5]" />
          <div className="flex flex-col items-center mb-16" style={{gap: DS.space.md, width:'100%'}}>
            <p style={{...DS.type.t4, color: 'rgba(255,255,255,0.75)', textAlign:'center', maxWidth:'240px'}}>
              在开始之前，想一想<br/>最近让你感到情绪消耗的那个人
            </p>
            <button onClick={handleStartIdentity}
              className="w-full max-w-xs active:scale-95"
              style={{...DS.btnPrimary(), height:'56px'}}>
              <span>开启测评</span>
            </button>
            <p style={{...DS.label, color: 'rgba(255,255,255,0.60)', letterSpacing: '0.12em',
              textAlign: 'center', lineHeight: 1.8, maxWidth: '240px'}}>
              基于 Stéphane Clerget 情绪劳动理论<br/>及关系动力学理论
            </p>
          </div>
        </div>
      </div>
    );
  }

  // [2] Identity
  if (step === 'identity') {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden relative"
        style={{background: DS.pageBg}}>
        {DS.waveSvg}
        <Particles />
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
            style={{background: 'rgba(146,141,171,0.12)', border: '1px solid rgba(146,141,171,0.2)'}}>
            <Heart className="w-10 h-10 animate-pulse" style={{color: 'rgba(146,141,171,0.8)'}} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center" style={{letterSpacing: '-0.02em'}}>锁定分析对象</h2>
          <p className="text-sm mb-12 text-center" style={{color: 'rgba(255,255,255,0.55)'}}>告诉我们，你最想扫描哪段互动的能量流失？</p>
          <div className="w-full max-w-sm space-y-4">
            <input
              autoFocus type="text"
              placeholder="例如：妈妈 / 爱人 / 同事"
              className="w-full p-6 text-lg text-center focus:outline-none placeholder:text-white/15 transition-all"
              style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '2rem', color: 'white'}}
              value={targetPerson}
              onChange={(e) => setTargetPerson(e.target.value)}
            />
            <button
              disabled={!targetPerson.trim()}
              onClick={handleStartQuiz}
              className="w-full py-5 active:scale-95"
              style={targetPerson.trim() ? DS.btnPrimary() : {...DS.btnSecondary, cursor: 'not-allowed', opacity: 0.5}}>
              进入扫描仪式 →
            </button>
            <button onClick={() => setStep('welcome')} className="w-full py-3"
              style={DS.btnSecondary}>
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // [3] Quiz
  if (step === 'quiz') {
    const q = QUESTIONS[currentIndex]; if (!q) return null;
    const currentVal = answers[q.id];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    const isPartB = q.part === 'B';
    const accentColor = isPartB ? 'rgba(200,198,230,' : 'rgba(188,190,229,';
    return (
      <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden relative"
        style={{background: DS.pageBg}}>
        <div className="absolute inset-0 pointer-events-none"
          style={{background: isPartB
            ? 'radial-gradient(ellipse at 70% 25%, rgba(99,94,121,0.2) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 30% 20%, rgba(146,141,171,0.15) 0%, transparent 55%)'}} />
        {DS.waveSvg}
        <Particles />
        <div className="relative z-10 px-6 pt-8 pb-4 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <span style={{...DS.type.t4, fontWeight:700, color: DS.text.muted}}>
              <span style={{color: isPartB ? 'rgba(200,198,230,0.9)' : 'rgba(188,190,229,0.9)'}}>
                {currentIndex + 1}
              </span>
              {' '}/{' '}{QUESTIONS.length}
            </span>
            <span style={{...DS.label, color: isPartB ? 'rgba(200,198,230,0.75)' : 'rgba(146,141,171,0.85)'}}>
              PART {String(q.part)}
            </span>
          </div>
          <div style={{...DS.progressTrack, marginBottom: DS.space.md}}>
            <div style={isPartB ? DS.progressFillB(progress) : DS.progressFillA(progress)} />
          </div>
          <p style={{...DS.label, color: isPartB ? 'rgba(200,198,230,0.65)' : 'rgba(255,255,255,0.70)'}}>
            {String(q.dim)}
          </p>
        </div>
        <div className="relative z-10 px-8 max-w-md mx-auto w-full"
          style={{marginTop: DS.space.sm, marginBottom: DS.space.lg}}>
          <span style={{...DS.label, color: DS.text.ghost, fontFamily:'monospace',
            display:'block', marginBottom: DS.space.md}}>
            Q{String(currentIndex+1).padStart(2,'0')}
          </span>
          <h2 style={{...DS.type.t1, fontSize:'1.65rem', color: DS.text.primary,
            textShadow:'0 0 40px rgba(255,255,255,0.05)'}}>
            {String(q.text).replace('{target}', finalTarget)}
          </h2>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-end px-8 max-w-md mx-auto w-full">
          <div className="flex justify-between items-end gap-1 mb-10">
            {OPTIONS.map((opt) => {
              const isSelected = currentVal === opt.value;
              return (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                  className="flex flex-col items-center gap-2 flex-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                      background: isSelected
                        ? `radial-gradient(ellipse, ${accentColor}0.55) 0%, ${accentColor}0.15) 100%)`
                        : 'rgba(255,255,255,0.07)',
                      border: isSelected
                        ? `2px solid ${accentColor}0.85)`
                        : '1px solid rgba(255,255,255,0.18)',
                      boxShadow: isSelected
                        ? `0 0 16px ${accentColor}0.35) inset, 0 0 24px ${accentColor}0.15)`
                        : 'none',
                    }}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full"
                        style={{background: `${accentColor}0.9)`, boxShadow:`0 0 6px ${accentColor}0.8)`}} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em',
                    color: isSelected ? '#D0CEF0' : 'rgba(255,255,255,0.45)'
                  }}>
                    {String(opt.label)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 flex gap-3 px-6 pb-10 max-w-md mx-auto w-full">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="active:scale-90"
            style={{
              ...DS.btnSecondary,
              width: '56px', height: '56px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              opacity: currentIndex === 0 ? 0 : 1,
              pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              padding: 0,
            }}>
            <ArrowLeft className="w-5 h-5" style={{color: 'rgba(255,255,255,0.6)'}} />
          </button>
          <button
            onClick={() => currentVal && navigateToNext(currentIndex)}
            disabled={!currentVal}
            className="flex-1 active:scale-95"
            style={currentVal
              ? {...DS.btnPrimary(accentColor), height: '56px',
                  background: isPartB
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.15)'}
              : {...DS.btnSecondary, height: '56px', cursor: 'not-allowed', opacity: 0.4}}>
            {currentIndex === QUESTIONS.length - 1 ? '完成分析' : '下一题'}
          </button>
        </div>
      </div>
    );
  }

  // [4] 过渡页
  if (step === 'transition') return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-12 text-center font-sans relative overflow-hidden"
      style={{background: DS.pageBg}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(146,141,171,0.18) 0%, transparent 60%)'}} />
      {DS.waveSvg}
      <Particles />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full mb-10 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse, rgba(146,141,171,0.28) 0%, transparent 70%)',
            boxShadow: '0 0 40px rgba(146,141,171,0.18)',
            border: '1px solid rgba(188,190,229,0.2)'
          }}>
          <Fingerprint className="w-7 h-7" style={{color:'rgba(188,190,229,0.75)'}} />
        </div>
        <p style={{...DS.label, marginBottom: DS.space.sm}}>PART A 完成</p>
        <h2 style={{...DS.type.t1, fontSize:'1.5rem', color: DS.text.primary, marginBottom: DS.space.sm}}>
          关系损耗扫描完成
        </h2>
        <p style={{...DS.type.t3, color: 'rgba(255,255,255,0.75)',
          marginBottom: DS.space.lg, maxWidth:'240px', textAlign:'center'}}>
          接下来扫描你当前的<br/>
          <span style={{color:'rgba(200,198,230,0.85)'}}>内在能量补给状态</span>
        </p>
        <button
          onClick={() => { setStep('quiz'); setCurrentIndex(QUESTIONS.findIndex(q => q.part === 'B')); }}
          className="w-full max-w-xs active:scale-95"
          style={{...DS.btnPrimary(), height: '56px'}}>
          继续内在扫描
        </button>
      </div>
    </div>
  );

  // [5] 结果页
  if (step === 'result' && resultData) {
    const { roleName, color, bg, status, tag, definition, scene, behaviors, impact, advice, scoreA, radarData, dimScores, subRole, image, imageResult } = resultData;
    const displayImage = imageResult || image;

    if (showPoster) {
      const _roleColorMap = {
        'text-red-500':'rgba(121,71,71,','text-orange-500':'rgba(177,71,29,',
        'text-amber-400':'rgba(211,145,109,','text-yellow-400':'rgba(232,203,192,',
        'text-slate-400':'rgba(139,166,181,','text-fuchsia-400':'rgba(152,216,208,',
        'text-emerald-400':'rgba(0,201,150,','text-cyan-400':'rgba(203,180,212,',
        'text-blue-400':'rgba(152,216,208,','text-purple-400':'rgba(246,229,222,',
        'text-rose-400':'rgba(127,129,176,','text-indigo-400':'rgba(43,58,96,',
      };
      const _rc = _roleColorMap[color] || 'rgba(99,102,241,';
      const _roleBgMap = {
        'text-red-500':'linear-gradient(to bottom, #111111, #4e2020, #794747)',
        'text-orange-500':'linear-gradient(to bottom, #111111, #462904, #B1471D)',
        'text-amber-400':'linear-gradient(to bottom, #111111, #544a7d, #D3916D)',
        'text-yellow-400':'linear-gradient(to bottom, #111111, #636FA4, #E8CBC0)',
        'text-slate-400':'linear-gradient(to bottom, #111111, #334d50, #8BA6B5)',
        'text-fuchsia-400':'linear-gradient(to bottom, #111111, #181944, #98D8D0)',
        'text-emerald-400':'linear-gradient(to bottom, #111111, #003D4D, #00C996)',
        'text-cyan-400':'linear-gradient(to bottom, #111111, #20002C, #CBB4D4)',
        'text-blue-400':'linear-gradient(to bottom, #111111, #181944, #98D8D0)',
        'text-purple-400':'linear-gradient(to bottom, #111111, #5D6A73, #F6E5DE)',
        'text-rose-400':'linear-gradient(to bottom, #111111, #463151, #7F81B0)',
        'text-indigo-400':'linear-gradient(to bottom, #111111, #606C88, #2B3A60)',
      };
      const _pageBg = _roleBgMap[color] || 'linear-gradient(to bottom, #111111, #1a1a2e, #2B3A60)';
      return (
        <div style={{minHeight:'100vh', background: _pageBg, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', padding:'32px 24px', fontFamily:'sans-serif'}}>
          <div style={{width:'100%', maxWidth:'300px', position:'relative'}}>
            <button onClick={() => setShowPoster(false)} style={{
              position:'absolute', top:'-14px', right:'-14px', zIndex:20,
              width:'30px', height:'30px', background:'rgba(0,0,0,0.5)',
              borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', color:'white'}}>
              <X style={{width:'13px', height:'13px'}}/>
            </button>
            <div style={{borderRadius:'24px', border:`1px solid ${_rc}0.25)`,
              overflow:'hidden', background:'rgba(0,0,0,0.5)'}}>
              <div style={{padding:'20px 20px 16px', textAlign:'center'}}>
                <p style={{...DS.label, color:`${_rc}0.6)`, marginBottom:'8px'}}>关系能量分析</p>
                <h2 style={{fontSize:'1.7rem', fontWeight:800, letterSpacing:'-0.02em',
                  color:'#fff', lineHeight:1.1, marginBottom:'4px',
                  textShadow:`0 0 24px ${_rc}0.5)`}}>
                  {String(roleName)}
                </h2>
                <p style={{fontSize:'9px', fontWeight:600, letterSpacing:'0.2em',
                  color:`${_rc}0.6)`, textTransform:'uppercase'}}>
                  {String(tag)}
                </p>
              </div>
              <div style={{height:'1px', background:`linear-gradient(90deg, transparent, ${_rc}0.3), transparent)`}}/>
              {image && (
                <div style={{padding:'0 12px'}}>
                  <img src={image} alt={roleName} style={{width:'100%', display:'block', borderRadius:'12px'}}/>
                </div>
              )}
              <div style={{height:'1px', background:`linear-gradient(90deg, transparent, ${_rc}0.3), transparent)`}}/>
              <div style={{padding:'16px 20px 20px', textAlign:'center'}}>
                <p style={{fontSize:'12px', lineHeight:1.75, color:'rgba(255,255,255,0.65)', fontStyle:'italic'}}>
                  {scene ? String(scene) : String(definition)}
                </p>
                <p style={{fontSize:'8px', letterSpacing:'0.2em', color:'rgba(255,255,255,0.2)',
                  marginTop:'12px', textTransform:'uppercase'}}>
                  Psychic Vampires
                </p>
              </div>
            </div>
            <p style={{textAlign:'center', fontSize:'9px', letterSpacing:'0.12em',
              color:'rgba(255,255,255,0.18)', marginTop:'12px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'}}>
              <Download style={{width:'9px', height:'9px', opacity:0.4}}/>
              截图保存你的报告
            </p>
          </div>
        </div>
      );
    }

    const roleColorMap = {
      'text-red-500':'rgba(121,71,71,','text-orange-500':'rgba(177,71,29,',
      'text-amber-400':'rgba(211,145,109,','text-yellow-400':'rgba(232,203,192,',
      'text-slate-400':'rgba(139,166,181,','text-fuchsia-400':'rgba(152,216,208,',
      'text-emerald-400':'rgba(0,201,150,','text-cyan-400':'rgba(203,180,212,',
      'text-blue-400':'rgba(152,216,208,','text-purple-400':'rgba(246,229,222,',
      'text-rose-400':'rgba(127,129,176,','text-indigo-400':'rgba(43,58,96,',
    };
    const rc = roleColorMap[color] || 'rgba(99,102,241,';
    const roleAccentMap = {
      'text-red-500':'rgba(78,32,32,0.6)','text-orange-500':'rgba(70,41,4,0.6)',
      'text-amber-400':'rgba(84,74,125,0.5)','text-yellow-400':'rgba(99,111,164,0.5)',
      'text-slate-400':'rgba(51,77,80,0.6)','text-fuchsia-400':'rgba(24,25,68,0.6)',
      'text-emerald-400':'rgba(0,61,77,0.6)','text-cyan-400':'rgba(32,0,44,0.6)',
      'text-blue-400':'rgba(24,25,68,0.6)','text-purple-400':'rgba(93,106,115,0.5)',
      'text-rose-400':'rgba(70,49,81,0.6)','text-indigo-400':'rgba(96,108,136,0.5)',
    };
    const rc2 = roleAccentMap[color] || 'rgba(88,28,135,0.18)';
    const roleBgBase = {
      'text-red-500':'linear-gradient(to bottom, #111111, #4e2020, #794747)',
      'text-orange-500':'linear-gradient(to bottom, #111111, #462904, #B1471D)',
      'text-amber-400':'linear-gradient(to bottom, #111111, #544a7d, #D3916D)',
      'text-yellow-400':'linear-gradient(to bottom, #111111, #636FA4, #E8CBC0)',
      'text-slate-400':'linear-gradient(to bottom, #111111, #334d50, #8BA6B5)',
      'text-fuchsia-400':'linear-gradient(to bottom, #111111, #181944, #98D8D0)',
      'text-emerald-400':'linear-gradient(to bottom, #111111, #003D4D, #00C996)',
      'text-cyan-400':'linear-gradient(to bottom, #111111, #20002C, #CBB4D4)',
      'text-blue-400':'linear-gradient(to bottom, #111111, #181944, #98D8D0)',
      'text-purple-400':'linear-gradient(to bottom, #111111, #5D6A73, #F6E5DE)',
      'text-rose-400':'linear-gradient(to bottom, #111111, #463151, #7F81B0)',
      'text-indigo-400':'linear-gradient(to bottom, #111111, #606C88, #2B3A60)',
    };
    const pageBg = roleBgBase[color] || 'linear-gradient(to bottom, #111111, #1a1a2e, #2B3A60)';
    const roleProgressFill = (pct) => ({
      width: `${pct}%`, height: '100%', borderRadius: '2px',
      background: `linear-gradient(90deg, ${rc}0.5), ${rc}0.85))`,
      boxShadow: `0 0 10px ${rc}0.4)`,
      transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
    });

    // 把 advice 里的 **text** 转成加粗段落
    const renderAdvice = (text) => {
      return text.split('\n\n').map((para, i) => {
        const boldMatch = para.match(/^\*\*(.+?)\*\*(.*)$/s);
        if (boldMatch) {
          return (
            <p key={i} style={{...DS.type.t3, color:'rgba(255,255,255,0.72)', marginBottom:'10px'}}>
              <span style={{fontWeight:700, color:`${rc}1)`, display:'block', marginBottom:'4px'}}>
                {boldMatch[1]}
              </span>
              {boldMatch[2].trim()}
            </p>
          );
        }
        return <p key={i} style={{...DS.type.t3, color:'rgba(255,255,255,0.72)', marginBottom:'10px'}}>{para}</p>;
      });
    };

    return (
      <div className="min-h-screen text-white font-sans relative overflow-x-hidden" style={{background: pageBg}}>
        <style>{`
          @keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-140px) scale(0.2); opacity: 0; } }
          .particle { animation: floatUp linear infinite; }
          @keyframes pulseGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        `}</style>
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
          <div style={{position:'absolute', top:'-15%', left:'-25%', width:'100%', height:'70%',
            background:`radial-gradient(ellipse, ${rc}0.40) 0%, transparent 65%)`,
            filter:'blur(90px)', animation:'pulseGlow 6s ease-in-out infinite'}}/>
          <div style={{position:'absolute', bottom:'5%', right:'-20%', width:'75%', height:'55%',
            background:`radial-gradient(ellipse, ${rc2} 0%, transparent 65%)`, filter:'blur(80px)'}}/>
          <div style={{position:'absolute', top:'35%', left:'10%', width:'80%', height:'50%',
            background:`radial-gradient(ellipse, ${rc}0.14) 0%, transparent 65%)`, filter:'blur(110px)'}}/>
          {[{l:'8%',t:'22%',d:'0s',dur:'8s',s:2.5},{l:'22%',t:'45%',d:'3s',dur:'10s',s:3},
            {l:'68%',t:'18%',d:'1.2s',dur:'7s',s:2},{l:'82%',t:'52%',d:'4s',dur:'9s',s:2.5},
            {l:'44%',t:'72%',d:'2s',dur:'8s',s:3}].map((p,i)=>(
            <div key={i} className="particle absolute rounded-full" style={{
              left:p.l, top:p.t, width:p.s, height:p.s,
              background:`${rc}0.7)`, animationDelay:p.d, animationDuration:p.dur,
              boxShadow:`0 0 ${p.s*6}px ${rc}1)`}}/>
          ))}
        </div>

        <div className="relative max-w-md mx-auto px-5 pt-10 pb-12" style={{zIndex:1}}>

          {/* ① HERO */}
          <section className="text-center" style={{marginBottom:'24px'}}>
            <div style={{display:'inline-flex', alignItems:'center', gap:'6px',
              background:`${rc}0.18)`, border:`1px solid ${rc}0.5)`,
              borderRadius:'999px', padding:'4px 14px', marginBottom:'20px'}}>
              <div style={{width:'5px', height:'5px', borderRadius:'50%',
                background:`${rc}1)`, boxShadow:`0 0 8px ${rc}1)`}}/>
              <span style={{...DS.label, color:`${rc}1)`, letterSpacing:'0.2em'}}>{String(status)}</span>
            </div>
            <h2 style={{fontSize:'clamp(3rem, 12vw, 4.5rem)', fontWeight:800, lineHeight:1.0,
              letterSpacing:'-0.04em', color:DS.text.primary,
              textShadow:`0 0 60px ${rc}0.6), 0 0 120px ${rc}0.25)`, marginBottom:'12px'}}>
              {String(roleName)}
            </h2>
            <p style={{fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.18em',
              color:'rgba(255,255,255,0.85)', marginBottom:'28px'}}>
              {String(tag)}
            </p>
            <div style={{width:'40px', height:'1px', margin:'0 auto 24px',
              background:`linear-gradient(90deg, transparent, ${rc}0.8), transparent)`}}/>
            <p style={{...DS.type.t3, color:'rgba(255,255,255,0.72)', maxWidth:'280px', margin:`0 auto ${DS.space.sm}`}}>
              {String(definition)}
            </p>
            {scene && (
              <p style={{...DS.type.t3, fontStyle:'italic', fontWeight:700, color:`${rc}0.9)`,
                textShadow:`0 0 16px ${rc}0.3)`, maxWidth:'260px', margin:'16px auto 0',
                borderLeft:`2px solid ${rc}0.5)`, paddingLeft:'12px', textAlign:'left'}}>
                {String(scene)}
              </p>
            )}
            {subRole && (
              <div style={{...DS.cardInner, background:`${rc}0.08)`, border:`1px solid ${rc}0.28)`,
                marginTop:'24px', padding:'16px 20px', textAlign:'left'}}>
                <p style={{...DS.label, color:'rgba(255,255,255,0.80)', marginBottom:DS.space.xs}}>副机制</p>
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                  <span style={{...DS.type.t2, color:`${rc}1)`, textShadow:`0 0 12px ${rc}0.4)`}}>
                    {String(subRole.name)}
                  </span>
                  <span style={{...DS.type.t4, color:DS.text.muted}}>· {String(subRole.dim)}</span>
                </div>
                <p style={{...DS.type.t3, color:DS.text.tertiary}}>{String(subRole.definition)}</p>
              </div>
            )}
          </section>

          {/* ② 插画区 */}
          <section style={{marginBottom:'16px'}}>
            {displayImage ? (
              <img src={displayImage} alt={roleName} style={{
                width:'100%', display:'block', borderRadius:'20px', border:`1px solid ${rc}0.20)`}}/>
            ) : (
              <div style={{height:'220px', display:'flex', alignItems:'center', justifyContent:'center',
                border:`1px solid ${rc}0.12)`, borderRadius:'20px'}}>
                <p style={{...DS.label, color:`${rc}0.25)`}}>插画 · {String(roleName)}</p>
              </div>
            )}
          </section>

          {/* ③ 常见互动 + 消耗 */}
          <section style={{...DS.card, border:`1px solid ${rc}0.20)`, marginBottom:DS.space.sm}}>
            <div style={{padding:'24px 24px 20px', borderBottom:`1px solid ${rc}0.10)`}}>
              <p style={{...DS.label, color:'rgba(255,255,255,0.80)', marginBottom:DS.space.sm}}>常见互动表现</p>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {behaviors.map((b,i)=>(
                  <div key={i} style={{display:'flex', alignItems:'flex-start', gap:'12px'}}>
                    <div style={{width:'5px', height:'5px', borderRadius:'50%', marginTop:'8px', flexShrink:0,
                      background:`${rc}1)`, boxShadow:`0 0 6px ${rc}0.8)`}}/>
                    <p style={{...DS.type.t3, color:'rgba(255,255,255,0.72)'}}>{String(b)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:'20px 24px 24px'}}>
              <p style={{...DS.label, color:'rgba(255,255,255,0.80)', marginBottom:DS.space.sm}}>能量消耗</p>
              <p style={{...DS.type.t3, color:'rgba(255,255,255,0.72)'}}>{String(impact)}</p>
            </div>
          </section>

          {/* ④ Part A 维度 */}
          <section style={{...DS.card, border:`1px solid ${rc}0.18)`, marginBottom:DS.space.sm}}>
            <div style={{padding:'24px 24px 20px', borderBottom:`1px solid ${rc}0.10)`}}>
              <p style={{...DS.label, color:'rgba(255,255,255,0.80)', marginBottom:DS.space.xs}}>A · 外部能量损耗</p>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',
                marginTop:DS.space.sm, marginBottom:'8px'}}>
                <span style={{...DS.label, color:DS.text.muted}}>关系消耗程度</span>
                <span style={{fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em',
                  color:`${rc}1)`, textShadow:`0 0 20px ${rc}0.5)`, lineHeight:1}}>
                  {Math.round((scoreA/120)*100)}%
                </span>
              </div>
              <div style={DS.progressTrack}>
                <div style={roleProgressFill(Math.round((scoreA/120)*100))}/>
              </div>
            </div>
            <div style={{padding:'4px 16px 0'}}>
              <RadarChart data={radarData}/>
            </div>
            <div style={{padding:`0 16px ${DS.space.md}`, display:'flex', flexDirection:'column', gap:DS.space.xs}}>
              {DIMENSIONS.slice(0,6).map((dim,idx)=>{
                const maxVal=25, score=dimScores[dim]||0, ratio=score/maxVal;
                let stateLabel='平稳', stateColor='rgba(52,211,153,0.9)', levelKey='stable';
                if(ratio>0.75){stateLabel='过载'; stateColor=`${rc}1)`; levelKey='overload';}
                else if(ratio>0.5){stateLabel='活跃'; stateColor='rgba(251,146,60,0.9)'; levelKey='active';}
                const bgState=stateColor.replace(/,[\d.]+\)$/,',0.12)');
                const brdState=stateColor.replace(/,[\d.]+\)$/,',0.35)');
                return (
                  <div key={idx} style={{...DS.cardInner, padding:`${DS.space.sm} 16px`}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <span style={{...DS.label, color:DS.text.ghost}}>{String(idx+1).padStart(2,'0')}</span>
                        <span style={{...DS.type.t2, color:DS.text.primary}}>{String(dim)}</span>
                        <span style={{fontSize:'8px', fontWeight:700, padding:'2px 8px', borderRadius:'999px',
                          color:stateColor, background:bgState, border:`1px solid ${brdState}`}}>
                          {stateLabel}
                        </span>
                      </div>
                      <span style={{fontSize:'0.875rem', fontWeight:700,
                        color:ratio>0.5?`${rc}1)`:DS.text.muted, fontVariantNumeric:'tabular-nums',
                        textShadow:ratio>0.5?`0 0 10px ${rc}0.4)`:'none'}}>
                        {score}/{maxVal}
                      </span>
                    </div>
                    <div style={{...DS.progressTrack, marginBottom:DS.space.sm}}>
                      <div style={roleProgressFill(ratio*100)}/>
                    </div>
                    <p style={{...DS.type.t4, color:DS.text.muted, marginBottom:'6px'}}>{String(DIMENSION_DESCS[dim])}</p>
                    <p style={{...DS.type.t4, color:DS.text.ghost, marginBottom:DS.space.sm}}>{String(DIMENSION_SCORE_DESC[dim])}</p>
                    <p style={{...DS.type.t3, color:'rgba(255,255,255,0.72)'}}>{String(DIMENSION_LEVEL_DESC[dim]?.[levelKey]||'')}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ⑤ Part B */}
          {(()=>{
            const dim=DIMENSIONS[6], maxVal=40, score=dimScores[dim]||0, ratio=score/maxVal;
            let stateLabel='平稳', stateColor='rgba(52,211,153,0.9)', levelKey='stable';
            if(ratio>0.75){stateLabel='需关注'; stateColor=`${rc}1)`; levelKey='overload';}
            else if(ratio>0.5){stateLabel='活跃'; stateColor='rgba(251,146,60,0.9)'; levelKey='active';}
            const bgState=stateColor.replace(/,[\d.]+\)$/,',0.12)');
            const brdState=stateColor.replace(/,[\d.]+\)$/,',0.35)');
            return (
              <section style={{...DS.card, background:'rgba(0,0,0,0.20)', border:`1px solid ${rc}0.28)`,
                marginBottom:DS.space.sm, position:'relative', overflow:'hidden'}}>
                <Fingerprint style={{position:'absolute', top:'12px', right:'12px',
                  width:'80px', height:'80px', pointerEvents:'none', color:`${rc}0.08)`, strokeWidth:1.5}}/>
                <div style={{padding:'24px 24px 20px', borderBottom:`1px solid ${rc}0.15)`}}>
                  <p style={{...DS.label, color:'rgba(255,255,255,0.80)', marginBottom:'6px'}}>B · 内在能量状态</p>
                  <p style={{...DS.type.t4, color:DS.text.muted}}>你是否正在无意识地消耗身边的人</p>
                </div>
                <div style={{padding:'20px 24px 24px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <span style={{...DS.type.t2, color:DS.text.primary}}>{String(dim)}</span>
                      <span style={{fontSize:'8px', fontWeight:700, padding:'2px 8px', borderRadius:'999px',
                        color:stateColor, background:bgState, border:`1px solid ${brdState}`}}>
                        {stateLabel}
                      </span>
                    </div>
                    <span style={{fontSize:'0.875rem', fontWeight:700,
                      color:ratio>0.5?`${rc}1)`:DS.text.muted, fontVariantNumeric:'tabular-nums',
                      textShadow:ratio>0.5?`0 0 10px ${rc}0.4)`:'none'}}>
                      {score}/{maxVal}
                    </span>
                  </div>
                  <div style={{...DS.progressTrack, marginBottom:DS.space.md}}>
                    <div style={roleProgressFill(ratio*100)}/>
                  </div>
                  <p style={{...DS.type.t4, color:DS.text.muted, marginBottom:'6px'}}>{String(DIMENSION_DESCS[dim])}</p>
                  <p style={{...DS.type.t4, color:DS.text.ghost, marginBottom:DS.space.sm}}>{String(DIMENSION_SCORE_DESC[dim])}</p>
                  <p style={{...DS.type.t3, color:'rgba(255,255,255,0.72)'}}>{String(DIMENSION_LEVEL_DESC[dim]?.[levelKey]||'')}</p>
                </div>
              </section>
            );
          })()}

          {/* ⑥ 建议卡片 — 内容加厚 */}
          <section style={{borderRadius:'20px', background:rc2, border:`1px solid ${rc}0.35)`, marginBottom:'40px'}}>
            <div style={{padding:'24px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:DS.space.sm}}>
                <div style={{width:'3px', height:'20px', borderRadius:'2px',
                  background:`${rc}1)`, boxShadow:`0 0 10px ${rc}0.7)`, flexShrink:0}}/>
                <p style={{...DS.label, color:'rgba(255,255,255,0.80)'}}>你可以尝试</p>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                {renderAdvice(String(advice))}
              </div>
            </div>
          </section>

          {/* ⑦ 底部按钮 */}
          <section style={{display:'flex', flexDirection:'row', gap:'12px', paddingBottom:'40px'}}>
            <button onClick={() => window.location.reload()}
              className="active:scale-95"
              style={{flex:1, height:'56px', background:'rgba(255,255,255,0.10)',
                backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.20)',
                borderRadius:'9999px', color:'#F2F3FB', fontWeight:700, fontSize:'0.85rem',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                transition:'transform 0.15s'}}>
              <RefreshCcw style={{width:'13px', height:'13px'}}/> 重测
            </button>
            <button onClick={() => setShowPoster(true)}
              className="active:scale-95"
              style={{flex:2, height:'56px', background:'rgba(255,255,255,0.10)',
                backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.20)',
                borderRadius:'9999px', color:'#F2F3FB', fontWeight:700, fontSize:'0.9rem',
                letterSpacing:'0.04em', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                transition:'transform 0.15s'}}>
              <Share2 style={{width:'15px', height:'15px'}}/> 导出卡片报告
            </button>
          </section>

        </div>
      </div>
    );
  }
  return null;
}
