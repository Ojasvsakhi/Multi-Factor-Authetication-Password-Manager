import React, { useEffect, useRef } from 'react';

export const HexGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const hexSize = 30;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 2;
    const hexVertical = hexHeight * 0.75;

    const drawHex = (x: number, y: number, time: number) => {
      const pulseValue = Math.sin(time + x * 0.05 + y * 0.05) * 0.5 + 0.5;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = x + hexSize * Math.cos(angle);
        const hy = y + hexSize * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 + pulseValue * 0.2})`;
      ctx.stroke();
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let row = 0; row < canvas.height / hexVertical + 2; row++) {
        for (let col = 0; col < canvas.width / hexWidth + 2; col++) {
          const x = col * hexWidth + (row % 2) * hexSize;
          const y = row * hexVertical;
          drawHex(x, y, time);
        }
      }
      
      time += 0.02;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.2 }}
    />
  );
};