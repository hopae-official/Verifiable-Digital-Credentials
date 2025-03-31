'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ResultData {
  id: string;
  resultType: 'job-application' | 'phone-register';
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setResultData(parsedData);
      } else {
        setError('No data provided');
      }
    } catch (err) {
      console.error('Error parsing result data:', err);
      setError('Error parsing result data');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <Link href="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Verification Success</h1>


      {resultData.resultType === 'job-application' && (
        <div className="mb-6">
          <p>Thank you for applying to our job posting. We will contact you soon.</p>
        </div>
      )}

      {resultData.resultType === 'phone-register' && (
        <div className="mb-6">
          <p>Thank you for requesting a phone number. We will send you the USIM card soon.</p>
        </div>
      )}

      <Link href="/">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
