import Navbar from "@/src/compoments/Navbar";
import Dither from "../../compoments/Dither";
import DitherShader from "../../compoments/dither-shader";


export default function Home()
{
    return(
        <>
            <Navbar/>

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
        
        
        </>
            

    );
}