'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ヘッダー */}
      <header style={{
        padding: '20px 40px',
        borderBottom: '1px solid #F0F0F0'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
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
        </Link>
      </header>

      {/* メインコンテンツ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* アイコン */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              border: '2px solid #2C3E5F'
            }}>
              🕊️
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '300',
              color: '#2C3E5F',
              marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              ログイン
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#4A4A4A',
              fontWeight: '300'
            }}>
              おかえりなさい
            </p>
          </div>

          {/* フォーム */}
          <form onSubmit={handleLogin} style={{
            background: '#FFFFFF',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #F0F0F0'
          }}>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FFF0F0',
                border: '1px solid #FFE0E0',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                color: '#D32F2F',
                fontWeight: '300'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#4A4A4A',
                marginBottom: '8px',
                fontWeight: '300',
                letterSpacing: '0.03em'
              }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #F0F0F0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '300',
                  color: '#4A4A4A',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #2C3E5F'}
                onBlur={(e) => e.target.style.border = '1px solid #F0F0F0'}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#4A4A4A',
                marginBottom: '8px',
                fontWeight: '300',
                letterSpacing: '0.03em'
              }}>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #F0F0F0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '300',
                  color: '#4A4A4A',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #2C3E5F'}
                onBlur={(e) => e.target.style.border = '1px solid #F0F0F0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#999' : '#2C3E5F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: '300',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
                letterSpacing: '0.05em'
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* リンク */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#4A4A4A',
              fontWeight: '300'
            }}>
              アカウントをお持ちでない方は{' '}
              <Link href="/register" style={{
                color: '#2C3E5F',
                textDecoration: 'none',
                fontWeight: '400'
              }}>
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}