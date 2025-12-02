'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SignaturePad from 'signature_pad';
import PDFViewer from './components/PDFViewer';
import styles from './page.module.css';

function SignNDAContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ndaData, setNdaData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Missing access token');
      return;
    }

    // Fetch user info based on token
    fetch(`/api/get-signing-info?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNdaData({ name: data.name, email: data.email });
        } else {
          setError(data.message || 'Invalid token');
        }
      })
      .catch(err => {
        setError('Failed to load signing information');
      });
  }, [token]);

  useEffect(() => {
    if (signatureType === 'draw' && canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;
      const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });
      signaturePadRef.current = signaturePad;

      // Resize canvas
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = 200 * ratio;
        canvas.getContext('2d')?.scale(ratio, ratio);
        signaturePad.clear();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [signatureType]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    setTypedSignature('');
  };

  const handleSubmit = async () => {
    if (!token || !ndaData) {
      setError('Missing required information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let signatureData: string;

      if (signatureType === 'draw' && signaturePadRef.current) {
        if (signaturePadRef.current.isEmpty()) {
          setError('Please provide a signature');
          setLoading(false);
          return;
        }
        // Get signature as base64 image
        signatureData = signaturePadRef.current.toDataURL('image/png');
      } else {
        if (!typedSignature.trim()) {
          setError('Please enter your name to sign');
          setLoading(false);
          return;
        }
        signatureData = typedSignature.trim();
      }

      // Submit signature
      const response = await fetch('/api/sign-nda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          signature: signatureData,
          signatureType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to success page or pitch deck
        router.push('/request-sent?signed=true');
      } else {
        setError(data.message || 'Failed to process signature');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!ndaData) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Sign NDA</h1>
        <p className={styles.subtitle}>
          Please review and sign the NDA to access the SPOTS pitch deck.
        </p>

        {/* PDF Viewer */}
        <div className={styles.pdfContainer}>
          <PDFViewer pdfUrl="/SPOTS_NDA_fillable_v3.pdf" />
        </div>

        {/* Signature Section */}
        <div className={styles.signatureSection}>
          <h2 className={styles.sectionTitle}>Your Signature</h2>

          <div className={styles.signatureTabs}>
            <button
              className={`${styles.tab} ${signatureType === 'draw' ? styles.active : ''}`}
              onClick={() => setSignatureType('draw')}
            >
              Draw Signature
            </button>
            <button
              className={`${styles.tab} ${signatureType === 'type' ? styles.active : ''}`}
              onClick={() => setSignatureType('type')}
            >
              Type Name
            </button>
          </div>

          {signatureType === 'draw' ? (
            <div className={styles.signatureCanvas}>
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                style={{ border: '2px solid var(--color-grey-300)', borderRadius: '12px' }}
              />
              <button onClick={handleClear} className={styles.clearButton}>
                Clear
              </button>
            </div>
          ) : (
            <div className={styles.typedSignature}>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your full name"
                className={styles.nameInput}
              />
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Processing...' : 'Sign & Submit'}
          </button>
        </div>

        <p className={styles.legalNote}>
          By signing, you agree to the terms of the NDA. A copy of the signed NDA will be sent to you via email.
        </p>
      </div>
    </main>
  );
}

export default function SignNDAPage() {
  return (
    <Suspense fallback={
      <main className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </main>
    }>
      <SignNDAContent />
    </Suspense>
  );
}

