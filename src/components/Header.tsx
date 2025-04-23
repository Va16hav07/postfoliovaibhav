import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowDownCircle, ExternalLink, Twitter } from 'lucide-react';

const Header: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const texts = [
    "Software Developer",
    "Frontend Engineer",
    "UI/UX Enthusiast",
    "Open Source Contributor",
    "Problem Solver"
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[textIndex % texts.length];
      
      if (!isDeleting) {
        setTypedText(currentText.substring(0, typedText.length + 1));
        
        if (typedText === currentText) {
          setTypingSpeed(2000); // Pause at the end
          setTimeout(() => setIsDeleting(true), typingSpeed);
        }
      } else {
        setTypedText(currentText.substring(0, typedText.length - 1));
        
        if (typedText.length === 0) {
          setIsDeleting(false);
          setTextIndex(textIndex + 1);
          setTypingSpeed(150);
        }
      }
    };
    
    const timer = setTimeout(handleTyping, isDeleting ? 50 : typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, textIndex, isDeleting, typingSpeed, texts]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to handle resume download
  const handleResumeDownload = () => {
    // Get the URL of the resume PDF
    const resumeUrl = '/Vaibhav_Kumawat_Resume.pdf'; // Assuming this is your filename
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.setAttribute('download', 'Vaibhav_Kumawat_Resume.pdf');
    link.setAttribute('target', '_blank'); // Open in new tab if download fails
    
    // Add error handling
    link.onerror = () => {
      console.error('Failed to download resume');
      // Fallback - open in new tab
      window.open(resumeUrl, '_blank');
    };
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header id="home" className="section py-28 md:py-36">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-8 fade-in">
            <div className="space-y-6">
              <p className="text-neon-blue font-medium inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
                Hello, I'm
              </p>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                <span className="bg-gradient-to-r from-neon-blue via-lavender to-neon-pink bg-clip-text text-transparent">
                  Vaibhav Kumawat
                </span>
              </h1>
              
              <div className="h-10">
                <h2 className="text-2xl md:text-3xl font-medium text-lavender flex items-center">
                  <span>{typedText}</span>
                  <span className="ml-1 w-1.5 h-8 bg-neon-blue animate-pulse"></span>
                </h2>
              </div>
              
              <p className="text-lavender/70 text-lg max-w-xl leading-relaxed">
                Passionate about creating elegant solutions to complex problems through clean, efficient code.
                Building digital experiences that make a difference.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToContact}
                className="bg-gradient-to-r from-neon-blue to-neon-pink text-white py-3 px-6 rounded-lg flex items-center gap-2 font-medium shadow-lg hover:shadow-neon-blue/30 transition-all hover:-translate-y-0.5"
              >
                <Mail size={18} />
                <span>Contact Me</span>
              </button>
              
              <button 
                onClick={scrollToProjects}
                className="bg-transparent border border-neon-blue/30 text-neon-blue py-3 px-6 rounded-lg flex items-center gap-2 font-medium hover:bg-neon-blue/10 transition-all"
              >
                <ExternalLink size={18} />
                <span>View Projects</span>
              </button>
              
              <button 
                onClick={handleResumeDownload}
                className="text-neon-pink hover:text-neon-blue flex items-center gap-2 transition-colors"
              >
                <ArrowDownCircle size={18} />
                <span>Download Resume</span>
              </button>
            </div>
            
            <div className="pt-4">
              <div className="flex gap-6 items-center">
                <a 
                  href="https://github.com/Va16hav07" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-neon-blue transform hover:scale-110 transition-all"
                >
                  <Github size={24} />
                  <span className="sr-only">GitHub</span>
                </a>
                <a 
                  href="https://linkedin.com/in/va16hav" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-neon-blue transform hover:scale-110 transition-all"
                >
                  <Linkedin size={24} />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a 
                  href="https://twitter.com/Vaibh_av_07" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-neon-blue transform hover:scale-110 transition-all"
                >
                  <Twitter size={24} />
                  <span className="sr-only">Twitter</span>
                </a>
                <a 
                  href="mailto:vaibhavkumwat7605@gmail.com" 
                  className="text-white/60 hover:text-neon-blue transform hover:scale-110 transition-all"
                >
                  <Mail size={24} />
                  <span className="sr-only">Email</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 fade-in">
            <div className="relative">
              <div className="glass-card rounded-xl border border-white/10 p-4 relative overflow-hidden">
                {/* Corner decoration */}
                <div className="absolute top-0 left-0 w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-blue"></div>
                  <div className="absolute top-0 left-0 h-full w-[1px] bg-neon-blue"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16">
                  <div className="absolute bottom-0 right-0 w-full h-[1px] bg-neon-pink"></div>
                  <div className="absolute bottom-0 right-0 h-full w-[1px] bg-neon-pink"></div>
                </div>
                
                {/* Updated image path to use profile.jpeg */}
                <img 
                  src="/profile.jpeg" 
                  alt="Vaibhav Kumawat" 
                  className="rounded-lg w-full h-auto object-cover shadow-[0_0_30px_rgba(0,243,255,0.3)]"
                  onError={(e) => {
                    console.log("Error loading profile image, using placeholder");
                    e.currentTarget.src = 'https://placehold.co/500x600/121212/00f3ff?text=Vaibhav+Kumawat';
                    e.currentTarget.onerror = null;
                  }}
                />
                
                {/* Scan line effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent" style={{ animation: 'scan-line 2s linear infinite' }}></div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6">
                <div className="glass-card rounded-lg p-2 pl-4 border-t border-l border-neon-green/30 flex items-center gap-3 animate-pulse-glow">
                  <span className="text-sm font-medium text-neon-green">Available for new projects</span>
                  <div className="rounded-full w-3 h-3 bg-neon-green"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;