import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  staggerFrom?: 'first' | 'last';
  initial?: any;
  animate?: any;
  exit?: any;
  staggerDuration?: number;
  splitLevelClassName?: string;
  transition?: any;
  rotationInterval?: number;
}

export default function RotatingText({
  texts,
  mainClassName = '',
  staggerFrom = 'first',
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  staggerDuration = 0.025,
  splitLevelClassName = '',
  transition = { type: 'spring', damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        className={splitLevelClassName}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{
          ...transition,
          delay: staggerFrom === 'first' ? index * staggerDuration : (text.length - 1 - index) * staggerDuration,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  // Calculate dynamic width based on current text length
  const getDynamicWidth = (text: string) => {
    const baseWidth = 60; // Base width in pixels
    const charWidth = 12; // Approximate width per character
    return Math.max(baseWidth, text.length * charWidth + 20); // Add padding
  };

  return (
    <motion.div 
      className={mainClassName}
      animate={{ 
        width: getDynamicWidth(texts[currentIndex])
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut"
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px',
        backgroundColor: 'white',
        color: 'black',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {splitText(texts[currentIndex])}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
