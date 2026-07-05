'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroCanvas - Subtle generative background for the hero section.
 * Renders floating particles with gentle drift and constellation-style connections.
 * Uses p5.js in instance mode loaded from CDN.
 */
export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically load p5.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js';
    script.async = true;

    const handleScriptLoad = () => {
      const p5 = (window as any).p5;
      if (!p5 || !containerRef.current) return;

      const sketch = (p: any) => {
        let particles: {
          x: number;
          y: number;
          vx: number;
          vy: number;
          size: number;
        }[] = [];

        const PARTICLE_COUNT_DESKTOP = 80;
        const PARTICLE_COUNT_MOBILE = 40;
        const CONNECTION_DISTANCE = 150;
        const BASE_SPEED = 0.15;

        function getParticleCount() {
          return window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        }

        p.setup = () => {
          const canvas = p.createCanvas(
            containerRef.current!.offsetWidth,
            containerRef.current!.offsetHeight
          );
          canvas.parent(containerRef.current);
          p.noStroke();
          initParticles();
        };

        function initParticles() {
          particles = [];
          const count = getParticleCount();
          for (let i = 0; i < count; i++) {
            particles.push(createParticle());
          }
        }

        function createParticle() {
          return {
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-BASE_SPEED, BASE_SPEED),
            vy: p.random(-BASE_SPEED, BASE_SPEED),
            size: p.random(1.5, 3.5),
          };
        }

        p.draw = () => {
          p.clear();

          // Update and draw particles
          for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];

            // Gentle drift with slight noise-based direction changes
            const noiseVal = p.noise(particle.x * 0.001, particle.y * 0.001, p.frameCount * 0.001);
            particle.vx += p.cos(noiseVal * p.TWO_PI) * 0.002;
            particle.vy += p.sin(noiseVal * p.TWO_PI) * 0.002;

            // Clamp velocity
            const maxSpeed = BASE_SPEED * 2.5;
            particle.vx = p.constrain(particle.vx, -maxSpeed, maxSpeed);
            particle.vy = p.constrain(particle.vy, -maxSpeed, maxSpeed);

            // Slight friction
            particle.vx *= 0.999;
            particle.vy *= 0.999;

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < -10) particle.x = p.width + 10;
            if (particle.x > p.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = p.height + 10;
            if (particle.y > p.height + 10) particle.y = -10;

            // Draw particle - dark subtle dot (#242424 at very low opacity)
            p.fill(36, 36, 36, p.random(8, 20)); // 0.03-0.08 opacity ≈ alpha 8-20
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size);

            // Draw connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
              const other = particles[j];
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < CONNECTION_DISTANCE) {
                const alpha = p.map(dist, 0, CONNECTION_DISTANCE, 12, 0); // very subtle connections
                // Very light blue tint for connections: #0099ff at 5-10% opacity
                p.stroke(0, 153, 255, alpha);
                p.strokeWeight(0.5);
                p.line(particle.x, particle.y, other.x, other.y);
                p.noStroke();
              }
            }
          }
        };

        p.windowResized = () => {
          if (!containerRef.current) return;
          p.resizeCanvas(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          );
          // Reinitialize particles to fill new dimensions
          initParticles();
        };
      };

      p5Ref.current = new p5(sketch, containerRef.current);
    };

    script.onload = handleScriptLoad;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
      // Remove script tag if still in head
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
