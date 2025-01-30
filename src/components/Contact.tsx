import React, { useState, useRef } from 'react';
import { Mail, MapPin, Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        'service_22x7bka', // Replace with your EmailJS service ID
        'template_qpwzp3c', // Replace with your EmailJS template ID
        formRef.current,
        'JW6xs8hFmH49Yb0YQ' // Replace with your EmailJS public key
      );
      toast.success('Message sent successfully!');
      formRef.current.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Email error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 animate-slide-up" id="contact">
      <Toaster position="top-right" />
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-lavender to-gold bg-clip-text text-transparent">
        Get In Touch
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-6 text-gold">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-lavender/60">Email</p>
                <a href="mailto:vaibhavkumawat7605@gmail.com" className="text-lavender hover:text-gold transition-colors">
                  vaibhavkumawat7605@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-lavender/60">Location</p>
                <p className="text-lavender">Bangalore, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-6 text-gold">Send Message</h3>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-lavender/60 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-gold/50 text-lavender transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-lavender/60 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-gold/50 text-lavender transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-lavender/60 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-gold/50 text-lavender transition-colors resize-none"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-gold to-royal-light text-royal-dark font-semibold py-3 px-6 rounded-lg
                       hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2
                       disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;