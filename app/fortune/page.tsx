'use client';

import Link from 'next/link';
import Header from '../components/Header';

export default function FortuneIndexPage() {
  // 今日の月相
  const getMoonPhase = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const age = ((year - 2000) * 12.3685 + (month - 1) * 1 + day * 0.0295) % 29.53;
    
    if (age < 1.84566) return { phase: '新月', icon: '🌑' };
    if (age < 5.53699) return { phase: '三日月', icon: '🌒' };
    if (age < 9.22831) return { phase: '上弦の月', icon: '🌓' };
    if (age < 12.91963) return { phase: '十三夜月', icon: '🌔' };
    if (age < 16.61096) return { phase: '満月', icon: '🌕' };
    if (age < 20.30228) return { phase: '寝待月', icon: '🌖' };
    if (age < 23.99361) return { phase: '下弦の月', icon: '🌗' };
    if (age < 27.68493) return { phase: '有明月', icon: '🌘' };
    return { phase: '新月前夜', icon: '🌑' };
  };

  const moonPhase = getMoonPhase();

  const fortuneMenus = [
    {
      title: '今日の運勢',
      description: '月と星があなたに伝える、今日の導き',
      icon: '✨',
      link: '/fortune/daily',
      gradient: 'linear-gradient(135deg, #FFF4CC 0%, #ffe9a3 100%)',
      featured: true
    },
    {
      title: '月のカレンダー',
      description: '月の満ち欠けと、あなたのリズム',
      icon: '🌙',
      link: '/fortune/moon-calendar',
      gradient: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)'
    },
    {
      title: '高島暦',
      description: '古からの知恵が示す、吉日と凶日',
      icon: '📖',
      link: '/fortune/takashima',
      gradient: 'linear-gradient(135deg, #F0F0F0 0%, #E8EAF0 100%)'
    },
    {
      title: 'パーソナルレポート',
      description: 'あなただけの詳細な運勢分析',
      icon: '📊',
      link: '/fortune/personal',
      gradient: 'linear-gradient(135deg, #E6D8F0 0%, #D8C8E0 100%)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF'
    }}>
      <Header />

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px 60px'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            border: '2px solid #FFF4CC'
          }}>
            {moonPhase.icon}
          </div>
          <h1 style={{
            fontSize: '36px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '12px',
            letterSpacing: '0.1em'
          }}>
            月と星の導き
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4A4A4A',
            fontWeight: '300',
            marginBottom: '8px'
          }}>
            プレミアム会員専用
          </p>
          <p style={{
            fontSize: '14px',
            color: '#4A4A4A',
            fontWeight: '300'
          }}>
            今日の月：{moonPhase.phase} {moonPhase.icon}
          </p>
        </div>

        {/* プレミアムバッジ */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF4CC 0%, #FFE5A0 100%)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '48px',
          border: '2px solid #2C3E5F',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👑</div>
          <p style={{
            fontSize: '15px',
            color: '#2C3E5F',
            fontWeight: '300',
            lineHeight: '1.8'
          }}>
            月明かりに照らされた、あなただけの特別な占いの世界へようこそ。<br />
            生年月日、血液型、月の満ち欠け、高島暦が織りなす、精緻な運勢をお届けします。
          </p>
        </div>

        {/* メニュー */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {fortuneMenus.map((menu, index) => (
            <Link
              key={index}
              href={menu.link}
              style={{
                background: menu.gradient,
                borderRadius: '16px',
                padding: menu.featured ? '48px 40px' : '40px',
                textDecoration: 'none',
                border: menu.featured ? '2px solid #2C3E5F' : '1px solid rgba(44, 62, 95, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                gridColumn: menu.featured ? 'span 2' : 'span 1',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(44, 62, 95, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {menu.featured && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 16px',
                  background: '#2C3E5F',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '300',
                  letterSpacing: '0.05em'
                }}>
                  おすすめ
                </div>
              )}
              <div style={{
                fontSize: menu.featured ? '56px' : '48px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {menu.icon}
              </div>
              <h3 style={{
                fontSize: menu.featured ? '24px' : '20px',
                color: menu.link.includes('moon-calendar') ? '#FFFFFF' : '#2C3E5F',
                fontWeight: '400',
                marginBottom: '12px',
                textAlign: 'center',
                letterSpacing: '0.05em'
              }}>
                {menu.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: menu.link.includes('moon-calendar') ? 'rgba(255, 255, 255, 0.9)' : '#4A4A4A',
                fontWeight: '300',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                {menu.description}
              </p>
            </Link>
          ))}
        </div>

        {/* 案内 */}
        <div style={{
          background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid #E8EAF0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌙</div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '300',
            color: '#2C3E5F',
            marginBottom: '16px',
            letterSpacing: '0.05em'
          }}>
            月明かりのように、静かに寄り添う
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#4A4A4A',
            lineHeight: '1.8',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            占いは未来を決めるものではなく、あなた自身を知るためのツールです。<br />
            月の満ち欠けのように、変化するあなたの心と体のリズムを、<br />
            優しく照らす灯りとなりますように。
          </p>
        </div>
      </div>
    </div>
  );
}