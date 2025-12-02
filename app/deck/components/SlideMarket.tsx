'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideMarket() {
  const { market } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{market.title}</h2>
        <ul className={styles.pointsList}>
          {market.points.map((point, index) => (
            <li key={index} className={styles.point}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  );
}

