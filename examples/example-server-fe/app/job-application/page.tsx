'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

        const response = await axios.get(apiUrl);

        const link = response.data.link;
        console.log(link);

        setQrCodeUrl(link);
        setId(response.data.id);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    const startPolling = async () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }

      pollInterval = setInterval(async () => {
        try {
          if (!id) return;

          const statusUrl = `${process.env.NEXT_PUBLIC_API_URL}/status/${id}`;
          const response = await axios.get(statusUrl);

          if (response.data.status === 'success') {
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            console.log('Success data:', response.data);

            // Navigate to result page with the returned data
            router.push(
              `/result?data=${encodeURIComponent(JSON.stringify({ id, resultType: 'job-application' }))}`,
            );
          }
        } catch (err) {
          console.error('Error polling status:', err);
          // Don't stop polling on error, just log it
        }
      }, 3000);
    };

    if (id && !loading) {
      startPolling();
    }

    // Clean up interval on component unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };
  }, [id, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div className="mb-4">
        <h1 className="text-3xl font-bold leading-tight mb-2">
          Job Application to Hopae Inc.
        </h1>
        <p className="text-xl">(Software Engineer)</p>
        <p className="text-lg">Scan the QR code to apply for a job.</p>
      </div>
      {qrCodeUrl && (
        <div style={{ maxWidth: '250px', width: '100%', margin: '0 auto' }}>
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={qrCodeUrl}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
    </div>
  );
}
