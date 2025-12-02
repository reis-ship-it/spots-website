'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './Slide.module.css';

interface SlideProps {
  children: ReactNode;
  className?: string;
}

export default function Slide({ children, className = '' }: SlideProps) {
  return (
    <motion.section
      className={`${styles.slide} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
}

