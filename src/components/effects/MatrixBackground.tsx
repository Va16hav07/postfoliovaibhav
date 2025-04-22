import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Matrix rain effect
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|/\\+=!@#$%^&*()_-';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
    }
    
    // Draw the matrix rain
    const draw = () => {
      // Semi-transparent black to create fading effect
      ctx.fillStyle = 'rgba(10, 10, 31, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text styling
      ctx.fillStyle = '#00f3ff';
      ctx.font = `${fontSize}px monospace`;
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Random character from the charset
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // x = i * font size, y = value of drops[i]
        ctx.fillText(text, i * fontSize, drops[i]);
        
        // Randomly change some characters to pink
        if (Math.random() > 0.97) {
          ctx.fillStyle = '#ff00e5';
          ctx.fillText(text, i * fontSize, drops[i]);
          ctx.fillStyle = '#00f3ff';
        }
        
        // Incrementing y coordinate
        drops[i] += fontSize;
        
        // Sending the drop back to the top randomly
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };
    
    const interval = setInterval(draw, 30);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0"
    />
  );
};

export default MatrixBackground;
