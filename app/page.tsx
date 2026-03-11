"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

// Usamos as bases RGB puras para injetar variações de transparência na matemática
const COLOR_PALETTES_RGB = [
  "57, 255, 20",   // Verde Neon
  "138, 43, 226",  // Roxo Elétrico
  "255, 232, 107", // Amarelo
];

function LeafRain() {
  const [leaves, setLeaves] = useState<LeafProps[]>([]);

  useEffect(() => {
    const generatedLeaves: LeafProps[] = [];
    const leafCount = 32; // Aumentado em ~35%

    for (let i = 0; i < leafCount; i++) {
      const rgb = COLOR_PALETTES_RGB[Math.floor(Math.random() * COLOR_PALETTES_RGB.length)];
      
      // Variações finas de cor para não ficar pragmático (um vidro mais limpo, outro mais neon)
      const bgOpacity = (0.05 + Math.random() * 0.15).toFixed(2);
      const glowOpacity = (0.2 + Math.random() * 0.45).toFixed(2);
      
      // A MAGIA DO 3D: 30% de chance da folha passar na FRENTE do texto
      const isFront = Math.random() > 0.7; 

      generatedLeaves.push({
        id: i,
        // Espalhamento de -10vw a 110vw para evitar acúmulo nos cantos
        left: `${Math.random() * 120 - 10}vw`,
        // Se a folha está na frente, ela é levemente maior por conta da perspectiva
        size: isFront ? (45 + Math.random() * 40) : (20 + Math.random() * 30),
        duration: 12 + Math.random() * 18,
        delay: Math.random() * -25,
        drift: `${(Math.random() - 0.5) * 60}vw`, // Mais variação no vento
        rotation: `${(Math.random() - 0.5) * 720}deg`,
        colorBg: `rgba(${rgb}, ${bgOpacity})`,
        colorGlow: `rgba(${rgb}, ${glowOpacity})`,
        zIndex: isFront ? 30 : 10, // z-10 passa atrás do texto (z-20), z-30 passa na frente
        blur: 3 + Math.random() * 5, // Variação de embaçado no vidro
      });
    }
    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-15vh]" // Começa bem acima para não spawnar do nada
          style={{
            left: leaf.left,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.12}px`,
            zIndex: leaf.zIndex, // Define se a folha flutua na frente ou atrás
            '--drift': leaf.drift,
            '--rotation': leaf.rotation,
            animation: `fallingLeaf ${leaf.duration}s linear ${leaf.delay}s infinite`,
          } as React.CSSProperties}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              WebkitMaskImage: "url(/leaf-prismatic.svg)",
              maskImage: "url(/leaf-prismatic.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backdropFilter: `blur(${leaf.blur}px)`,
              WebkitBackdropFilter: `blur(${leaf.blur}px)`,
              background: `linear-gradient(135deg, ${leaf.colorBg} 0%, rgba(0,0,0,0) 100%)`,
              // O brilho interior agora é proporcional ao tamanho da folha
              boxShadow: `inset 0 0 ${leaf.size * 0.4}px ${leaf.colorGlow}`,
              border: `1px solid rgba(255,255,255,0.05)`, // Borda de vidro sutil
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black min-h-screen">
      
      {/* --- ANIMAÇÕES GLOBAIS --- */}
      <style jsx global>{`
        @keyframes iguanaScreenSheen {
          0% { transform: translateX(-120%) rotate(18deg); opacity: 0; }
          12% { opacity: 0.35; }
          50% { opacity: 0.22; }
          100% { transform: translateX(120%) rotate(18deg); opacity: 0; }
        }

        @keyframes fallingLeaf {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% { opacity: 1; }
          85% { opacity: 1; }
          100% {
            transform: translateY(120vh) translateX(var(--drift)) rotate(var(--rotation));
            opacity: 0;
          }
        }
      `}</style>

      {/* --- LUZES DE FUNDO --- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[42%] h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39FF14] opacity-[0.08] blur-[150px]" />
        <div className="absolute left-1/2 top-[46%] h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A2BE2] opacity-[0.06] blur-[170px]" />
        <div className="absolute left-1/2 top-[50%] h-[60vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE86B] opacity-[0.035] blur-[190px]" />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 46%, rgba(255,255,255,0) 92%)",
            width: "55vw",
            height: "120vh",
            top: "-10vh",
            left: "0",
            filter: "blur(1px)",
            mixBlendMode: "screen",
            animation: "iguanaScreenSheen 6.5s linear infinite",
          }}
        />
      </div>

      {/* --- CHUVA DE FOLHAS DE VIDRO --- */}
      {/* Removi a classe 'z-10' do container pai para permitir que as folhas cruzem a camada do texto livremente */}
      <div className="absolute inset-0 pointer-events-none">
        <LeafRain />
      </div>

      {/* --- CONTEÚDO PRINCIPAL (z-20) --- */}
      <section className="relative z-20 mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center px-4 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.965 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative pointer-events-auto"
        >
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-500 md:text-xl">
            Cultura Cannábica
          </h2>

          <h1
            className="text-6xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#e0e0e0] to-[#39FF14] md:text-9xl"
            style={{
              textShadow: "0px 10px 40px rgba(57, 255, 20, 0.25)",
              filter: "drop-shadow(0px 0px 2px rgba(0,0,0,1))",
            }}
          >
            NA PALMA
            <br />
            DA MÃO
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-gray-400 md:text-lg pointer-events-auto"
        >
          Conecte-se a um ecossistema digital com{" "}
          <strong className="font-medium text-white">Genéticas de Elite</strong>,
          Guias de Cultivo e uma{" "}
          <span className="text-[#a78bfa]">Rede Profissional</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-12 pointer-events-auto"
        >
          <button className="group relative flex items-center gap-3 rounded-full bg-[#39FF14] px-12 py-5 text-lg font-black tracking-wider text-black shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(57,255,20,0.6)]">
            VER GENÉTICAS
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}
