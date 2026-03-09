'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #F0F0F0',
      padding: '16px 0',
      position: 'relative'
    }}>
      <style>{`
        .header-nav-links { display: flex; }
        .header-hamburger { display: none; }
        .header-mobile-menu { display: flex; }
        @media (max-width: 768px) {
          .header-nav-links { display: none !important; }
          .header-hamburger { display: flex !important; }
          .header-mobile-menu { display: flex !important; }
        }
        @media (min-width: 769px) {
          .header-mobile-menu { display: none !important; }
        }
      `}</style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C3E5F 0%, #4a6fa5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '12px',
              height: '16px',
              background: '#FFF4CC',
              borderRadius: '0 100% 100% 0',
              left: '8px'
            }} />
          </div>

          <img
            src="/ichihuyu-icon.jpg"
            alt="イチフユ"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />

          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#2C3E5F',
            fontWeight: '300',
            letterSpacing: '0.1em'
          }}>
            RUNEERA
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* デスクトップ用ナビリンク */}
          <nav className="header-nav-links" style={{ gap: '32px', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <Link
              href="/dashboard"
              style={{
                color: pathname === '/dashboard' ? '#2C3E5F' : '#4A4A4A',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: pathname === '/dashboard' ? '400' : '300',
                letterSpacing: '0.03em',
                transition: 'color 0.3s'
              }}
            >
              マイページ
            </Link>
            <Link
              href="/community"
              style={{
                color: pathname === '/community' ? '#2C3E5F' : '#4A4A4A',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: pathname === '/community' ? '400' : '300',
                letterSpacing: '0.03em',
                transition: 'color 0.3s'
              }}
            >
              コミュニティ
            </Link>
            <Link
              href="/about"
              style={{
                color: pathname === '/about' ? '#2C3E5F' : '#4A4A4A',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: pathname === '/about' ? '400' : '300',
                letterSpacing: '0.03em',
                transition: 'color 0.3s'
              }}
            >
              このサイトについて
            </Link>
          </nav>

          {/* ユーザーアイコン（常時表示） */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C3E5F 0%, #4a6fa5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '300'
          }}>
            I
          </div>

          {/* ハンバーガーメニュー（スマホのみ） */}
          <button
            className="header-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#2C3E5F', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#2C3E5F', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#2C3E5F', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="header-mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderBottom: '1px solid #F0F0F0',
          flexDirection: 'column',
          padding: '16px 20px',
          gap: '4px',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{
            padding: '12px 0',
            color: pathname === '/dashboard' ? '#2C3E5F' : '#4A4A4A',
            textDecoration: 'none',
            fontWeight: pathname === '/dashboard' ? '400' : '300',
            fontSize: '14px',
            borderBottom: '1px solid #F0F0F0'
          }}>
            マイページ
          </Link>
          <Link href="/community" onClick={() => setMenuOpen(false)} style={{
            padding: '12px 0',
            color: pathname === '/community' ? '#2C3E5F' : '#4A4A4A',
            textDecoration: 'none',
            fontWeight: pathname === '/community' ? '400' : '300',
            fontSize: '14px',
            borderBottom: '1px solid #F0F0F0'
          }}>
            コミュニティ
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} style={{
            padding: '12px 0',
            color: pathname === '/about' ? '#2C3E5F' : '#4A4A4A',
            textDecoration: 'none',
            fontWeight: pathname === '/about' ? '400' : '300',
            fontSize: '14px'
          }}>
            このサイトについて
          </Link>
        </div>
      )}
    </header>
  );
}
