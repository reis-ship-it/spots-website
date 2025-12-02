'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideProblem() {
  const { problem } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{problem.title}</h2>
        <ul className={styles.pointsList}>
          {problem.points.map((point, index) => (
            <li key={index} className={styles.point}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  );
}

