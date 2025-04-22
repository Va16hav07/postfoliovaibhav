import React from 'react';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dark-light pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-neon-pink/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-neon-blue">&lt;</span>
              <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">Vaibhav</span>
              <span className="text-neon-pink">/&gt;</span>
            </h3>
            <p className="text-lavender/60 mb-6">
              First year CS student passionate about creating digital experiences through code.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Va16hav07"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-blue hover:text-dark transition-all"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/va16hav/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-blue hover:text-dark transition-all"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/Vaibh_av_07"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-blue hover:text-dark transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:vaibhavkumwat7605@gmail.com"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-blue hover:text-dark transition-all"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-lavender/60 hover:text-neon-blue transition-colors">Home</a></li>
              <li><a href="#about" className="text-lavender/60 hover:text-neon-blue transition-colors">About</a></li>
              <li><a href="#projects" className="text-lavender/60 hover:text-neon-blue transition-colors">Projects</a></li>
              <li><a href="#contact" className="text-lavender/60 hover:text-neon-blue transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <p className="text-lavender/60 mb-1">vaibhavkumwat7605@gmail.com</p>
            <p className="text-lavender/60">Polaris School of Technology</p>
          </div>
        </div>
        
        <div className="pt-6 text-center">
          <p className="text-lavender/60 flex items-center justify-center gap-2">
            © {new Date().getFullYear()} Made with 
            <Heart size={16} className="text-neon-pink fill-neon-pink animate-pulse-slow" /> 
            by Vaibhav Kumawat
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;