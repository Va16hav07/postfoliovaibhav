import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Sparkles } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all');
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Equiply (Rental Marketplace)",
      description: "A full-stack rental marketplace platform enabling users to list, discover, and rent items seamlessly. Includes secure authentication, roles, schema architecture, and search/filtering capabilities.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      githubUrl: "https://github.com/Va16hav07",
      featured: true
    },
    {
      id: 2,
      title: "Sweat Smart",
      description: "A comprehensive fitness tracking startup that was selected for the zonals of Eureka IIT Bombay, positioned among the top 500 startups in Asia representing innovation in a competitive environment.",
      image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&auto=format&fit=crop",
      tags: ["Startup", "Innovation", "Tech-Business"],
      featured: true
    },
    {
      id: 3,
      title: "Zuvees App (Internship)",
      description: "Designed, developed, and launched the Zuvees Online Flower and Gifting mobile application from scratch globally on both iOS and Android stores.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop",
      tags: ["Mobile App", "React Native", "Deployment"],
      liveUrl: "https://zuvees.ae",
      featured: true
    },
    {
      id: 4,
      title: "KubeStellar Observability",
      description: "Implemented a full-stack OpenTelemetry tracing integration for the KubeStellar UI, linking frontend interactions to backend API traces with Jaeger.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      tags: ["OpenTelemetry", "Tracing", "KubeStellar", "Jaeger"],
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.featured);

  return (
    <section id="projects" className="section relative">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="section-title">Selected Work</h2>
            <p className="section-subtitle mb-0">Bridging the gap between design and scalable engineering.</p>
          </div>
          
          <div className="p-1.5 bg-white/5 border border-white/10 rounded-xl inline-flex w-max backdrop-blur-md">
            <button 
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeFilter === 'featured' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveFilter('featured')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Featured
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="premium-card group flex flex-col cursor-pointer"
              >
                <div className="p-4 flex-grow flex flex-col">
                  {/* Image container */}
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 mb-6">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded bg-white/5 border border-white/5 text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer actions */}
                  <div className="pt-4 mt-auto border-t border-white/10 flex items-center gap-4">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                        <span>Live View</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;