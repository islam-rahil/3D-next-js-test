"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const hrefs = [
  { label: "Home",     href: "/"     },
  { label: "Models",  href: "/models"},
  { label: "Contact",  href: "/#contact"  },
];

export default function Navbar() {
  const [open, setOpen]             = useState(false);
  const [activeIndex, setActive]    = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef   = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const moveHighlight = (index: number) => {
    const item = itemRefs.current[index];
    const nav  = navRef.current;
    if (!item || !nav) return;
    const navRect  = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setHoverStyle({ left: itemRect.left - navRect.left, width: itemRect.width, opacity: 1 });
  };

  const hideHighlight = () => setHoverStyle(s => ({ ...s, opacity: 0 }));

  return (
    <header
      className={`${poppins.className} fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-zinc-950/90 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]`}
    >
      <nav className="mx-auto gap-8 max-w-5xl px-6 h-16 flex items-center justify-between">

        <Link href="/" className="group relative text-white font-semibold tracking-tight text-base select-none">
          <span className="relative z-10">PixelBack</span>
          <span className="absolute inset-x-0 bottom-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        <ul ref={navRef} onMouseLeave={hideHighlight} className="hidden md:flex items-center gap-16 relative">
          {hrefs.map(({ label, href }, i) => (
            <li key={i} ref={el => { itemRefs.current[i] = el; }} onMouseEnter={() => { setActive(i); moveHighlight(i); }}>
              <Link
                href={href}
                className="group relative text-white font-semibold tracking-tight text-base select-none"
              >
                {label}
              <span className="absolute inset-x-0 bottom-0 h-[3px]  bg-[#ff7e5a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </li>
          ))}
        </ul>

       

        <button onClick={() => setOpen(o => !o)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5">
          <span className={["block h-px w-5 bg-white rounded-full origin-center transition-all duration-300", open ? "rotate-45 translate-y-[3.5px]" : ""].join(" ")} />
          <span className={["block h-px bg-white rounded-full transition-all duration-300", open ? "w-0 opacity-0" : "w-5 opacity-100"].join(" ")} />
          <span className={["block h-px w-5 bg-white rounded-full origin-center transition-all duration-300", open ? "-rotate-45 -translate-y-[3.5px]" : ""].join(" ")} />
        </button>
      </nav>

      <div
        className={["md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/[0.06] bg-zinc-950/95 backdrop-blur-md",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"].join(" ")}
        aria-hidden={!open}
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {hrefs.map(({ label, href }, i) => (
            <li key={i}>
              <Link href={href} onClick={() => setOpen(false)}
                className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                <span>{label}</span>
                <svg className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 7h12M8 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <Link href="/#contact" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200">
              Démarrer
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}