import Navbar from "@/src/compoments/Navbar";
import Footer from "../compoments/Footer";
import About from "../compoments/About";
import FaultyTerminal from "@/src/compoments/FaultyTerminal";
import TextType from "../compoments/TextType";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <Navbar />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.15}
            tint="#ff7e5a"
            mouseReact
            mouseStrength={0.5}
            pageLoadAnimation
            brightness={0.5}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/50 to-black" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7e5a]/20 blur-[120px]" />

        {/* Content */}
        <div className="relative z-20 flex max-w-5xl flex-col items-center px-6 text-center">
          
          {/* Top label */}
          <div className="mb-6 rounded-full border border-[#ff7e5a]/20 bg-[#ff7e5a]/10 px-4 py-2 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-[#ff7e5a]">
              Retro Image Effects
            </p>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-[9rem]">
            <span className="bg-gradient-to-r from-white via-white to-[#ff7e5a] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,126,90,0.35)]">
              <TextType
                text={["Pixel_Back"]}
                typingSpeed={100}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                deletingSpeed={50}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
            Transform your images into nostalgic digital art using
            advanced shaders, dithering algorithms and retro visual
            effects inspired by old CRT monitors and vintage consoles.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            
            <button className="group relative overflow-hidden rounded-xl bg-[#ff7e5a] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:scale-105 hover:bg-white">
              START EXPERIENCE
            </button>

            <button className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-[#ff7e5a] hover:text-[#ff7e5a]">
              LIVE DEMO
            </button>
          </div>

          {/* Scroll */}
          <div className="mt-20 animate-bounce text-xs tracking-[0.3em] text-zinc-500">
            ▼ SCROLL
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <About />

      <Footer />
    </main>
  );
}


{/* <div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Dither
    waveColor={[0.5,0.5,0.5]}
    disableAnimation={false}
    enableMouseInteraction
    mouseRadius={0.3}
    colorNum={4}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.05}
  />
</div> */}
     {/* <DitherShader
          src="/hero2.jpg"
          gridSize={1}
          ditherMode="bayer"
          colorMode="duotone"
          primaryColor="#ff7e5a"
          secondaryColor="#f1f1f1"
          threshold={0.3}
          className="h-screen w-full"
        /> */}

          {/* <main className="h-screen bg-[#000] ">
      
      <div className="h-full w-full grid grid-cols-1  sm:grid-cols-3 gap-10">
        
        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb1.jpg" />
          

        <TextType 
          text={["LE VOYAGEUR CONTEMPLANT UNE MER DE NUAGES - CASPAR DAVID FRIEDRICH"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          className="text-center"
/>
      
        </div>
        
       

      </div>
    </main> */}