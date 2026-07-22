'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Ingresa un número celular válido de 10 dígitos.');
      return;
    }
    setError('');
    router.push(`/verify?phone=${encodeURIComponent(`+57 ${cleaned}`)}`);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Top Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Image
            src="/logo.png"
            alt="BeeApp AI Admin Logo"
            width={150}
            height={150}
            style={{ borderRadius: '100%' }}
            priority
          />
        </div>
        <h1 style={titleStyle}>BeeApp AI</h1>

        <form onSubmit={handleContinue}>
          <div style={inputGroupStyle}>
            <div style={phoneRowStyle}>
              <div style={badgeStyle}>
                <span style={{ marginRight: '6px' }}>🇨🇴</span>
                <span style={{ fontWeight: '700', fontSize: '15px', color: '#1A1A2E' }}>+57</span>
              </div>
              <input
                type="tel"
                placeholder="300 000 0000"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                style={inputStyle}
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
          </div>

          <button type="submit" style={buttonStyle}>
            Continuar
          </button>
        </form>

        {/* Footer Legal */}
        <div style={footerStyle}>
          <p style={{ fontSize: '12px', color: '#ADB5BD', marginBottom: '6px' }}>
            Acceso exclusivo para personal administrativo autorizado
          </p>
          <div>
            <Link href="/terms" style={linkStyle}>
              Términos y Condiciones
            </Link>
            <span style={{ margin: '0 8px', color: '#ADB5BD' }}>•</span>
            <Link href="/privacy" style={linkStyle}>
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline responsive styling for web admin login
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '#F8F9FC',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '40px 32px',
  width: '100%',
  maxWidth: '460px',
  boxShadow: '0 12px 32px rgba(96, 37, 210, 0.08)',
  border: '1px solid #E9ECEF',
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1A1A2E',
  textAlign: 'center',
  marginBottom: '8px',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '24px',
};

const phoneRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  border: '1.5px solid #E9ECEF',
  borderRadius: '12px',
  padding: '6px 12px',
};

const badgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#F1F3F5',
  padding: '6px 10px',
  borderRadius: '8px',
  marginRight: '10px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '18px',
  fontWeight: '600',
  color: '#1A1A2E',
  letterSpacing: '1px',
  backgroundColor: 'transparent',
};

const errorStyle: React.CSSProperties = {
  color: '#F44336',
  fontSize: '12px',
  marginTop: '8px',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#6025d2',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  padding: '16px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(96, 37, 210, 0.25)',
  transition: 'all 0.2s ease',
};

const footerStyle: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
};

const linkStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#6025d2',
  textDecoration: 'none',
};
