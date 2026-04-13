import React from 'react';
import { motion } from 'framer-motion';
import { Github, LayoutTemplate, Layers, Wrench, Bug } from 'lucide-react';

const contributions = [
  {
    project: 'KubeStellar (UI)',
    icon: Layers,
    items: [
      { text: 'Enhanced UI components for better usability and consistency across cluster management features.', icon: LayoutTemplate },
      { text: 'Fixed backend logic issues related to resource synchronization and state management.', icon: Bug },
      { text: 'Contributed to telemetry integration, enabling improved monitoring and diagnostics for multi-cluster environments.', icon: Wrench },
    ]
  },
  {
    project: 'Ruxailabs (RUXAILAB)',
    icon: Github,
    items: [
      { text: 'Redesigned key UI components to enhance accessibility and responsiveness across devices, improving user interaction flow and reducing interface latency.', icon: LayoutTemplate },
      { text: 'Refactored legacy styles and optimized component rendering, contributing to a cleaner codebase and smoother navigation experience.', icon: Wrench },
    ]
  }
];

const OpenSource = () => {
  return (
    <section className="section" id="opensource">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <h2 className="section-title mb-0">Open Source</h2>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 flex items-center gap-1.5">
              <Github size={14} /> Journey
            </div>
          </div>
          <p className="section-subtitle">Passionate about building in public and giving back to the community.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="premium-card p-8 h-full flex flex-col justify-between bg-gradient-to-b from-white/[0.02] to-transparent border-t-blue-500/20">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Github className="w-7 h-7 text-white/90" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Active Contributor</h3>
                <p className="text-white/60 leading-relaxed font-light mb-8">
                  I believe in the power of collaborative software development. Contributing to open-source allows me to learn from the best, improve my skills, and build software that matters.
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            {contributions.map((contribution, cIdx) => (
              <motion.div
                key={cIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: cIdx * 0.1 }}
                className="premium-card p-8"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <contribution.icon className="w-6 h-6 text-blue-400" />
                  <h4 className="text-xl font-bold text-white">{contribution.project}</h4>
                </div>
                
                <div className="space-y-5">
                  {contribution.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-white/60" />
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;