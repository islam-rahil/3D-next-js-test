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
import { cn } from "../lib/util";

// ─────────────────────────────────────────────
// CHARSETS
// ─────────────────────────────────────────────

const ASCII_CHARSETS: Record<string, string> = {
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
};

const MATRIX_CHARSET = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";

const resolveCharset = (charset: string): string =>
  charset in ASCII_CHARSETS ? ASCII_CHARSETS[charset] : charset;

// ─────────────────────────────────────────────
// CSS COLOR CACHE (optimized)
// ─────────────────────────────────────────────

const cssColorCache = new Map<string, string>();

const resolveCssColor = (color: string, element: HTMLElement): string => {
  if (!color || !color.startsWith("var(")) return color;
  
  const cached = cssColorCache.get(color);
  if (cached) return cached;

  const resolved = getComputedStyle(element).getPropertyValue(color.slice(4, -1)).trim();
  if (resolved) {
    cssColorCache.set(color, resolved);
    return resolved;
  }

  // Fallback method
  const tmp = document.createElement("div");
  tmp.style.color = color;
  element.appendChild(tmp);
  const fallback = getComputedStyle(tmp).color || "#ffffff";
  element.removeChild(tmp);
  cssColorCache.set(color, fallback);
  return fallback;
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AsciiPixel {
  char: string;
  r: number;
  g: number;
  b: number;
}

type HoverData = {
  x: number;
  y: number;
  velocity: number;
};

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
  hoverEffect?: "glow" | "expand" | "none";
  hoverIntensity?: number;
}

// ─────────────────────────────────────────────
// EASING (precomputed for performance)
// ─────────────────────────────────────────────

const easeOutCubic = (x: number): number => 1 - (1 - x) ** 3;

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export const AsciiArt = React.memo(({
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
  hoverColor = "#00ff00",
  hoverRadius = 90,
  hoverEffect = "glow",
  hoverIntensity = 1,
}: AsciiArtProps) => {
  const uniqueId = useId();
  
  const [asciiData, setAsciiData] = useState<AsciiPixel[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mousePos = useRef<HoverData | null>(null);
  const prevMousePos = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasAnimatedRef = useRef(false);
  const animStartRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const hoverCacheRef = useRef<Map<string, { alpha: number; scale: number; offsetX: number; offsetY: number }>>(new Map());

  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const shouldStartAnimation = animated && animateOnView ? isInView : animated;
  const shouldShowStatic = !animated || animationStyle === "none";

  // Adaptive resolution based on device performance
  const adaptiveResolution = useMemo(() => {
    if (typeof window === "undefined") return resolution;
    
    // Reduce resolution on mobile/low-end devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return Math.min(resolution, 60);
    
    const w = window.innerWidth;
    if (w < 640) return Math.min(resolution, 80);
    if (w < 1024) return Math.min(resolution, 120);
    return resolution;
  }, [resolution]);

  const enableHover = adaptiveResolution <= 100; // Disable hover on high-res for performance
  const enableGlow = adaptiveResolution <= 80 && hoverEffect === "glow";

  const effectiveCharset = useMemo(() => {
    const base = resolveCharset(charset);
    return inverted ? base.split("").reverse().join("") : base;
  }, [charset, inverted]);

  const textColor = color || (inverted ? "#ffffff" : "#000000");

  const charPositions = useMemo(() => {
    if (!asciiData.length) return null;
    return { rows: asciiData.length, cols: asciiData[0].length };
  }, [asciiData]);

  // ─────────────────────────────────────────────
  // IMAGE → ASCII (optimized)
  // ─────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);
    setError(null);
    hasAnimatedRef.current = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setError("Canvas context not available");
        return;
      }

      const { naturalWidth: iw, naturalHeight: ih } = img;
      const charAspect = 0.55;
      const cols = adaptiveResolution;
      const rows = Math.floor(cols * charAspect);
      
      canvas.width = cols;
      canvas.height = rows;

      // Optimized image drawing
      if (objectFit === "contain") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cols, rows);
        
        const imgAspect = iw / ih;
        const targetAspect = cols / rows / charAspect;
        
        let dw, dh, dx, dy;
        if (imgAspect > targetAspect) {
          dw = cols;
          dh = cols / imgAspect * charAspect;
          dx = 0;
          dy = (rows - dh) / 2;
        } else {
          dh = rows;
          dw = rows * imgAspect / charAspect;
          dy = 0;
          dx = (cols - dw) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // cover - optimized with direct scaling
        const scale = Math.max(cols / iw, rows / ih / charAspect);
        const sw = cols / scale;
        const sh = rows / scale / charAspect;
        const sx = (iw - sw) / 2;
        const sy = (ih - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      }

      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, cols, rows);
      } catch {
        setError("Unable to read image data (CORS)");
        return;
      }

      const data = imageData.data;
      const cLen = effectiveCharset.length - 1;
      const result: AsciiPixel[][] = new Array(rows);

      // Optimized pixel processing
      for (let y = 0; y < rows; y++) {
        const row: AsciiPixel[] = new Array(cols);
        const rowOffset = y * cols;
        
        for (let x = 0; x < cols; x++) {
          const i = (rowOffset + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Fast brightness calculation
          const brightness = a === 0 ? 0 : (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const charIndex = Math.min(Math.floor(brightness * cLen), cLen);
          
          row[x] = {
            char: effectiveCharset[charIndex] || " ",
            r, g, b
          };
        }
        result[y] = row;
      }

      setAsciiData(result);
      setIsLoaded(true);
    };

    img.onerror = () => {
      if (!cancelled) setError("Failed to load image");
    };

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, adaptiveResolution, effectiveCharset, objectFit]);

  // ─────────────────────────────────────────────
  // DRAW (heavily optimized)
  // ─────────────────────────────────────────────

  const drawFrame = useCallback((
    progress: number,
    matrixProgress?: number
  ) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !asciiData.length || !charPositions) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = adaptiveResolution > 120 ? 1 : window.devicePixelRatio || 1;
    const W = container.clientWidth;
    const H = container.clientHeight;
    
    if (W === 0 || H === 0) return;

    // Update canvas dimensions only when needed
    const targetW = Math.round(W * dpr);
    const targetH = Math.round(H * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bgColor = resolveCssColor(backgroundColor, container);
    const txtColor = resolveCssColor(textColor, container);
    const hvColor = resolveCssColor(hoverColor, container);

    // Fast background clearing
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    const cursor = enableHover ? mousePos.current : null;
    const { rows, cols } = charPositions;
    const charW = W / cols;
    const charH = H / rows;
    const baseFontSize = Math.min(charW * 1.8, charH * 1.2);
    
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.font = `${baseFontSize}px ${fontFamily}`;

    const totalChars = rows * cols;
    const revealedChars = Math.floor(progress * totalChars);
    const isMatrix = animationStyle === "matrix" && matrixProgress !== undefined;
    const isTypewriter = animationStyle === "typewriter";
    const isFade = animationStyle === "fade";
    
    let charIndex = 0;
    let lastShadowBlur = 0;

    for (let y = 0; y < rows; y++) {
      const baseY = y * charH;
      const row = asciiData[y];
      
      for (let x = 0; x < cols; x++) {
        // Typewriter early skip
        if (isTypewriter && charIndex >= revealedChars) {
          charIndex++;
          continue;
        }

        const pixel = row[x];
        let cx = x * charW + charW * 0.5;
        let cy = baseY;
        let char = pixel.char;
        let alpha = isFade ? progress : 1;
        let fill = colored ? `rgb(${pixel.r},${pixel.g},${pixel.b})` : txtColor;
        let shadowBlur = 0;

        // Hover effect (optimized with caching)
        if (cursor && hoverEffect !== "none") {
          const dx = cx - cursor.x;
          const dy = cy - cursor.y;
          const distanceSq = dx * dx + dy * dy;
          const radiusSq = hoverRadius * hoverRadius;
          
          if (distanceSq < radiusSq) {
            const distance = Math.sqrt(distanceSq);
            const t = 1 - distance / hoverRadius;
            const smooth = easeOutCubic(t) * hoverIntensity;
            
            fill = hvColor;
            alpha = Math.max(alpha, 0.35 + smooth * 0.8);
            
            // Subtle push effect
            const push = smooth * 1.5;
            cx += (dx / hoverRadius) * push;
            cy += (dy / hoverRadius) * push;
            
            if (hoverEffect === "expand") {
              const scale = 1 + smooth * 0.1;
              ctx.font = `${baseFontSize * scale}px ${fontFamily}`;
            } else if (enableGlow) {
              shadowBlur = 6 + smooth * 10;
              ctx.shadowColor = hvColor;
            }
          }
        }

        // Matrix effect
        if (isMatrix) {
          const cp = (x * 0.02 + y * 0.01) / 2;
          if (matrixProgress < cp) {
            charIndex++;
            continue;
          }
          if (matrixProgress < cp + 0.15) {
            char = MATRIX_CHARSET[Math.floor(Math.random() * MATRIX_CHARSET.length)];
            fill = "#00ff00";
            if (enableGlow) {
              shadowBlur = 5;
              ctx.shadowColor = "#00ff00";
            }
          }
        }

        // Apply shadow only if changed
        if (lastShadowBlur !== shadowBlur) {
          ctx.shadowBlur = shadowBlur;
          lastShadowBlur = shadowBlur;
        }
        
        if (ctx.globalAlpha !== alpha) ctx.globalAlpha = alpha;
        if (ctx.fillStyle !== fill) ctx.fillStyle = fill;
        
        ctx.fillText(char, cx, cy);
        charIndex++;
      }
      
      // Reset font after each row if modified
      if (hoverEffect === "expand" && ctx.font !== `${baseFontSize}px ${fontFamily}`) {
        ctx.font = `${baseFontSize}px ${fontFamily}`;
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    lastShadowBlur = 0;
  }, [
    asciiData, charPositions, backgroundColor, textColor, hoverColor,
    hoverRadius, hoverEffect, hoverIntensity, fontFamily, animationStyle,
    colored, adaptiveResolution, enableHover, enableGlow
  ]);

  // ─────────────────────────────────────────────
  // ANIMATION LOOP
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded || !asciiData.length) return;

    const needsAnimation = animated && !shouldShowStatic && !hasAnimatedRef.current && shouldStartAnimation;
    
    const animDuration = animationStyle === "fade" ? animationDuration * 1000 :
                        animationStyle === "typewriter" ? asciiData.length * (asciiData[0]?.length ?? 0) * 1.5 :
                        animationStyle === "matrix" ? 3000 : 1000;

    let frameId: number | null = null;
    let lastTimestamp = 0;

    const loop = (ts: number) => {
      if (needsAnimation) {
        if (animStartRef.current === null) animStartRef.current = ts;
        
        const elapsed = ts - animStartRef.current;
        const p = Math.min(elapsed / animDuration, 1);
        
        if (animationStyle === "matrix") {
          drawFrame(1, p);
        } else {
          drawFrame(p);
        }
        
        if (p < 1) {
          frameId = requestAnimationFrame(loop);
        } else {
          hasAnimatedRef.current = true;
          drawFrame(1);
          frameId = null;
        }
      } else {
        drawFrame(1);
        frameId = null;
      }
    };

    frameId = requestAnimationFrame(loop);
    rafRef.current = frameId;

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (rafRef.current === frameId) rafRef.current = null;
    };
  }, [isLoaded, shouldStartAnimation, shouldShowStatic, animated, animationStyle, animationDuration, drawFrame, asciiData]);

  // ─────────────────────────────────────────────
  // MOUSE TRACKING (optimized)
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!enableHover) return;
    
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    let rafId: number | null = null;
    let needsRedraw = false;

    const scheduleRedraw = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (needsRedraw) {
          drawFrame(1);
          needsRedraw = false;
        }
        rafId = null;
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      let velocity = 0;
      const now = performance.now();
      
      if (prevMousePos.current) {
        const dt = Math.max(0.016, (now - prevMousePos.current.time) / 1000);
        const vx = (x - prevMousePos.current.x) / dt;
        const vy = (y - prevMousePos.current.y) / dt;
        velocity = Math.min(3, Math.sqrt(vx * vx + vy * vy) / 200);
      }
      
      prevMousePos.current = { x, y, time: now };
      mousePos.current = { x, y, velocity };
      
      needsRedraw = true;
      scheduleRedraw();
    };

    const onLeave = () => {
      mousePos.current = null;
      prevMousePos.current = null;
      needsRedraw = true;
      scheduleRedraw();
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enableHover, isLoaded, drawFrame]);

  // ─────────────────────────────────────────────
  // RESIZE OBSERVER (optimized)
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) return;
    
    const container = containerRef.current;
    if (!container) return;

    let resizeTimeout: number | null = null;
    
    const ro = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        drawFrame(1);
        resizeTimeout = null;
      }, 50);
    });
    
    ro.observe(container);
    
    return () => {
      ro.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [isLoaded, drawFrame]);

  // Initial draw
  useEffect(() => {
    if (isLoaded && asciiData.length && shouldShowStatic) {
      drawFrame(1);
    }
  }, [isLoaded, asciiData, shouldShowStatic, drawFrame]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

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
        style={{ backgroundColor }}
      >
        Loading…
      </div>
    );
  }

  const canvas = (
    <canvas
      key={uniqueId}
      ref={canvasRef}
      className="block w-full h-full"
      style={{ 
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        imageRendering: "crisp-edges"
      }}
      aria-label="ASCII art rendering"
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
      className={cn("overflow-hidden relative", className)}
      style={{ backgroundColor }}
    >
      {canvas}
    </div>
  );
});

AsciiArt.displayName = "AsciiArt";

// ─────────────────────────────────────────────
// STATIC VERSION
// ─────────────────────────────────────────────

export const AsciiArtStatic = (props: Omit<AsciiArtProps, "animated" | "animationStyle">) => (
  <AsciiArt {...props} animated={false} animationStyle="none" />
);