'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideCTA() {
  const { cta } = pitchDeckContent;

  return (
    <Slide className={styles.ctaSlide}>
      <div className={styles.slideContent}>
        <h2 className={styles.ctaTitle}>{cta.title}</h2>
        <p className={styles.ctaMessage}>{cta.message}</p>
        <p className={styles.ctaContact}>
          {cta.contact}:<br />
          <a href={`mailto:${cta.email}`} className={styles.ctaEmail}>
            {cta.email}
          </a>
        </p>
      </div>
    </Slide>
  );
}

