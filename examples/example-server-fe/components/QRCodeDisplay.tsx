'use client';

import React from 'react';

// Client component for displaying QR code
interface QRCodeDisplayProps {
  qrCodeUrl: string;
}

export default function QRCodeDisplay({ qrCodeUrl }: QRCodeDisplayProps) {
  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>QR Code</h1>
      <img src={qrCodeUrl} alt="alt" />
    </div>
  );
}
