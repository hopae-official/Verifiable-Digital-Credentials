'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ResultData {
  status: string;
  id: string;
  resultType: string;
  data: any;
  // 필요한 다른 필드들 추가
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
      <h1 className="text-2xl font-bold mb-6">Result</h1>

      <div className="bg-gray-100 p-6 rounded-lg mb-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Response Data:</h2>
        <div className="bg-white p-3 rounded overflow-auto max-h-[400px]">
          <pre className="text-sm">{JSON.stringify(resultData, null, 2)}</pre>
        </div>
      </div>

      {resultData.resultType === 'type1' && (
        <div className="mb-6">
          {/* Type 1에 특화된 UI 렌더링 */}
          <p>Type 1 Result Visualization</p>
          {/* 여기에 Type 1 데이터에 맞는 컴포넌트 추가 */}
        </div>
      )}

      {resultData.resultType === 'type2' && (
        <div className="mb-6">
          {/* Type 2에 특화된 UI 렌더링 */}
          <p>Type 2 Result Visualization</p>
          {/* 여기에 Type 2 데이터에 맞는 컴포넌트 추가 */}
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
