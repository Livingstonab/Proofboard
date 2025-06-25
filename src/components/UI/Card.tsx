import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;