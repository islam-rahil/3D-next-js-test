import DitherShader from "./dither-shader";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function About() {
  return (
    <section className={`${poppins.className} relative overflow-hidden py-24 px-6 md:px-12`}>
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Texte */}
        <div className="flex flex-col justify-center">
          <span className="mb-4 text-sm uppercase tracking-[0.3em] text-orange-400 font-medium">
            Projet créatif
          </span>

          <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
            À propos de{" "}
            <span className="text-orange-400">Pixel-back</span>
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-zinc-300 max-w-2xl">
            Pixel-back est un projet personnel dédié à l’univers de la
            pixellisation et du dithering d’images.  
            L’objectif est de transformer des visuels classiques en œuvres
            rétro et artistiques grâce à différents effets graphiques.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-zinc-400 max-w-2xl">
            Le site permet d’explorer plusieurs styles visuels, de générer des
            rendus uniques, d’importer ses propres images et de télécharger les
            résultats en quelques secondes.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-zinc-400 max-w-2xl">
            Ce projet a été créé par passion pour le design numérique, les
            shaders et l’esthétique rétro inspirée des anciens écrans et jeux
            vidéo.
          </p>

          {/* Stats / cards */}
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
              <h3 className="text-2xl font-bold text-white">8+</h3>
              <p className="text-sm text-zinc-400">Effets visuels</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
              <h3 className="text-2xl font-bold text-white">HD</h3>
              <p className="text-sm text-zinc-400">Export qualité</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
              <h3 className="text-2xl font-bold text-white">100%</h3>
              <p className="text-sm text-zinc-400">Personnalisable</p>
            </div>
          </div>
        </div>

        {/* Image / Shader */}
        <div className="relative">
          
          {/* contour glow */}
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-orange-500/30 to-pink-500/20 blur-2xl opacity-70" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
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

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* floating label */}
            <div className="absolute bottom-6 left-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-3">
              <p className="text-sm text-zinc-300">
                Shader • Dithering • Pixel Art
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}