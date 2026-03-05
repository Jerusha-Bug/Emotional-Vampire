import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, RefreshCcw, ShieldCheck, Zap, 
  ArrowLeft, ArrowRight, Fingerprint, Activity, 
  Sparkles, BookOpen, Timer, ListChecks, BarChart3, UserCheck, HeartPulse,
  AlertTriangle, ShieldAlert, CheckCircle2, X, Download, Lock, Unlock, Key, Eye
} from 'lucide-react';

// --- Supabase 配置 ---
const SUPABASE_URL = 'https://rfazkfbaqmrxcsudefiu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9ksrRzUpTr_nUM4cAwN0WQ_NBD-gcfN';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 授权配置 ---
const ACCESS_CODE = "6688"; 

// --- 选项配置 ---
const OPTIONS = [
  { label: "从不", value: 1 }, { label: "很少", value: 2 }, { label: "有时", value: 3 }, { label: "经常", value: 4 }, { label: "总是", value: 5 }
];

const DIMENSIONS = ["情绪倾倒", "受害叙述", "责任转移", "依赖绑定", "冲突激发", "自我消耗", "内在补能模式"];

const DIMENSION_DESCS = {
  "情绪倾倒": "这反映了对方是否将你视为单纯的情绪宣泄口。分值越高，意味着你正在这段关系中被迫消化大量的‘情绪垃圾’。",
  "受害叙述": "这反映了对方是否通过展示弱势来博取你的同情。分值越高，代表你越容易在对方的‘无助感’面前感到亏欠和疲惫。",
  "责任转移": "这反映了关系中责任承担的失衡。分值越高，意味着你在互动中承担了过多不属于你的过错和后果。",
  "依赖绑定": "这反映了对方是否在通过‘没你不行’来捆绑你的自由。分值越高，代表你背负的心理照顾压力越沉重。",
  "冲突激发": "这反映了互动中的摩擦频率。分值越高，意味着你们之间的大量能量都耗费在了无效的试探与争执中。",
  "自我消耗": "这是最直接的生命力流失。分值越高，代表你的自我认同感正在被这段互动慢慢磨损。",
  "内在补能模式": "这反映了你当前内心的‘能量余额’。分值越高，代表你现在的内心越‘饥饿’，越容易因为渴望外界的一点光亮而忽略了自身的流失。"
};

const QUESTIONS = [
  { id: 1, part: "A", dim: "情绪倾倒", text: "和{target}相处后，我会感到疲惫。" },
  { id: 2, part: "A", dim: "情绪倾倒", text: "我需要花很多精力安抚{target}的情绪。" },
  { id: 3, part: "A", dim: "情绪倾倒", text: "{target}经常向我倾倒负面情绪。" },
  { id: 4, part: "A", dim: "情绪倾倒", text: "我需要压抑自己的真实感受去配合{target}。" },
  { id: 5, part: "A", dim: "情绪倾倒", text: "和{target}沟通让我有心理负担。" },
  { id: 6, part: "A", dim: "受害叙述", text: "我担心向{target}表达真实想法会引发冲突。" },
  { id: 7, part: "A", dim: "受害叙述", text: "我会因为{target}的态度而情绪波动很大。" },
  { id: 8, part: "A", dim: "受害叙述", text: "我经常猜测{target}是不是对我不满。" },
  { id: 9, part: "A", dim: "受害叙述", text: "我在这段关系中缺乏稳定感。" },
  { id: 10, part: "A", dim: "受害叙述", text: "我害怕失去这段关系。" },
  { id: 11, part: "A", dim: "责任转移", text: "{target}会干涉我的 decision 或生活。" },
  { id: 12, part: "A", dim: "责任转移", text: "我很难拒绝{target}的请求。" },
  { id: 13, part: "A", dim: "责任转移", text: "即使不愿意，我也会答应{target}。" },
  { id: 14, part: "A", dim: "责任转移", text: "我觉得自己需要为{target}的情绪负责。" },
  { id: 15, part: "A", dim: "责任转移", text: "我很少向{target}表达自己的需求。" },
  { id: 16, part: "A", dim: "依赖绑定", text: "我付出的比{target}多。" },
  { id: 17, part: "A", dim: "依赖绑定", text: "{target}很少关心我的感受。" },
  { id: 18, part: "A", dim: "依赖绑定", text: "我觉得这段关系不够公平。" },
  { id: 19, part: "A", dim: "依赖绑定", text: "{target}只在需要时才联系我。" },
  { id: 20, part: "A", dim: "依赖绑定", text: "我很少从这段关系中获得支持。" },
  { id: 21, part: "A", dim: "冲突激发", text: "我和{target}的沟通经常变成争吵。" },
  { id: 22, part: "A", dim: "冲突激发", text: "{target}会指责或否定我。" },
  { id: 23, part: "A", dim: "冲突激发", text: "冲突后通常是我先向{target}道歉。" },
  { id: 24, part: "A", dim: "冲突激发", text: "{target}会回避问题不沟通。" },
  { id: 25, part: "A", dim: "冲突激发", text: "小问题会被放大成大矛盾。" },
  { id: 26, part: "A", dim: "自我消耗", text: "这段关系让你怀疑自己的价值。" },
  { id: 27, part: "A", dim: "自我消耗", text: "你为了维持关系改变了自己。" },
  { id: 28, part: "A", dim: "自我消耗", text: "我会反复回想{target}说过的话。" },
  { id: 29, part: "A", dim: "自我消耗", text: "你在这段关系中感到内耗。" },
  { id: 30, part: "A", dim: "自我消耗", text: "我有想过疏远{target}。" },
  { id: 31, part: "B", dim: "内在补能模式", text: "我觉得周围的人大多都带着一身麻烦，需要我去关注。" },
  { id: 32, part: "B", dim: "内在补能模式", text: "我觉得自己对人生中发生的大部分事情都无能为力。" },
  { id: 33, part: "B", dim: "内在补能模式", text: "在我真正需要帮助时，身边几乎找不到可以依靠的人。" },
  { id: 34, part: "B", dim: "内在补能模式", text: "相比其他人，我总觉得自己在达成目标的过程中阻碍重重。" },
  { id: 35, part: "B", dim: "内在补能模式", text: "我认为人与人之间很难达成真正的理解，大家并不善于倾听。" },
  { id: 36, part: "B", dim: "内在补能模式", text: "我常觉得我所处环境中，别人生活得比我更艰难，我必须为此做点什么。" },
  { id: 37, part: "B", dim: "内在补能模式", text: "我在人际关系中经常遭遇背叛，或者被我信任的人伤害。" },
  { id: 38, part: "B", dim: "内在补能模式", text: "我觉得自己付出的努力，并没有得到环境应有的认可。" }
];

const RESULT_MATRIX = {
  // 内在稳健型 (B-LOW)
  "HEALTHY_STABLE": { name: "能量自洽星人", tag: "互动平衡 · 损耗极低", color: "text-emerald-400", bg: "from-emerald-950/40", status: "Healthy", desc: "损耗发现：你与 TA 之间形成了高透明度的能量闭环。你具备强大的心理免疫力，能自然地过滤潜在的损耗，保持个人能量场的稳健。", advice: "目前的互动非常健康，请继续保持这种平衡的补能节奏。" },
  "FLUCTUATING_STABLE": { name: "边界探索者", tag: "隐性试探 · 动态调整", color: "text-blue-400", bg: "from-blue-950/40", status: "Moderate", desc: "损耗发现：关系中存在一些不稳定的能量渗漏，你们正在互相试探边界。虽然目前没有严重透支，但偶尔沟通疲劳说明需要明确互动协议了。", advice: "尝试在感到微小疲惫时就主动表达，不要让‘小渗漏’变成‘大缺口’。" },
  "BURDENED_STABLE": { name: "高频负重承担者", tag: "单向透支 · 能量发电机", color: "text-orange-400", bg: "from-orange-950/40", status: "Warning", desc: "损耗发现：你正在这段关系中扮演‘能量供给站’的角色。大量能量通过情绪倾倒口径流失到了对方身上，你的心理防线已显疲态。", advice: "你需要暂时关闭能量输出，学习识别那些不属于你的责任，找回属于自己的休息空间。" },
  "CRISIS_STABLE": { name: "孤勇承受者", tag: "极限抗压 · 系统性流失", color: "text-rose-500", bg: "from-rose-950/40", status: "Critical", desc: "损耗发现：损耗已达到临界点。尽管你内核稳定，但长期的单向输出正让你陷入‘能量休克’。对方的吸能模式已经严重干扰了你的正常生活。", advice: "立即停止解释和自证。物理隔离是最高优先级的自救行动。" },

  // 内在寻求型 (B-MID)
  "HEALTHY_SEEKING": { name: "内核重构状态", tag: "自我觉察 · 补给期", color: "text-indigo-400", bg: "from-indigo-950/40", status: "Cautious", desc: "损耗发现：外部关系尚算平稳，但你正处于一个深刻的自我审视阶段。你开始察觉到内心的某些渴望，正在寻找更稳定的补能方式。", advice: "关注你的内在节奏，外部认可是辅助，自我的肯定才是核心燃料。" },
  "FLUCTUATING_SEEKING": { name: "动态平衡模式", tag: "亚健康互动 · 存量博弈", color: "text-cyan-400", bg: "from-cyan-950/40", status: "Moderate", desc: "损耗发现：这是典型的‘拉扯地带’。你们在互动中既有依赖也有排斥，能量在反复磨损中被消耗。这是一种隐性的、长期的不满足感。", advice: "打破‘理所当然’的互动惯性，试着从被动应对转为主动建立新的互动边界。" },
  "BURDENED_SEEKING": { name: "疲惫维系个体", tag: "高压互动 · 局部过载", color: "text-amber-500", bg: "from-amber-950/40", status: "Warning", desc: "损耗发现：你承受着显著的外部压力，同时内在防御也略显疲态。这种双重拉扯让你在处理关系冲突时变得迟钝，容易在妥协中进一步流失能量。", advice: "优先处理那些让你最感到疲惫的任务。减少非必要的深度社交，把能量留给自己。" },
  "CRISIS_SEEKING": { name: "系统性透支源", tag: "双重崩溃 · 能量工伤", color: "text-red-400", bg: "from-red-950/40", status: "Critical", desc: "损耗发现：警告，你的能量系统正在全面报警。长期的损耗已经击穿了你的调适空间，你正处于一种‘为了活着而勉强互动’的濒危状态。", advice: "不要尝试去解决任何关系问题，现在的你没有余额。先去一个能让你感到绝对安全的地方。" },

  // 内在匮乏型 (B-HIGH)
  "HEALTHY_EMPTY": { name: "荒原守望者", tag: "内核空洞 · 潜在代偿", color: "text-purple-400", bg: "from-purple-950/40", status: "Cautious", desc: "损耗发现：虽然外部关系目前温和，但你内心的‘能量黑洞’极大。你可能因为害怕失去，而在潜意识里过度关注对方需求来换取存在的证据。", advice: "外界的灯火只是路标，你需要尝试在荒原中挖掘自己的水源，学习如何无条件地支持自己。" },
  "FLUCTUATING_EMPTY": { name: "焦虑抓取模式", tag: "恐惧驱动 · 敏感互动", color: "text-fuchsia-400", bg: "from-fuchsia-950/40", status: "Warning", desc: "损耗发现：由于内在能量的匮乏，你对关系中的微小变动非常敏感。这种敏感导致了不必要的互动损耗，形成了‘因恐惧流失而流失更多’的恶性循环。", advice: "停止向外索要‘确定的爱’。从最小的、能让自己愉悦的行动开始，重建你的自爱储蓄池。" },
  "BURDENED_EMPTY": { name: "情感代偿客", tag: "牺牲换爱 · 深度透支", color: "text-pink-500", bg: "from-pink-950/40", status: "Critical", desc: "损耗发现：你正在通过‘自我毁灭式’的付出来换取对方的一点点认可。这种互动模式让你成为了对方最完美的‘吸能目标’，损耗已深入骨髓。", advice: "看清那个‘我必须有用才值得被爱’的谎言。现在的你最需要的是停止任何形式的输出。" },
  "HIGH_HIGH": { name: "深度纠缠沉沦者", tag: "相互吞噬 · 能量枯竭", color: "text-red-600", bg: "from-red-950/40", status: "Danger", desc: "损耗发现：最高危机。你们正处于‘能量相互残杀’的极端阶段。两个匮乏的人在泥潭中疯狂拉扯，系统性地摧毁生命力。", advice: "物理与心理的‘双重撤离’是唯一的生机。在能量彻底枯竭前，必须斩断这一消耗链条。" }
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
  const [targetPerson, setTargetPerson] = useState('');
  const [unlockCode, setUnlockCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  const isUnlocked = useMemo(() => unlockCode === ACCESS_CODE, [unlockCode]);
  const finalTarget = targetPerson.trim() || 'TA';

  const navigateToNext = (currentIdx) => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (currentIdx === 29) setStep('transition');
    else if (currentIdx < QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
    else setStep('result');
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleStart = async () => { if (isUnlocked) setStep('quiz'); };

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
    const topDim = DIMENSIONS.slice(0, 6).reduce((a, b) => dimScores[a] > dimScores[b] ? a : b);
    
    // --- 4x3 判定逻辑 ---
    const getLevelA = (s) => {
      if (s <= 55) return "HEALTHY";
      if (s <= 90) return "FLUCTUATING";
      if (s <= 120) return "BURDENED";
      return "CRISIS";
    };
    const getLevelB = (s) => {
      if (s <= 16) return "STABLE";
      if (s <= 27) return "SEEKING";
      return "EMPTY";
    };

    const lA = getLevelA(scoreA);
    const lB = getLevelB(scoreB);
    const typeKey = (lA === "CRISIS" && lB === "EMPTY") ? "HIGH_HIGH" : `${lA}_${lB}`;
    const baseResult = RESULT_MATRIX[typeKey] || RESULT_MATRIX["HEALTHY_STABLE"];
    
    let vulnerabilityReason = "";
    if (lB === "EMPTY") {
      vulnerabilityReason = "你之所以成为‘能量流失点’，核心在于你内在的高匮乏感。因为极度渴望外界认可来填补空洞，你会在潜意识里通过‘牺牲’来交换安全感。吸能者正是识别到了这种模式，将你锁定为优质供应源。";
    } else if (lB === "SEEKING") {
      vulnerabilityReason = "你成为目标源于你摇摆不定的心理防线。在冲突面前，你习惯性地选择‘有限度的妥协’。这种‘防御性退缩’给了对方试探和蚕食你领地的借口，让他们觉得你的能量是可以被‘谈’出来的。";
    } else {
      vulnerabilityReason = "虽然内核稳定，但你被拉入损耗多半源于高度同理心。吸能者利用了你的善良，通过诉说不幸或转嫁责任，让你在不知不觉中背负了不属于你的负重，成为了义务发电机。";
    }

    return { ...baseResult, scoreA, scoreB, radarData, dimScores, topDim, vulnerabilityReason };
  }, [step, answers]);

  // --- 欢迎页 ---
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-indigo-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-purple-600 rounded-full blur-[150px]"></div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-8 bg-white/5 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div> 流失追踪 · 能量损耗分析
        </div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter leading-[1.1] text-center">关系能量与<br/>心理防御双维度测评</h1>
        <p className="text-slate-400 text-sm mb-12 max-w-xs text-center leading-relaxed opacity-70">揭秘互动中的能量流失真相<br/>识别并追踪你的损耗出口</p>
        <div className="w-full max-w-sm mb-8 space-y-4 text-center">
          <input type="text" placeholder="你想分析哪段关系? (如：妈妈/爱人)" className="w-full bg-white/5 border border-white/10 p-5 rounded-[2rem] text-sm text-center focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 mx-auto block" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
          <div className="relative group">
            <input type="text" placeholder="请输入专属解锁码" className={`w-full bg-white/5 border p-5 rounded-[2rem] text-sm text-center focus:outline-none transition-all placeholder:text-slate-700 font-mono tracking-[0.2em] ${isUnlocked ? 'border-emerald-500/50 text-emerald-400' : 'border-white/10 text-white'}`} value={unlockCode} onChange={(e) => setUnlockCode(e.target.value)} />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">{isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}</div>
          </div>
          <button onClick={handleStart} disabled={!isUnlocked} className={`w-full py-5 transition-all rounded-[2rem] font-black text-lg shadow-2xl flex items-center justify-center gap-2 ${isUnlocked ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40 active:scale-95 cursor-pointer' : 'bg-slate-900 text-slate-700 border border-white/5 cursor-not-allowed opacity-50'}`}>{!isUnlocked && <Lock className="w-5 h-5" />}{isUnlocked ? "开启能量损耗分析 →" : "请输入解锁码以开启"}</button>
        </div>
        <div className="max-w-sm w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem] backdrop-blur-sm mt-4">
          <div className="flex items-start gap-3 text-left">
             <BookOpen className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
             <div className="space-y-2 text-left">
                <p className="text-xs text-slate-300 font-bold leading-relaxed">核心逻辑源自 Stéphane Clerget 著作：<br/><span className="text-indigo-400 italic font-medium">《Les vampires psychiques》</span></p>
                <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-80 text-justify">整合亲子关系及情绪发展理论，不仅看“谁在吸你的能”，更看“你为何成为目标”。</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 答题页 ---
  if (step === 'quiz') {
    const q = QUESTIONS[currentIndex]; if (!q) return null;
    const currentVal = answers[q.id]; const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 font-sans">
        <div className="max-w-md mx-auto w-full px-2">
            <div className="flex items-center justify-between mb-2 mt-4 px-1">
              <div className="flex flex-col"><span className="text-lg font-black tracking-tighter"><span className="text-indigo-500 font-black">{currentIndex + 1}</span><span className="text-slate-700 font-bold"> / 38</span></span></div>
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">PART {String(q.part)}</div>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full mb-5 overflow-hidden relative mx-auto"><div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} /></div>
            <div className="flex items-center gap-2 mb-8 text-left pl-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div><span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{String(q.dim)}</span></div>
        </div>
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          <div className="bg-white/[0.03] border border-white/[0.05] px-10 rounded-[2.5rem] mb-12 shadow-2xl backdrop-blur-sm relative h-56 flex flex-col justify-center overflow-hidden text-left">
             <span className="absolute top-10 left-10 text-[10px] font-bold text-indigo-500/40 block tracking-[0.2em] font-mono">Q{String(currentIndex+1).padStart(2,'0')}</span>
             <h2 className="text-2xl font-bold text-slate-100 leading-snug w-full">{String(q.text).replace('{target}', finalTarget)}</h2>
          </div>
          <div className="flex justify-between items-start gap-2 mb-12 px-2">
            {OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="flex flex-col items-center gap-3 flex-1 group">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 font-black text-lg ${currentVal === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110' : 'bg-white/5 border-white/10 text-slate-500 group-hover:border-indigo-500/50 active:scale-90'}`}>{opt.value}</div>
                <span className={`text-[10px] font-bold tracking-tight text-center ${currentVal === opt.value ? 'text-indigo-400 font-black' : 'text-slate-600'}`}>{String(opt.label)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mb-6 mt-auto max-w-md mx-auto w-full">
            <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 border-white/10 text-slate-500 active:scale-90 hover:bg-white/10'}`}><ArrowLeft className="w-6 h-6" /></button>
            <button onClick={() => currentVal && navigateToNext(currentIndex)} disabled={!currentVal} className={`flex-1 h-16 rounded-[1.5rem] font-black text-lg transition-all ${!currentVal ? 'bg-slate-900 text-slate-700 border border-white/5' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 active:scale-95'}`}>{currentIndex === QUESTIONS.length - 1 ? '完成分析' : '下一题'}</button>
        </div>
      </div>
    );
  }

  // --- 过渡页 ---
  if (step === 'transition') return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-12 text-center">
      <Fingerprint className="w-16 h-16 text-indigo-400 mb-8 animate-pulse" />
      <h2 className="text-2xl font-black mb-4 tracking-tighter">关系损耗扫描已完成</h2>
      <p className="text-slate-500 text-sm mb-12 leading-relaxed italic opacity-80">接下来扫描你当前的<span className="text-indigo-400 font-bold">内在能量补给状态</span></p>
      <button onClick={() => { setStep('quiz'); setCurrentIndex(30); }} className="w-full max-w-xs py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg active:scale-95 shadow-xl">继续内在扫描</button>
    </div>
  );

  // --- 结果页 ---
  if (step === 'result' && resultData) {
    const { name, tag, desc, advice, color, bg, status, scoreA, radarData, topDim, vulnerabilityReason, dimScores } = resultData;
    
    if (showPoster) return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300 z-50">
         <button onClick={() => setShowPoster(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"><X className="w-6 h-6"/></button>
         <div className="w-full max-w-[340px] bg-slate-950 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)] relative text-center">
            <div className={`h-28 bg-gradient-to-b ${bg} to-slate-950 p-6 flex flex-col items-center justify-center`}><div className={`px-3 py-1 rounded-full border border-white/10 bg-black/20 ${color} text-[8px] font-black uppercase tracking-widest`}>{String(status)} Level</div></div>
            <div className="px-8 pb-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-5 -mt-8 ring-4 ring-slate-950"><ShieldCheck className={`w-8 h-8 ${color}`} /></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 text-center">Energy Loss Analysis</p>
                <h2 className="text-3xl font-black mb-3 tracking-tighter text-white leading-tight">{String(name)}</h2>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border border-white/10 ${color} bg-white/5 mb-8`}>{String(tag)}</div>
                <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 mb-6 text-center">
                   <div className="flex items-center justify-between mb-2 px-2"><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Loss Pattern Scan</span><span className="text-[9px] font-black text-indigo-400">{scoreA} PTS</span></div>
                   <RadarChart data={radarData} />
                </div>
                <div className="text-left relative pl-4 border-l-2 border-indigo-600"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">流失定性解析</h4><p className="text-slate-300 text-xs leading-relaxed text-justify font-medium opacity-90 text-left">{String(desc)}</p></div>
                <div className="mt-8 w-full flex items-center justify-between"><div className="text-left text-left"><p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Energy Flow Analysis</p><p className="text-[8px] text-slate-600 italic">By Stéphane Clerget System</p></div><div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-[8px] font-bold text-slate-600 border border-white/5 font-mono">QR</div></div>
                <div className="mt-8"><p className="text-white/20 text-[9px] font-medium tracking-[0.2em] flex items-center justify-center gap-2 text-center"><Download className="w-2.5 h-2.5 opacity-50"/> 截图保存能量报告</p></div>
            </div>
         </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 pb-12 font-sans overflow-x-hidden">
        <div className="max-w-md mx-auto space-y-6">
          <div className={`rounded-[3rem] border border-white/5 bg-gradient-to-b ${bg} to-slate-950 shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-8 right-8"><div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border bg-black/40 backdrop-blur-sm ${color} border-white/10 text-[9px] font-black uppercase tracking-widest`}>{String(status)} Level</div></div>
            <div className="p-10 text-center flex flex-col items-center text-white">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/10 flex items-center justify-center mb-6 ring-8 ring-indigo-50/5"><ShieldCheck className={`w-10 h-10 ${color}`} /></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 text-center">Energy Depletion Report</h3>
              <h2 className="text-4xl font-black mb-3 tracking-tighter text-white leading-tight">{String(name)}</h2>
              <div className={`px-5 py-2 rounded-full text-[10px] font-black border border-white/10 ${color} bg-black/30 backdrop-blur-md shadow-sm`}>{String(tag)}</div>
            </div>
            <div className="px-8 pb-10 space-y-10">
              <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden mx-auto text-center">
                <div className="flex items-center justify-between mb-4 text-left px-2"><h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">外部损耗雷达</h4><span className="text-[10px] font-black text-indigo-400">{scoreA} pts</span></div>
                <RadarChart data={radarData} />
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-left"><p className="text-[10px] text-slate-500 font-bold mb-1">关键流失点：</p><p className="text-xs text-indigo-400 font-black">【{String(topDim)}】泄露最为严重</p></div>
              </div>
              <div className="bg-indigo-950/30 p-8 rounded-[2.5rem] border border-indigo-500/20 text-left relative overflow-hidden group">
                  <div className="absolute right-[-10px] top-[-10px] opacity-10"><Eye className="w-24 h-24 text-indigo-400" /></div>
                  <h4 className="font-black text-sm mb-4 flex items-center gap-2 text-indigo-300"><UserCheck className="w-4 h-4" /> 溯源：为何你成为了目标？</h4>
                  <p className="text-indigo-100/90 text-sm leading-relaxed text-justify font-medium text-left">{String(vulnerabilityReason)}</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-left relative overflow-hidden group">
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
                  <h4 className="font-black text-sm mb-4 flex items-center gap-2 text-white text-left"><HeartPulse className="w-4 h-4 text-rose-500" /> 能量流失定性解析</h4>
                  <p className="text-slate-300 text-sm leading-relaxed text-justify opacity-90 font-medium text-left">{String(desc)}</p>
              </div>
              <div className="space-y-4">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-slate-500 pl-2 text-left">损耗维度深度报表</h4>
                 {DIMENSIONS.map((dim, idx) => {
                   const isInternal = idx === 6; const maxVal = isInternal ? 40 : 25; const score = dimScores[dim] || 0; const ratio = (score/maxVal);
                   let stateLabel = "平稳"; let stateColor = "text-emerald-400"; if (ratio > 0.75) { stateLabel = isInternal ? "匮乏" : "过载"; stateColor = "text-rose-500"; } else if (ratio > 0.5) { stateLabel = "活跃"; stateColor = "text-orange-400"; }
                   return (
                    <div key={idx} className={`relative overflow-hidden transition-all duration-300 p-6 rounded-[2.2rem] border text-left ${isInternal ? 'bg-indigo-950/50 border-indigo-400/40 shadow-[0_0_30px_rgba(99,102,241,0.2)] ring-1 ring-indigo-400/20' : 'bg-white/5 border-white/5 hover:bg-white/[0.04]'}`}>
                        {isInternal && (<div className="absolute -right-8 -top-8 opacity-10 rotate-12 pointer-events-none"><Fingerprint className="w-32 h-32 text-indigo-400" /></div>)}
                        <div className="flex items-center justify-between mb-4 relative z-10 text-left text-white"><div className="flex flex-col">{isInternal && (<span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Individual Scan</span>)}<div className="flex items-center gap-2">{isInternal ? <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> : <Activity className="w-3.5 h-3.5 text-slate-500" />}<span className={`text-xs font-black tracking-tight ${isInternal ? 'text-indigo-100' : 'text-slate-200'}`}>0{idx+1} {String(dim)}</span><span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 bg-black/20 ${stateColor}`}>{stateLabel}</span></div></div><span className={`text-[10px] font-black ${isInternal ? 'text-indigo-400' : 'text-slate-500'}`}>{score} / {maxVal}</span></div>
                        <div className={`w-full h-1 rounded-full mb-4 overflow-hidden relative z-10 ${isInternal ? 'bg-indigo-900/50' : 'bg-white/5'}`}><div className={`h-full transition-all duration-1000 ${isInternal ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-indigo-600'}`} style={{ width: `${ratio*100}%` }}></div></div>
                        <p className={`text-[10px] leading-relaxed text-justify relative z-10 text-left ${isInternal ? 'text-indigo-200/80 font-medium' : 'text-slate-500 opacity-80'}`}>{String(DIMENSION_DESCS[dim])}</p>
                    </div>
                   )
                 })}
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left ring-4 ring-indigo-50/10"><Sparkles className="absolute -right-2 -top-2 w-16 h-16 opacity-20 rotate-12" /><h5 className="text-[10px] font-black opacity-60 uppercase mb-2 tracking-widest text-left text-white/60">止损与补能建议</h5><p className="text-sm font-bold italic leading-relaxed relative z-10 text-left text-white">“{String(advice)}”</p></div>
              <div className="pt-6 flex gap-4 text-center"><button onClick={() => window.location.reload()} className="flex-1 py-5 bg-white/5 text-slate-400 rounded-[2.2rem] font-black text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><RefreshCcw className="w-4 h-4" /> 重测</button><button onClick={() => setShowPoster(true)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2.2rem] font-black text-xs shadow-xl active:scale-95 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 text-white"><Share2 className="w-4 h-4" /> 导出卡片报告</button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
