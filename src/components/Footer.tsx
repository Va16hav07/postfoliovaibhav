import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://github.com/Va16hav07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lavender hover:text-gold transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/va16hav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lavender hover:text-gold transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:vaibhavkumwat7605@gmail.com"
            className="text-lavender hover:text-gold transition-colors"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/Vaibh_av_07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lavender hover:text-gold transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
        </div>
        <p className="text-lavender/60">
          © {new Date().getFullYear()} Vaibhav Kumawat. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;