'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="splash-container">
      <div className="splash-content">
        <Image
          src="/logoletras.png"
          alt="BeeApp AI Logo"
          width={320}
          height={140}
          className="splash-logo"
          priority
        />
        <div className="splash-spinner" />
        <h1 className="splash-title">Iniciando tu espacio seguro...</h1>
        <p className="splash-subtitle">Todo lo importante, en un solo lugar.</p>
      </div>
    </main>
  );
}
