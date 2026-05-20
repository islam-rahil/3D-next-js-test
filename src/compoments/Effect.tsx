"use client";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useId,
} from "react";
import { motion, useInView } from "motion/react";
import { cn } from "../lib/util";




const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ASCII_CHARSETS = {
  standard: " .,:;i1tfLCG08@",
  blocks: " ░▒▓█",
  binary: " 01",
  dots: " ·•●",
  minimal: " .:░▒",
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  arrows: " ←↑→↓↔↕↖↗↘↙",
  stars: " ·✦✧★",
  hash: " -=#",
  pipes: " |/─\\│",
  braille: " ⠁⠃⠇⠏⠟⠿⡿⣿",
  circles: " ○◔◑◕●",
  squares: " ▢▣▤▥▦▧▨▩",
  hearts: " ♡♥",
  math: " +-×÷=≠≈∞",
} as const;

type CharsetPreset = keyof typeof ASCII_CHARSETS;

const isCharsetPreset = (value: string): value is CharsetPreset =>
  value in ASCII_CHARSETS;

const resolveCharset = (charset: string): string =>
  isCharsetPreset(charset) ? ASCII_CHARSETS[charset] : charset;

const resolveCssColor = (
  color: string,
  element: HTMLElement | null
): string => {
  if (!color) return color;
  if (!color.startsWith("var(")) return color;
  if (!element) return "#ffffff";

  const tempDiv = document.createElement("div");
  tempDiv.style.color = color;
  element.appendChild(tempDiv);
  const computedColor = getComputedStyle(tempDiv).color;
  element.removeChild(tempDiv);
  return computedColor || "#ffffff";
};

type AsciiArtProps = {
  src: string;
  resolution?: number;
  charset?: CharsetPreset | string;
  color?: string;
  backgroundColor?: string;
  inverted?: boolean;
  colored?: boolean;
  animated?: boolean;
  animationStyle?: "fade" | "typewriter" | "matrix" | "none";
  animationDuration?: number;
  fontFamily?: string;
  className?: string;
  animateOnView?: boolean;
  objectFit?: "cover" | "contain" | "fill";
};

const MATRIX_CHARSET = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
const MATRIX_CHARSET_LENGTH = MATRIX_CHARSET.length;

type AsciiPixel = {
  char: string;
  /** Pre-computed `rgb(r,g,b)` string — avoids per-frame allocation in colored mode */
  color: string;
};

export const AsciiArt: React.FC<AsciiArtProps> = ({
  src,
  resolution = 80,
  charset = "standard",
  color = "#ffffff",
  backgroundColor = "transparent",
  inverted = false,
  colored = false,
  animated = true,
  animationStyle = "fade",
  animationDuration = 1,
  fontFamily = "monospace",
  className,
  animateOnView = true,
  objectFit = "cover",
}) => {
  const uniqueId = useId();
  const [asciiData, setAsciiData] = useState<AsciiPixel[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const shouldStartAnimation = animated && animateOnView ? isInView : animated;
  const shouldShowStatic = !animated || animationStyle === "none";

  const effectiveCharset = useMemo(() => {
    const base = resolveCharset(charset);
    return inverted ? base.split("").reverse().join("") : base;
  }, [charset, inverted]);

  const defaultColor = inverted ? "#ffffff" : "#000000";
  const textColor = color || defaultColor;

  useEffect(() => {
    let isCancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (isCancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Canvas context not available");
        return;
      }

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspect = imgWidth / imgHeight;
      const charAspectRatio = 0.55;

      const cols = resolution;
      const rows = Math.floor(cols * charAspectRatio);

      canvas.width = cols;
      canvas.height = rows;

      const visualAspect = 1.0;

      let sx = 0,
        sy = 0,
        sw = imgWidth,
        sh = imgHeight;

      if (objectFit === "cover") {
        if (imgAspect > visualAspect) {
          sw = imgHeight * visualAspect;
          sx = (imgWidth - sw) / 2;
        } else {
          sh = imgWidth / visualAspect;
          sy = (imgHeight - sh) / 2;
        }
      } else if (objectFit === "contain") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cols, rows);

        let dw, dh, dx, dy;
        if (imgAspect > visualAspect) {
          dw = cols;
          dh = (cols / imgAspect) * charAspectRatio;
          dx = 0;
          dy = (rows - dh) / 2;
        } else {
          dh = rows;
          dw = (rows * imgAspect) / charAspectRatio;
          dx = (cols - dw) / 2;
          dy = 0;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      if (objectFit !== "contain") {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      }

      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, cols, rows);
      } catch {
        setError("Unable to read image data (CORS issue)");
        return;
      }

      const data = imageData.data;
      const maxCharIdx = effectiveCharset.length - 1;
      const result: AsciiPixel[][] = new Array(rows);

      for (let y = 0; y < rows; y++) {
        const row: AsciiPixel[] = new Array(cols);
        const rowOffset = y * cols * 4;
        for (let x = 0; x < cols; x++) {
          const idx = rowOffset + x * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const adjustedBrightness = a === 0 ? 0 : brightness;

          const charIndex = Math.floor(adjustedBrightness * maxCharIdx);
          const char = effectiveCharset[charIndex] || " ";

          row[x] = { char, color: `rgb(${r},${g},${b})` };
        }
        result[y] = row;
      }

      setAsciiData(result);
      setIsLoaded(true);
    };

    img.onerror = () => {
      if (isCancelled) return;
      setError("Failed to load image");
    };

    return () => {
      isCancelled = true;
    };
  }, [src, resolution, effectiveCharset, objectFit]);

  const drawCanvas = useCallback(
    (progress: number = 1, matrixProgress?: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || asciiData.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) return;

      // Resize backing store ONLY when dimensions actually change.
      // (Setting canvas.width clears the entire context state, so doing it
      //  every frame was wiping font/fillStyle/etc. unnecessarily.)
      const desiredW = Math.floor(containerWidth * dpr);
      const desiredH = Math.floor(containerHeight * dpr);
      if (canvas.width !== desiredW || canvas.height !== desiredH) {
        canvas.width = desiredW;
        canvas.height = desiredH;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerHeight}px`;
      }

      // Reset transform + apply DPR (cheap; works whether or not we resized).
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const resolvedBgColor = resolveCssColor(backgroundColor, container);
      const resolvedTextColor = resolveCssColor(textColor, container);

      if (resolvedBgColor !== "transparent") {
        ctx.fillStyle = resolvedBgColor;
        ctx.fillRect(0, 0, containerWidth, containerHeight);
      } else {
        ctx.clearRect(0, 0, containerWidth, containerHeight);
      }

      const rows = asciiData.length;
      const cols = asciiData[0]?.length || 0;
      if (cols === 0) return;

      const charWidth = containerWidth / cols;
      const charHeight = containerHeight / rows;
      const fontSize = Math.min(charWidth * 1.8, charHeight * 1.2);

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      // Hoist mode flags + alpha out of the per-cell loop.
      const isFade = animationStyle === "fade";
      const isTypewriter = animationStyle === "typewriter";
      const isMatrix =
        animationStyle === "matrix" && matrixProgress !== undefined;

      ctx.globalAlpha = isFade ? progress : 1;

      const totalChars = rows * cols;
      const revealedChars = isTypewriter
        ? Math.floor(progress * totalChars)
        : totalChars;

      // Avoid redundant context property writes inside the inner loop.
      let currentFillStyle: string | null = null;
      let currentShadowBlur = 0;
      ctx.shadowBlur = 0;

      let charIndex = 0;
      for (let y = 0; y < rows; y++) {
        const row = asciiData[y];
        const cy = y * charHeight;
        for (let x = 0; x < cols; x++) {
          if (isTypewriter && charIndex >= revealedChars) {
            charIndex++;
            continue;
          }

          const pixel = row[x];
          let displayChar = pixel.char;
          let displayColor = colored ? pixel.color : resolvedTextColor;
          let nextShadowBlur = 0;

          if (isMatrix) {
            const charProgress = (x * 0.02 + y * 0.01) / 2;
            if (matrixProgress! < charProgress) {
              charIndex++;
              continue;
            } else if (matrixProgress! < charProgress + 0.15) {
              displayChar =
                MATRIX_CHARSET[
                  Math.floor(Math.random() * MATRIX_CHARSET_LENGTH)
                ];
              displayColor = "#00ff00";
              nextShadowBlur = 5;
            }
          }

          if (nextShadowBlur !== currentShadowBlur) {
            ctx.shadowBlur = nextShadowBlur;
            if (nextShadowBlur > 0) ctx.shadowColor = "#00ff00";
            currentShadowBlur = nextShadowBlur;
          }

          if (displayColor !== currentFillStyle) {
            ctx.fillStyle = displayColor;
            currentFillStyle = displayColor;
          }

          ctx.fillText(displayChar, x * charWidth + charWidth / 2, cy);

          charIndex++;
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    },
    [
      asciiData,
      backgroundColor,
      colored,
      textColor,
      fontFamily,
      animationStyle,
    ]
  );

  useEffect(() => {
    if (!isLoaded || asciiData.length === 0) return;

    let pendingFrame: number | null = null;

    const draw = () => {
      pendingFrame = null;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        pendingFrame = requestAnimationFrame(draw);
        return;
      }

      if (shouldShowStatic || hasAnimated || !shouldStartAnimation) {
        drawCanvas(1);
        return;
      }

      const startTime = performance.now();
      const duration =
        animationStyle === "fade"
          ? animationDuration * 1000
          : animationStyle === "typewriter"
            ? asciiData.length * asciiData[0]?.length * 2
            : animationStyle === "matrix"
              ? 3000
              : 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (animationStyle === "matrix") {
          drawCanvas(1, progress);
        } else {
          drawCanvas(progress);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null;
          setHasAnimated(true);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    pendingFrame = requestAnimationFrame(draw);

    return () => {
      if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [
    isLoaded,
    shouldStartAnimation,
    shouldShowStatic,
    hasAnimated,
    animationStyle,
    animationDuration,
    drawCanvas,
    asciiData,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!isLoaded || asciiData.length === 0) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    drawCanvas(1);
  }, [isLoaded, asciiData, drawCanvas]);

  useEffect(() => {
    if (!isLoaded || asciiData.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas(1);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isLoaded, asciiData, drawCanvas]);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-red-500 text-sm font-mono",
          className
        )}
      >
        Error: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-neutral-500 text-sm font-mono animate-pulse",
          className
        )}
        style={{ backgroundColor }}
      >
        Loading...
      </div>
    );
  }

  const canvasElement = (
    <canvas
      key={uniqueId}
      id={`ascii-canvas-${uniqueId}`}
      ref={canvasRef}
      className="block w-full h-full"
      aria-label="ASCII art rendering of image"
      role="img"
    />
  );

  if (animationStyle === "fade" && animated && !hasAnimated) {
    return (
      <motion.div
        ref={containerRef}
        className={cn("overflow-hidden", className)}
        style={{ backgroundColor }}
        initial={{ opacity: 0 }}
        animate={shouldStartAnimation ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: animationDuration * 0.3 }}
      >
        {canvasElement}
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      style={{ backgroundColor }}
    >
      {canvasElement}
    </div>
  );
};

export const AsciiArtStatic: React.FC<
  Omit<AsciiArtProps, "animated" | "animationStyle">
> = (props) => {
  return <AsciiArt {...props} animated={false} animationStyle="none" />;
};
