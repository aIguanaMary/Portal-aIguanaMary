import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Menu } from "lucide-react";

// Configuração das Fontes
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Iguana Mary",
  description: "Portal Vertical de Cannabis Medicinal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <head>
        {/* FONT AWESOME (CDN) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body
        className={`${inter.variable} ${space.variable} bg-background text-white antialiased overflow-x-hidden`}
      >
        {/* --- FUNDO BASE --- */}
        <div className="fixed inset-0 z-[-1] bg-[#050505]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* --- HEADER FIXO --- */}
        <nav className="fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-[#39FF14]/20 shadow-[0_5px_20px_rgba(0,0,0,0.8)]" />

          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            {/* LOGO (sua iguana) */}
            <div className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative p-2 rounded-xl bg-black border border-[#39FF14]/30 group-hover:border-[#39FF14] transition-all duration-500 shadow-[0_0_15px_rgba(57,255,20,0.1)] group-hover:shadow-[0_0_25px_rgba(57,255,20,0.35)]">
                <Image
                  src="/logo-iguana.png"
                  alt="Iguana Mary"
                  width={44}
                  height={44}
                  priority
                  className="rounded-lg object-cover drop-shadow-[0_0_6px_rgba(57,255,20,0.45)]"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-space font-black text-2xl tracking-[0.18em] text-white group-hover:text-[#39FF14] transition-colors drop-shadow-md">
                  IGUANA MARY
                </span>
                <span className="text-[10px] uppercase tracking-[0.34em] text-gray-400 group-hover:text-white transition-colors">
                  Portal Cannábico • Mapa do Grow • Comunidade
                </span>
              </div>
            </div>

            {/* MENU CENTRAL */}
            <div className="hidden md:flex items-center gap-10">
              <a href="#" className="group flex flex-col items-center gap-1 cursor-pointer">
                <i className="fa-solid fa-cannabis text-2xl text-[#39FF14] opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] group-hover:scale-110" />
                <span className="text-xs font-space font-medium uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors relative">
                  Simule seu Grow
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[#39FF14] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </span>
              </a>

              <a href="#" className="group flex flex-col items-center gap-1 cursor-pointer">
                <i className="fa-solid fa-dna text-2xl text-[#39FF14] opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] group-hover:scale-110" />
                <span className="text-xs font-space font-medium uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors relative">
                  Genéticas
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[#39FF14] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </span>
              </a>

              <a href="#" className="group flex flex-col items-center gap-1 cursor-pointer">
                <i className="fa-solid fa-house-medical text-2xl text-[#39FF14] opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] group-hover:scale-110" />
                <span className="text-xs font-space font-medium uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors relative">
                  Associações
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[#39FF14] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </span>
              </a>

              <a href="#" className="group flex flex-col items-center gap-1 cursor-pointer">
                <i className="fa-solid fa-user-tie text-2xl text-[#39FF14] opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] group-hover:scale-110" />
                <span className="text-xs font-space font-medium uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors relative">
                  Profissionais
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[#39FF14] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </span>
              </a>
            </div>

            {/* REMOVIDO: Botão Acessar */}
            <div className="md:hidden text-white cursor-pointer hover:text-[#39FF14] transition-colors">
              <Menu size={32} />
            </div>
          </div>
        </nav>

        <main className="pt-24 min-h-screen relative z-10">{children}</main>
      </body>
    </html>
  );
}
