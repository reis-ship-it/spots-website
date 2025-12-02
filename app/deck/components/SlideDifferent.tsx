'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideDifferent() {
  const { different } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{different.title}</h2>
        <div className={styles.featuresGrid}>
          {different.points.map((point, index) => (
            <div key={index} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{point.title}</h3>
              <p className={styles.featureDescription}>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

