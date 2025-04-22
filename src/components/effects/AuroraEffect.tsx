import React from 'react';

const AuroraEffect: React.FC = () => {
  return (
    <div className="aurora-background fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="aurora-beam absolute opacity-20" 
           style={{
             background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 243, 255, 0.2) 0%, rgba(107, 0, 255, 0.1) 40%, rgba(255, 0, 229, 0.1) 60%, rgba(0, 255, 157, 0.05) 80%, transparent 100%)',
             animation: 'aurora-wave 15s ease infinite',
           }}
      ></div>
      <div className="aurora-beam absolute opacity-10" 
           style={{
             background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 0, 229, 0.15) 0%, rgba(0, 243, 255, 0.1) 40%, rgba(0, 255, 157, 0.1) 60%, rgba(107, 0, 255, 0.05) 80%, transparent 100%)',
             animation: 'aurora-wave 20s ease-in-out infinite reverse',
           }}
      ></div>
      <div className="aurora-beam absolute opacity-10" 
           style={{
             background: 'radial-gradient(ellipse at 30% 70%, rgba(0, 255, 157, 0.15) 0%, rgba(107, 0, 255, 0.1) 40%, rgba(255, 0, 229, 0.1) 60%, rgba(0, 243, 255, 0.05) 80%, transparent 100%)',
             animation: 'aurora-wave 25s ease infinite',
           }}
      ></div>
    </div>
  );
};

export default AuroraEffect;
