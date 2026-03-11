'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF'
    }}>
      <style>{`
        .home-nav-about { display: inline-block; }
        .home-nav-register { display: inline-block; }
        .home-hamburger { display: none; }
        .home-mobile-menu { display: none; }
        @media (max-width: 768px) {
          .home-nav-about { display: none !important; }
          .home-nav-register { display: none !important; }
          .home-hamburger { display: flex !important; }
          .home-mobile-menu { display: flex !important; }
        }
      `}</style>
      {/* ヘッダー */}
      <header style={{
        padding: '20px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#FFFFFF',
        borderBottom: '1px solid #F0F0F0',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* 半月 */}
          <div style={{
            position: 'relative',
            width: '24px',
            height: '24px'
          }}>
            <div style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#FFF4CC',
              boxShadow: 'inset -8px 0 0 0 #2C3E5F'
            }} />
          </div>
          {/* 幸せの鳥 */}
          <div style={{
            fontSize: '20px',
            filter: 'hue-rotate(200deg) brightness(1.2)'
          }}>
            🕊️
          </div>
          <span style={{
            fontSize: '22px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            color: '#2C3E5F',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}>
            RUNEERA
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0, alignItems: 'center' }}>
          <Link href="/about" className="home-nav-about" style={{
            padding: '10px 24px',
            color: '#4A4A4A',
            textDecoration: 'none',
            fontWeight: '300',
            fontSize: '14px',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap'
          }}>
            このサイトについて
          </Link>
          <Link href="/login" style={{
            padding: '10px 24px',
            background: '#FFFFFF',
            color: '#4A4A4A',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: '300',
            border: '1px solid #F0F0F0',
            fontSize: '14px',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap'
          }}>
            ログイン
          </Link>
          <Link href="/register" className="home-nav-register" style={{
            padding: '10px 24px',
            background: '#2C3E5F',
            color: '#FFFFFF',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: '300',
            fontSize: '14px',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap'
          }}>
            無料で始める
          </Link>
          {/* ハンバーガーメニュー（スマホのみ） */}
          <button
            className="home-hamburger"
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
        {/* モバイルメニュー */}
        {menuOpen && (
          <div className="home-mobile-menu" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderBottom: '1px solid #F0F0F0',
            flexDirection: 'column',
            padding: '16px 20px',
            gap: '12px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Link href="/about" onClick={() => setMenuOpen(false)} style={{
              padding: '12px 0',
              color: '#4A4A4A',
              textDecoration: 'none',
              fontWeight: '300',
              fontSize: '14px',
              borderBottom: '1px solid #F0F0F0'
            }}>
              このサイトについて
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} style={{
              padding: '12px 0',
              color: '#2C3E5F',
              textDecoration: 'none',
              fontWeight: '400',
              fontSize: '14px'
            }}>
              無料で始める
            </Link>
          </div>
        )}
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        {/* ヒーローセクション */}
        <section style={{
          textAlign: 'center',
          padding: '80px 20px',
          marginBottom: '80px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            border: '2px solid #2C3E5F'
          }}>
        <img
  src="/ichihuyu-icon.jpg"
  alt="イチフユ"
  style={{
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%'
  }}
/>
                      </div>
          <h1 style={{
            fontSize: '52px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '24px',
            lineHeight: '1.3',
            letterSpacing: '0.1em',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}>
            RUNEERA
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#4A4A4A',
            marginBottom: '16px',
            lineHeight: '1.8',
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}>
            整える・巡らせる・静かに立て直す・再生する
          </p>
          <p style={{
            fontSize: '16px',
            color: '#4A4A4A',
            marginBottom: '48px',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            あなたの変化を見守り、寄り添う場所
          </p>
          <Link href="/register" style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: '#2C3E5F',
            color: '#FFFFFF',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: '300',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'all 0.3s'
          }}>
            無料で始める →
          </Link>
        </section>

        {/* 特徴セクション */}
        <section style={{ marginBottom: '100px' }}>
          <h2 style={{
            fontSize: '32px',
            color: '#2C3E5F',
            fontWeight: '300',
            textAlign: 'center',
            marginBottom: '60px',
            letterSpacing: '0.05em'
          }}>
            RUNEERA ができること
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {/* 特徴1 */}
            <a href="https://taplog-pink.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '40px',
                border: '1px solid #F0F0F0',
                textAlign: 'center',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{
                  fontSize: '40px',
                  marginBottom: '20px'
                }}>📊</div>
                <h3 style={{
                  fontSize: '20px',
                  color: '#2C3E5F',
                  fontWeight: '300',
                  marginBottom: '16px',
                  letterSpacing: '0.05em'
                }}>
                  揺らぎを記録
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#4A4A4A',
                  lineHeight: '1.8',
                  fontWeight: '300'
                }}>
                  242種類の症状から選んで記録。あなただけのデータが蓄積されます。
                </p>
              </div>
            </a>

            {/* 特徴2 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '40px',
              border: '1px solid #F0F0F0',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}>
              <div style={{
                fontSize: '40px',
                marginBottom: '20px'
              }}>📈</div>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '300',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                パターンを発見
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                周期や傾向を可視化。「いつ」「どんな揺らぎ」が出るかが見えてきます。
              </p>
            </div>

            {/* 特徴3 */}
            <Link href="/community" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '40px',
                border: '1px solid #F0F0F0',
                textAlign: 'center',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{
                  fontSize: '40px',
                  marginBottom: '20px'
                }}>💬</div>
                <h3 style={{
                  fontSize: '20px',
                  color: '#2C3E5F',
                  fontWeight: '300',
                  marginBottom: '16px',
                  letterSpacing: '0.05em'
                }}>
                  仲間とつながる
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#4A4A4A',
                  lineHeight: '1.8',
                  fontWeight: '300'
                }}>
                  同じ経験をしている人たちと情報を共有し、励まし合えます。
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* こんな人におすすめ */}
        <section style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '60px',
          marginBottom: '100px',
          border: '1px solid #F0F0F0'
        }}>
          <h2 style={{
            fontSize: '32px',
            color: '#2C3E5F',
            fontWeight: '300',
            textAlign: 'center',
            marginBottom: '48px',
            letterSpacing: '0.05em'
          }}>
            こんな方におすすめです
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              padding: '24px',
              background: '#F0F0F0',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '28px',
                marginBottom: '12px'
              }}>✓</div>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                体調の変化に気づいているけれど、<br />何が起きているのかわからない
              </p>
            </div>
            <div style={{
              padding: '24px',
              background: '#FFF4CC',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '28px',
                marginBottom: '12px'
              }}>✓</div>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                更年期症状のパターンを<br />把握したい
              </p>
            </div>
            <div style={{
              padding: '24px',
              background: '#FFF4CC',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '28px',
                marginBottom: '12px'
              }}>✓</div>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                同じ悩みを持つ人たちと<br />つながりたい
              </p>
            </div>
            <div style={{
              padding: '24px',
              background: '#F0F0F0',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '28px',
                marginBottom: '12px'
              }}>✓</div>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                自分のことをもっと<br />理解したい
              </p>
            </div>
          </div>
        </section>

        {/* 最終CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
          borderRadius: '12px',
          padding: '80px 60px',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '36px',
            color: '#FFFFFF',
            fontWeight: '300',
            marginBottom: '24px',
            letterSpacing: '0.05em'
          }}>
            一緒に、軽やかに生きましょう
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#FFFFFF',
            marginBottom: '40px',
            opacity: 0.95,
            fontWeight: '300'
          }}>
            あなたの変化を記録することから、始めませんか?
          </p>
          <Link href="/register" style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: '#FFFFFF',
            color: '#2C3E5F',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: '300',
            textDecoration: 'none',
            letterSpacing: '0.05em'
          }}>
            今すぐ無料で始める
          </Link>
        </section>
      </div>

      {/* フッター */}
      <footer style={{
        background: '#F0F0F0',
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid #E8EAF0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '300',
            color: '#2C3E5F',
            marginBottom: '16px',
            letterSpacing: '0.1em',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}>
            🌙 🕊️ RUNEERA
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginBottom: '24px'
          }}>
            <Link href="/about" style={{
              color: '#4A4A4A',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '300'
            }}>
              このサイトについて
            </Link>
            <Link href="/terms" style={{
              color: '#4A4A4A',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '300'
            }}>
              利用規約
            </Link>
            <Link href="/privacy" style={{
              color: '#4A4A4A',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '300'
            }}>
              プライバシーポリシー
            </Link>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#999',
            fontWeight: '300'
          }}>
            © 2025 RUNEERA All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}