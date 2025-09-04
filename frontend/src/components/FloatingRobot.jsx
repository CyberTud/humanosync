import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FloatingRobot = ({ 
  src, 
  alt, 
  label, 
  description, 
  position, 
  floatRange = 30,
  rotateRange = 5,
  delay = 0,
  glowColor = "from-blue-400 to-purple-400"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Dynamic positioning styles
  const positionStyles = {
    ...position,
    position: 'absolute'
  };

  // Fallback emoji for missing images
  const robotEmojis = {
    'Humanoid': '🤖',
    'Robotic Arm': '🦾',
    'Quadruped': '🐕',
    'Drone': '🚁'
  };

  return (
    <motion.div
      style={positionStyles}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      {/* Floating animation container */}
      <motion.div
        animate={{
          y: [-floatRange/2, floatRange/2, -floatRange/2],
          rotate: [-rotateRange, rotateRange, -rotateRange],
        }}
        transition={{
          y: {
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
          },
          rotate: {
            duration: 6 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.5
          }
        }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.4
          }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-gradient-to-r ${glowColor} blur-2xl rounded-full`}
          style={{ 
            width: '120%', 
            height: '120%',
            left: '-10%',
            top: '-10%'
          }}
        />

        {/* Robot image or fallback */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="relative z-10"
        >
          {!imageError ? (
            <img
              src={src}
              alt={alt}
              className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain filter drop-shadow-2xl"
              onError={() => setImageError(true)}
              style={{ 
                filter: isHovered ? 'brightness(1.2) contrast(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.3))' : 'brightness(1)',
                transition: 'filter 0.3s ease'
              }}
            />
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center text-6xl md:text-7xl filter drop-shadow-2xl">
              {robotEmojis[label] || '🤖'}
            </div>
          )}
        </motion.div>

        {/* Label and description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap"
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <h3 className="text-white font-semibold text-sm">{label}</h3>
            {isHovered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-gray-300 mt-1"
              >
                {description}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Interactive pulse effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-white/30"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </motion.div>

      {/* Connection points */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay * 0.5
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-2 h-2 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default FloatingRobot;