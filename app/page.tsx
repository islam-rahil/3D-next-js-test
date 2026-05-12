//import HouseScene from "../compoments/objet";
import Art from "../compoments/Art"
import TextType from "../compoments/TextType";
import { DitherShader } from "../compoments/dither-shader";
 import Dither from '../compoments/Dither';
import Navbar from "@/compoments/Navbar";
import FaultyTerminal from '@/compoments/FaultyTerminal';

export default function Home() {
  return (
    <>
<Navbar/>
   


<div style={{ width: '100%', height: '800px', position: 'relative' }}>
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

          <main className="h-screen bg-[#000] ">
      
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
          {/* <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            LE VOYAGEUR CONTEMPLANT UNE MER DE NUAGES - CASPAR DAVID FRIEDRICH
          </h1> */}
        </div>
        
        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb2.jpg" />
               <TextType 
          text={["LA JEUNE FILLE À LA PERLE - JOHANNES OU JAN VERMEER DE DELFT"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          className="text-center"
/>
          {/* <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            LA JEUNE FILLE À LA PERLE - JOHANNES OU JAN VERMEER DE DELFT
          </h1> */}
        </div>

        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb4.jpg" />
               <TextType 
          text={["DAME AVEC L'HERMINE - LÉONARD DE VINCI"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          className="text-center"
/>
          {/* <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            DAME AVEC L'HERMINE - LÉONARD DE VINCI
          </h1> */}
        </div>

      </div>
    </main>
    </>
  
  );
}