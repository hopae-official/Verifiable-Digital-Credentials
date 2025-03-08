'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

export default function Home() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

        const response = await axios.get(apiUrl);

        const link = response.data.link;
        console.log(link);

        setQrCodeUrl(link);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
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
