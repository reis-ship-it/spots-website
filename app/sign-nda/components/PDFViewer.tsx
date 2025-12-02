'use client';

import { useState } from 'react';
import styles from './PDFViewer.module.css';

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.viewer}>
      {loading && (
        <div className={styles.loading}>
          Loading NDA PDF...
        </div>
      )}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <iframe
        src={pdfUrl}
        className={styles.iframe}
        title="NDA PDF"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError('Failed to load PDF. Please refresh the page.');
        }}
        style={{ display: loading || error ? 'none' : 'block' }}
      />
    </div>
  );
}

