import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ChevronDown, Sun, Moon, Globe, Settings, Menu, X, Sparkles, LayoutTemplate, Layers } from 'lucide-react';
import { useNavigation } from './router/NavigationContext';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import './styles.css';

export default function SiteHeader() {
  const { currentPath, navigate } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isHome = currentPath === '/';
  const isPricing = currentPath === '/pricing' || currentPath === '/services/website-rental';
  const isService = currentPath === '/services/website-design';

  const homeLink = isHome ? '#home' : '/';
  const workLink = isHome ? '#work' : '/#work';
  const aboutLink = isHome ? '#start' : '/#start';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change or Escape
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`site-nav ${isDark ? 'is-dark' : ''}`} data-ready="true">
      <div className="nav-shell">
        <a
          className="brand-mark"
          href={homeLink}
          aria-label={t.nav?.brand || 'LOOPS'}
          onClick={(e) => {
            e.preventDefault();
            navigate(homeLink);
          }}
        >
          LOOPS
        </a>

        <nav aria-label={t.nav?.brand || 'Main Navigation'}>
          <a
            href={homeLink}
            className={isHome ? 'is-active' : ''}
            onClick={(e) => {
              e.preventDefault();
              navigate(homeLink);
            }}
          >
            {t.nav?.home || 'Trang chủ'}
          </a>

          <a
            href={workLink}
            onClick={(e) => {
              e.preventDefault();
              navigate(workLink);
            }}
          >
            {t.nav?.works || 'Dự án'}
          </a>

          <div className="nav-services-menu-wrap" ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`nav-services-toggle ${isService ? 'is-active' : ''}`}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'inherit',
                fontWeight: 750,
                fontSize: '13px',
                padding: '0',
              }}
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
            >
              {t.nav?.services || 'Dịch vụ'}
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 200ms ease',
                  transform: servicesOpen ? 'rotate(180deg)' : 'none',
                  opacity: 0.7,
                }}
              />
            </button>

            {servicesOpen && (
              <div
                className="nav-services-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 18px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px',
                  borderRadius: '12px',
                  padding: '10px',
                  background: isDark ? 'rgba(20, 22, 28, 0.98)' : 'rgba(244, 243, 238, 0.98)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(16, 17, 19, 0.12)',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
                  backdropFilter: 'blur(24px)',
                  zIndex: 200,
                  display: 'grid',
                  gap: '6px',
                }}
              >
                <a
                  href="/services/website-design/"
                  onClick={(e) => {
                    e.preventDefault();
                    setServicesOpen(false);
                    navigate('/services/website-design/');
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    gap: '4px 10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 160ms ease',
                  }}
                >
                  <span style={{ color: 'var(--blue)', fontSize: '10px', fontWeight: 900 }}>01</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', lineHeight: 1.3 }}>
                      {t.nav?.customDesign || 'Thiết kế website doanh nghiệp'}
                    </strong>
                    <small style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {language === 'vi' ? 'Theo yêu cầu & Custom UI/UX' : 'Bespoke UI/UX & Web App'}
                    </small>
                  </div>
                </a>

                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    setServicesOpen(false);
                    navigate('/pricing');
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    gap: '4px 10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 160ms ease',
                  }}
                >
                  <span style={{ color: 'var(--gold, #dfa85b)', fontSize: '10px', fontWeight: 900 }}>02</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', lineHeight: 1.3 }}>
                      {t.nav?.rental || 'Bảng giá thuê Web'}
                    </strong>
                    <small style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {language === 'vi' ? 'Từ 189.000đ/tháng · 4 gói linh hoạt' : 'From 189,000₫/mo · 4 Flexible Plans'}
                    </small>
                  </div>
                </a>
              </div>
            )}
          </div>

          <a
            href="/pricing"
            className={isPricing ? 'is-active' : ''}
            style={isPricing ? { color: '#dfa85b', fontWeight: 800 } : {}}
            onClick={(e) => {
              e.preventDefault();
              navigate('/pricing');
            }}
          >
            {t.nav?.pricing || 'Bảng giá'}
          </a>

          <a
            href={aboutLink}
            onClick={(e) => {
              e.preventDefault();
              navigate(aboutLink);
            }}
          >
            {t.nav?.about || 'Giới thiệu'}
          </a>
        </nav>

        <div className="nav-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifySelf: 'end' }}>
          {/* Language Switcher Pill: VI | EN */}
          <div
            className="lang-switcher-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 17, 19, 0.05)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(16, 17, 19, 0.14)',
              borderRadius: '20px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setLanguage('vi')}
              aria-label="Tiếng Việt"
              style={{
                padding: '4px 8px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: language === 'vi' ? (isDark ? '#dfa85b' : '#101113') : 'transparent',
                color: language === 'vi' ? (isDark ? '#101113' : '#ffffff') : (isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(16, 17, 19, 0.65)'),
                fontWeight: 800,
                fontSize: '11px',
                transition: 'all 160ms ease',
              }}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-label="English"
              style={{
                padding: '4px 8px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: language === 'en' ? (isDark ? '#dfa85b' : '#101113') : 'transparent',
                color: language === 'en' ? (isDark ? '#101113' : '#ffffff') : (isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(16, 17, 19, 0.65)'),
                fontWeight: 800,
                fontSize: '11px',
                transition: 'all 160ms ease',
              }}
            >
              EN
            </button>
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? (language === 'vi' ? 'Chuyển sang chế độ Sáng' : 'Switch to Light Mode') : (language === 'vi' ? 'Chuyển sang chế độ Tối' : 'Switch to Dark Mode')}
            aria-label={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(16, 17, 19, 0.14)',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 17, 19, 0.05)',
              color: isDark ? '#dfa85b' : '#101113',
              transition: 'all 200ms ease',
              padding: 0,
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Admin CMS Button (Desktop) */}
          <a
            href="/admin"
            className="nav-admin-link desktop-only"
            title="Trang quản trị CMS Landing Page"
            aria-label="CMS Admin"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(16, 17, 19, 0.14)',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 17, 19, 0.05)',
              color: isDark ? '#93c5fd' : '#2563eb',
              transition: 'all 200ms ease',
              padding: 0,
              textDecoration: 'none',
            }}
          >
            <Settings size={16} />
          </a>

          {/* Desktop Nav CTA */}
          <a
            className={`button ${isDark ? 'button-light' : 'button-dark'} nav-cta desktop-only`}
            href={t.nav?.startProjectLink || 'https://www.loops.vn/bao-gia'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.nav?.startProject || 'Bắt đầu dự án'} <ArrowUpRight size={16} />
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Navigation Drawer Modal - Liquid Glass 4.0 */}
    {mobileMenuOpen && (
        <>
          <div
            className="mobile-nav-drawer-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng Liquid Glass"
          >
            {/* Prismatic Liquid Ambient Orbs behind the frosted glass */}
            <div className="liquid-glass-ambient-orb liquid-orb-1" aria-hidden="true" />
            <div className="liquid-glass-ambient-orb liquid-orb-2" aria-hidden="true" />
            <div className="liquid-glass-ambient-orb liquid-orb-3" aria-hidden="true" />

            {/* Top Bar with Live Fluid Status Badge */}
            <div className="mobile-nav-top-row">
              <div className="liquid-glass-badge">
                <span className="liquid-pulse-dot" />
                <span>LOOPS FLUID OS 4.0</span>
              </div>
              <button
                type="button"
                className="mobile-nav-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng menu"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="mobile-nav-list">
              <a
                href={homeLink}
                className={`mobile-nav-item ${isHome ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(homeLink);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mobile-item-bullet" />
                  <span>{t.nav?.home || 'Trang chủ'}</span>
                </div>
                <span className="mobile-nav-tag">Home</span>
              </a>

              <a
                href={workLink}
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(workLink);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mobile-item-bullet" />
                  <span>{t.nav?.works || 'Dự án tiêu biểu'}</span>
                </div>
                <span className="mobile-nav-tag">Work</span>
              </a>

              {/* Service Submenu in Mobile - Liquid Glass Card */}
              <div className="mobile-nav-services-card">
                <span className="mobile-services-badge">
                  <Sparkles size={13} /> {t.nav?.services || 'Dịch vụ chủ lực'}
                </span>

                <a
                  href="/services/website-design/"
                  className={`mobile-service-subitem ${isService ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate('/services/website-design/');
                  }}
                >
                  <div className="mobile-service-subitem-icon service-icon-blue">
                    01
                  </div>
                  <div>
                    <strong>{t.nav?.customDesign || 'Thiết kế website doanh nghiệp'}</strong>
                    <small>{language === 'vi' ? 'May đo UI/UX & Công nghệ cao' : 'Bespoke UI/UX & Web App'}</small>
                  </div>
                </a>

                <a
                  href="/pricing"
                  className={`mobile-service-subitem ${isPricing ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate('/pricing');
                  }}
                >
                  <div className="mobile-service-subitem-icon service-icon-gold">
                    02
                  </div>
                  <div>
                    <strong>{t.nav?.rental || 'Bảng giá thuê Web linh hoạt'}</strong>
                    <small>{language === 'vi' ? 'Từ 189.000đ/tháng · 4 gói dịch vụ' : 'From 189,000₫/mo · 4 Plans'}</small>
                  </div>
                </a>
              </div>

              <a
                href="/pricing"
                className={`mobile-nav-item ${isPricing ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate('/pricing');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mobile-item-bullet" />
                  <span>{t.nav?.pricing || 'Bảng giá chi tiết'}</span>
                </div>
                <span className="mobile-nav-tag">Pricing</span>
              </a>

              <a
                href={aboutLink}
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(aboutLink);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mobile-item-bullet" />
                  <span>{t.nav?.about || 'Giới thiệu về LOOPS'}</span>
                </div>
                <span className="mobile-nav-tag">About</span>
              </a>

              <a
                href="/admin"
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
                  <Settings size={16} />
                  <span>Quản trị CMS Landing Page</span>
                </div>
                <span className="mobile-nav-tag" style={{ background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>Admin</span>
              </a>
            </nav>

            {/* Liquid Metallic Primary CTA */}
            <a
              className="mobile-drawer-cta"
              href={t.nav?.startProjectLink || 'https://www.loops.vn/bao-gia'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{t.nav?.startProject || 'Bắt đầu dự án ngay'}</span>
              <ArrowUpRight size={17} />
            </a>

            {/* Quick Control Liquid Glass Dock */}
            <div className="mobile-nav-glass-dock">
              <div className="dock-lang-pills">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`dock-pill ${language === 'vi' ? 'is-active' : ''}`}
                >
                  🇻🇳 VI
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`dock-pill ${language === 'en' ? 'is-active' : ''}`}
                >
                  🇬🇧 EN
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="dock-theme-toggle"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                <span>{isDark ? 'Sáng' : 'Tối'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
