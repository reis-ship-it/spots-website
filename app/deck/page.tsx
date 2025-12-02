'use client';

import SlideHero from './components/SlideHero';
import SlideProblem from './components/SlideProblem';
import SlidePhilosophy from './components/SlidePhilosophy';
import SlideJourney from './components/SlideJourney';
import SlideHowItWorks from './components/SlideHowItWorks';
import SlideFeatures from './components/SlideFeatures';
import SlideDifferent from './components/SlideDifferent';
import SlideTechnology from './components/SlideTechnology';
import SlideMarket from './components/SlideMarket';
import SlideVision from './components/SlideVision';
import SlideCTA from './components/SlideCTA';
import styles from './page.module.css';

export default function DeckPage() {
  return (
    <main className={styles.deckContainer}>
      <SlideHero />
      <SlideProblem />
      <SlidePhilosophy />
      <SlideJourney />
      <SlideHowItWorks />
      <SlideFeatures />
      <SlideDifferent />
      <SlideTechnology />
      <SlideMarket />
      <SlideVision />
      <SlideCTA />
    </main>
  );
}

