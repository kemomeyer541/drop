import React, { useEffect, useRef } from 'react';

interface ParticlesProps {
  preset: string;
  className?: string;
}

export default function Particles({ preset, className }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: any[] = [];
    let animationId: number;

    // Create particles based on preset
    const createParticles = () => {
      particles.length = 0;
      const count = getParticleCount(preset);
      
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(preset, canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        updateParticle(particle, preset, canvas.width, canvas.height);
        drawParticle(ctx, particle, preset);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [preset]);

  return <canvas ref={canvasRef} className={className} />;
}

function getParticleCount(preset: string): number {
  switch (preset) {
    case 'starfield': return 50;
    case 'bubbles': return 20;
    case 'snow': return 100;
    case 'fireflies': return 15;
    case 'notes': return 25;
    case 'petals': return 30;
    case 'triangles': return 20;
    case 'pixels': return 60;
    case 'emojiConfetti': return 40;
    case 'aurora': return 3;
    default: return 30;
  }
}

function createParticle(preset: string, width: number, height: number) {
  const particle = {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 1,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    opacity: Math.random() * 0.8 + 0.2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    color: '#ffffff'
  };

  // Customize based on preset
  switch (preset) {
    case 'starfield':
      particle.speedX *= 0.2;
      particle.speedY *= 0.2;
      particle.size = Math.random() * 2 + 1;
      particle.color = '#FFD700';
      break;
    
    case 'bubbles':
      particle.speedY = -(Math.random() * 2 + 0.5);
      particle.speedX *= 0.3;
      particle.size = Math.random() * 6 + 3;
      particle.color = '#5BE9E9';
      break;
    
    case 'snow':
      particle.speedY = Math.random() * 2 + 1;
      particle.speedX = (Math.random() - 0.5) * 1;
      particle.size = Math.random() * 3 + 1;
      particle.color = '#ffffff';
      break;
    
    case 'fireflies':
      particle.speedX *= 0.5;
      particle.speedY *= 0.5;
      particle.size = Math.random() * 3 + 2;
      particle.color = '#FFB039';
      break;
    
    case 'triangles':
      particle.size = Math.random() * 8 + 4;
      particle.color = '#FF6BAA';
      break;
  }

  return particle;
}

function updateParticle(particle: any, preset: string, width: number, height: number) {
  particle.x += particle.speedX;
  particle.y += particle.speedY;
  particle.rotation += particle.rotationSpeed;

  // Wrap around edges
  if (particle.x > width + particle.size) particle.x = -particle.size;
  if (particle.x < -particle.size) particle.x = width + particle.size;
  if (particle.y > height + particle.size) particle.y = -particle.size;
  if (particle.y < -particle.size) particle.y = height + particle.size;

  // Flickering effect for fireflies
  if (preset === 'fireflies') {
    particle.opacity = 0.3 + 0.7 * Math.sin(Date.now() * 0.005 + particle.x * 0.01);
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: any, preset: string) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate((particle.rotation * Math.PI) / 180);
  ctx.globalAlpha = particle.opacity;

  switch (preset) {
    case 'starfield':
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    
    case 'bubbles':
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = particle.opacity * 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.stroke();
      break;
    
    case 'triangles':
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.moveTo(0, -particle.size);
      ctx.lineTo(-particle.size, particle.size);
      ctx.lineTo(particle.size, particle.size);
      ctx.closePath();
      ctx.fill();
      break;
    
    default:
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}