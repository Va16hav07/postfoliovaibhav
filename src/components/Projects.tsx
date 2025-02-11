import React from 'react';
import { Heart, Clock, GamepadIcon, Building2, Glasses, Github ,TrendingUp} from 'lucide-react';

const projects = [
  {
    title: 'Sweat Smart',
    description: 'A comprehensive fitness application helping users achieve their health goals through personalized workout plans and progress tracking.',
    icon: Heart,
    link: 'https://github.com/Va16hav07/SweatSmart1',
    tech: ['Kotlin', 'Node.js', 'MongoDB'],
    color: 'from-[#FF6B6B] to-[#FF8E8E]',
  },
  {
    title: 'Time Management System',
    description: 'An efficient system for organizing and optimizing daily schedules, increasing productivity and time utilization.',
    icon: Clock,
    link: 'https://github.com/Va16hav07/Time-Managment-System',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    color: 'from-[#4ECDC4] to-[#45B7AF]',
  },
  {
    title: 'Memory Match Game',
    description: 'An engaging memory challenge game built with modern web technologies, featuring multiple difficulty levels.',
    icon: GamepadIcon,
    link: 'https://github.com/Va16hav07/Memory-Match',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    color: 'from-[#FFD93D] to-[#FFC107]',
  },
  {
    title: 'Real Estate Website',
    description: 'A modern real estate platform showcasing properties with advanced search and filtering capabilities.',
    icon: Building2,
    link: 'https://github.com/MAT1018/RealEstate',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    color: 'from-[#6C63FF] to-[#5A52E5]',
  },
  {
    title: 'Optical Shop Website',
    description: 'An e-commerce solution for an optical shop, featuring product catalog and virtual try-on functionality.',
    icon: Glasses,
    link: 'https://github.com/Va16hav07/Web-Optical',
    tech: ['MERN', 'Spring Boot'],
    color: 'from-[#FF61D2] to-[#FE48C9]',
  },
  {
    title: 'Crypto Price Tracker',
    description: 'A real-time cryptocurrency tracking application providing live price updates and historical data visualization.',
    icon: TrendingUp,
    link: 'https://github.com/Va16hav07/crypto-price-tracker.git',
    tech: ['React', 'Node.js', 'CoinGecko API'],
    color: 'from-[#0DCAF0] to-[#0A95B0]',
  },
];


const Projects = () => {
  return (
    <>
      {projects.map((project, index) => (
        <div
          key={index}
          className="project-card glass-panel rounded-xl p-6 group hover:transform hover:scale-105 transition-all duration-500"
        >
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${project.color} p-3 mb-6 group-hover:animate-float`}>
            <project.icon className="w-full h-full text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
            {project.title}
          </h3>
          
          <p className="text-lavender/80 mb-6 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1 text-sm rounded-full bg-white/10 text-neon-blue"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-button text-sm py-2 px-4 inline-flex items-center gap-2 hover:gap-3 transition-all w-full justify-center sm:w-auto"
          >
            <Github className="w-4 h-4" />
            View Code
          </a>
        </div>
      ))}
    </>
  );
};

export default Projects;