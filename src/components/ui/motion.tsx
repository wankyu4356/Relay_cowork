import { motion, type Variants, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

/* ============================================================
   RELAY · shared motion primitives
   Premium, tasteful micro-interactions used across all screens.
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

type DivProps = HTMLMotionProps<'div'>;

/** Fade + rise in on mount. */
export function FadeIn({
  children,
  delay = 0,
  y = 14,
  className,
  ...props
}: DivProps & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its direct <Stagger.Item> children into view. */
export function Stagger({
  children,
  stagger = 0.07,
  delay = 0,
  className,
  ...props
}: DivProps & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate="show"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className, ...props }: DivProps) {
  return (
    <motion.div variants={fadeUp} className={className} {...props}>
      {children}
    </motion.div>
  );
}
Stagger.Item = StaggerItem;

/** Subtle press/hover affordance for interactive cards & buttons. */
export function Press({
  children,
  className,
  scale = 0.98,
  lift = true,
  ...props
}: DivProps & { scale?: number; lift?: boolean }) {
  return (
    <motion.div
      whileHover={lift ? { y: -3 } : undefined}
      whileTap={{ scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Animated count-up for stat numbers. */
export function CountUp({
  value,
  duration = 1.1,
  suffix = '',
  prefix = '',
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const rounded = Number.isInteger(value) ? Math.round(display) : Math.round(display * 10) / 10;
  return (
    <span className={`tnum ${className ?? ''}`}>
      {prefix}{rounded.toLocaleString()}{suffix}
    </span>
  );
}

/* ============================================================
   Premium motion primitives — scroll reveals, text reveals,
   3D tilt, marquee, magnetic buttons, aurora backgrounds.
   ============================================================ */

/** Fade + rise when the element scrolls into view (once). */
export function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...props
}: DivProps & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children when the container scrolls into view (once). */
export function ScrollStagger({
  children,
  stagger = 0.08,
  delay = 0,
  className,
  ...props
}: DivProps & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
ScrollStagger.Item = StaggerItem;

/** Headline word-by-word rise reveal (clip-masked). */
export function TextReveal({
  text,
  delay = 0,
  stagger = 0.055,
  className,
  as: Tag = 'span',
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
}) {
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Pointer-tracking 3D tilt with soft glare — for hero/featured cards. */
export function Tilt({
  children,
  max = 5,
  glare = true,
  className,
  ...props
}: DivProps & { max?: number; glare?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * max * 2, ry: (px - 0.5) * max * 2, gx: px * 100, gy: py * 100, on: true });
  };
  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <div style={{ perspective: 1000 }} className={className} {...props}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        animate={{ rotateX: t.rx, rotateY: t.ry, scale: t.on ? 1.008 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative will-change-transform"
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: t.on ? 1 : 0,
              background: `radial-gradient(600px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.10), transparent 45%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/** Infinite horizontal marquee strip. */
export function Marquee({
  children,
  duration = 30,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${pauseOnHover ? 'marquee-pausable' : ''} ${className ?? ''}`}>
      <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/** Magnetic pull toward the cursor — for primary CTAs. Subtle by design. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
  ...props
}: DivProps & { strength?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      className={`inline-block ${className ?? ''}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Ambient aurora backdrop — slow-drifting blurred iris blobs. */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
    </div>
  );
}
