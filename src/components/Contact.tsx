import React, { useState, FormEvent } from 'react';
import { Send, Check, AlertCircle, AtSign, MessageSquare, User } from 'lucide-react';
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
      // Configure these with your EmailJS service details
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
        message: 'Thanks for reaching out! I\'ll get back to you soon.'
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Something went wrong. Please try again or contact me directly via email.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <h2 className="relative text-4xl font-bold mb-12 text-center text-white cyber-text" data-text="Get In Touch">
        Get In Touch
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="fade-in">
            <h3 className="text-2xl font-bold mb-6 text-neon-blue">Let's Connect</h3>
            <p className="text-lavender/80 mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-8">
              <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                    <AtSign size={24} className="text-neon-blue animate-pulse-slow" />
                  </div>
                  <div>
                    <h4 className="text-sm text-lavender/60 mb-1">Email</h4>
                    <a href="mailto:vaibhavkumwat7605@gmail.com" className="text-lg font-medium text-neon-pink hover:text-neon-blue transition-colors">
                      vaibhavkumwat7605@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center">
                    <MessageSquare size={24} className="text-neon-pink animate-pulse-slow" />
                  </div>
                  <div>
                    <h4 className="text-sm text-lavender/60 mb-1">Connect</h4>
                    <a href="https://linkedin.com/in/va16hav" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-neon-blue hover:text-neon-pink transition-colors">
                      linkedin.com/in/va16hav
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="fade-in">
            <div className="glass-card p-6 rounded-xl border border-white/10 shadow-lg">
              {formStatus.submitted && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${formStatus.success ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-pink/10 text-neon-pink'}`}>
                  {formStatus.success ? <Check size={20} /> : <AlertCircle size={20} />}
                  <p>{formStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="form-input-wrapper relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="form-input pl-12"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="form-input-wrapper relative">
                    <AtSign size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="form-input pl-12"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="form-input-wrapper relative">
                    <MessageSquare size={18} className="absolute left-4 top-6 text-white/40" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      required
                      rows={5}
                      className="form-input pl-12 pt-4"
                    ></textarea>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-neon-blue to-neon-pink w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-white shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;