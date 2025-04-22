import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import OpenSource from './components/OpenSource';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MatrixBackground from './components/effects/MatrixBackground';
import AuroraEffect from './components/effects/AuroraEffect';

const App: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll progress indicator and back to top button visibility
  const handleScroll = () => {
    if (!scrollProgressRef.current || !backToTopRef.current) return;
    
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / totalScroll) * 100;
    
    scrollProgressRef.current.style.transform = `scaleX(${scrollPercentage / 100})`;
    
    // Show back to top button after scrolling 300px
    if (scrollPosition > 300) {
      backToTopRef.current.classList.remove('opacity-0', 'pointer-events-none');
      backToTopRef.current.classList.add('opacity-100');
    } else {
      backToTopRef.current.classList.add('opacity-0', 'pointer-events-none');
      backToTopRef.current.classList.remove('opacity-100');
    }
    
    // Improved section detection
    const sections = ['home', 'about', 'projects', 'opensource', 'contact'];
    
    // Find which section is currently in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const rect = section.getBoundingClientRect();
        // If the section is in the viewport (or just above it)
        if (rect.top <= 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    }
    
    // Edge case: At the top of the page, always set to home
    if (scrollPosition < 100) {
      setActiveSection('home');
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Setup intersection observer for animation on scroll
  useEffect(() => {
    const setupScrollObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.fade-in').forEach((element) => {
        observerRef.current?.observe(element);
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial setup
    setupScrollObserver();
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      {/* Background Effects */}
      <AuroraEffect />
      <div className="bg-cyber-grid bg-[length:50px_50px] fixed inset-0 opacity-20 pointer-events-none"></div>
      <MatrixBackground />
      
      {/* Progress Bar */}
      <div ref={scrollProgressRef} className="progress-indicator" />
      
      {/* Navigation */}
      <Navigation activeSection={activeSection} />
      
      <main className="relative z-10">
        <Header />
        
        <section id="about" className="section">
          <div className="container-custom">
            <div className="card fade-in">
              <About />
            </div>
          </div>
        </section>
        
       
        
        <Projects />
        
        <section id="opensource" className="section">
          <div className="container-custom">
            <div className="card fade-in">
              <OpenSource />
            </div>
          </div>
        </section>
        
        <section id="contact" className="section bg-gradient-to-b from-dark-light to-cyber-dark">
          <div className="container-custom">
            <div className="card fade-in">
              <Contact />
            </div>
          </div>
        </section>
        
        <button 
          ref={backToTopRef}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="btn-floating opacity-0 pointer-events-none transition-opacity duration-300"
        >
          <ArrowUp size={24} />
        </button>
      </main>
      
      <Footer />
    </>
  );
};

export default App;