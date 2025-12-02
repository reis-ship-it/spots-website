'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideHero() {
  const { hero } = pitchDeckContent;

  return (
    <Slide className={styles.heroSlide}>
      <h1 className={styles.heroTitle}>{hero.title}</h1>
      <p className={styles.heroTagline}>{hero.tagline}</p>
    </Slide>
  );
}

