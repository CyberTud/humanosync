import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const ImmersiveLanding = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitMessage('Access granted. Welcome to the future.');
    setEmail('');
    setIsSubmitting(false);
    
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-black to-black">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px),
                               linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px)`,
              backgroundSize: '4rem 4rem'
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Train Any Robot
              <br />
              From Video
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-400 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              HumanoSync extracts pose, object, and action data from any video 
              to train humanoids, arms, quadrupeds, and drones.
            </motion.p>
            
            <motion.button
              onClick={() => scrollToSection('robot-sync')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Early Access
            </motion.button>
          </motion.div>

          {/* Right Orbital Animation */}
          <motion.div 
            className="lg:w-1/2 relative h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div 
                className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Orbiting Robots */}
            <OrbitingRobot 
              src="/humanoid_robot.png" 
              alt="Humanoid"
              orbitRadius={200}
              duration={20}
              delay={0}
              size="w-24 h-24"
            />
            <OrbitingRobot 
              src="/arm_robot.png" 
              alt="Arm"
              orbitRadius={180}
              duration={25}
              delay={5}
              size="w-20 h-20"
            />
            <OrbitingRobot 
              src="/dog_robot.png" 
              alt="Quadruped"
              orbitRadius={220}
              duration={30}
              delay={10}
              size="w-20 h-20"
            />
            <OrbitingRobot 
              src="/drone_robot.png" 
              alt="Drone"
              orbitRadius={160}
              duration={22}
              delay={15}
              size="w-16 h-16"
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Robot Sync Scene */}
      <section id="robot-sync" className="relative min-h-screen py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-purple-950/5" />
        
        <motion.div 
          className="relative z-10 container mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Sync With Any Robot
          </motion.h2>

          <div className="relative h-[600px] lg:h-[700px]">
            {/* Data Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line 
                x1="20%" y1="30%" x2="80%" y2="30%"
                stroke="url(#gradient1)" 
                strokeWidth="1" 
                opacity="0.3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.line 
                x1="50%" y1="10%" x2="50%" y2="90%"
                stroke="url(#gradient1)" 
                strokeWidth="1" 
                opacity="0.3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Robots */}
            <FloatingRobotCard 
              src="/humanoid_robot.png"
              alt="Humanoid Robot"
              label="Humanoid"
              position={{ top: '10%', left: '10%' }}
              delay={0}
            />
            <FloatingRobotCard 
              src="/arm_robot.png"
              alt="Robot Arm"
              label="Manipulator"
              position={{ top: '10%', right: '10%' }}
              delay={0.2}
            />
            <FloatingRobotCard 
              src="/dog_robot.png"
              alt="Quadruped Robot"
              label="Quadruped"
              position={{ bottom: '10%', left: '10%' }}
              delay={0.4}
            />
            <FloatingRobotCard 
              src="/drone_robot.png"
              alt="Drone"
              label="Aerial"
              position={{ bottom: '10%', right: '10%' }}
              delay={0.6}
            />

            {/* Central Hub */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59,130,246,0.5)',
                      '0 0 40px rgba(147,51,234,0.5)',
                      '0 0 20px rgba(59,130,246,0.5)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-2xl font-bold">SYNC</span>
                </motion.div>
                
                {/* Orbiting Particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, 50 * Math.cos(i * 2.09), 0, -50 * Math.cos(i * 2.09), 0],
                      y: [0, 50 * Math.sin(i * 2.09), 0, -50 * Math.sin(i * 2.09), 0],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Video-to-Data Visualization */}
      <section className="relative min-h-screen py-20 bg-gradient-to-b from-purple-950/5 via-black to-black">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Video Intelligence Pipeline
          </motion.h2>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <DataCard
              title="Pose Extraction"
              icon="🦴"
              data={["33 keypoints", "3D coordinates", "60 FPS tracking"]}
              delay={0}
            />
            <DataCard
              title="Object Detection"
              icon="📦"
              data={["YOLO v8", "80+ classes", "Real-time"]}
              delay={0.2}
            />
            <DataCard
              title="Action Recognition"
              icon="🎬"
              data={["Temporal analysis", "Context aware", "Multi-label"]}
              delay={0.4}
            />
          </div>

          {/* Mock Video Visualization */}
          <motion.div 
            className="mt-20 relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
              {/* Mock Video Frame */}
              <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 to-purple-950/20" />
                
                {/* Animated Skeleton Overlay */}
                <motion.svg 
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  {/* Skeleton Lines */}
                  <motion.line 
                    x1="50%" y1="20%" x2="45%" y2="35%"
                    stroke="#60A5FA" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                  <motion.line 
                    x1="50%" y1="20%" x2="55%" y2="35%"
                    stroke="#60A5FA" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  />
                  <motion.line 
                    x1="50%" y1="35%" x2="50%" y2="50%"
                    stroke="#60A5FA" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  />
                  
                  {/* Keypoints */}
                  <motion.circle 
                    cx="50%" cy="20%" r="4"
                    fill="#60A5FA"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  />
                  <motion.circle 
                    cx="45%" cy="35%" r="3"
                    fill="#60A5FA"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.6 }}
                  />
                  <motion.circle 
                    cx="55%" cy="35%" r="3"
                    fill="#60A5FA"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.7 }}
                  />
                </motion.svg>

                {/* Bounding Boxes */}
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-24 h-32 border-2 border-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  <span className="absolute -top-6 left-0 text-xs text-green-400">Person</span>
                </motion.div>

                <motion.div 
                  className="absolute bottom-1/4 right-1/3 w-16 h-16 border-2 border-yellow-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <span className="absolute -top-6 left-0 text-xs text-yellow-400">Cup</span>
                </motion.div>

                {/* Action Labels */}
                <motion.div 
                  className="absolute top-4 right-4 bg-purple-600/80 px-3 py-1 rounded-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                >
                  <span className="text-sm font-medium">Action: Pick</span>
                </motion.div>
              </div>

              {/* Export Formats */}
              <div className="flex justify-center gap-4 mt-8">
                {['JSON', 'CSV', 'ROS/YAML'].map((format, i) => (
                  <motion.div
                    key={format}
                    className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 2.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05, borderColor: '#60A5FA' }}
                  >
                    <span className="text-sm text-gray-400">Export as</span>
                    <p className="font-mono font-semibold">{format}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 via-black to-black" />
        
        <motion.div 
          className="relative z-10 container mx-auto px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Join the Beta Program
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Be among the first to train next-generation robots with video intelligence.
          </motion.p>

          {/* Terminal-style Input */}
          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative bg-gray-900 rounded-lg border border-gray-800 p-1">
              <div className="flex items-center">
                <span className="text-green-400 font-mono px-3">$</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter_email --access beta"
                  className="flex-1 bg-transparent text-white font-mono py-4 px-2 outline-none placeholder-gray-600"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md font-semibold mx-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    'Execute'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Success Message */}
          <AnimatePresence>
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-green-400 font-mono"
              >
                <span className="inline-block mr-2">✓</span>
                {submitMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 HumanoSync. All rights reserved.
            </p>
            <div className="flex gap-6">
              <motion.a 
                href="https://github.com" 
                className="text-gray-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                className="text-gray-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Orbiting Robot Component
const OrbitingRobot = ({ src, alt, orbitRadius, duration, delay, size }) => {
  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 ${size}`}
      style={{
        transformOrigin: `${-orbitRadius}px center`,
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <motion.img 
        src={src} 
        alt={alt}
        className="w-full h-full object-contain drop-shadow-2xl"
        whileHover={{ scale: 1.2 }}
      />
    </motion.div>
  );
};

// Floating Robot Card Component
const FloatingRobotCard = ({ src, alt, label, position, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute w-32 h-32 lg:w-40 lg:h-40"
      style={position}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        y: {
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
      >
        {/* Glow Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />
        
        {/* Robot Image */}
        <img 
          src={src} 
          alt={alt}
          className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
        />
        
        {/* Label */}
        <motion.div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-3 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
        </motion.div>

        {/* Data Stream Effect */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  initial={{ 
                    top: '50%', 
                    left: '50%',
                    opacity: 0
                  }}
                  animate={{ 
                    top: `${20 + i * 20}%`,
                    left: `${110 + i * 10}%`,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Data Card Component
const DataCard = ({ title, icon, data, delay }) => {
  return (
    <motion.div
      className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-600/50 transition-colors"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-blue-400">{title}</h3>
      <ul className="space-y-2">
        {data.map((item, i) => (
          <motion.li
            key={i}
            className="text-gray-400 text-sm flex items-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + i * 0.1 }}
          >
            <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ImmersiveLanding;