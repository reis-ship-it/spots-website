'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error === 'invalid_token' ? 'Invalid or expired access link.'
    : error === 'token_expired' ? 'Access link has expired.'
    : error === 'not_completed' ? 'NDA has not been completed yet.'
    : null
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.signUrl) {
        // Redirect to sign NDA page
        router.push(data.signUrl);
      } else {
        setErrorMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>SPOTS</h1>
        <p className={styles.tagline}>
          Opening doors to experiences, communities, people, meaning
        </p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Request Access</h2>
          <p className={styles.formDescription}>
            To view our pitch deck, please sign an NDA. You'll be redirected to sign it on this website.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.error}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              placeholder="Your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={styles.input}
              placeholder="Your company"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Submitting...' : 'Request Access'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>SPOTS</h1>
          <p className={styles.tagline}>
            Opening doors to experiences, communities, people, meaning
          </p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}

