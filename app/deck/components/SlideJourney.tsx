'use client';

import Slide from './Slide';
import { pitchDeckContent } from '@/lib/pitch-deck-content';
import styles from './Slides.module.css';

export default function SlideJourney() {
  const { journey } = pitchDeckContent;

  return (
    <Slide>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{journey.title}</h2>
        <div className={styles.flow}>{journey.flow}</div>
        <div className={styles.timeline}>
          {journey.timeline.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineWeek}>{item.week}</div>
              <div className={styles.timelineDescription}>"{item.description}"</div>
              {item.outcome && (
                <div className={styles.timelineOutcome}>→ {item.outcome}</div>
              )}
              {item.outcomes && (
                <div className={styles.timelineOutcomes}>
                  {item.outcomes.map((outcome, i) => (
                    <div key={i} className={styles.timelineOutcomeItem}>
                      {outcome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

