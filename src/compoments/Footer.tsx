import Art from "./Art"

export default function Footer()
{
    return(

      <footer className="flex flex-col sm:flex-row justify-between items-center gap-5">

      <div className="">
         <Art img="/tb2.jpg" resolution={700}/>
      </div>

      <div className="flex flex-col gap-4 justify-between items-start ">
           <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-[9rem]">PixelBack</h1>
      </div>
     
      </footer>

    );
}