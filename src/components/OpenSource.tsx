import React from 'react';
import { GitPullRequest, Star, GitFork, Github, Code2 } from 'lucide-react';

const contributions = [
  {
    title: 'Feature Implementation',
    description: 'Added new functionality to improve user experience in various open source projects.',
    icon: Code2,
    stats: '5+ PRs Merged',
  },
  {
    title: 'Bug Fixes',
    description: 'Resolved critical issues in core functionality across multiple repositories.',
    icon: GitPullRequest,
    stats: '20+ Issues Fixed',
  },
  {
    title: 'Documentation',
    description: 'Improved project documentation and examples for better developer experience.',
    icon: Star,
    stats: '10+ Docs Updated',
  },
];

const OpenSource = () => {
  return (
    <section className="py-8" id="opensource">
      <h2 className="text-4xl font-bold mb-12 text-center cyber-text">
        Open Source Journey
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-6 mb-8">
            <Github className="w-16 h-16 text-neon-blue animate-pulse" />
            <div>
              <h3 className="text-2xl font-bold text-neon-pink mb-2">Active Contributor</h3>
              <p className="text-lavender/80">Passionate about giving back to the community</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-panel rounded-lg p-4 text-center">
              <GitPullRequest className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-pink">5+</div>
              <div className="text-sm text-lavender/60">Pull Requests</div>
            </div>
            <div className="glass-panel rounded-lg p-4 text-center">
              <Star className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-pink">150+</div>
              <div className="text-sm text-lavender/60">Contributions</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {contributions.map((item, index) => (
            <div
              key={index}
              className="glass-panel rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue to-neon-pink p-2">
                  <item.icon className="w-full h-full text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neon-blue">{item.title}</h4>
                  <p className="text-sm text-neon-pink">{item.stats}</p>
                </div>
              </div>
              <p className="text-lavender/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenSource;