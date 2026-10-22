import React, { useEffect, useRef } from 'react';

interface AmbientAuroraBackdropProps {
  isDarkMode?: boolean;
}

export const AmbientAuroraBackdrop: React.FC<AmbientAuroraBackdropProps> = ({ isDarkMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const motionLayerRef = useRef<HTMLDivElement>(null);

  // Smooth lerp state for scroll and mouse parallax
  const stateRef = useRef({
    currentMouseX: 0.5,
    currentMouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    currentScroll: 0,
    targetScroll: 0,
    rafId: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.targetMouseX = e.clientX / window.innerWidth;
      stateRef.current.targetMouseY = e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      stateRef.current.targetScroll = window.scrollY / maxScroll;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const s = stateRef.current;
      // Smooth linear interpolation (lerp factor ~ 0.05 for silky liquid lag)
      s.currentMouseX += (s.targetMouseX - s.currentMouseX) * 0.05;
      s.currentMouseY += (s.targetMouseY - s.currentMouseY) * 0.05;
      s.currentScroll += (s.targetScroll - s.currentScroll) * 0.06;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-progress', s.currentScroll.toFixed(4));
        containerRef.current.style.setProperty('--mouse-x', s.currentMouseX.toFixed(4));
        containerRef.current.style.setProperty('--mouse-y', s.currentMouseY.toFixed(4));
      }

      if (motionLayerRef.current) {
        const panX = (s.currentMouseX - 0.5) * 60; // -30px to +30px
        const panY = (s.currentMouseY - 0.5) * 60 + s.currentScroll * 80;
        const rotate = (s.currentMouseX - 0.5) * 8 + (s.currentScroll - 0.5) * 12;

        motionLayerRef.current.style.transform = `translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0px) rotate(${rotate.toFixed(2)}deg)`;
      }

      s.rafId = requestAnimationFrame(animate);
    };

    stateRef.current.rafId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-slate-50/40 dark:bg-[#090d16]"
      aria-hidden="true"
    >
      {/* Scroll-Reactive & Cursor Interactive Motion Canvas */}
      <div
        ref={motionLayerRef}
        className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out will-change-transform"
      >
        {/* Orb 1: Soft Indigo (Top-Left / Center-Left) */}
        <div
          className="absolute -top-32 -left-20 w-[45rem] h-[45rem] rounded-full blur-[110px] mix-blend-multiply dark:mix-blend-screen opacity-90 dark:opacity-80 animate-aurora-drift-1 will-change-transform"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0.12) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.24) 0%, rgba(99, 102, 241, 0.08) 60%, transparent 75%)',
          }}
        />

        {/* Orb 2: Luminous Violet / Rose (Top-Right) */}
        <div
          className="absolute -top-24 -right-28 w-[45rem] h-[45rem] rounded-full blur-[110px] mix-blend-multiply dark:mix-blend-screen opacity-85 dark:opacity-75 animate-aurora-drift-2 will-change-transform"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.30) 0%, rgba(217, 70, 239, 0.10) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.20) 0%, rgba(244, 63, 94, 0.07) 60%, transparent 75%)',
          }}
        />

        {/* Orb 3: Warm Champagne / Amber (Mid-Bottom Left) */}
        <div
          className="absolute top-1/2 -left-36 w-[45rem] h-[45rem] rounded-full blur-[110px] mix-blend-multiply dark:mix-blend-screen opacity-80 dark:opacity-70 animate-aurora-drift-3 will-change-transform"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.08) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(251, 191, 36, 0.16) 0%, rgba(245, 158, 11, 0.05) 60%, transparent 75%)',
          }}
        />

        {/* Orb 4: Sky / Cyan Glow (Bottom-Right / Center) */}
        <div
          className="absolute -bottom-36 right-10 w-[45rem] h-[45rem] rounded-full blur-[110px] mix-blend-multiply dark:mix-blend-screen opacity-85 dark:opacity-75 animate-aurora-drift-4 will-change-transform"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.08) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(59, 130, 246, 0.06) 60%, transparent 75%)',
          }}
        />
      </div>

      {/* Subtle Noise / Light Diffusion Texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.025] dark:opacity-[0.04] pointer-events-none" />
    </div>
  );
};
