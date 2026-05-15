import DitherShader from "./dither-shader";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const stats = [
  {
    title: "8+",
    subtitle: "Visual Effects",
  },
  {
    title: "HD",
    subtitle: "High Quality Export",
  },
  {
    title: "100%",
    subtitle: "Customizable",
  },
];

export default function About() {
  return (
    <section
      className={`${poppins.className} relative overflow-hidden py-28`}
    >
      {/* Background glow */}
      <div className="absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#ff7e5a]/10 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:grid-cols-2 lg:px-10">
        
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          
          <span className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-[#ff7e5a]">
            Creative Project
          </span>

          <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
            About{" "}
            <span className="text-[#ff7e5a]">
              Pixel-back
            </span>
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-400">
            
            <p>
              Pixel-back is a creative experimental platform focused on
              image pixelization, retro rendering and visual shader effects.
            </p>

            <p>
              The project transforms modern images into nostalgic digital
              artworks inspired by vintage consoles, CRT displays and
              old-school computer graphics.
            </p>

            <p>
              Users can upload their own images, apply multiple rendering
              styles and instantly export unique artistic results.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-5">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7e5a]/40 hover:bg-white/10"
              >
                <h3 className="text-3xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center">
          
          {/* Glow */}
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-[#ff7e5a]/20 to-pink-500/10 blur-3xl" />
                <DitherShader
              src="/hero2.jpg"
              gridSize={1}
              ditherMode="bayer"
              colorMode="duotone"
              primaryColor="#ff7e5a"
              secondaryColor="#f1f1f1"
              threshold={0.3}
              className="h-[650px] w-full object-cover"
            />
          {/* Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 shadow-[0_0_80px_rgba(255,126,90,0.15)] backdrop-blur-xl">
            
            

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-xl">
              <p className="text-sm tracking-wide text-zinc-300">
                Shader • Dithering • Pixel Art
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}