import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FloatingRobot from '../components/FloatingRobot';

const LandingPage = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const { scrollY } = useScroll();
  
  // Parallax transforms for different elements
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const sceneScale = useTransform(scrollY, [0, 800], [1, 0.95]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      setTimeout(() => setEmailSubmitted(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-blue-950 to-black" />
        <motion.div 
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        <motion.div 
          animate={{ 
            background: [
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center z-20"
      >
        <div className="text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
            >
              {['Train', 'Any', 'Robot', 'Using', 'Video'].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            From motion to manipulation — turn video into structured data for humanoids, arms, drones, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link
              to="#showcase"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('showcase').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <span>Get Early Access</span>
              <motion.svg 
                className="ml-3 w-5 h-5"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [2, 12, 2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Robot Scene Section */}
      <motion.section 
        id="showcase"
        style={{ scale: sceneScale }}
        className="relative min-h-screen py-20 z-10"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Scene Title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Every Robot. Every Motion.
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Our AI understands all robotic platforms
            </p>
          </motion.div>

          {/* Floating Robots Scene */}
          <div className="relative h-[600px] md:h-[700px]">
            {/* Center glow effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"
            />

            {/* Humanoid Robot */}
            <FloatingRobot
              src="/humanoid_robot.png"
              alt="Humanoid Robot"
              label="Humanoid"
              description="Full-body motion capture"
              position={{ top: '5%', left: '10%' }}
              floatRange={30}
              rotateRange={5}
              delay={0}
              glowColor="from-blue-400 to-cyan-400"
            />

            {/* Robotic Arm */}
            <FloatingRobot
              src="/arm_robot.png"
              alt="Robotic Arm"
              label="Robotic Arm"
              description="Precision manipulation"
              position={{ top: '15%', right: '15%' }}
              floatRange={25}
              rotateRange={-3}
              delay={0.5}
              glowColor="from-green-400 to-emerald-400"
            />

            {/* Quadruped */}
            <FloatingRobot
              src="/dog_robot.png"
              alt="Quadruped Robot"
              label="Quadruped"
              description="Dynamic locomotion"
              position={{ bottom: '20%', left: '12%' }}
              floatRange={35}
              rotateRange={4}
              delay={1}
              glowColor="from-orange-400 to-yellow-400"
            />

            {/* Drone */}
            <FloatingRobot
              src="/drone_robot.png"
              alt="Drone"
              label="Drone"
              description="Aerial navigation"
              position={{ bottom: '10%', right: '10%' }}
              floatRange={40}
              rotateRange={-6}
              delay={1.5}
              glowColor="from-purple-400 to-pink-400"
            />

            {/* Connection lines between robots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="20%" y1="30%" x2="80%" y2="35%"
                stroke="url(#gradient1)"
                strokeWidth="1"
                opacity="0.3"
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.line
                x1="25%" y1="70%" x2="75%" y2="75%"
                stroke="url(#gradient2)"
                strokeWidth="1"
                opacity="0.3"
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              />
              <defs>
                <linearGradient id="gradient1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="gradient2">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Features grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              { icon: '🎬', title: 'Video Analysis', desc: 'Advanced computer vision' },
              { icon: '🧠', title: 'AI Processing', desc: 'Real-time pose extraction' },
              { icon: '📊', title: 'Data Export', desc: 'Robot-ready formats' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA / Signup Section */}
      <section className="relative py-32 z-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Want to train your robots smarter?
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Join the waitlist for early access to HumanoSync
            </p>

            <form onSubmit={handleEmailSubmit} className="relative max-w-md mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 pr-32 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Join Waitlist
                </button>
              </motion.div>
            </form>

            <AnimatePresence>
              {emailSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-green-400"
                >
                  ✓ Thanks for joining! We'll be in touch soon.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800 z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">© 2025 HumanoSync. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;