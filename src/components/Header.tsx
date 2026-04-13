import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ArrowRight, Download } from 'lucide-react';

const Header: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    const resumeUrl = '/Vaibhav_Kumawat_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.setAttribute('download', 'Vaibhav_Kumawat_Resume.pdf');
    link.setAttribute('target', '_blank');
    link.onerror = () => window.open(resumeUrl, '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <header id="home" className="section min-h-screen flex items-center relative overflow-hidden pt-32 pb-20">
      <div className="container-custom relative z-10 w-full h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full">
          
          <motion.div 
            className="flex flex-col space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={textVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 w-max backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide text-white/80 uppercase">Available for new opportunities</span>
            </motion.div>
            
            <motion.div variants={textVariant} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Building digital <br/>
                <span className="text-gradient">experiences.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-lg leading-relaxed font-light">
                Hi, I'm Vaibhav Kumawat. A passionate software engineer, open source contributor, and problem solver who designs and builds highly functional, performant, and scalable applications.
              </p>
            </motion.div>
            
            <motion.div variants={textVariant} className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={scrollToContact}
                className="btn-primary group"
              >
                <span>Let's talk</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleResumeDownload}
                className="btn-secondary group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                <span>Resume</span>
              </button>
            </motion.div>
            
            <motion.div variants={textVariant} className="flex gap-6 items-center pt-8">
              {[
                { icon: Github, href: "https://github.com/Va16hav07", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/va16hav", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com/Vaibh_av_07", label: "Twitter" },
                { icon: Mail, href: "mailto:vaibhavkumwat7605@gmail.com", label: "Email" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 -m-2 text-white/50 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:flex justify-end hidden"
          >
            <div className="relative w-[400px] h-[500px]">
              {/* Photo styling container */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out z-10">
                <img 
                  src="/profile.jpeg" 
                  alt="Vaibhav Kumawat" 
                  className="w-full h-full object-cover grayscale mix-blend-luminosity hover:grayscale-0 hover:mix-blend-normal transition-all duration-700 ease-in-out"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl -z-10 animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;