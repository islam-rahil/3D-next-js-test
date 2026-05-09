"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useId,
} from "react";
import { motion, useInView } from "motion/react";
import { cn } from "../app/lib/util";

// ─── Charsets ────────────────────────────────────────────────────────────────

const ASCII_CHARSETS: Record<string, string> = {
  standard:  " .,:;i1tfLCG08@",
  blocks:    " ░▒▓█",
  binary:    " 01",
  dots:      " ·•●",
  minimal:   " .:░▒",
  dense:     " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  arrows:    " ←↑→↓↔↕↖↗↘↙",
  stars:     " ·✦✧★",
  hash:      " -=#",
  pipes:     " |/─\\│",
  braille:   " ⠁⠃⠇⠏⠟⠿⡿⣿",
  circles:   " ○◔◑◕●",
  squares:   " ▢▣▤▥▦▧▨▩",
  hearts:    " ♡♥",
  math:      " +-×÷=≠≈∞",
};

const MATRIX_CHARSET = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";

const resolveCharset = (charset: string): string =>
  charset in ASCII_CHARSETS ? ASCII_CHARSETS[charset] : charset;

// ─── CSS color resolver (cached — avoids DOM per-frame) ──────────────────────

const cssColorCache = new Map<string, string>();

const resolveCssColor = (color: string, element: HTMLElement): string => {
  if (!color) return color;
  if (!color.startsWith("var(")) return color;

  const cached = cssColorCache.get(color);
  if (cached) return cached;

  const tmp = document.createElement("div");
  tmp.style.color = color;
  element.appendChild(tmp);
  const resolved = getComputedStyle(tmp).color || "#ffffff";
  element.removeChild(tmp);
  cssColorCache.set(color, resolved);
  return resolved;
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface AsciiPixel { char: string; r: number; g: number; b: number }

interface AsciiArtProps {
  src: string;
  resolution?: number;
  charset?: string;
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
  objectFit?: "cover" | "contain";
  hoverColor?: string;
  hoverRadius?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AsciiArt = ({
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
  hoverColor = "#ffffff",
  hoverRadius = 80,
}: AsciiArtProps) => {
  const uniqueId = useId();
  const [asciiData, setAsciiData] = useState<AsciiPixel[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);        // single unified RAF
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const hasAnimatedRef = useRef(false);              // ref, not state → no re-render
  const animProgressRef = useRef(0);                 // live animation progress
  const animStartRef = useRef<number | null>(null);

  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const shouldStartAnimation = animated && animateOnView ? isInView : animated;
  const shouldShowStatic = !animated || animationStyle === "none";

  // ─── Resolved charset (memoized) ──────────────────────────────────────────
  const effectiveCharset = useMemo(() => {
    const base = resolveCharset(charset);
    return inverted ? base.split("").reverse().join("") : base;
  }, [charset, inverted]);

  const textColor = color || (inverted ? "#ffffff" : "#000000");

  // ─── Pre-computed char grid positions (memoized on asciiData change) ───────
  // Avoids recomputing cx/cy every frame in the hot draw loop.
  const charPositions = useMemo(() => {
    if (!asciiData.length) return null;
    return { rows: asciiData.length, cols: asciiData[0].length };
  }, [asciiData]);

  // ─── Image → ASCII data ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);
    setError(null);
    hasAnimatedRef.current = false;
    animProgressRef.current = 0;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError("Canvas context not available"); return; }

      const { naturalWidth: iw, naturalHeight: ih } = img;
      const charAspect = 0.55;
      const cols = resolution;
      const rows = Math.floor(cols * charAspect);
      canvas.width = cols;
      canvas.height = rows;

      if (objectFit === "contain") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cols, rows);
        const ia = iw / ih;
        const va = 1.0;
        let dw: number, dh: number, dx: number, dy: number;
        if (ia > va) { dw = cols; dh = cols / ia * charAspect; dx = 0; dy = (rows - dh) / 2; }
        else         { dh = rows; dw = rows * ia / charAspect; dy = 0; dx = (cols - dw) / 2; }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // cover
        const ia = iw / ih;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (ia > 1.0) { sw = ih; sx = (iw - sw) / 2; }
        else          { sh = iw; sy = (ih - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      }

      let imageData: ImageData;
      try { imageData = ctx.getImageData(0, 0, cols, rows); }
      catch { setError("Unable to read image data (CORS issue)"); return; }

      const data = imageData.data;
      const cLen = effectiveCharset.length - 1;
      const result: AsciiPixel[][] = [];

      for (let y = 0; y < rows; y++) {
        const row: AsciiPixel[] = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          const brightness = a === 0 ? 0 : (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          row.push({ char: effectiveCharset[Math.floor(brightness * cLen)] ?? " ", r, g, b });
        }
        result.push(row);
      }

      setAsciiData(result);
      setIsLoaded(true);
    };

    img.onerror = () => { if (!cancelled) setError("Failed to load image"); };
    return () => { cancelled = true; };
  }, [src, resolution, effectiveCharset, objectFit]);

  // ─── Core draw function ───────────────────────────────────────────────────
  // Stable reference — only rebuilt when truly static props change.
  const drawFrame = useCallback((
    progress: number,
    matrixProgress?: number
  ) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !asciiData.length || !charPositions) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W === 0 || H === 0) return;

    // Resize canvas only when dimensions change
    const targetW = Math.round(W * dpr);
    const targetH = Math.round(H * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Resolve colors (cached after first call)
    const bgColor   = resolveCssColor(backgroundColor, container);
    const txtColor  = resolveCssColor(textColor, container);
    const hvColor   = resolveCssColor(hoverColor, container);

    // Clear / fill background
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    const { rows, cols } = charPositions;
    const charW = W / cols;
    const charH = H / rows;
    let fontSize = Math.min(charW * 1.8, charH * 1.2);

    // Set font once per frame
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;

    const totalChars = rows * cols;
    const revealedChars = Math.floor(progress * totalChars);
    const cursor = mousePos.current;
    let charIndex = 0;

    for (let y = 0; y < rows; y++) {
      let cy = y * charH;

      for (let x = 0; x < cols; x++) {
        // Early-exit for typewriter
        if (animationStyle === "typewriter" && charIndex >= revealedChars) {
          charIndex++;
          continue;
        }

        const pixel = asciiData[y][x];
        let cx = x * charW + charW * 0.5;

        let char  = pixel.char;
        let color = colored ? `rgb(${pixel.r},${pixel.g},${pixel.b})` : txtColor;
        let alpha = animationStyle === "fade" ? progress : 1;

        // Hover highlight
        if (cursor) {
          const dx = cx - cursor.x;
          const dy = cy - cursor.y;
          if (dx * dx + dy * dy < hoverRadius * hoverRadius) {
            color = hvColor;
            const intensity = 1 - Math.sqrt(dx * dx + dy * dy) / hoverRadius;
            alpha = Math.max(alpha, 0.4 + intensity * 0.6);
          }
        }

//           if (cursor) {
//   const dx = cx - cursor.x;
//   const dy = cy - cursor.y;

//   const distance = Math.sqrt(dx * dx + dy * dy);

//   if (distance < hoverRadius) {
//     // Progression douce
//     const t = 1 - distance / hoverRadius;

//     // Courbe easing
//     const smooth = t * t * (3 - 2 * t);

//     // Couleur hover
//     color = hvColor;

//     // Alpha plus élégant
//     alpha = Math.max(alpha, 0.35 + smooth * 0.85);

//     // Glow subtil
//     ctx.shadowColor = hvColor;
//     ctx.shadowBlur = 8 + smooth * 18;

//     // Petit effet de "push"
//     const push = smooth * 1.5;

//     // Décalage léger selon la souris
//     cx += (dx / hoverRadius) * push;
//     cy += (dy / hoverRadius) * push;

//     // Scale douce
//     fontSize *= 0.8 + smooth * 0.2;
//   } else {
//     ctx.shadowBlur = 0;
//   }
// }



        

        // Matrix effect
        if (animationStyle === "matrix" && matrixProgress !== undefined) {
          const cp = (x * 0.02 + y * 0.01) / 2;
          if (matrixProgress < cp) { charIndex++; continue; }
          if (matrixProgress < cp + 0.15) {
            char  = MATRIX_CHARSET[Math.floor(Math.random() * MATRIX_CHARSET.length)];
            color = "#00ff00";
            ctx.shadowColor = "#00ff00";
            ctx.shadowBlur  = 5;
          } else {
            ctx.shadowBlur = 0;
          }
        }

        if (ctx.globalAlpha !== alpha) ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillText(char, cx, cy);
        ctx.font = `${fontSize}px ${fontFamily}`;
        charIndex++;
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }, [asciiData, charPositions, backgroundColor, textColor, hoverColor, hoverRadius,
      fontFamily, animationStyle, colored]);

  // ─── Unified animation loop ───────────────────────────────────────────────
  // One single RAF drives both the intro animation and the hover redraws.
  useEffect(() => {
    if (!isLoaded || !asciiData.length) return;

    const needsAnimation =
      animated && !shouldShowStatic && !hasAnimatedRef.current && shouldStartAnimation;

    const animDuration =
      animationStyle === "fade"       ? animationDuration * 1000
      : animationStyle === "typewriter" ? asciiData.length * (asciiData[0]?.length ?? 0) * 2
      : animationStyle === "matrix"     ? 3000
      : 1000;

    const loop = (ts: number) => {
      if (needsAnimation) {
        if (animStartRef.current === null) animStartRef.current = ts;
        const elapsed = ts - animStartRef.current;
        const p = Math.min(elapsed / animDuration, 1);
        animProgressRef.current = p;

        if (animationStyle === "matrix") drawFrame(1, p);
        else drawFrame(p);

        if (p < 1) { rafRef.current = requestAnimationFrame(loop); return; }
        hasAnimatedRef.current = true;
      }

      // Static / post-animation frame
      drawFrame(1);
      rafRef.current = null;
    };

    animStartRef.current = null;
    rafRef.current = requestAnimationFrame(loop);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isLoaded, shouldStartAnimation, shouldShowStatic, animated,
      animationStyle, animationDuration, drawFrame, asciiData]);

  // ─── Mouse tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Kick a single RAF if no animation is running
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          drawFrame(1);
          rafRef.current = null;
        });
      }
    };

    const onLeave = () => {
      mousePos.current = null;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          drawFrame(1);
          rafRef.current = null;
        });
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [isLoaded, drawFrame]);

  // ─── Resize observer (debounced via RAF) ──────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const container = containerRef.current;
    if (!container) return;

    let resizeRaf: number | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeRaf) return; // debounce: skip if a redraw is already pending
      resizeRaf = requestAnimationFrame(() => {
        drawFrame(1);
        resizeRaf = null;
      });
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
  }, [isLoaded, drawFrame]);

  // ─── Initial paint after data is ready ───────────────────────────────────
  useEffect(() => {
    if (isLoaded && asciiData.length && shouldShowStatic) drawFrame(1);
  }, [isLoaded, asciiData, shouldShowStatic, drawFrame]);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={cn("flex items-center justify-center text-red-500 text-sm font-mono", className)}>
        Error: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn("flex items-center justify-center text-neutral-500 text-sm font-mono animate-pulse", className)}
        style={{ backgroundColor }}>
        Loading…
      </div>
    );
  }

  const canvas = (
    <canvas
      key={uniqueId}
      ref={canvasRef}
      className="block w-full h-full"
      aria-label="ASCII art rendering of image"
      role="img"
    />
  );

  if (animated && animationStyle === "fade" && !hasAnimatedRef.current) {
    return (
      <motion.div
        ref={containerRef}
        className={cn("overflow-hidden", className)}
        style={{ backgroundColor }}
        initial={{ opacity: 0 }}
        animate={shouldStartAnimation ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: animationDuration * 0.3 }}
      >
        {canvas}
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      style={{ backgroundColor }}
    >
      {canvas}
    </div>
  );
};

export const AsciiArtStatic = (props: Omit<AsciiArtProps, "animated" | "animationStyle">) => (
  <AsciiArt {...props} animated={false} animationStyle="none" />
);