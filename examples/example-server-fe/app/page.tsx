'use client';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">
        Digital Credentials Verification Demo
      </h1>

      <div className="flex gap-6">
        <Link href="/job-application">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Job Application
          </button>
        </Link>

        <Link href="/phone-register">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            Phone Register
          </button>
        </Link>
      </div>
    </div>
  );
}
