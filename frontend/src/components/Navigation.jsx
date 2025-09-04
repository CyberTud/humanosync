import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
  const location = useLocation();

  return (
    <motion.nav 
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              HumanoSync
            </motion.span>
          </Link>
          
          <div className="flex items-center gap-8">
            <NavLink to="/upload" active={location.pathname === '/upload'}>
              Upload
            </NavLink>
            <NavLink to="/annotate/demo" active={location.pathname.includes('/annotate')}>
              Annotate
            </NavLink>
            <NavLink to="/export/demo" active={location.pathname.includes('/export')}>
              Export
            </NavLink>
            
            <motion.button
              className="ml-4 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children, active }) => {
  return (
    <Link to={to}>
      <motion.span
        className={`text-sm font-medium transition-colors ${
          active ? 'text-black' : 'text-gray-600 hover:text-black'
        }`}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

export default Navigation;