import Art from "../compoments/Art";
import TextType from "../compoments/TextType";
import Navbar from "@/src/compoments/Navbar";
import FaultyTerminal from "@/src/compoments/FaultyTerminal";
import Footer from "../compoments/Footer";
import Dither from "../compoments/Dither";
import DitherShader from "../compoments/dither-shader";





export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden font-mono">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative w-full min-h-screen flex items-center justify-center">

        {/* CRT background — full cover */}
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
            curvature={0.1}
            tint="#ff7e5a"
            mouseReact
            mouseStrength={0.5}
            pageLoadAnimation
            brightness={0.6}
          />
        </div>

        {/* Dark gradient overlay so text stays readable */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-20 px-4 sm:px-8 md:px-16 text-center">

          {/* Eyebrow label */}
          <p className="mb-4 text-xs sm:text-sm tracking-[0.35em] text-[#ff7e5a]/70 uppercase">
            Retro Image Effects
          </p>

          {/* Main title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,126,90,0.6)]">
            <TextType
              text={["PixeL_Back"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="▊"
              deletingSpeed={50}
            />
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Transform your images into retro art —{" "}
            <span className="text-[#ff7e5a]">ASCII</span>,{" "}
            <span className="text-[#ff7e5a]">Game Boy</span>,{" "}
            <span className="text-[#ff7e5a]">CRT</span> & more.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-3 bg-[#ff7e5a] text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors duration-200 cursor-pointer">
              [ START ]
            </button>
            <button className="px-8 py-3 border border-white/30 text-white/60 font-bold text-sm tracking-widest uppercase hover:border-[#ff7e5a] hover:text-[#ff7e5a] transition-colors duration-200 cursor-pointer">
              [ DEMO ]
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 animate-bounce text-white/30 text-xs tracking-widest">
            ▼ SCROLL
          </div>
        </div>
      </section>

         
      <section className="h-full w-full grid grid-cols-1  sm:grid-cols-3 gap-10">

   
        <div className="flex flex-col justify-center items-center max-w-2xl">
                 <DitherShader
                  src="/tb2.jpg"
                  gridSize={1}
                  ditherMode="bayer"
                  colorMode="duotone"
                  primaryColor="#ff7e5a"
                  secondaryColor="#f1f1f1"
                  threshold={0.3}
                  className="h-screen w-full"
        />
        </div>
          <div className="flex flex-col justify-center items-center max-w-2xl">
                 <DitherShader
                  src="/tb4.jpg"
                  gridSize={1}
                  ditherMode="bayer"
                  colorMode="duotone"
                  primaryColor="#ff7e5a"
                  secondaryColor="#f1f1f1"
                  threshold={0.3}
                  className="h-screen w-full"
        />
        </div>
           <div className="flex flex-col justify-center items-center max-w-2xl">
                 <DitherShader
                  src="/tb9.jpg"
                  gridSize={1}
                  ditherMode="bayer"
                  colorMode="duotone"
                  primaryColor="#ff7e5a"
                  secondaryColor="#f1f1f1"
                  threshold={0.3}
                  className="h-screen w-full"
        />
        </div>
       

      </section>

      {/* ─── FOOTER ─── */}
      <Footer/>
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