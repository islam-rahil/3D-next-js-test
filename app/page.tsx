import HouseScene from "../compoments/objet";
import Art from "../compoments/Art"
export default function Home() {
  return (
    <main className="h-screen ">
      <div className="h-full w-full grid-cols-3 gap-10">
        <Art img="/tb1.jpg"/>
        <Art img="/tb2.jpg"/>
        <Art img="/tb3.jpg"/>
      </div>
    </main>
  );
}