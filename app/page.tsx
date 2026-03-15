"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Dna, Zap, Shield, ChevronRight, Star } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   1. SISTEMA DE CHUVA DE FOLHAS
═══════════════════════════════════════════════════════════ */
type LeafProps = {
  id: number; left: string; size: number; duration: number; delay: number;
  drift: string; rotation: string; colorBg: string; colorGlow: string;
  zIndex: number; blur: number;
};

const LEAF_PALETTES = ["57, 255, 20", "138, 43, 226", "0, 229, 255", "255, 232, 107"];

function LeafRain() {
  const [leaves, setLeaves] = useState<LeafProps[]>([]);

  useEffect(() => {
    const gen: LeafProps[] = Array.from({ length: 28 }, (_, i) => {
      const rgb = LEAF_PALETTES[Math.floor(Math.random() * LEAF_PALETTES.length)];
      const isFront = Math.random() > 0.65;
      return {
        id: i, left: `${Math.random() * 120 - 10}vw`,
        size: isFront ? 40 + Math.random() * 45 : 18 + Math.random() * 28,
        duration: 13 + Math.random() * 18, delay: Math.random() * -28,
        drift: `${(Math.random() - 0.5) * 65}vw`, rotation: `${(Math.random() - 0.5) * 720}deg`,
        colorBg: `rgba(${rgb}, ${(0.04 + Math.random() * 0.14).toFixed(2)})`,
        colorGlow: `rgba(${rgb}, ${(0.2 + Math.random() * 0.45).toFixed(2)})`,
        zIndex: isFront ? 30 : 8, blur: 3 + Math.random() * 6,
      };
    });
    setLeaves(gen);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id} className="absolute top-[-15vh]"
          style={{
            left: leaf.left, width: `${leaf.size}px`, height: `${leaf.size * 1.12}px`,
            zIndex: leaf.zIndex, "--drift": leaf.drift, "--rotation": leaf.rotation,
            animation: `fallingLeaf ${leaf.duration}s linear ${leaf.delay}s infinite`,
          } as React.CSSProperties}
        >
          <div
            style={{
              width: "100%", height: "100%", WebkitMaskImage: "url(/leaf-prismatic.svg)",
              maskImage: "url(/leaf-prismatic.svg)", WebkitMaskSize: "contain", maskSize: "contain",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center",
              backdropFilter: `blur(${leaf.blur}px)`, WebkitBackdropFilter: `blur(${leaf.blur}px)`,
              background: `linear-gradient(135deg, ${leaf.colorBg} 0%, rgba(0,0,0,0) 100%)`,
              boxShadow: `inset 0 0 ${leaf.size * 0.4}px ${leaf.colorGlow}`, border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. CONTADOR ANIMADO
═══════════════════════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = target / 60;
    const timer = setInterval(() => {
      start += step; if (start >= target) { setCount(target); clearInterval(timer); return; }
      setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════
   3. DADOS DAS GENÉTICAS
═══════════════════════════════════════════════════════════ */
const GENETICS_DB = [
  {
    id: "lebron", name: "Lebron Haze", type: "SATIVA DOMINANTE", thc: "22%", cbd: "< 1%",
    terpenes: "Limoneno · Mirceno", flowering: "8–9 Semanas", origin: "Haze × Jack Herer",
    effects: ["Euforia", "Criatividade", "Foco"], color: "#FFE86B", colorRgb: "255, 232, 107",
    image: "/lebron.jpg", badge: "SATIVA", rating: 4.8,
  },
  {
    id: "gorilla", name: "Gorilla Glue", type: "HÍBRIDA EQUILIBRADA", thc: "26%", cbd: "1%",
    terpenes: "Cariofileno · Mirceno", flowering: "9–10 Semanas", origin: "Chem's Sis × Sour Dubb",
    effects: ["Relaxamento", "Euforia", "Sono"], color: "#39FF14", colorRgb: "57, 255, 20",
    image: "/gorilla.jpg", badge: "HÍBRIDA", rating: 4.9,
  },
  {
    id: "pineapple", name: "Pineapple Kush", type: "INDICA DOMINANTE", thc: "18%", cbd: "2%",
    terpenes: "Pineno · Linalol", flowering: "8 Semanas", origin: "Pineapple × OG Kush",
    effects: ["Relaxamento", "Dor", "Ansiedade"], color: "#8A2BE2", colorRgb: "138, 43, 226",
    image: "/pineapple.png", badge: "INDICA", rating: 4.7,
  },
];

/* ═══════════════════════════════════════════════════════════
   4. CARD DE GENÉTICA
═══════════════════════════════════════════════════════════ */
function GeneticsCard({ data, isActive, onClick }: { data: (typeof GENETICS_DB)[0]; isActive: boolean; onClick: () => void; }) {
  return (
    <div className="relative flex flex-col items-center w-full">
      <motion.div
        onClick={onClick}
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
        style={{
          height: 280, border: isActive ? `1px solid ${data.color}` : "1px solid rgba(255,255,255,0.08)",
          background: isActive ? `radial-gradient(ellipse at center, rgba(${data.colorRgb},0.08) 0%, #070f09 100%)` : "rgba(10,15,10,0.6)",
          boxShadow: isActive ? `inset 0 0 60px rgba(${data.colorRgb},0.12), 0 0 30px rgba(${data.colorRgb},0.2), 0 20px 60px rgba(0,0,0,0.9)` : "0 10px 40px rgba(0,0,0,0.6)",
          transition: "all 0.5s cubic-bezier(.17,.67,.83,.67)",
        }}
        whileHover={{ scale: isActive ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
        {isActive && <div className="scanner-line z-20" />}
        {isActive && <div className="absolute inset-0 holo-overlay z-10 pointer-events-none" />}

        <div className="absolute top-3 left-3 z-30 font-mono text-[9px] font-bold tracking-widest px-2 py-1 rounded-sm"
          style={{ color: data.color, background: `rgba(${data.colorRgb}, 0.12)`, border: `1px solid rgba(${data.colorRgb}, 0.3)` }}>
          {data.badge}
        </div>

        <div className="absolute top-3 right-3 z-30 flex items-center gap-1">
          <Star size={10} style={{ fill: data.color, stroke: "none" }} />
          <span className="font-mono text-[10px]" style={{ color: data.color }}>{data.rating}</span>
        </div>

        <motion.img
          src={data.image} alt={data.name}
          className="absolute left-1/2 -translate-x-1/2 object-cover z-10"
          style={{ mixBlendMode: "screen", filter: `drop-shadow(0 0 25px rgba(${data.colorRgb}, 0.7))`, width: isActive ? 240 : 200, bottom: isActive ? -20 : 0 }}
          animate={{ y: isActive ? [-8, 8, -8] : 0, scale: isActive ? 1.12 : 1 }}
          transition={{ y: isActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}, scale: { type: "spring", stiffness: 100, damping: 14 } }}
        />

        {!isActive && (
          <div className="absolute bottom-4 inset-x-0 text-center z-20">
            <p className="font-space text-[11px] font-bold tracking-widest text-white/40 uppercase">{data.name}</p>
            <p className="font-mono text-[9px] text-white/20 mt-0.5 uppercase tracking-wider">Clique para decodificar</p>
          </div>
        )}

        {isActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-10 inset-x-0 text-center z-30">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] animate-pulse" style={{ color: "rgba(255,80,80,0.9)", textShadow: "0 0 10px rgba(255,50,50,0.8)" }}>
              ⬡ CONTENÇÃO DESTRAVADA
            </p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ opacity: 0, y: -30, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full overflow-hidden">
            <div className="w-full py-2 px-4 text-center relative" style={{ background: "#111", borderLeft: `1px solid rgba(${data.colorRgb},0.2)`, borderRight: `1px solid rgba(${data.colorRgb},0.2)` }}>
              <span className="font-space font-black text-[11px] tracking-widest uppercase" style={{ color: data.color, textShadow: `0 0 10px rgba(${data.colorRgb},0.8)` }}>IGUANA MARY SEEDS</span>
            </div>
            <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} transition={{ delay: 0.9, duration: 0.7, type: "spring", damping: 14 }} className="w-[92%] mx-auto rounded-b-lg shadow-[0_14px_40px_rgba(0,0,0,0.6)] overflow-hidden" style={{ background: "#e8e8e0", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.06) 23px, rgba(0,0,0,0.06) 24px)" }}>
              <div className="p-5">
                <h3 className="font-space font-black text-base uppercase text-black mb-3" style={{ textShadow: `0 0 8px rgba(${data.colorRgb},0.4)` }}>{data.name}</h3>
                <div className="space-y-2 font-mono text-[11px] text-black/75">
                  {[["Tipo", data.type], ["THC / CBD", `${data.thc} / ${data.cbd}`], ["Terpenos", data.terpenes], ["Floração", data.flowering], ["Origem", data.origin]].map(([label, val]) => (
                    <div key={label} className="flex justify-between border-b border-black/10 pb-1.5"><span className="text-black/50 font-medium">{label}</span><span className="font-bold text-right">{val}</span></div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {data.effects.map((e) => (
                    <span key={e} className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm" style={{ background: `rgba(${data.colorRgb},0.15)`, color: `rgb(${data.colorRgb})`, border: `1px solid rgba(${data.colorRgb},0.3)` }}>{e}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button className="w-full py-2.5 text-white text-[10px] font-space font-bold uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-[1.02] active:scale-95" style={{ background: `rgb(${data.colorRgb})`, color: "#000", boxShadow: `0 0 20px rgba(${data.colorRgb},0.4)` }}>Adquirir Semente</button>
                  <button className="w-full py-2 bg-transparent text-black border border-black/20 text-[10px] font-space font-bold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors duration-300">Ver Perfil Completo →</button>
                  <button className="w-full py-2 bg-transparent text-black border border-black/20 text-[10px] font-space font-bold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors duration-300">Buscar Associação</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. SEÇÃO: STATS
═══════════════════════════════════════════════════════════ */
const STATS = [
  { value: 300, suffix: "+", label: "Genéticas" }, { value: 50, suffix: "+", label: "Bancos de Sementes" },
  { value: 12, suffix: "K", label: "Usuários Ativos" }, { value: 98, suffix: "%", label: "Satisfação" },
];

function StatsBar() {
  return (
    <div className="relative w-full border-y border-iguana-neon/10 bg-black/30 backdrop-blur-sm py-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] neon-border-run opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] neon-border-run opacity-40" />
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {STATS.map(({ value, suffix, label }) => (
          <div key={label} className="text-center group cursor-default">
            <div className="font-space text-3xl md:text-4xl font-black text-iguana-neon group-hover:text-white transition-colors" style={{ textShadow: "0 0 20px rgba(57,255,20,0.5)" }}>
              <AnimatedCounter target={value} suffix={suffix} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 group-hover:text-gray-300 transition-colors mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. SEÇÃO: FEATURES
═══════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: Dna, title: "Enciclopédia Genética", desc: "300+ strains catalogadas com perfil de terpenos, genealogia, efeitos e fotos de alta resolução.", color: "#39FF14" },
  { icon: Zap, title: "Simulador de Grow", desc: "Configure ambiente, nutrição e iluminação. Veja o desenvolvimento da planta em tempo real.", color: "#FFE86B" },
  { icon: Shield, title: "Rede de Profissionais", desc: "Médicos, farmacêuticos e advogados especializados em cannabis medicinal no Brasil.", color: "#8A2BE2" },
];

function FeaturesSection() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-iguana-neon/60 mb-3">⬡ SISTEMA DE MÓDULOS ⬡</p>
        <h2 className="font-space font-black text-3xl md:text-5xl text-white tracking-wide">TUDO QUE VOCÊ PRECISA</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.12 }} className="group relative p-6 rounded-2xl border border-white/8 bg-black/30 backdrop-blur-sm cursor-default hover:border-white/15 transition-all duration-500 overflow-hidden" style={{ "--card-color": color } as React.CSSProperties} whileHover={{ y: -4 }}>
            <div className="absolute top-0 left-0 w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 70%)` }} />
            <div className="absolute top-0 left-0 w-[1px] h-16 opacity-30 group-hover:opacity-70 transition-opacity" style={{ background: color }} />
            <div className="absolute top-0 left-0 h-[1px] w-16 opacity-30 group-hover:opacity-70 transition-opacity" style={{ background: color }} />
            <Icon className="mb-4 h-6 w-6 transition-all duration-300" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
            <h3 className="font-space font-bold text-sm uppercase tracking-widest text-white mb-2">{title}</h3>
            <p className="font-body text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{desc}</p>
            <div className="mt-5 flex items-center gap-1.5 group/link cursor-pointer">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>Explorar</span>
              <ChevronRight size={12} style={{ color }} className="group-hover/link:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. SEÇÃO: CTA TERMINAL
═══════════════════════════════════════════════════════════ */
function TerminalCTA() {
  const [typed, setTyped] = useState("");
  const full = "> acesso liberado para usuário medicinal_br...";
  // CORREÇÃO: O TypeScript exigia um HTMLElement genérico por ser usado numa <section>
  const inViewRef = useRef<HTMLElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++; setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section ref={inViewRef} className="relative z-20 max-w-4xl mx-auto px-6 py-16 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-2xl border border-iguana-neon/20 overflow-hidden" style={{ background: "rgba(0,8,0,0.8)", backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(57,255,20,0.05), inset 0 0 40px rgba(57,255,20,0.02)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-iguana-neon/10 bg-black/40">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" /><span className="w-2.5 h-2.5 rounded-full bg-iguana-neon/60" />
          <span className="font-mono text-[10px] text-gray-600 ml-2 tracking-widest">iguana-mary-portal ~ bash</span>
        </div>
        <div className="p-8 md:p-12">
          <p className="font-mono text-[11px] text-iguana-neon/50 mb-2 tracking-widest">{typed}{typed.length < full.length && (<span className="inline-block w-2 h-3.5 bg-iguana-neon animate-blink ml-0.5" />)}</p>
          <h2 className="font-space font-black text-2xl md:text-4xl text-white mt-6 mb-4 leading-tight">FAÇA PARTE DA<br /><span className="text-iguana-neon neon-flicker" style={{ textShadow: "0 0 30px rgba(57,255,20,0.6)" }}>COMUNIDADE</span></h2>
          <p className="font-body text-gray-500 text-sm max-w-lg leading-relaxed mb-8">Acesse guias exclusivos, conecte-se com outros pacientes e cultive com segurança e conhecimento de elite.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button className="relative font-space font-bold text-sm tracking-widest uppercase px-8 py-3.5 text-black rounded-sm overflow-hidden group" style={{ background: "#39FF14", boxShadow: "0 0 30px rgba(57,255,20,0.4)" }} whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(57,255,20,0.6)" }} whileTap={{ scale: 0.97 }}>Criar Conta Grátis</motion.button>
            <motion.button className="font-space font-bold text-sm tracking-widest uppercase px-8 py-3.5 border border-white/15 text-gray-400 hover:text-white hover:border-white/30 rounded-sm transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Ver Genéticas →</motion.button>
          </div>
          <p className="font-mono text-[9px] text-gray-700 mt-6 uppercase tracking-wider">⬡ Portal educativo · Cannabis medicinal · BR · ANVISA compliant</p>
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. MAIN HOME
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [activeGenetic, setActiveGenetic] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-x-hidden selection:bg-iguana-neon selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"><LeafRain /></div>
      <section className="relative z-20 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 inline-flex items-center gap-2 border border-iguana-neon/20 bg-iguana-neon/5 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-iguana-neon animate-pulse" /><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-iguana-neon/70">Portal Cannábico Brasileiro</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <h1 className="glitch-text font-space font-black text-[clamp(3rem,12vw,8rem)] leading-[0.88] tracking-tight" data-text="NA PALMA DA MÃO" style={{ background: "linear-gradient(175deg, #ffffff 0%, #d0ead0 40%, #39FF14 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(57,255,20,0.2))" }}>
            NA PALMA<br />DA MÃO
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} className="font-body mt-8 max-w-lg text-gray-400 text-base md:text-lg leading-relaxed">
          Conecte-se a um ecossistema digital com <strong className="text-white font-semibold">Genéticas de Elite</strong>, Guias de Cultivo e uma <span className="text-iguana-purple">Rede Profissional</span>.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <motion.button className="font-space font-bold text-sm tracking-widest uppercase px-8 py-4 text-black rounded-sm" style={{ background: "#39FF14", boxShadow: "0 0 40px rgba(57,255,20,0.4)" }} whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(57,255,20,0.6)" }} whileTap={{ scale: 0.97 }}>Explorar Genéticas</motion.button>
          <motion.button className="font-space font-bold text-sm tracking-widest uppercase px-8 py-4 border border-white/15 text-gray-400 hover:text-white hover:border-white/30 rounded-sm transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Como Funciona</motion.button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-700">Rolar</span><div className="w-px h-10 bg-gradient-to-b from-transparent via-iguana-neon/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      <StatsBar />

      <section className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-iguana-neon/60 mb-3">⬡ BANCO DE DADOS ENCRIPTADO ⬡</p>
          <h2 className="font-space font-black text-3xl md:text-5xl text-white tracking-wide">COFRE DE GENÉTICAS</h2>
          <p className="font-body mt-4 text-gray-600 text-sm uppercase tracking-widest font-mono">Clique no frasco para decodificar</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start">
          {GENETICS_DB.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <GeneticsCard data={g} isActive={activeGenetic === g.id} onClick={() => setActiveGenetic(activeGenetic === g.id ? null : g.id)} />
            </motion.div>
          ))}
        </div>
      </section>

      <FeaturesSection />
      <TerminalCTA />
    </div>
  );
}
