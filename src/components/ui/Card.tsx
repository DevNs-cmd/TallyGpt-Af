import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden p-6';
  const hoverClasses = hoverEffect && onClick ? 'cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300' : '';

  if (onClick) {
    return (
      <motion.div
        whileHover={hoverEffect ? { y: -4, scale: 1.005 } : {}}
        whileTap={{ scale: 0.995 }}
        onClick={onClick}
        className={`${baseClasses} ${hoverClasses} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
