"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. SISTEMA DE CHUVA DE FOLHAS (Mantido intacto)
// ==========================================
type LeafProps = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: string;
  rotation: string;
  colorBg: string;
  colorGlow: string;
  zIndex: number;
  blur: number;
};

const COLOR_PALETTES_RGB = ["57, 255, 20", "138, 43, 226", "255, 232, 107"];

function LeafRain() {
  const [leaves, setLeaves] = useState<LeafProps[]>([]);

  useEffect(() => {
    const generatedLeaves: LeafProps[] = [];
    for (let i = 0; i < 32; i++) {
      const rgb = COLOR_PALETTES_RGB[Math.floor(Math.random() * COLOR_PALETTES_RGB.length)];
      const isFront = Math.random() > 0.7; 
      generatedLeaves.push({
        id: i,
        left: `${Math.random() * 120 - 10}vw`,
        size: isFront ? (45 + Math.random() * 40) : (20 + Math.random() * 30),
        duration: 12 + Math.random() * 18,
        delay: Math.random() * -25,
        drift: `${(Math.random() - 0.5) * 60}vw`,
        rotation: `${(Math.random() - 0.5) * 720}deg`,
        colorBg: `rgba(${rgb}, ${(0.05 + Math.random() * 0.15).toFixed(2)})`,
        colorGlow: `rgba(${rgb}, ${(0.2 + Math.random() * 0.45).toFixed(2)})`,
        zIndex: isFront ? 30 : 10,
        blur: 3 + Math.random() * 5,
      });
    }
    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-15vh]"
          style={{
            left: leaf.left,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.12}px`,
            zIndex: leaf.zIndex,
            '--drift': leaf.drift,
            '--rotation': leaf.rotation,
            animation: `fallingLeaf ${leaf.duration}s linear ${leaf.delay}s infinite`,
          } as React.CSSProperties}
        >
          <div
            style={{
              width: "100%", height: "100%",
              WebkitMaskImage: "url(/leaf-prismatic.svg)", maskImage: "url(/leaf-prismatic.svg)",
              WebkitMaskSize: "contain", maskSize: "contain",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
              WebkitMaskPosition: "center", maskPosition: "center",
              backdropFilter: `blur(${leaf.blur}px)`, WebkitBackdropFilter: `blur(${leaf.blur}px)`,
              background: `linear-gradient(135deg, ${leaf.colorBg} 0%, rgba(0,0,0,0) 100%)`,
              boxShadow: `inset 0 0 ${leaf.size * 0.4}px ${leaf.colorGlow}`,
              border: `1px solid rgba(255,255,255,0.05)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. DADOS DAS GENÉTICAS
// ==========================================
const GENETICS_DB = [
  {
    id: "lebron",
    name: "Lebron Haze",
    type: "SATIVA DOMINANTE",
    thc: "22%",
    cbd: "< 1%",
    terpenes: "Limoneno, Mirceno",
    flowering: "8 - 9 Semanas",
    image: "/lebron.jpg", // A primeira foto
    color: "#FFE86B", // Amarelo/Dourado Haze
  },
  {
    id: "gorilla",
    name: "Gorilla Glue",
    type: "HÍBRIDA",
    thc: "26%",
    cbd: "1%",
    terpenes: "Cariofileno, Mirceno",
    flowering: "9 - 10 Semanas",
    image: "/gorilla.jpg", // A segunda foto
    color: "#39FF14", // Verde Neon
  },
  {
    id: "pineapple",
    name: "Pineapple Kush",
    type: "INDICA DOMINANTE",
    thc: "18%",
    cbd: "2%",
    terpenes: "Pineno, Linalol",
    flowering: "8 Semanas",
    image: "/pineapple.jpg", // A terceira foto
    color: "#8A2BE2", // Roxo Elétrico
  }
];

// ==========================================
// 3. COMPONENTE: O Frasco e a Seda Interativa
// ==========================================
function GeneticsVaultCard({ data, isActive, onClick }: { data: any, isActive: boolean, onClick: () => void }) {
  return (
    <div className="relative flex flex-col items-center w-full max-w-[320px] mx-auto">
      
      {/* O FRASCO (Cápsula de Contenção) */}
      <motion.div 
        onClick={onClick}
        className={`relative w-full h-64 rounded-2xl border cursor-pointer transition-all duration-500 overflow-hidden flex items-center justify-center z-20
          ${isActive 
            ? 'bg-black/60 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-transparent' 
            : 'bg-black/20 backdrop-blur-md border-white/10 hover:border-white/30'}`}
        style={{
          boxShadow: isActive ? `inset 0 0 50px ${data.color}40, 0 0 30px ${data.color}20` : 'none',
          borderColor: isActive ? data.color : ''
        }}
      >
        {/* Fundo de grade digital do frasco */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px] opacity-30" />
        
        {/* Nome do Frasco (se estiver fechado) */}
        {!isActive && (
          <div className="absolute bottom-4 left-0 w-full text-center z-30">
            <span className="font-space font-bold tracking-widest uppercase text-xs text-white/50">{data.name}</span>
          </div>
        )}

        {/* A FLOR 3D (Holograma) */}
        <motion.img
          src={data.image}
          alt={data.name}
          className="relative z-10 w-48 h-48 object-cover"
          // mix-blend-screen é a mágica que remove o fundo preto e deixa holográfico
          style={{ mixBlendMode: 'screen', filter: `drop-shadow(0 0 20px ${data.color})` }}
          initial={false}
          animate={{
            y: isActive ? -40 : 0, // Levita se estiver ativo
            scale: isActive ? 1.4 : 1, // Cresce
            rotateY: isActive ? [0, 10, -10, 0] : 0, // Flutua lentamente
          }}
          transition={{
            y: { type: "spring", stiffness: 100, damping: 15 },
            scale: { type: "spring", stiffness: 100, damping: 15 },
            rotateY: { repeat: Infinity, duration: 6, ease: "easeInOut" }
          }}
        />
        
        {/* Tampa do Frasco destravando */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-4 w-full text-center z-30"
            >
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest animate-pulse">CONTENÇÃO DESTRAVADA</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* A SEDA (Dados e Links de Monetização) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full mt-2 relative z-10"
          >
            {/* A Caixinha da Seda (Aparece primeiro) */}
            <div className="w-full bg-[#111] border border-white/10 rounded-t-lg p-2 text-center relative shadow-lg z-20">
              <span className="font-space font-black text-[#39FF14] text-xs tracking-widest drop-shadow-[0_0_5px_#39FF14]">IGUANA MARY SEEDS</span>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1" />
            </div>

            {/* O Papel de Seda Deslizando (Aparece depois de um delay) */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              // Aqui está o segredo: delay de 1.2 segundos para a seda deslizar!
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, type: "spring", damping: 15 }}
              className="relative w-[90%] mx-auto bg-[#e8e8e8] -mt-1 pt-6 pb-4 px-5 rounded-b-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.05) 19px, rgba(0,0,0,0.05) 20px)',
              }}
            >
              {/* O texto impresso na seda simulando tinta digital */}
              <div className="flex flex-col gap-2 font-mono text-xs text-black/80 font-medium">
                <h3 className="font-black text-base uppercase text-black" style={{ textShadow: `0 0 10px ${data.color}` }}>{data.name}</h3>
                <div className="flex justify-between border-b border-black/10 pb-1"><span>Tipo:</span> <span className="font-bold">{data.type}</span></div>
                <div className="flex justify-between border-b border-black/10 pb-1"><span>THC/CBD:</span> <span className="font-bold">{data.thc} / {data.cbd}</span></div>
                <div className="flex justify-between border-b border-black/10 pb-1"><span>Terpenos:</span> <span className="font-bold">{data.terpenes}</span></div>
                <div className="flex justify-between border-b border-black/10 pb-1"><span>Floração:</span> <span className="font-bold">{data.flowering}</span></div>
              </div>

              {/* Botões de Monetização (Selos) */}
              <div className="mt-4 flex flex-col gap-2">
                <button className="w-full py-2 bg-black text-white text-[10px] font-space font-bold uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-colors border border-black/20">
                  Adquirir Semente
                </button>
                <button className="w-full py-2 bg-transparent text-black border border-black text-[10px] font-space font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  Buscar Associação
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 4. PÁGINA PRINCIPAL
// ==========================================
export default function Home() {
  const [activeGenetics, setActiveGenetics] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black min-h-screen">
      
      <style jsx global>{`
        @keyframes fallingLeaf {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          5% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(120vh) translateX(var(--drift)) rotate(var(--rotation)); opacity: 0; }
        }
      `}</style>

      {/* Luzes de Fundo */}
      <div className="pointer-events-none absolute inset-0 z-0 fixed">
        <div className="absolute left-1/2 top-[42%] h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39FF14] opacity-[0.05] blur-[150px]" />
        <div className="absolute left-1/2 top-[50%] h-[60vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A2BE2] opacity-[0.03] blur-[190px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none fixed">
        <LeafRain />
      </div>

      {/* HERO SECTION (Centralizado como você pediu) */}
      <section className="relative z-20 mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-4 text-center pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.965 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative pointer-events-auto">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-500 md:text-xl">Cultura Cannábica</h2>
          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#e0e0e0] to-[#39FF14] md:text-9xl"
            style={{ textShadow: "0px 10px 40px rgba(57, 255, 20, 0.25)" }}>
            NA PALMA<br />DA MÃO
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-gray-400 md:text-lg pointer-events-auto">
          Conecte-se a um ecossistema digital com <strong className="font-medium text-white">Genéticas de Elite</strong>, Guias de Cultivo e uma <span className="text-[#a78bfa]">Rede Profissional</span>.
        </motion.p>
      </section>

      {/* SEÇÃO: COFRE DE GENÉTICAS */}
      <section className="relative z-20 mx-auto w-full max-w-7xl px-4 py-24 pb-48">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-space font-black tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">COFRE DE GENÉTICAS</h2>
          <p className="mt-4 text-gray-400 font-mono text-sm uppercase tracking-widest">Clique no frasco para decodificar</p>
        </div>

        {/* Grade com os 3 frascos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">
          {GENETICS_DB.map((genetica) => (
            <GeneticsVaultCard
              key={genetica.id}
              data={genetica}
              isActive={activeGenetics === genetica.id}
              onClick={() => setActiveGenetics(activeGenetics === genetica.id ? null : genetica.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
