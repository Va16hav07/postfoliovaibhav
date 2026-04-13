import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle, Mail, MapPin, User, FileText } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.send(
        'service_22x7bka', // Replace with your service ID
        'template_qpwzp3c', // Replace with your template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        'JW6xs8hFmH49Yb0YQ' // Replace with your public key
      );
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Message sent successfully. I will get back to you soon!'
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Something went wrong. Please try again or email me directly.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus({ submitted: false, success: false, message: '' }), 5000);
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="section-title">Get in Touch</h2>
          <p className="text-muted leading-relaxed">
            I'm currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="premium-card p-8 h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-white mb-8">Contact Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail size={18} className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50 font-medium mb-1">Email bounds</p>
                      <a href="mailto:vaibhavkumwat7605@gmail.com" className="text-white hover:text-blue-400 transition-colors">
                        vaibhavkumwat7605@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin size={18} className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50 font-medium mb-1">Location</p>
                      <p className="text-white">Remote / Willing to Relocate</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="premium-card p-8 relative">
                {formStatus.submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute inset-x-8 top-8 p-4 rounded-lg flex items-center gap-3 text-sm font-medium z-20 ${
                      formStatus.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {formStatus.success ? <Check size={18} /> : <AlertCircle size={18} />}
                    <p>{formStatus.message}</p>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className={`space-y-6 ${formStatus.submitted ? 'mt-16' : ''} transition-all`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-white/70 pl-1">Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30" />
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/70 pl-1">Email</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30" />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-white/70 pl-1">Message</label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-4 top-4 text-white/30" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can I help you?"
                        required
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;