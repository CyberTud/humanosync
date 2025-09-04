import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CleanLanding = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitMessage('Thank you! We\'ll be in touch soon.');
    setEmail('');
    setIsSubmitting(false);
    
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            {['Teach', 'Any', 'Robot', 'to', 'Understand', 'Video'].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            From pose to perception — convert human motion into robot structure.
          </motion.p>
          
          <motion.button
            onClick={() => navigate('/upload')}
            className="px-8 py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-900 transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try It Now →
          </motion.button>
          
          {/* Subtle scroll indicator */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-gray-400"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Robots in Motion - Stacked Sections */}
      <section id="robots" className="py-20">
        {/* Humanoid Robot */}
        <RobotSection
          imageSrc="/humanoid_robot.png"
          title="Humanoid Robot"
          subtitle="For full-body imitation learning"
          bgColor="bg-gray-50"
          delay={0}
        />
        
        {/* Robotic Arm */}
        <RobotSection
          imageSrc="/arm_robot.png"
          title="Robotic Arm"
          subtitle="For precise manipulation tasks"
          bgColor="bg-white"
          delay={0.2}
        />
        
        {/* Quadruped Robot */}
        <RobotSection
          imageSrc="/dog_robot.png"
          title="Quadruped Robot"
          subtitle="For dynamic locomotion and navigation"
          bgColor="bg-gray-50"
          delay={0.4}
        />
        
        {/* Drone */}
        <RobotSection
          imageSrc="/drone_robot.png"
          title="Drone"
          subtitle="For aerial perception and mapping"
          bgColor="bg-white"
          delay={0.6}
        />
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <ProcessStep
                  number="1"
                  title="Upload Video"
                  description="Submit any video containing human demonstrations or robot movements"
                />
                <ProcessStep
                  number="2"
                  title="Extract Data"
                  description="AI processes video into structured outputs"
                />
                <ProcessStep
                  number="3"
                  title="Train Robots"
                  description="Use extracted data for imitation learning and control"
                />
              </div>
              
              <div className="mt-12 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Output Types:</h3>
                <DataType icon="🦴" label="Pose" description="33 keypoints in 3D space" />
                <DataType icon="📦" label="Objects" description="Bounding boxes with labels" />
                <DataType icon="🎬" label="Actions" description="Temporal action segments" />
              </div>
            </motion.div>
            
            {/* Right: Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-black rounded-2xl p-8 shadow-2xl">
                <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                  {/* Mock video frame with annotations */}
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Skeleton lines */}
                    <motion.line
                      x1="50%" y1="25%" x2="45%" y2="40%"
                      stroke="#3B82F6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                    <motion.line
                      x1="50%" y1="25%" x2="55%" y2="40%"
                      stroke="#3B82F6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                    <motion.line
                      x1="50%" y1="40%" x2="50%" y2="60%"
                      stroke="#3B82F6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                    <motion.line
                      x1="50%" y1="60%" x2="45%" y2="80%"
                      stroke="#3B82F6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1.1 }}
                    />
                    <motion.line
                      x1="50%" y1="60%" x2="55%" y2="80%"
                      stroke="#3B82F6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1.2 }}
                    />
                    
                    {/* Keypoints */}
                    <motion.circle
                      cx="50%" cy="25%" r="4"
                      fill="#3B82F6"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.3 }}
                    />
                    <motion.circle
                      cx="45%" cy="40%" r="3"
                      fill="#3B82F6"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.4 }}
                    />
                    <motion.circle
                      cx="55%" cy="40%" r="3"
                      fill="#3B82F6"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.5 }}
                    />
                    <motion.circle
                      cx="50%" cy="60%" r="3"
                      fill="#3B82F6"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.6 }}
                    />
                  </svg>
                  
                  {/* Bounding box */}
                  <motion.div
                    className="absolute top-1/4 left-1/3 w-32 h-48 border-2 border-green-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  >
                    <span className="absolute -top-6 left-0 text-xs text-green-400 bg-black px-1">Person</span>
                  </motion.div>
                  
                  {/* Action label */}
                  <motion.div
                    className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 2 }}
                  >
                    Walking
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Want to train robots using video?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-400 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join the beta to get early access to HumanoSync.
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-full outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-500"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative">
                  {isSubmitting ? 'Submitting...' : 'Get Early Access'}
                </span>
              </motion.button>
            </div>
          </motion.form>
          
          {submitMessage && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 text-green-400"
            >
              {submitMessage}
            </motion.p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 HumanoSync. Robotics meets perception.
            </p>
            <div className="flex gap-6">
              <motion.a 
                href="https://linkedin.com" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://github.com" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Robot Section Component
const RobotSection = ({ imageSrc, title, subtitle, bgColor, delay }) => {
  return (
    <motion.div className={`py-24 ${bgColor}`}>
      <motion.div 
        className="max-w-4xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {/* Robot Image with floating animation */}
        <motion.div
          className="relative inline-block mb-8"
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay * 2
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <img 
            src={imageSrc} 
            alt={title}
            className="relative w-48 h-48 lg:w-64 lg:h-64 object-contain drop-shadow-lg"
          />
        </motion.div>
        
        {/* Title and Subtitle */}
        <motion.h3 
          className="text-2xl lg:text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.3 }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Process Step Component
const ProcessStep = ({ number, title, description }) => {
  return (
    <motion.div 
      className="flex gap-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

// Data Type Component
const DataType = ({ icon, label, description }) => {
  return (
    <motion.div 
      className="flex items-center gap-3 p-3 bg-white rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ x: 5 }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <span className="font-semibold">{label}:</span>
        <span className="text-gray-600 ml-2">{description}</span>
      </div>
    </motion.div>
  );
};

export default CleanLanding;