
import React, { useEffect, useState } from 'react';

const HolographicParticles: React.FC = () => {
  const [particles, setParticles] = useState<{id: number, left: string, delay: string, duration: string, size: string}[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`,
      size: `${1 + Math.random() * 3}px`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div 
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            background: `rgba(0, 243, 255, ${0.1 + Math.random() * 0.3})`,
            boxShadow: `0 0 10px rgba(0, 243, 255, 0.5)`
          }}
        />
      ))}
    </div>
  );
};

export default HolographicParticles;
