'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideVision() {
  const { vision } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{vision.title}</h2>
        <div className={styles.quote}>"{vision.quote}"</div>
        <p className={styles.sectionText}>{vision.description}</p>
        <p className={styles.subtitle}>{vision.subtitle}</p>
      </div>
    </Slide>
  );
}

