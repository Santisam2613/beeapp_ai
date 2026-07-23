'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';
import DashboardModule from '../../features/dashboard/DashboardModule';
import UsersModule from '../../features/dashboard/UsersModule';
import SubscriptionsModule from '../../features/dashboard/SubscriptionsModule';

const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', name: 'Usuarios', icon: Users },
  { id: 'subscriptions', name: 'Suscripciones', icon: CreditCard },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Responsive sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile dropdown toggles
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    router.replace('/login');
  };

  const getModuleTitle = () => {
    if (activeModule === 'dashboard') return 'Resumen del Panel';
    if (activeModule === 'users') return 'Usuarios Registrados';
    return 'Control de Suscripciones';
  };

  const renderActiveModule = () => {
    if (activeModule === 'dashboard') return <DashboardModule />;
    if (activeModule === 'users') return <UsersModule />;
    if (activeModule === 'subscriptions') return <SubscriptionsModule />;
    return <DashboardModule />;
  };

  // Mock Notifications list
  const mockNotifications = [
    { id: 1, text: 'Nueva suscripción Plus anual de María Gómez', time: 'Hace 5m', read: false },
    { id: 2, text: 'Renovación de cobro fallida: Laura Ramos', time: 'Hace 15m', read: false },
    { id: 3, text: 'Alerta de API: Sincronización fallida Outlook para Sofía Castro', time: 'Hace 2h', read: true },
  ];

  return (
    <div className="admin-layout-container">
      {/* Sidebar Navigation - Fixed on desktop, collapsible on mobile/tablet */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-container">
          <Image
            src="/logo.png"
            alt="BeeApp Logo"
            width={48}
            height={48}
            className="sidebar-brand-logo"
          />
          <div className="sidebar-logo-text-col">
            <span className="sidebar-brand-title">BeeApp AI</span>
            <span className="sidebar-brand-subtitle">Panel de Control</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="close-sidebar-mobile-btn">
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation Links defined as data array */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile select
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="admin-footer-profile">
            <div className="admin-footer-avatar">SV</div>
            <div className="admin-footer-meta">
              <span className="admin-footer-name">S. Valencia</span>
              <span className="admin-footer-role">Administrador</span>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="admin-main-viewport">
        {/* Topbar Panel */}
        <header className="admin-topbar">
          {/* Hamburger button for mobile toggling */}
          <button onClick={() => setSidebarOpen(true)} className="hamburger-menu-btn">
            <Menu size={22} />
          </button>

          {/* Section title */}
          <div className="topbar-title-section">
            <h1 className="topbar-section-title">{getModuleTitle()}</h1>
          </div>

          {/* Global topbar actions */}
          <div className="topbar-actions-section">
            {/* Global Search bar */}
            <div className="topbar-search-box">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                placeholder="Buscar usuarios, facturas..."
                className="topbar-search-input"
              />
            </div>

            {/* Notification triggers */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="topbar-action-icon-btn"
              >
                <Bell size={18} />
                <span className="notification-red-dot" />
              </button>

              {notificationsOpen && (
                <div className="notifications-popover-panel">
                  <div className="popover-panel-header">
                    <span className="popover-panel-title">Notificaciones</span>
                    <span className="popover-panel-mark-read">Marcar como leídas</span>
                  </div>
                  <div className="popover-notifications-list">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="notification-list-row">
                        <div className={`notification-row-dot ${notif.read ? 'read' : 'unread'}`} />
                        <div className="notification-row-text-col">
                          <p className="notification-row-text">{notif.text}</p>
                          <span className="notification-row-time">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="topbar-profile-trigger"
              >
                <div className="topbar-profile-avatar">SV</div>
                <span className="topbar-profile-name">Santiago Valencia</span>
                <ChevronDown size={14} className="topbar-profile-chevron" />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-popover">
                  <div className="dropdown-popover-header">
                    <span className="dropdown-popover-name">Santiago Valencia</span>
                    <span className="dropdown-popover-email">santiago@beeapp.ai</span>
                  </div>
                  <button onClick={() => { setProfileDropdownOpen(false); alert('Detalle de perfil administrativo.'); }} className="dropdown-popover-row">
                    <User size={14} />
                    <span>Mi Perfil</span>
                  </button>
                  <button onClick={() => { setProfileDropdownOpen(false); alert('Ajustes del sistema administrativo.'); }} className="dropdown-popover-row">
                    <Shield size={14} />
                    <span>Seguridad y Roles</span>
                  </button>
                  <button onClick={() => { setProfileDropdownOpen(false); alert('Centro de ayuda administrativo.'); }} className="dropdown-popover-row">
                    <HelpCircle size={14} />
                    <span>Ayuda</span>
                  </button>
                  <button onClick={handleLogout} className="dropdown-popover-row text-red">
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content canvas viewport */}
        <main className="admin-content-canvas">{renderActiveModule()}</main>
      </div>

      {/* Styling */}
      <style jsx global>{`
        .admin-layout-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background-color: #F8F9FA;
        }

        /* Sidebar styles */
        .admin-sidebar {
          width: 260px;
          background-color: #FFFFFF;
          border-right: 1px solid #E9ECEF;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          z-index: 500;
        }

        .sidebar-logo-container {
          padding: 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #F1F3F5;
          gap: 12px;
          position: relative;
        }

        .sidebar-brand-logo {
          border-radius: 12px;
        }

        .sidebar-logo-text-col {
          display: flex;
          flex-direction: column;
        }

        .sidebar-brand-title {
          font-size: 16px;
          font-weight: 850;
          color: #1A1A2E;
        }

        .sidebar-brand-subtitle {
          font-size: 10px;
          color: #ADB5BD;
          font-weight: 650;
        }

        .close-sidebar-mobile-btn {
          display: none;
          position: absolute;
          right: 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6C757D;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          border: none;
          background: transparent;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          color: #495057;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .sidebar-nav-item:hover {
          background-color: #F8F9FA;
          color: #1A1A2E;
        }

        .sidebar-nav-item.active {
          background-color: #FAF5FF;
          color: #6025d2;
        }

        .sidebar-footer {
          padding: 20px 16px;
          border-top: 1px solid #F1F3F5;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-footer-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-footer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #F1F3F5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #6025d2;
        }

        .admin-footer-meta {
          display: flex;
          flex-direction: column;
        }

        .admin-footer-name {
          font-size: 12px;
          font-weight: 800;
          color: #1A1A2E;
        }

        .admin-footer-role {
          font-size: 10px;
          color: #ADB5BD;
          font-weight: 600;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          border: 1px solid #E9ECEF;
          background-color: #FFFFFF;
          padding: 10px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 750;
          color: #EF4444;
          cursor: pointer;
        }

        .sidebar-logout-btn:hover {
          background-color: #FEF2F2;
        }

        /* Viewport frame */
        .admin-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex children from stretching */
        }

        .admin-topbar {
          height: 70px;
          background-color: #FFFFFF;
          border-bottom: 1px solid #E9ECEF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          gap: 16px;
        }

        .hamburger-menu-btn {
          display: none;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6C757D;
          padding: 4px;
        }

        .topbar-section-title {
          font-size: 18px;
          font-weight: 850;
          color: #1A1A2E;
        }

        .topbar-actions-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .topbar-search-box {
          display: flex;
          align-items: center;
          background-color: #F8F9FA;
          border: 1.5px solid #E9ECEF;
          border-radius: 10px;
          padding: 6px 12px;
          gap: 8px;
          width: 220px;
        }

        @media (max-width: 768px) {
          .topbar-search-box {
            display: none; /* Hide topbar search on mobile */
          }
        }

        .search-box-icon {
          color: #ADB5BD;
        }

        .topbar-search-input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12px;
          font-weight: 600;
          color: #1A1A2E;
          width: 100%;
        }

        .topbar-action-icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6C757D;
          padding: 6px;
          position: relative;
        }

        .topbar-action-icon-btn:hover {
          color: #1A1A2E;
        }

        .notification-red-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #EF4444;
        }

        .topbar-profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 10px;
        }

        .topbar-profile-trigger:hover {
          background-color: #F8F9FA;
        }

        .topbar-profile-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #F3E8FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #7C3AED;
        }

        .topbar-profile-name {
          font-size: 12.5px;
          font-weight: 750;
          color: #495057;
        }

        @media (max-width: 900px) {
          .topbar-profile-name {
            display: none; /* Hide profile name on smaller screens */
          }
        }

        .topbar-profile-chevron {
          color: #ADB5BD;
        }

        /* Popovers panels */
        .notifications-popover-panel {
          position: absolute;
          right: 0;
          top: 36px;
          background-color: #FFFFFF;
          border: 1px solid #DEE2E6;
          border-radius: 16px;
          width: 320px;
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.08);
          z-index: 600;
          padding: 16px;
        }

        .popover-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #F1F3F5;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .popover-panel-title {
          font-size: 13px;
          font-weight: 800;
          color: #1A1A2E;
        }

        .popover-panel-mark-read {
          font-size: 11px;
          font-weight: 700;
          color: #6025d2;
          cursor: pointer;
        }

        .popover-notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 240px;
          overflow-y: auto;
        }

        .notification-list-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .notification-row-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .notification-row-dot.unread {
          background-color: #6025d2;
        }

        .notification-row-dot.read {
          background-color: #CED4DA;
        }

        .notification-row-text-col {
          flex: 1;
        }

        .notification-row-text {
          font-size: 11.5px;
          color: #495057;
          line-height: 15px;
          font-weight: 600;
        }

        .notification-row-time {
          font-size: 9.5px;
          color: #ADB5BD;
          font-weight: 600;
          margin-top: 2px;
          display: block;
        }

        /* Profile dropdown popover */
        .profile-dropdown-popover {
          position: absolute;
          right: 0;
          top: 36px;
          background-color: #FFFFFF;
          border: 1px solid #DEE2E6;
          border-radius: 16px;
          width: 200px;
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.08);
          z-index: 600;
          padding: 8px;
        }

        .dropdown-popover-header {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F3F5;
          margin-bottom: 6px;
          display: flex;
          flex-direction: column;
        }

        .dropdown-popover-name {
          font-size: 12.5px;
          font-weight: 800;
          color: #1A1A2E;
        }

        .dropdown-popover-email {
          font-size: 10px;
          color: #6C757D;
          font-weight: 600;
          margin-top: 1px;
        }

        .dropdown-popover-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #495057;
          cursor: pointer;
          border-radius: 10px;
          text-align: left;
        }

        .dropdown-popover-row:hover {
          background-color: #F8F9FA;
          color: #1A1A2E;
        }

        .dropdown-popover-row.text-red {
          color: #EF4444;
        }

        .admin-content-canvas {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .close-sidebar-mobile-btn {
            display: block;
          }

          .hamburger-menu-btn {
            display: block;
          }

          .admin-topbar {
            padding: 0 20px;
          }

          .admin-content-canvas {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
