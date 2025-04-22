import React, { useState } from 'react';
import { ExternalLink, Github, Code2, Lightbulb, Star } from 'lucide-react';

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

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="fade-in group">
      <div className="glass-card h-full flex flex-col overflow-hidden hover:shadow-[0_0_25px_rgba(0,243,255,0.2)] transition-all duration-500">
        <div className="relative overflow-hidden">
          <div className="aspect-video overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/600x400?text=${project.title}`;
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-4">
            <div className="flex space-x-3">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-neon-blue text-dark py-2 px-4 rounded-lg flex items-center gap-2 font-medium transform -translate-y-10 group-hover:translate-y-0 transition-all duration-500"
                >
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
              )}
              
              {project.githubUrl && (
                <a 
                  href={project.githubUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 text-white backdrop-blur-md py-2 px-4 rounded-lg flex items-center gap-2 font-medium transform -translate-y-10 group-hover:translate-y-0 transition-all duration-500 delay-100"
                >
                  <Github size={16} />
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent" 
              style={{ animation: 'scan-line 2s linear infinite' }}
            ></div>
          </div>
        </div>
        
        <div className="flex-grow p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            {project.featured && (
              <div className="bg-neon-pink/20 text-neon-pink rounded-full flex items-center gap-1 text-xs font-medium px-2.5 py-0.5">
                <Lightbulb size={12} />
                <span>Featured</span>
              </div>
            )}
          </div>
          
          <p className="text-lavender/70">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 pt-4">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-lavender/70">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all');
  
  // Use local image path for better reliability
  const projectImage = "/images/project-image.jpg";
  
  const projects: Project[] = [
    {
      id: 1,
      title: "SweatSmart Fitness App",
      description: "A comprehensive fitness tracking application that helps users monitor workouts, set goals, and track their progress with analytics and personalized recommendations.",
      image: projectImage,
      tags: ["React Native", "Node.js", "MongoDB", "Express"],
      liveUrl: "https://sweatsmart.example.com",
      githubUrl: "https://github.com/yourusername/sweatsmart",
      featured: true
    },
    {
      id: 2,
      title: "Code Collab Platform",
      description: "A collaborative coding platform where developers can code together in real-time, share snippets, and solve problems as a team.",
      image: projectImage,
      tags: ["React", "Socket.io", "Express", "MongoDB"],
      liveUrl: "https://codecollab.example.com",
      githubUrl: "https://github.com/yourusername/codecollab",
      featured: true
    },
    {
      id: 3,
      title: "DataViz Dashboard",
      description: "An interactive data visualization dashboard that transforms complex datasets into insightful, interactive charts and graphs.",
      image: projectImage,
      tags: ["D3.js", "React", "TypeScript", "Node.js"],
      githubUrl: "https://github.com/yourusername/dataviz",
      featured: false
    },
    {
      id: 4,
      title: "EcoTrack App",
      description: "A mobile application that helps users track and reduce their carbon footprint through daily habit suggestions and progress tracking.",
      image: projectImage,
      tags: ["Flutter", "Firebase", "Dart"],
      featured: true
    },
    {
      id: 5,
      title: "StudyBuddy",
      description: "A web platform connecting students for collaborative study sessions, resource sharing, and knowledge exchange.",
      image: projectImage,
      tags: ["Next.js", "Tailwind CSS", "Supabase"],
      liveUrl: "https://studybuddy.example.com",
      featured: false
    },
    {
      id: 6,
      title: "MealPrep Planner",
      description: "An application that helps users plan their meals, generate shopping lists, and follow nutritional guidelines.",
      image: projectImage,
      tags: ["React", "Firebase", "Tailwind CSS"],
      githubUrl: "https://github.com/yourusername/mealprep",
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.featured);

  return (
    <section id="projects" className="section bg-dark relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-cyber-purple/5 to-transparent opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-neon-blue/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-neon-pink/5 rounded-full blur-[100px]"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="section-title">
          <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">My Projects</span>
        </h2>
        
        <div className="flex justify-center mb-12">
          <div className="glass-card p-1 rounded-lg">
            <div className="flex">
              <button 
                className={`px-6 py-2 rounded-md transition-all ${activeFilter === 'all' ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white' : 'text-lavender/60 hover:text-neon-blue'}`}
                onClick={() => setActiveFilter('all')}
              >
                All Projects
              </button>
              <button 
                className={`px-6 py-2 rounded-md transition-all ${activeFilter === 'featured' ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white' : 'text-lavender/60 hover:text-neon-blue'}`}
                onClick={() => setActiveFilter('featured')}
              >
                Featured
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="https://github.com/Va16hav07" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline inline-flex items-center"
          >
            <Github size={20} />
            <span>See More on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};


export default Projects;