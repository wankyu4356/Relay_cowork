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
