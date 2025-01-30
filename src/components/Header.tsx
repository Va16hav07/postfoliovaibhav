import React from 'react';
import { Code2, Rocket, Users, ChevronDown, Terminal, Coffee } from 'lucide-react';

const Header = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="min-h-screen flex flex-col items-center justify-center relative animate-fade-in">
      {/* Profile Image */}
      <div className="mb-8 relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-gold/30 animate-float group-hover:ring-gold/50 transition-colors duration-300">
          <img
            src="/profile.jpeg"
            alt="Profile"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 rounded-full animate-pulse-slow ring-4 ring-gold/20" />
      </div>

      {/* Name and Title */}
      <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center">
        <span className="bg-gradient-to-r from-lavender via-gold to-royal-light bg-clip-text text-transparent">
          Vaibhav Kumawat
        </span>
      </h1>

      {/* Software Engineer Title */}
      <div className="mb-8 text-2xl text-lavender/90 flex items-center gap-3">
        <Terminal className="w-6 h-6 text-gold animate-pulse" />
        <span>Software Engineering Student</span>
        <Coffee className="w-6 h-6 text-gold animate-pulse" />
      </div>

      {/* Roles */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 text-lg text-lavender/80 mb-12">
        <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
          <Code2 className="w-5 h-5 text-gold" />
          <span>Full Stack Developer</span>
        </div>
        <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
          <Rocket className="w-5 h-5 text-gold" />
          <span>Problem Solver</span>
        </div>
        <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
          <Users className="w-5 h-5 text-gold" />
          <span>Team Player</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce hover:text-gold transition-colors duration-300"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </header>
  );
};

export default Header;