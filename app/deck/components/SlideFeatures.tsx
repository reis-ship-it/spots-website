'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideFeatures() {
  const { features } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{features.title}</h2>
        <div className={styles.featuresGrid}>
          {features.items.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

