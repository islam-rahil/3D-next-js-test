import HouseScene from "../compoments/objet";
import Art from "../compoments/Art"

export default function Home() {
  return (
    <main className="h-screen bg-[#000] ">
      <div className="h-full w-full grid grid-cols-1  sm:grid-cols-3 gap-10">
        
        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb1.jpg" />

          <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            LE VOYAGEUR CONTEMPLANT UNE MER DE NUAGES - CASPAR DAVID FRIEDRICH
          </h1>
        </div>
        
        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb2.jpg" />

          <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            LA JEUNE FILLE À LA PERLE - JOHANNES OU JAN VERMEER DE DELFT
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center max-w-2xl" >
          <Art img="/tb4.jpg" />

          <h1 className="text-center max-w-xl font-bold text-2xl text-white  m-3 leading-10 h-32">
            DAME AVEC L'HERMINE - LÉONARD DE VINCI
          </h1>
        </div>

      </div>
    </main>
  );
}