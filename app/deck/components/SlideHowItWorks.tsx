'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideHowItWorks() {
  const { howItWorks } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{howItWorks.title}</h2>
        {howItWorks.sections.map((section, index) => (
          <div key={index} style={{ marginBottom: 'var(--spacing-xxl)' }}>
            <h3 className={styles.sectionTitle}>{section.heading}</h3>
            <ul className={styles.pointsList}>
              {section.points.map((point, i) => (
                <li key={i} className={styles.point}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Slide>
  );
}

