'use client';

import React, { useRef, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.6;

// ─── 1. AnimatedSection ───────────────────────────────────────────────────────

type Direction = 'up' | 'left' | 'right' | 'none';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}

const directionOffsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  left: { x: -40 },
  right: { x: 40 },
  none: {},
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{
        duration: DURATION,
        delay,
        ease: EASE_OUT_EXPO,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── 2. StaggerContainer ─────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Companion variant for children of StaggerContainer. */
export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION,
      ease: EASE_OUT_EXPO,
    },
  },
};

// ─── 3. HoverCard ─────────────────────────────────────────────────────────────

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function HoverCard({
  children,
  className,
  glowColor = '#0099ff',
}: HoverCardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl ${className ?? ''}`}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 30px ${glowColor}22, 0 2px 8px rgba(0,0,0,0.08)`,
        transition: { duration: 0.25, ease: EASE_OUT_EXPO },
      }}
      style={{
        // gradient border glow on hover is achieved via an ::after pseudo
        // on the parent wrapper; we add a transparent border baseline so
        // the hover shadow looks like a glow ring.
        border: '1px solid transparent',
      }}
    >
      {/* Gradient border glow layer */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(135deg, ${glowColor}44, ${glowColor}11, transparent)`,
          zIndex: -1,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
}

// ─── 4. TextReveal ────────────────────────────────────────────────────────────

type TextElement = 'h1' | 'h2' | 'h3' | 'p';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: TextElement;
  delay?: number;
}

const MotionTag = motion.create('span') as typeof motion.span;

export function TextReveal({
  text,
  className,
  as: Tag = 'p',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // Split into words for a natural reveal pace
  const words = text.split(' ');

  // Map the tag prop to a motion element
  const MotionEl = motion.create(Tag);

  return (
    <div ref={ref} className={className}>
      <MotionEl
        style={{ overflow: 'hidden', display: 'inline' }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden' }}
          >
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{ y: '100%', opacity: 0 }}
              animate={
                isInView
                  ? { y: '0%', opacity: 1 }
                  : { y: '100%', opacity: 0 }
              }
              transition={{
                duration: DURATION,
                delay: delay + i * 0.08,
                ease: EASE_OUT_EXPO,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </MotionEl>
    </div>
  );
}

// ─── 5. ParallaxSection ──────────────────────────────────────────────────────

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function ParallaxSection({
  children,
  className,
  offset = 50,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset, -offset],
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// ─── 6. FloatingElement ───────────────────────────────────────────────────────

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
}

const speedMap: Record<string, string> = {
  slow: '6s',
  medium: '3.5s',
  fast: '2s',
};

const floatingKeyframes = `
@keyframes float-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
`;

export function FloatingElement({
  children,
  className,
  speed = 'medium',
}: FloatingElementProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatingKeyframes }} />
      <div
        className={className}
        style={{
          animation: `float-gentle ${speedMap[speed]} ease-in-out infinite`,
        }}
      >
        {children}
      </div>
    </>
  );
}
