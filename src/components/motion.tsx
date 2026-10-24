"use client";

import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

// Respects the visitor's "reduce motion" system setting everywhere.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealVariant = "rise" | "tilt" | "pop";

const revealFrom: Record<RevealVariant, (index: number) => TargetAndTransition> = {
  rise: () => ({ opacity: 0, y: 28 }),
  // Cards settle in from a slight alternating rotation.
  tilt: (index) => ({ opacity: 0, y: 56, rotate: index % 2 ? 5 : -5 }),
  // Elastic scale-in with a twist.
  pop: () => ({ opacity: 0, scale: 0.5, rotate: -12 }),
};

const revealSpring: Record<RevealVariant, Transition> = {
  rise: { type: "spring", stiffness: 90, damping: 18 },
  tilt: { type: "spring", stiffness: 110, damping: 14 },
  pop: { type: "spring", stiffness: 120, damping: 8 },
};

export function Reveal({
  children,
  variant = "rise",
  index = 0,
  className,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={revealFrom[variant](index)}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...revealSpring[variant], delay: index * 0.12 }}
    >
      {children}
    </motion.div>
  );
}

const wordOffsets = [
  { x: -120, y: -60, rotate: -8 },
  { x: 100, y: -80, rotate: 6 },
  { x: -80, y: 70, rotate: 10 },
  { x: 120, y: 60, rotate: -6 },
  { x: 0, y: -100, rotate: 4 },
  { x: -60, y: 90, rotate: -10 },
];

// Hero headline: each word flies in from a different direction with an elastic overshoot.
export function HeroTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="mr-[0.25em] inline-block last:mr-0"
          initial={{ opacity: 0, ...wordOffsets[i % wordOffsets.length] }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ delay: 0.15 + i * 0.09, type: "spring", stiffness: 110, damping: 9 }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

// Pulls gently toward the cursor.
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 15 });
  const y = useSpring(my, { stiffness: 150, damping: 15 });

  function onMove(e: MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileTap={{ scale: 0.94 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// Tilts in 3D following the cursor.
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -7);
    ry.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// Slow ambient sway for the hero picture.
export function IdleSway({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: [0, 1.2, -1.2, 0], y: [0, -8, 5, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Continuous bob used on the floating chat button.
export function Bob({ children }: { children: ReactNode }) {
  return (
    <motion.span
      className="inline-flex"
      animate={{ y: [0, -4, 0], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

// Warm light drifting slowly behind the hero.
export function DriftingGlow() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity: 0.22 }}
      animate={{
        background: [
          "radial-gradient(circle at 20% 30%, #d9a441 0%, transparent 55%)",
          "radial-gradient(circle at 80% 70%, #9a4f2c 0%, transparent 55%)",
          "radial-gradient(circle at 55% 20%, #5f7a45 0%, transparent 55%)",
          "radial-gradient(circle at 20% 30%, #d9a441 0%, transparent 55%)",
        ],
      }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
    />
  );
}

const particles = [
  { left: "6%", delay: 0, dur: 24, size: 18, color: "#d9a441" },
  { left: "22%", delay: 9, dur: 30, size: 12, color: "#5f7a45" },
  { left: "41%", delay: 4, dur: 27, size: 14, color: "#9a4f2c" },
  { left: "63%", delay: 13, dur: 25, size: 20, color: "#d9a441" },
  { left: "81%", delay: 6, dur: 29, size: 13, color: "#5f7a45" },
  { left: "94%", delay: 17, dur: 23, size: 16, color: "#9a4f2c" },
];

// Lotus petals rising slowly through the hero.
export function FloatingPetals() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.svg
          key={i}
          width={p.size}
          height={p.size * 1.6}
          viewBox="0 0 10 16"
          className="absolute"
          style={{ left: p.left, bottom: "-10%", opacity: 0.35 }}
          animate={{ y: ["0vh", "-120vh"], rotate: [0, 360], x: [0, 24, -24, 0] }}
          transition={{
            y: { duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" },
            rotate: { duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" },
            x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <path d="M5 0C8 4 10 8 5 16 0 8 2 4 5 0Z" fill={p.color} />
        </motion.svg>
      ))}
    </div>
  );
}
