'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlidePhilosophy() {
  const { philosophy } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{philosophy.title}</h2>
        <div className={styles.quote}>"{philosophy.quote}"</div>
        <p className={styles.subtitle}>{philosophy.subtitle}</p>
        <ul className={styles.pointsList}>
          {philosophy.points.map((point, index) => (
            <li key={index} className={styles.point}>
              {point}
            </li>
          ))}
        </ul>
        <p className={styles.closing}>{philosophy.closing}</p>
      </div>
    </Slide>
  );
}

