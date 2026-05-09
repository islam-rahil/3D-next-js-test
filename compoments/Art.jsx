"use client";
import { AsciiArt } from "./Effect";

export default function Art({ img }) {
  return (
    <AsciiArt
      src={img}
      resolution={200}
      hoverColor="#ffffff" 
      hoverRadius={50}
      color="#FF7E5A"
      animationStyle="fade"
      animationDuration={1.5}
      animateOnView={false}
      className="mx-auto aspect-square w-full max-w-lg bg-neutral-950 hover:bg-[#FF7E5A]" />
  );
}
