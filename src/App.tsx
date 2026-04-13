import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import OpenSource from './components/OpenSource';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 300);
      
      const sections = ['home', 'about', 'projects', 'opensource', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
      
      if (scrollPosition < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-white/20">
      {/* Subtle modern background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558602/noise_djf022.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <Navigation activeSection={activeSection} />
      
      <main className="relative z-10">
        <Header />
        
        <div className="relative">
          <About />
        </div>
        
        <div className="relative">
          <Projects />
        </div>
        
        <div className="relative">
          <OpenSource />
        </div>
        
        <div className="relative border-t border-white/[0.05] bg-gradient-to-b from-background to-black">
          <Contact />
        </div>
        
        <button 
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`fixed bottom-8 right-8 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg z-50 transition-all duration-300 hover:bg-white flex items-center justify-center hover:text-black hover:scale-110 active:scale-95 ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <ArrowUp size={20} />
        </button>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;