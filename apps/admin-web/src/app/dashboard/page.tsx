'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>BeeApp AI - Panel Admin (Placeholder)</h1>
        <p style={subtitleStyle}>
          ¡Verificación administrativa exitosa! Los indicadores y herramientas de supervisión se construirán en fases posteriores.
        </p>
        <button onClick={() => router.replace('/login')} style={buttonStyle}>
          Cerrar Sesión (Simulado)
        </button>
      </div>
    </div>
  );
}

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
  padding: '40px',
  maxWidth: '520px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 12px 32px rgba(96, 37, 210, 0.08)',
  border: '1px solid #E9ECEF',
};

const titleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1A1A2E',
  marginBottom: '12px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6C757D',
  marginBottom: '28px',
  lineHeight: '1.5',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#6025d2',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
};
