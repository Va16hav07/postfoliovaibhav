import React, { useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import OpenSource from './components/OpenSource';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const createMatrixRain = () => {
      const container = document.querySelector('.matrix-background');
      if (!container) return;

      for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${Math.random() * 100}%`;
        column.style.animationDelay = `${Math.random() * 20}s`;
        column.textContent = '10'.repeat(30);
        container.appendChild(column);
      }
    };

    createMatrixRain();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white overflow-hidden">
      <div className="matrix-background absolute inset-0 opacity-20" />
      <div className="aurora-background absolute inset-0">
        <div className="aurora-beam" />
      </div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          
          <main className="py-12 space-y-32">
            <div className="transform hover:scale-105 transition-all duration-500">
              <div className="glass-panel rounded-2xl p-8 backdrop-blur-lg bg-white/5">
                <About />
              </div>
            </div>
            
            {/* Projects Section */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent mb-16">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Projects />
              </div>
            </div>
            
            {/* Open Source Section */}
            <div className="glass-panel rounded-2xl p-8 transform hover:scale-105 transition-transform duration-500 backdrop-blur-lg bg-white/5">
              <OpenSource />
            </div>
            
            <div className="glass-panel rounded-2xl p-8 hover:shadow-neon transition-shadow duration-500 backdrop-blur-lg bg-white/5">
              <Contact />
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App