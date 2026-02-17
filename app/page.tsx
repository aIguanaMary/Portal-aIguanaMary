"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LEAF_MASK_URL = "/leaf-prismatic.svg";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FallingLeaf = {
  id: number;
  depth: number;
  isFront: boolean;
  size: number;
  x: number;
  drift: number;
  rotateZ: number;
  rotateZ2: number;
  rotateX: number;
  rotateY: number;
  duration: number;
  delay: number;
  opacity: number;
  c1: string;
  c2: string;
  c3: string;
};

function buildLeaves(count: number, seed = 20260211): FallingLeaf[] {
  const rndBase = mulberry32(seed);

  const greens = ["#39FF14", "#A6FF4D", "#00FF9A"];
  const purples = ["#8A2BE2", "#B65CFF", "#6D28D9"];
  const yellows = ["#FFE86B", "#FFD54A", "#C7FF4D"];

  const pick = (arr: string[], r: () => number) => arr[Math.floor(r() * arr.length)];

  const out: FallingLeaf[] = [];
  for (let i = 0; i < count; i++) {
    const r = mulberry32(Math.floor(rndBase() * 1e9) + i * 97);

    const depth = Math.min(1, Math.max(0, Math.pow(r(), 1.7)));
    const isFront = depth > 0.62;

    const c1 = r() > 0.45 ? pick(greens, r) : pick(purples, r);
    const c2 = r() > 0.5 ? pick(purples, r) : pick(greens, r);
    const c3 = pick(yellows, r);

    const size = 26 + depth * 110 + r() * 18;
    const x = r() * 110 - 5;
    const drift = (r() * 2 - 1) * (10 + depth * 14);

    const rotateZ = r() * 360;
    const rotateZ2 = (r() * 2 - 1) * (520 + depth * 640);

    const rotateX = (r() * 2 - 1) * (6 + depth * 10);
    const rotateY = (r() * 2 - 1) * (6 + depth * 10);

    const duration = 18 - depth * 9 + r() * 2.3;
    const delay = r() * 2.2; // positivo = não “spawnar no meio”
    const opacity = 0.14 + depth * 0.72 + r() * 0.08;

    out.push({
      id: i,
      depth,
      isFront,
      size,
      x,
      drift,
      rotateZ,
      rotateZ2,
      rotateX,
      rotateY,
      duration,
      delay,
      opacity,
      c1,
      c2,
      c3,
    });
  }

  return out;
}

function MaskedStainedGlassLeaf({
  sizePx,
  c1,
  c2,
  c3,
  frontGlow,
}: {
  sizePx: number;
  c1: string;
  c2: string;
  c3: string;
  frontGlow: boolean;
}) {
  const w = sizePx;
  const h = sizePx * 1.12;

  const maskCommon: React.CSSProperties = {
    WebkitMaskImage: `url(${LEAF_MASK_URL})`,
    maskImage: `url(${LEAF_MASK_URL})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };

  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {/* chumbo / outline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          ...maskCommon,
          background: "#050505",
          opacity: 0.95,
          // bem mais leve que antes
          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.55))",
        }}
      />

      {/* vidro prismático (sem animação interna por folha = MUITO mais leve) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          ...maskCommon,
          backgroundImage: `
            radial-gradient(120% 90% at 40% 25%, ${c1} 0%, ${c2} 48%, ${c3} 78%, rgba(0,0,0,0) 100%),
            repeating-conic-gradient(from 20deg at 52% 45%,
              rgba(255,255,255,0.18) 0deg 10deg,
              rgba(255,255,255,0.05) 10deg 22deg,
              rgba(255,255,255,0.00) 22deg 40deg
            )
          `,
          backgroundBlendMode: "screen",
          opacity: 0.92,
          mixBlendMode: "plus-lighter",
          filter: frontGlow
            ? "drop-shadow(0 0 8px rgba(57,255,20,0.18)) drop-shadow(0 0 10px rgba(138,43,226,0.14))"
            : "none",
        }}
      />
    </div>
  );
}

function LeafRain() {
  // 16 folhas (mais leve que 25)
  const leaves = useMemo(() => buildLeaves(16), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ perspective: "900px", transformStyle: "preserve-3d" }}
      >
        {leaves.map((leaf) => {
          const scale = 0.7 + leaf.depth * 0.62;

          return (
            <motion.div
              key={leaf.id}
              className="absolute top-0 left-0"
              style={{
                left: `${leaf.x}vw`,
                opacity: leaf.opacity,
                transformStyle: "preserve-3d",
                willChange: "transform",
                // blend só na frente (alivia GPU)
                mixBlendMode: leaf.isFront ? ("plus-lighter" as any) : ("normal" as any),
              }}
              initial={{
                y: "-18vh",
                x: 0,
                rotateZ: leaf.rotateZ,
                rotateX: leaf.rotateX,
                rotateY: leaf.rotateY,
                scale,
              }}
              animate={{
                y: "118vh",
                x: `${leaf.drift}vw`,
                rotateZ: leaf.rotateZ + leaf.rotateZ2,
                rotateX: leaf.rotateX,
                rotateY: leaf.rotateY,
                scale,
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <MaskedStainedGlassLeaf
                sizePx={leaf.size}
                c1={leaf.c1}
                c2={leaf.c2}
                c3={leaf.c3}
                frontGlow={leaf.isFront}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black">
      {/* Sheen GLOBAL (luz passando no cenário) — barato e dá vida */}
      <style jsx global>{`
        @keyframes iguanaScreenSheen {
          0% { transform: translateX(-120%) rotate(18deg); opacity: 0; }
          12% { opacity: 0.35; }
          50% { opacity: 0.22; }
          100% { transform: translateX(120%) rotate(18deg); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[42%] h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39FF14] opacity-[0.08] blur-[150px]" />
        <div className="absolute left-1/2 top-[46%] h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A2BE2] opacity-[0.06] blur-[170px]" />
        <div className="absolute left-1/2 top-[50%] h-[60vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE86B] opacity-[0.035] blur-[190px]" />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 46%, rgba(255,255,255,0) 92%)",
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

      <div className="absolute inset-0 z-10">
        <LeafRain />
      </div>

      <section className="relative z-20 mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.965 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative"
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
          className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-gray-400 md:text-lg"
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
          className="mt-12"
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
