"use client";
import { AsciiArtStatic } from "./Effect";

interface ArtProps {
  img: string;
  resolution?: number;
}

export default function Art({ img, resolution = 200 }: ArtProps) {
  return (
    <AsciiArtStatic
      src={img}
      resolution={resolution}
     // hoverColor="#ffffff"
      //hoverRadius={15}
      color="#FF7E5A"
      //animationStyle="fade"
      animationDuration={3}
      animateOnView={false}
      className="relative top-[100%] left-0 mx-auto aspect-square max-w-8xl h-auto bg-neutral-950  rounded-md"
    />
  );
}