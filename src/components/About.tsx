import React from 'react';
import { GraduationCap, Code2, Terminal, Coffee, Laptop, Book } from 'lucide-react';

const skills = [
  { name: 'HTML5', level: 80 },
  { name: 'CSS3', level: 80 },
  { name: 'JavaScript', level: 88 },
  { name: 'React.js', level: 75 },
  { name: 'Node.js', level: 82 },
  { name: 'MongoDB', level: 80 },
  { name: 'Express.js', level: 80 },
  { name: 'Kotlin', level: 75 },
  { name: 'Flutter', level: 65 },
];

const About = () => {
  return (
    <section className="py-16 animate-slide-up" id="about">
      <h2 className="text-5xl font-bold mb-16 text-center">
        <span className="bg-gradient-to-r from-lavender to-gold bg-clip-text text-transparent">
          About Me
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Profile Info */}
        <div className="glass-card rounded-2xl p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden ring-2 ring-gold/30 transform hover:scale-105 transition-transform duration-300">
              <img
                src="profile.jpeg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gold mb-2">Vaibhav Kumawat</h3>
              <p className="text-lavender/80 flex items-center gap-2 justify-center sm:justify-start">
                <Terminal className="w-4 h-4" />
                First Year Student
              </p>
              <p className="text-lavender/60 flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Coffee className="w-4 h-4" />
                Turning Coffee into Code
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 gradient-border p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform" />
              <div>
                <h4 className="font-medium">Education</h4>
                <p className="text-lavender/80">B.Tech in CSE with AI/ML</p>
                <p className="text-lavender/60">Polaris School of Technology</p>
                <p className="text-lavender/60 text-sm">2024-2028 (Currently Pursuing)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 gradient-border p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
              <Laptop className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform" />
              <div>
                <h4 className="font-medium">Focus Areas</h4>
                <p className="text-lavender/80">Web Development</p>
                <p className="text-lavender/60">Mobile App Development</p>
              </div>
            </div>

            <div className="flex items-center gap-4 gradient-border p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
              <Book className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform" />
              <div>
                <h4 className="font-medium">Current Status</h4>
                <p className="text-lavender/80">First Year Student</p>
                <p className="text-lavender/60">Exploring New Technologies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-gold animate-pulse" />
            <span>Technical Arsenal</span>
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="gradient-border rounded-lg p-4 hover:bg-white/5 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                    {skill.name}
                  </span>
                  <span className="text-gold">{skill.level}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full animate-shimmer relative"
                    style={{
                      width: `${skill.level}%`,
                      background: 'linear-gradient(90deg, #FFD700 0%, #8B5CF6 100%)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-12 glass-card rounded-2xl p-8 text-center">
        <p className="text-xl text-lavender/90 italic">
          "Passionate about crafting elegant solutions to complex problems through code."
        </p>
      </div>
    </section>
  );
};

export default About;