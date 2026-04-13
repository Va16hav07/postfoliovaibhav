import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/[0.05] bg-black">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <a href="#home" className="text-xl font-bold text-white flex items-center gap-1 mb-4 group inline-flex">
              <span className="text-blue-500">V</span>
              <span className="text-white">aibhav.</span>
            </a>
            <p className="text-muted text-sm leading-relaxed max-w-sm mb-6">
              A passionate software engineering student building sleek, high-performance web and mobile applications with modern technologies.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Github, href: "https://github.com/Va16hav07" },
                { icon: Linkedin, href: "https://linkedin.com/in/va16hav" },
                { icon: Twitter, href: "https://twitter.com/Vaibh_av_07" },
                { icon: Mail, href: "mailto:vaibhavkumwat7605@gmail.com" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm text-muted hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Location</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted">
                Based in India <br/>
                Open for remote roles worldwide.
              </li>
              <li className="text-sm text-muted">vaibhavkumwat7605@gmail.com</li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Vaibhav Kumawat. All rights reserved.
          </p>
          <p className="text-sm text-muted flex items-center gap-1.5">
            Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;