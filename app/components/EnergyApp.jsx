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

const ACCESS_CODE = "6688"; 
const OPTIONS = [
  { label: "从不", value: 1 }, { label: "很少", value: 2 }, { label: "有时", value: 3 }, { label: "经常", value: 4 }, { label: "总是", value: 5 }
];

const DIMENSIONS = ["情绪倾倒", "受害叙述", "责任转移", "依赖绑定", "冲突激发", "自我消耗", "内在补能模式"];

// 维度描述映射
const DIMENSION_DESCS = {
  "情绪倾倒": "反映对方是否将你视为情绪宣泄口。", "受害叙述": "反映对方是否通过展示弱势博取同情。",
  "责任转移": "反映关系中责任承担的失衡。", "依赖绑定": "反映对方是否通过‘没你不行’捆绑你。",
  "冲突激发": "反映互动中的摩擦频率。", "自我消耗": "反映内核认同感的损耗。", "内在补能模式": "反映你当前的能量余额。"
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
  { id: 11, part: "A", dim: "责任转移", text: "{target}会干涉我的决定或生活。" },
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
  { id: 26, part: "A", dim: "自我消耗", text: "这段关系让我怀疑自己的价值。" },
  { id: 27, part: "A", dim: "自我消耗", text: "我为了维持关系改变了自己。" },
  { id: 28, part: "A", dim: "自我消耗", text: "我会反复回想{target}说过的话。" },
  { id: 29, part: "A", dim: "自我消耗", text: "我在这段关系中感到内耗。" },
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
  "LOW_LOW": { name: "能量自洽状态", tag: "互动平衡 · 损耗极低", color: "text-emerald-400", bg: "from-emerald-950/40", status: "Healthy", desc: "损耗发现：你与 TA 之间保持着清晰的心理边界。", advice: "目前的互动健康，保持平衡。" },
  "MID_LOW": { name: "动态拉扯模式", tag: "隐性损耗 · 适应期", color: "text-amber-400", bg: "from-amber-950/40", status: "Moderate", desc: "损耗发现：关系中存在一些不稳定的能量渗漏。", advice: "感到疲惫时主动表达边界。" },
  "HIGH_LOW": { name: "高频损耗承担者", tag: "单向透支 · 能量流失", color: "text-orange-400", bg: "from-orange-950/40", status: "Warning", desc: "损耗发现：你正在扮演‘能量供给站’。", advice: "暂时关闭能量输出。" },
  "LOW_MID": { name: "自我调适状态", tag: "内核重构 · 补给中", color: "text-indigo-400", bg: "from-indigo-950/40", status: "Moderate", desc: "损耗发现：你开始察觉到内心的某些渴望。", advice: "关注内在节奏。" },
  "MID_MID": { name: "博弈共生阶段", tag: "存量博弈 · 心理防御", color: "text-blue-400", bg: "from-blue-950/40", status: "Cautious", desc: "损耗发现：互动中既有依赖也有排斥。", advice: "打破‘理所当然’的互动惯性。" },
  "HIGH_MID": { name: "能量侵蚀状态", tag: "高压互动 · 局部过载", color: "text-rose-400", bg: "from-rose-950/40", status: "Critical", desc: "损耗发现：你正承受显著的外部压力。", advice: "减少非必要深度社交。" },
  "LOW_HIGH": { name: "深海孤岛状态", tag: "渴求补给 · 潜在内耗", color: "text-purple-400", bg: "from-purple-950/40", status: "Warning", desc: "损耗发现：内心的‘能量空洞’正在拉扯你。", advice: "建立独立的内在补能回路。" },
  "MID_HIGH": { name: "防守型抓取模式", tag: "焦虑互动 · 能量渴求", color: "text-pink-400", bg: "from-pink-950/40", status: "Critical", desc: "损耗发现：你对关系中的微小变动非常敏感。", advice: "停止向外索要确定性。" },
  "HIGH_HIGH": { name: "深度纠缠损耗者", tag: "双重内耗 · 能量枯竭", color: "text-red-500", bg: "from-red-950/40", status: "Danger", desc: "损耗发现：你们正处于‘能量相互流失’极端阶段。", advice: "物理与心理的‘双重撤离’。" }
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

  const handleStart = async () => { 
    if (isUnlocked) {
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
      // 核心计算逻辑：将 38 道题归类到各维度
      const dimTotals = {};
      DIMENSIONS.forEach(dim => dimTotals[dim] = 0);
      
      QUESTIONS.forEach(q => {
        const score = newAnswers[q.id] || 0;
        if (dimTotals[q.dim] !== undefined) dimTotals[q.dim] += score;
      });

      try {
        await supabase.from('test_results').insert([{ 
          relation_type: finalTarget,
          // 存储雷达图 6 个数值 (0-5 范围)
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

  const navigateToNext = (currentIdx) => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (currentIdx === 29) setStep('transition');
    else if (currentIdx < QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
    else setStep('result');
    setTimeout(() => setIsNavigating(false), 300);
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
    const getLevel = (s, t) => t === 'A' ? (s <= 65 ? "LOW" : s <= 105 ? "MID" : "HIGH") : (s <= 18 ? "LOW" : s <= 28 ? "MID" : "HIGH");
    const levelA = getLevel(scoreA, 'A'); const levelB = getLevel(scoreB, 'B');
    const typeKey = `${levelA}_${levelB}`; const baseResult = RESULT_MATRIX[typeKey] || RESULT_MATRIX["LOW_LOW"];
    
    let vulnerabilityReason = levelB === "HIGH" ? "内在的高匮乏感让你成为目标。" : levelB === "MID" ? "摇摆不定的防线给了对方借口。" : "高度同理心让你成了发电机。";
    return { ...baseResult, scoreA, scoreB, radarData, dimScores, topDim, vulnerabilityReason };
  }, [step, answers]);

  // --- 渲染部分保持原样 ---
  if (step === 'welcome') return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-black mb-8 text-center">关系能量与心理防御测评</h1>
      <div className="w-full max-w-sm space-y-4">
        <input type="text" placeholder="分析对象" className="w-full bg-white/5 p-4 rounded-xl" value={targetPerson} onChange={e => setTargetPerson(e.target.value)} />
        <input type="text" placeholder="授权码 6688" className="w-full bg-white/5 p-4 rounded-xl" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} />
        <button onClick={handleStart} disabled={!isUnlocked} className="w-full py-4 bg-indigo-600 rounded-xl font-bold">开启分析</button>
      </div>
    </div>
  );

  if (step === 'quiz') {
    const q = QUESTIONS[currentIndex];
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <p className="text-indigo-400 font-bold mb-4">Q {currentIndex + 1} / 38</p>
        <h2 className="text-xl mb-8">{q.text.replace('{target}', finalTarget)}</h2>
        <div className="grid grid-cols-1 gap-4">
          {OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 text-left">
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'transition') return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">第一部分完成</h2>
      <button onClick={() => { setStep('quiz'); setCurrentIndex(30); }} className="px-8 py-4 bg-white text-black rounded-xl font-bold">进入内在扫描</button>
    </div>
  );

  if (step === 'result' && resultData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="bg-indigo-900/20 p-8 rounded-3xl border border-indigo-500/30 text-center">
          <h2 className="text-3xl font-black mb-2">{resultData.name}</h2>
          <p className="text-indigo-400 mb-6">{resultData.tag}</p>
          <RadarChart data={resultData.radarData} />
          <p className="mt-8 text-slate-300 text-sm leading-relaxed">{resultData.desc}</p>
          <button onClick={() => window.location.reload()} className="mt-8 w-full py-4 bg-white/5 rounded-xl text-sm">重测</button>
        </div>
      </div>
    );
  }
  return null;
}
