import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Open Source', href: '#opensource', id: 'opensource' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];
  
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if the link is active
  const isActive = (linkId: string): boolean => {
    return activeSection === linkId;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 backdrop-blur-lg bg-dark/80 shadow-lg' : 'py-5 bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <a href="#home" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-neon-blue">&lt;</span>
            <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">Vaibhav</span>
            <span className="text-neon-pink">/&gt;</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`nav-link relative text-sm font-medium transition-all ${
                  isActive(link.id) 
                    ? 'text-neon-blue' 
                    : 'text-lavender/70 hover:text-lavender'
                }`}
              >
                {link.name}
                {isActive(link.id) && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-neon-blue"></span>
                )}
              </a>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-dark-light backdrop-blur-lg border-t border-white/10 py-4 shadow-lg">
          <div className="container-custom flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`py-2 ${
                  isActive(link.id) 
                    ? 'text-neon-blue' 
                    : 'text-lavender/70'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
