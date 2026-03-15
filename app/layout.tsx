import type { Metadata } from "next";
import Image from "next/image";
import { Orbitron, Space_Grotesk, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Leaf, Dna, Users, Stethoscope, Menu, BookOpen, Sprout } from "lucide-react";

/* ─── CARREGAMENTO DE FONTES (Next.js font optimization) ── */
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  weight: "400",
  display: "swap",
});

/* ─── METADATA ─────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "A Iguana Mary — Portal Cannábico",
  description: "Portal vertical de cannabis medicinal: genéticas de elite, guias de cultivo, profissionais e comunidade.",
  icons: { icon: "/favicon.ico" },
};

/* ─── LAYOUT ROOT ───────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-br"
      className={`dark ${orbitron.variable} ${spaceGrotesk.variable} ${shareTechMono.variable}`}
    >
      <body className="bg-background text-white antialiased overflow-x-hidden font-body">

        {/* ── FUNDO BASE ── */}
        <div className="fixed inset-0 z-[-1] bg-[#050505]">
          {/* Grade cyberpunk */}
          <div className="absolute inset-0 bg-cyber-grid bg-grid-size cyber-grid-animated opacity-100" />
          {/* Luzes de fundo suaves */}
          <div className="absolute left-1/4  top-1/3  h-[60vh] w-[50vw]  rounded-full bg-iguana-neon   opacity-[0.025] blur-[180px]" />
          <div className="absolute right-1/4 top-2/3  h-[50vh] w-[40vw]  rounded-full bg-iguana-purple opacity-[0.025] blur-[200px]" />
          <div className="absolute left-1/2  bottom-0 h-[30vh] w-[60vw]  rounded-full bg-iguana-teal   opacity-[0.015] blur-[160px] -translate-x-1/2" />
        </div>

        {/* ── NAVBAR FIXA ─────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl border-b border-iguana-neon/15 shadow-[0_2px_30px_rgba(0,0,0,0.9)]" />

          {/* Linha decorativa inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] neon-border-run opacity-50" />

          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

            {/* ── LOGO ── */}
            <div className="flex items-center gap-3 cursor-pointer group select-none shrink-0">
              <div
                className="relative p-1.5 rounded-xl bg-black border border-iguana-neon/25 transition-all duration-500"
                style={{
                  boxShadow: "0 0 15px rgba(57,255,20,0.08)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 25px rgba(57,255,20,0.4), inset 0 0 15px rgba(57,255,20,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 15px rgba(57,255,20,0.08)")}
              >
                <Image
                  src="/logo-iguana.png"
                  alt="Iguana Mary"
                  width={46}
                  height={46}
                  priority
                  className="rounded-lg object-cover"
                  style={{ filter: "drop-shadow(0 0 6px rgba(57,255,20,0.5))" }}
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-space font-black text-lg md:text-xl tracking-[0.2em] text-white group-hover:text-iguana-neon transition-colors duration-300">
                  IGUANA MARY
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-iguana-neon/50 group-hover:text-iguana-neon/80 transition-colors">
                  Portal Cannábico
                </span>
              </div>
            </div>

            {/* ── MENU CENTRAL ── */}
            <div className="hidden lg:flex items-center gap-7">
              {[
                { icon: Leaf,         label: "Simule o Grow" },
                { icon: BookOpen,     label: "Guias" },
                { icon: Dna,          label: "Genéticas" },
                { icon: Sprout,       label: "Bancos" },
                { icon: Users,        label: "Associações" },
                { icon: Stethoscope,  label: "Profissionais" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="group flex flex-col items-center gap-1.5 cursor-pointer relative"
                >
                  <Icon className="h-4 w-4 text-iguana-neon/40 group-hover:text-iguana-neon transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-neon-green" />
                  <span className="font-space text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 group-hover:text-white transition-colors">
                    {label}
                  </span>
                  {/* Underline animado */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-iguana-neon group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* ── BOTÃO ENTRAR ── */}
            <div className="hidden lg:flex items-center">
              <button
                className="relative font-space text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 border border-iguana-neon/30 text-iguana-neon/70 hover:text-iguana-neon hover:border-iguana-neon transition-all duration-300 rounded-sm overflow-hidden group"
                style={{ background: "rgba(57,255,20,0.03)" }}
              >
                <span className="relative z-10">ENTRAR</span>
                <span className="absolute inset-0 bg-iguana-neon/0 group-hover:bg-iguana-neon/8 transition-colors duration-300" />
              </button>
            </div>

            {/* ── MOBILE MENU ── */}
            <button className="lg:hidden text-white hover:text-iguana-neon transition-colors p-2">
              <Menu size={28} />
            </button>
          </div>
        </nav>

        {/* ── CONTEÚDO PRINCIPAL ── */}
        <main className="pt-20 min-h-screen relative z-10">{children}</main>

      </body>
    </html>
  );
}
