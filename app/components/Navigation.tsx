'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { emoji: '🏠', label: 'ホーム', href: '/', external: false },
  { emoji: '👤', label: 'マイページ', href: '/dashboard', external: false },
  { emoji: '📝', label: '記録', href: 'https://taplog-pink.vercel.app', external: true },
  { emoji: '🌙', label: '占い', href: '/fortune', external: false },
  { emoji: '🌿', label: '広場', href: '/community', external: false },
  { emoji: '📅', label: '高島暦', href: '/fortune/takashima', external: false },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        /* スマホ：下部固定タブバー */
        .nav-bottom-tab {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #FFFFFF;
          border-top: 1px solid #E8EAF0;
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
          justify-content: space-around;
          align-items: center;
          padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
        }
        .nav-sidebar {
          display: none;
        }
        .nav-main-content-spacer-bottom {
          display: block;
          height: 72px;
        }
        .nav-main-content-spacer-left {
          display: none;
        }

        /* PC：左側固定サイドバー */
        @media (min-width: 769px) {
          .nav-bottom-tab {
            display: none;
          }
          .nav-sidebar {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 200px;
            z-index: 1000;
            background: #FFFFFF;
            border-right: 1px solid #E8EAF0;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
            flex-direction: column;
            padding: 24px 0;
          }
          .nav-main-content-spacer-bottom {
            display: none;
          }
          .nav-main-content-spacer-left {
            display: block;
            min-width: 200px;
            flex-shrink: 0;
          }
        }
      `}</style>

      {/* スマホ：下部タブバー */}
      <nav className="nav-bottom-tab">
        {navItems.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                padding: '4px 0',
                flex: 1,
                color: '#4A4A4A',
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: '300',
                letterSpacing: '0.02em',
              }}>
                {item.label}
              </span>
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                padding: '4px 0',
                flex: 1,
                color: isActive(item.href) ? '#2C3E5F' : '#4A4A4A',
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive(item.href) ? '500' : '300',
                letterSpacing: '0.02em',
              }}>
                {item.label}
              </span>
              {isActive(item.href) && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  width: '24px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #2C3E5F, #4a6fa5)',
                  borderRadius: '0 0 2px 2px',
                }} />
              )}
            </Link>
          )
        )}
      </nav>

      {/* PC：サイドバー */}
      <nav className="nav-sidebar">
        <div style={{
          padding: '0 20px 24px',
          borderBottom: '1px solid #F0F0F0',
          marginBottom: '16px',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/ichihuyu-icon.jpg"
              alt="イチフユ"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: '#2C3E5F',
              fontWeight: '300',
              letterSpacing: '0.1em',
            }}>
              RUNEERA
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: '#4A4A4A',
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.03em',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.emoji}</span>
                <span>{item.label}</span>
                <span style={{ fontSize: '11px', marginLeft: 'auto', opacity: 0.4 }}>↗</span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: isActive(item.href) ? '#2C3E5F' : '#4A4A4A',
                  fontSize: '14px',
                  fontWeight: isActive(item.href) ? '400' : '300',
                  letterSpacing: '0.03em',
                  background: isActive(item.href) ? 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)' : 'transparent',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* スペーサー（コンテンツがナビゲーションに隠れないようにする） */}
      <div className="nav-main-content-spacer-bottom" />
    </>
  );
}
