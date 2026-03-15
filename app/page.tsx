"use client";

import React, { useEffect, useState, useRef, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Dna, Zap, Shield, ChevronRight, Star, Lock } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════
   ARQUITETURA DE PERFORMANCE

   CAUSA DO LAG: backdropFilter em 20 folhas = 20 stacking contexts
   com GPU que precisa amostrar e re-renderizar tudo por trás de cada
   folha a cada frame. Custo: O(n) por pixel coberto.

   SOLUÇÃO APLICADA:
   ① LeafRain  — backdropFilter REMOVIDO. Apenas SVG mask + cor sólida
                 + box-shadow. Zero background sampling. 100% compositor.
   ② AmbientBg — radial-gradient puro (sem blur). Só opacity + transform.
   ③ Glitch    — animação CSS a cada 7s (era 4s). Menos repaint.
   ④ Cards     — isolation:isolate + fundo #000 → mix-blend-mode correto.
   ⑤ Framer    — whileInView once:true. Nenhum loop infinito via Motion.
                 Loops usam CSS keyframes (compositor nativo).
══════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────
   1. CHUVA DE FOLHAS — SEM backdropFilter
   Cada folha = SVG mask + background sólido + box-shadow.
   willChange:"transform" + contain:"layout style paint" =
   cada folha é um layer independente sem afetar o resto.
────────────────────────────────────────────────────────────────── */
type LeafData = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: string;
  rotation: string;
  color: string;
  glow: string;
  zIndex: number;
};

const LEAF_PALETTES = [
  "57,255,20",
  "138,43,226",
  "0,229,255",
  "255,232,107",
];

const LeafRain = memo(function LeafRain() {
  const [leaves, setLeaves] = useState<LeafData[]>([]);

  useEffect(() => {
    const gen = Array.from({ length: 15 }, (_, i) => {
      const rgb = LEAF_PALETTES[i % LEAF_PALETTES.length];
      const isFront = Math.random() > 0.58;
      return {
        id: i,
        left: `${Math.random() * 112 - 6}vw`,
        size: isFront ? 38 + Math.random() * 42 : 14 + Math.random() * 24,
        duration: 14 + Math.random() * 16,
        delay: Math.random() * -32,
        drift: `${(Math.random() - 0.5) * 62}vw`,
        rotation: `${(Math.random() - 0.5) * 700}deg`,
        color: `rgba(${rgb},${(0.15 + Math.random() * 0.18).toFixed(2)})`,
        glow: `rgba(${rgb},${(0.3 + Math.random() * 0.3).toFixed(2)})`,
        zIndex: isFront ? 25 : 6,
      };
    });
    setLeaves(gen);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-15vh]"
          style={{
            left: leaf.left,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.12}px`,
            zIndex: leaf.zIndex,
            "--drift": leaf.drift,
            "--rotation": leaf.rotation,
            animation: `fallingLeaf ${leaf.duration}s linear ${leaf.delay}s infinite`,
            willChange: "transform",
            contain: "layout style paint",
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
              background: leaf.color,
              boxShadow: `0 0 ${leaf.size * 0.3}px ${leaf.glow}`,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>
      ))}
    </div>
  );
});

/* ──────────────────────────────────────────────────────────────────
   2. FUNDO AMBIENTE — radial-gradient + opacity/transform (GPU puro)
   ZERO blur, ZERO background-filter. Apenas cores e animações de
   opacidade / escala — tudo resolvido no compositor.
────────────────────────────────────────────────────────────────── */
const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid cyberpunk animado */}
      <div className="absolute inset-0 cyber-grid-animated" />

      {/* Orb neon verde — base-esquerda */}
      <div
        className="absolute orb-pulse"
        style={{
          bottom: "-20%",
          left: "-12%",
          width: "65vw",
          height: "65vw",
          background:
            "radial-gradient(circle, rgba(57,255,20,0.055) 0%, transparent 62%)",
          willChange: "opacity, transform",
        }}
      />

      {/* Orb roxo — topo-direita */}
      <div
        className="absolute orb-pulse-alt"
        style={{
          top: "-12%",
          right: "-12%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, rgba(138,43,226,0.065) 0%, transparent 60%)",
          willChange: "opacity, transform",
        }}
      />

      {/* Orb teal — centro-medio */}
      <div
        className="absolute orb-pulse-slow"
        style={{
          top: "45%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          width: "35vw",
          height: "35vw",
          background:
            "radial-gradient(circle, rgba(0,229,255,0.025) 0%, transparent 60%)",
          willChange: "opacity, transform",
        }}
      />

      {/* Linha neon horizontal tênue — divisor visual */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(57,255,20,0.04) 30%, rgba(138,43,226,0.04) 70%, transparent)",
          opacity: 0.8,
        }}
      />

      {/* Scanlines sutis de toda a página */}
      <div className="absolute inset-0 scan-lines opacity-60" />
    </div>
  );
});

/* ──────────────────────────────────────────────────────────────────
   3. BANCO DE DADOS DAS GENÉTICAS
────────────────────────────────────────────────────────────────── */
const GENETICS_DB = [
  {
    id: "lebron",
    name: "Lebron Haze",
    type: "SATIVA DOMINANTE",
    thc: "22%",
    cbd: "< 1%",
    terpenes: "Limoneno · Mirceno",
    flowering: "8–9 Semanas",
    origin: "Haze × Jack Herer",
    effects: ["Euforia", "Criatividade", "Foco"],
    color: "#FFE86B",
    colorRgb: "255,232,107",
    image: "/lebron.jpg",
    badge: "SATIVA",
    rating: 4.8,
    associacoes: [],
  },
  {
    id: "gorilla",
    name: "Gorilla Glue",
    type: "HÍBRIDA EQUILIBRADA",
    thc: "26%",
    cbd: "1%",
    terpenes: "Cariofileno · Mirceno",
    flowering: "9–10 Semanas",
    origin: "Chem's Sis × Sour Dubb",
    effects: ["Relaxamento", "Euforia", "Sono"],
    color: "#39FF14",
    colorRgb: "57,255,20",
    image: "/gorilla.jpg",
    badge: "HÍBRIDA",
    rating: 4.9,
    associacoes: ["ACAFLOR"],
  },
  {
    id: "pineapple",
    name: "Pineapple Kush",
    type: "INDICA DOMINANTE",
    thc: "18%",
    cbd: "2%",
    terpenes: "Pineno · Linalol",
    flowering: "8 Semanas",
    origin: "Pineapple × OG Kush",
    effects: ["Relaxamento", "Dor", "Ansiedade"],
    color: "#8A2BE2",
    colorRgb: "138,43,226",
    image: "/pineapple.png",
    badge: "INDICA",
    rating: 4.7,
    associacoes: ["Maria Flor"],
  },
  {
    id: "sour",
    name: "Sour Diesel",
    type: "SATIVA DOMINANTE",
    thc: "21%",
    cbd: "1%",
    terpenes: "Limoneno · Cariofileno",
    flowering: "10 Semanas",
    origin: "Chemdawg × Super Skunk",
    effects: ["Energia", "Foco", "Criatividade"],
    color: "#FFE86B",
    colorRgb: "255,232,107",
    image: "/lebron.jpg",
    badge: "SATIVA",
    rating: 4.9,
    associacoes: [],
  },
  {
    id: "widow",
    name: "White Widow",
    type: "HÍBRIDA",
    thc: "19%",
    cbd: "1%",
    terpenes: "Mirceno · Pineno",
    flowering: "8 Semanas",
    origin: "Sativa BR × Indica IN",
    effects: ["Relaxamento", "Felicidade", "Fome"],
    color: "#39FF14",
    colorRgb: "57,255,20",
    image: "/gorilla.jpg",
    badge: "HÍBRIDA",
    rating: 4.6,
    associacoes: ["Cultiva Brasil"],
  },
  {
    id: "dream",
    name: "Blue Dream",
    type: "SATIVA DOMINANTE",
    thc: "24%",
    cbd: "2%",
    terpenes: "Mirceno · Pineno",
    flowering: "9 Semanas",
    origin: "Blueberry × Haze",
    effects: ["Euforia", "Relaxamento", "Criatividade"],
    color: "#8A2BE2",
    colorRgb: "138,43,226",
    image: "/pineapple.png",
    badge: "SATIVA",
    rating: 4.8,
    associacoes: [],
  },
];

/* ──────────────────────────────────────────────────────────────────
   4. CARD HOLOGRÁFICO DE GENÉTICA

   CORREÇÃO DA IMAGEM (retângulo preto):
   O container da imagem usa background:#000 PURO + isolation:isolate.
   mix-blend-mode:screen sobre fundo negro elimina pixels escuros da
   foto, mantendo apenas a planta visível — sem retângulo.

   filter:brightness(1.5) contrast(1.1) intensifica o contraste:
   fundo escuro → colapsa para preto → desaparece com screen blend.
   Planta colorida → fica brilhante e "holográfica".
────────────────────────────────────────────────────────────────── */
function GeneticsCard({
  data,
  isActive,
  onClick,
}: {
  data: (typeof GENETICS_DB)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center w-full">
      <motion.div
        onClick={onClick}
        className="relative w-full cursor-pointer"
        style={{
          height: 300,
          borderRadius: 16,
          overflow: "hidden",
          isolation: "isolate",
          background: "#050505",
          border: isActive
            ? `1px solid rgba(${data.colorRgb},0.65)`
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isActive
            ? `0 0 0 1px rgba(${data.colorRgb},0.1),
               0 0 40px rgba(${data.colorRgb},0.14),
               0 0 90px rgba(${data.colorRgb},0.05),
               0 28px 80px rgba(0,0,0,0.95)`
            : "0 8px 40px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.025)",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        }}
        whileHover={{ scale: isActive ? 1 : 1.022, y: isActive ? 0 : -4 }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {/* ── Cyberpunk grid interno ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)," +
              "linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* ── Linha de canto: topo-esquerda ── */}
        <div
          className="absolute top-0 left-0 z-[6] pointer-events-none"
          style={{ transition: "all 0.45s ease" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "1.5px",
              width: isActive ? "55%" : "28%",
              background: `linear-gradient(to right, rgba(${data.colorRgb},${isActive ? "1" : "0.4"}), transparent)`,
              transition: "width 0.45s ease, opacity 0.45s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1.5px",
              height: isActive ? "45%" : "22%",
              background: `linear-gradient(to bottom, rgba(${data.colorRgb},${isActive ? "1" : "0.4"}), transparent)`,
              transition: "height 0.45s ease, opacity 0.45s ease",
            }}
          />
        </div>

        {/* ── Linha de canto: base-direita ── */}
        <div
          className="absolute bottom-0 right-0 z-[6] pointer-events-none"
          style={{ transition: "all 0.45s ease" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: "1.5px",
              width: isActive ? "55%" : "28%",
              background: `linear-gradient(to left, rgba(${data.colorRgb},${isActive ? "1" : "0.4"}), transparent)`,
              transition: "width 0.45s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "1.5px",
              height: isActive ? "45%" : "22%",
              background: `linear-gradient(to top, rgba(${data.colorRgb},${isActive ? "1" : "0.4"}), transparent)`,
              transition: "height 0.45s ease",
            }}
          />
        </div>

        {/* ── Scanner + Holo (somente ativo) ── */}
        {isActive && <div className="scanner-line" />}
        {isActive && (
          <div className="absolute inset-0 holo-overlay z-[3] pointer-events-none" />
        )}

        {/* ── Badge tipo ── */}
        <div
          className="absolute top-3 left-3 z-[7] font-mono text-[8.5px] font-black tracking-[0.22em] px-2 py-[3px] rounded-[3px]"
          style={{
            color: data.color,
            background: `rgba(${data.colorRgb},0.1)`,
            border: `1px solid rgba(${data.colorRgb},0.35)`,
            textShadow: `0 0 8px rgba(${data.colorRgb},0.8)`,
            boxShadow: `0 0 12px rgba(${data.colorRgb},0.12)`,
          }}
        >
          {data.badge}
        </div>

        {/* ── Rating ── */}
        <div className="absolute top-3 right-3 z-[7] flex items-center gap-[3px]">
          <Star
            size={9}
            style={{
              fill: data.color,
              stroke: "none",
              filter: `drop-shadow(0 0 5px ${data.color})`,
            }}
          />
          <span
            className="font-mono text-[10px] font-bold"
            style={{
              color: data.color,
              textShadow: `0 0 6px rgba(${data.colorRgb},0.6)`,
            }}
          >
            {data.rating}
          </span>
        </div>

        {/* ────────────────────────────────────────────────────────
            HOLOGRAMA — CORREÇÃO DO RETÂNGULO PRETO
            Container: background #000 PURO + isolation:isolate
            mix-blend-mode:screen sobre #000 → pixels escuros somem
            → apenas a planta colorida permanece visível.
            brightness(1.5) + contrast(1.1): colapsa fundos escuros
            para preto puro, amplifica a planta.
        ──────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
          style={{ background: "#000000", isolation: "isolate" }}
        >
          <motion.img
            src={data.image}
            alt={data.name}
            draggable={false}
            className="object-contain select-none"
            style={{
              mixBlendMode: "screen",
              filter: isActive
                ? `brightness(1.65) contrast(1.12)
                   drop-shadow(0 0 28px rgba(${data.colorRgb},0.95))
                   drop-shadow(0 0 64px rgba(${data.colorRgb},0.4))`
                : `brightness(1.4) contrast(1.08)
                   drop-shadow(0 0 14px rgba(${data.colorRgb},0.55))`,
              width: isActive ? 228 : 188,
              maxWidth: "84%",
              maxHeight: "84%",
              transition: "filter 0.45s ease, width 0.4s ease",
            }}
            animate={{
              y: isActive ? [-7, 7, -7] : 0,
              scale: isActive ? 1.07 : 1,
            }}
            transition={{
              y: isActive
                ? { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
                : { duration: 0.3 },
              scale: { type: "spring", stiffness: 130, damping: 16 },
            }}
          />
        </div>

        {/* ── Texto inativo ── */}
        {!isActive && (
          <div className="absolute bottom-4 inset-x-0 text-center z-[7] px-3">
            <p className="font-space text-[11px] font-bold tracking-[0.2em] text-white/45 uppercase truncate">
              {data.name}
            </p>
            <p className="font-mono text-[7.5px] text-white/20 mt-0.5 tracking-[0.28em] uppercase">
              ⬡ CLIQUE PARA DECODIFICAR
            </p>
          </div>
        )}

        {/* ── Texto ativo ── */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-9 inset-x-0 text-center z-[7]"
          >
            <p
              className="font-mono text-[8px] tracking-[0.38em] uppercase"
              style={{
                color: `rgb(${data.colorRgb})`,
                textShadow: `0 0 14px rgba(${data.colorRgb},1), 0 0 30px rgba(${data.colorRgb},0.5)`,
              }}
            >
              ⬡ DADOS DECODIFICADOS ⬡
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* ── Painel de dados ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="w-full overflow-hidden"
          >
            {/* Tarja de marca */}
            <div
              className="w-full py-2 px-4 text-center"
              style={{
                background: `linear-gradient(to right, #070707, rgba(${data.colorRgb},0.045), #070707)`,
                borderLeft: `1px solid rgba(${data.colorRgb},0.22)`,
                borderRight: `1px solid rgba(${data.colorRgb},0.22)`,
              }}
            >
              <span
                className="font-space font-black text-[10px] tracking-[0.3em] uppercase"
                style={{
                  color: data.color,
                  textShadow: `0 0 14px rgba(${data.colorRgb},0.9)`,
                }}
              >
                ⬡ IGUANA MARY SEEDS ⬡
              </span>
            </div>

            {/* Ficha técnica */}
            <div
              className="w-[93%] mx-auto rounded-b-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
              style={{
                background: "#eaeae2",
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(0,0,0,0.045) 23px,rgba(0,0,0,0.045) 24px)",
              }}
            >
              <div className="p-5">
                <h3 className="font-space font-black text-[15px] uppercase text-black mb-3 leading-tight">
                  {data.name}
                </h3>

                <div className="space-y-1.5 font-mono text-[10.5px] text-black/70">
                  {[
                    ["Tipo", data.type],
                    ["THC / CBD", `${data.thc} / ${data.cbd}`],
                    ["Terpenos", data.terpenes],
                    ["Floração", data.flowering],
                    ["Origem", data.origin],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="flex justify-between items-start border-b border-black/[0.07] pb-1.5 gap-3"
                    >
                      <span className="text-black/40 font-medium shrink-0">
                        {label}
                      </span>
                      <span className="font-bold text-right text-[10px] leading-snug">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {data.effects.map((e) => (
                    <span
                      key={e}
                      className="font-mono text-[8px] font-bold uppercase px-2 py-[3px] rounded-sm"
                      style={{
                        background: `rgba(${data.colorRgb},0.12)`,
                        color: `rgb(${data.colorRgb})`,
                        border: `1px solid rgba(${data.colorRgb},0.28)`,
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    className="w-full py-2.5 text-black text-[10px] font-space font-black uppercase tracking-[0.22em] rounded-sm transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                    style={{
                      background: `rgb(${data.colorRgb})`,
                      boxShadow: `0 0 22px rgba(${data.colorRgb},0.32)`,
                    }}
                  >
                    Adquirir Semente
                  </button>

                  {/* Botão condicional — só aparece se houver associações */}
                  {data.associacoes.length > 0 && (
                    <button className="w-full py-2 bg-transparent text-black/65 border border-black/25 text-[10px] font-space font-bold uppercase tracking-[0.18em] rounded-sm hover:bg-black hover:text-white transition-all duration-200">
                      Buscar via Associação
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   5. SEÇÃO FEATURES
────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Dna,
    title: "Enciclopédia Genética",
    desc: "300+ strains catalogadas com perfil de terpenos, genealogia, efeitos e dados científicos.",
    color: "#39FF14",
    colorRgb: "57,255,20",
  },
  {
    icon: Zap,
    title: "Simulador de Grow",
    desc: "Configure ambiente, nutrição e iluminação. Visualize o desenvolvimento da planta em tempo real.",
    color: "#FFE86B",
    colorRgb: "255,232,107",
  },
  {
    icon: Shield,
    title: "Rede de Profissionais",
    desc: "Médicos, farmacêuticos e advogados especializados em cannabis medicinal no Brasil.",
    color: "#8A2BE2",
    colorRgb: "138,43,226",
  },
];

function FeaturesSection() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55 }}
        className="text-center mb-16"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.45em] mb-3"
          style={{ color: "rgba(57,255,20,0.5)" }}
        >
          ⬡ SISTEMA DE MÓDULOS ⬡
        </p>
        <h2 className="font-space font-black text-3xl md:text-5xl text-white tracking-wide">
          TUDO QUE VOCÊ PRECISA
        </h2>
        <div className="mt-5 mx-auto w-28 h-px bg-gradient-to-r from-transparent via-iguana-neon/60 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc, color, colorRgb }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative p-7 rounded-2xl cursor-default overflow-hidden"
            style={{
              background: "#050505",
              border: "1px solid rgba(255,255,255,0.055)",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Glow no hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                background: `radial-gradient(ellipse at 0% 0%, rgba(${colorRgb},0.07) 0%, transparent 55%)`,
              }}
            />

            {/* Corner accent top-left */}
            <div className="absolute top-0 left-0 pointer-events-none z-[2]">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "1.5px",
                  width: "38px",
                  background: color,
                  opacity: 0.6,
                  transition: "opacity 0.3s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "1.5px",
                  height: "38px",
                  background: color,
                  opacity: 0.6,
                  transition: "opacity 0.3s",
                }}
              />
            </div>

            <div className="relative z-[3]">
              <div
                className="mb-5 inline-flex p-2.5 rounded-lg"
                style={{
                  background: `rgba(${colorRgb},0.08)`,
                  border: `1px solid rgba(${colorRgb},0.15)`,
                }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{
                    color,
                    filter: `drop-shadow(0 0 8px ${color})`,
                  }}
                />
              </div>

              <h3 className="font-space font-bold text-[13px] uppercase tracking-[0.18em] text-white mb-2.5">
                {title}
              </h3>
              <p className="font-mono text-[11px] text-gray-600 leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                {desc}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color }}
                >
                  Explorar
                </span>
                <ChevronRight
                  size={11}
                  style={{ color }}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   6. CTA TERMINAL
────────────────────────────────────────────────────────────────── */
function TerminalCTA() {
  const [typed, setTyped] = useState("");
  const full = "> acesso liberado para usuário medicinal_br...";
  const inViewRef = useRef<HTMLElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 42);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section
      ref={inViewRef}
      className="relative z-20 max-w-4xl mx-auto px-6 py-16 pb-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(2,8,2,0.92)",
          border: "1px solid rgba(57,255,20,0.14)",
          boxShadow:
            "0 0 80px rgba(57,255,20,0.04), 0 40px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Barra de título do terminal */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05] bg-black/50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#39FF14", opacity: 0.7 }}
          />
          <span className="font-mono text-[10px] text-gray-700 ml-3 tracking-[0.22em]">
            iguana-mary-portal ~ bash
          </span>
        </div>

        <div className="p-8 md:p-12">
          <p
            className="font-mono text-[11px] tracking-[0.1em] mb-2"
            style={{ color: "rgba(57,255,20,0.5)" }}
          >
            {typed}
            {typed.length < full.length && (
              <span
                className="inline-block w-[7px] h-[14px] ml-0.5 animate-blink"
                style={{ background: "#39FF14" }}
              />
            )}
          </p>

          <h2 className="font-space font-black text-2xl md:text-4xl text-white mt-6 mb-4 leading-tight">
            FAÇA PARTE DA
            <br />
            <span
              className="neon-flicker"
              style={{
                color: "#39FF14",
                textShadow: "0 0 30px rgba(57,255,20,0.6)",
              }}
            >
              COMUNIDADE VIP
            </span>
          </h2>

          <p className="font-mono text-[12px] text-gray-600 max-w-md leading-[1.85] mb-8">
            Acesse guias de cultivo avançados, tire dúvidas com especialistas
            e conecte-se com cultivadores de todo o Brasil.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              className="font-space font-black text-[13px] tracking-[0.22em] uppercase px-8 py-3.5 text-black rounded-sm"
              style={{
                background: "#39FF14",
                boxShadow: "0 0 30px rgba(57,255,20,0.3)",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 50px rgba(57,255,20,0.6)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Acessar Telegram
            </motion.button>
            <motion.button
              className="font-space font-bold text-[13px] tracking-[0.16em] uppercase px-8 py-3.5 border border-white/10 text-gray-500 hover:text-white hover:border-white/25 rounded-sm transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Seguir no Instagram →
            </motion.button>
          </div>

          <p className="font-mono text-[9px] text-gray-800 mt-7 uppercase tracking-[0.22em]">
            ⬡ Portal educativo · Cannabis medicinal · BR · ANVISA compliant
          </p>
        </div>

        {/* CRT scanlines do terminal */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px)",
          }}
        />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   7. HOME — PÁGINA PRINCIPAL
────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [activeGenetic, setActiveGenetic] = useState<string | null>(null);

  // 1.5 fileiras: altura-card(300) + gap(24) + meia-fileira(150) = 474px
  const VAULT_MAX_H = "474px";

  return (
    <div className="relative w-full overflow-x-hidden selection:bg-iguana-neon selection:text-black">
      {/* Fundo ambiente — fixo, z-0, sem blur */}
      <AmbientBackground />

      {/* Chuva de folhas — fixo, z-5 */}
      <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
        <LeafRain />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 min-h-[95vh] flex flex-col items-center justify-center text-center px-6 pt-8">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
          style={{
            border: "1px solid rgba(57,255,20,0.22)",
            background: "rgba(57,255,20,0.04)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-iguana-neon animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-iguana-neon/70">
            Portal Cannábico Brasileiro
          </span>
          <Lock size={10} className="text-iguana-neon/35" />
        </motion.div>

        {/* Título glitch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12 }}
          className="relative"
        >
          <h1
            className="glitch-text font-space font-black leading-[0.86] tracking-tight"
            data-text="NA PALMA DA MÃO"
            style={{
              fontSize: "clamp(3.2rem, 13vw, 9.5rem)",
              background:
                "linear-gradient(168deg, #ffffff 0%, #c8e8c8 32%, #39FF14 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(57,255,20,0.12))",
            }}
          >
            NA PALMA
            <br />
            DA MÃO
          </h1>
        </motion.div>

        {/* Subtítulo minimalista */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.65 }}
          className="font-mono mt-8 max-w-sm text-gray-500 text-[12.5px] leading-[2] tracking-[0.08em]"
        >
          Genéticas de elite · Simulador de grow · Rede profissional
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            className="font-space font-black text-[13px] tracking-[0.22em] uppercase px-10 py-4 text-black rounded-sm"
            style={{
              background: "#39FF14",
              boxShadow:
                "0 0 40px rgba(57,255,20,0.35), 0 0 80px rgba(57,255,20,0.1)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 0 60px rgba(57,255,20,0.6), 0 0 120px rgba(57,255,20,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Explorar Genéticas
          </motion.button>
          <motion.button
            className="font-space font-bold text-[13px] tracking-[0.18em] uppercase px-10 py-4 border text-gray-500 hover:text-white rounded-sm transition-all duration-300"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(255,255,255,0.24)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Como Funciona
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.45em] text-gray-700">
            Rolar
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-iguana-neon/30 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COFRE DE GENÉTICAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.45em] mb-3"
            style={{ color: "rgba(57,255,20,0.5)" }}
          >
            ⬡ BANCO DE DADOS ENCRIPTADO ⬡
          </p>
          <h2 className="font-space font-black text-3xl md:text-5xl text-white tracking-wide">
            COFRE DE GENÉTICAS
          </h2>
          <div className="mt-5 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-iguana-neon/50 to-transparent" />
          <p
            className="font-mono mt-5 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Selecione uma strain para decodificar
          </p>
        </motion.div>

        {/* ── VITRINE CORTADA (1.5 fileiras) ── */}
        <div
          className="relative w-full"
          style={{
            maxHeight: activeGenetic ? "9999px" : VAULT_MAX_H,
            overflow: activeGenetic ? "visible" : "hidden",
            transition: "max-height 0.55s ease",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {GENETICS_DB.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <GeneticsCard
                  data={g}
                  isActive={activeGenetic === g.id}
                  onClick={() =>
                    setActiveGenetic(activeGenetic === g.id ? null : g.id)
                  }
                />
              </motion.div>
            ))}
          </div>

          {/* ── Fade negro + Botão CTA ── */}
          <AnimatePresence>
            {!activeGenetic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center justify-end pb-10"
                style={{
                  height: "270px",
                  background:
                    "linear-gradient(to top, #050505 0%, #050505 22%, rgba(5,5,5,0.92) 50%, rgba(5,5,5,0.5) 78%, transparent 100%)",
                  pointerEvents: "none",
                }}
              >
                <motion.button
                  className="relative font-space font-black text-sm md:text-[15px] tracking-[0.2em] uppercase px-12 py-5 text-black rounded-sm overflow-hidden group"
                  style={{
                    background: "#39FF14",
                    border: "1px solid rgba(57,255,20,0.5)",
                    boxShadow:
                      "0 0 50px rgba(57,255,20,0.2), 0 0 100px rgba(57,255,20,0.07)",
                    pointerEvents: "auto",
                  }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow:
                      "0 0 80px rgba(57,255,20,0.55), 0 0 160px rgba(57,255,20,0.18)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    ACESSAR TODAS AS GENÉTICAS
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  {/* Shimmer sweep */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)",
                    }}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <FeaturesSection />
      <TerminalCTA />
    </div>
  );
}
