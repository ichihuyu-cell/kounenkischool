'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #F0F0F0',
      padding: '16px 0'
    }}>
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

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
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
        </nav>
      </div>
    </header>
  );
}