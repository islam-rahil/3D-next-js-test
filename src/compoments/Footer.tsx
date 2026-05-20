import Art from "./Art"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

const socials = [
  { label: "GitHub", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white px-6 py-16 sm:px-12 lg:px-20">

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10 flex flex-col gap-14">

        {/* Top: Brand + Nav + Image */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

          {/* Left: wordmark + nav */}
          <div className="flex flex-col gap-8">
            <h1
              className="font-black uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(3.5rem,12vw,9rem)]"
              style={{ fontFamily: "'Arial Black', 'Impact', sans-serif" }}
            >
              Pixel
              <span className="text-transparent [-webkit-text-stroke:2px_white] opacity-40">
                Back
              </span>
            </h1>

            <nav>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group relative text-sm font-medium uppercase tracking-widest text-white/50 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: image with frame */}
          <div className="relative shrink-0 self-end">
            <div className="absolute -inset-2 border border-white/10" />
            <div className="absolute -inset-4 border border-white/5" />
            <Art img="tb1.jpg" resolution={400} />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10" />

        {/* Bottom: copyright + socials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs tracking-widest text-white/30 uppercase">
            © {new Date().getFullYear()} PixelBack. All rights reserved.
          </p>

          <ul className="flex gap-6">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-xs font-medium uppercase tracking-widest text-white/30 transition-colors duration-200 hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  )
}