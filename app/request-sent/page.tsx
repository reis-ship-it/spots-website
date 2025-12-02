'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function RequestSent() {
  const searchParams = useSearchParams();
  const signed = searchParams.get('signed') === 'true';

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>
          {signed ? 'NDA Signed Successfully!' : 'Request Received'}
        </h1>
        <p className={styles.message}>
          {signed
            ? 'Your NDA has been signed. Check your email for a copy of the signed NDA and your pitch deck access link.'
            : 'We\'ve received your access request. Please check your email to sign the NDA.'}
        </p>
        {!signed && (
          <p className={styles.submessage}>
            Once you've signed the NDA, you'll receive an email with a link to access the pitch deck.
          </p>
        )}
        <Link href="/" className={styles.link}>
          Return to Home
        </Link>
      </div>
    </main>
  );
}

