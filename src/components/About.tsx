import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Terminal, Briefcase, Award } from 'lucide-react';

const skills = [
  'JavaScript', 'Java', 'Python', 'SQL', 'Go', 
  'React.js', 'Node.js', 'REST APIs', 'Docker', 
  'Git', 'CI/CD', 'FFmpeg', 'OpenTelemetry'
];

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="section" id="about">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">My professional background, education, and technical arsenal.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Main Bio Card */}
            <motion.div variants={itemVariants} className="premium-card p-6 md:p-8 flex flex-col items-center sm:flex-row gap-8 bg-gradient-to-br from-white/[0.05] to-transparent h-auto">
              <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 rounded-full overflow-hidden border-4 border-white/10">
                <img
                  src="/profile.jpeg"
                  alt="Vaibhav Kumawat"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Vaibhav Kumawat</h3>
                  <p className="text-muted flex items-center justify-center sm:justify-start gap-2">
                    <Terminal className="w-4 h-4" />
                    Software Engineer
                  </p>
                </div>
                <p className="text-white/80 leading-relaxed font-light text-sm md:text-base">
                  I am a deeply passionate software developer with full-stack experience ranging from building complex MERN stack applications to implementing real-time observability pipelines. With experience in Open Source and shipping cross-platform apps, I strive to solve complex problems through clean and efficient code.
                </p>
              </div>
            </motion.div>

            {/* Experience Card */}
            <motion.div variants={itemVariants} className="premium-card p-6 md:p-8 flex-grow">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white">Experience</h4>
              </div>
              
              <div className="space-y-6">
                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-orange-500/50 before:rounded-full before:ring-4 before:ring-white/5 border-l border-white/10 ml-1 pb-6">
                  <h5 className="font-semibold text-white/90 leading-tight">Software Engineer Intern</h5>
                  <p className="text-sm text-white/60 mb-2">Zuvees Flowers and Gifting • Bengaluru</p>
                  <p className="text-xs text-white/40 mb-3 bg-white/5 inline-block px-2 py-1 rounded">Jul 2025 - Dec 2025</p>
                  <p className="text-sm text-white/70 leading-relaxed font-light">Developed AI agents for customer support, built ML pipelines for product quality assessment, and launched the Zuvees cross-platform mobile app on the App Store and Google Play.</p>
                </div>

                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-orange-500/50 before:rounded-full before:ring-4 before:ring-white/5 border-l border-white/10 ml-1 border-b-transparent">
                  <h5 className="font-semibold text-white/90 leading-tight">Summer Intern</h5>
                  <p className="text-sm text-white/60 mb-2">KubeStellar • Remote</p>
                  <p className="text-xs text-white/40 mb-3 bg-white/5 inline-block px-2 py-1 rounded">Jun 2025 - Aug 2025</p>
                  <p className="text-sm text-white/70 leading-relaxed font-light">Instrumented KubeStellar UI with OpenTelemetry for real-time observability, integrating Jaeger tracing to significantly improve visibility and developer debugging workflows.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Side Details) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            
            {/* Education Card */}
            <motion.div variants={itemVariants} className="premium-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white">Education</h4>
              </div>
              <p className="text-white/90 font-medium leading-snug">Integrated B.Tech in CSE (AI/ML)</p>
              <p className="text-muted text-sm mt-1 mb-3">Polaris School of Technology, Bangalore</p>
              <p className="text-muted text-xs font-mono bg-white/5 w-max px-2 py-1 rounded">2024 - 2028</p>
            </motion.div>

            {/* Skills Card */}
            <motion.div variants={itemVariants} className="premium-card p-6 md:p-8 flex-grow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white">Technical Arsenal</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Awards / Achievements */}
            <motion.div variants={itemVariants} className="premium-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white">Achievements</h4>
              </div>
              <ul className="text-sm text-white/70 space-y-3 font-light pl-4 list-disc marker:text-white/20">
                <li>Led Sweat Smart to Eureka IIT Bombay zonals (top 500 startups in Asia).</li>
                <li>Earned Certification from NEC '24 for tech-driven business excellence.</li>
              </ul>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;