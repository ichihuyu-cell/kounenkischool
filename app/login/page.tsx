'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const SAVED_EMAIL_KEY = 'runeera_saved_email';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) setEmail(saved);
  }, []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!resetEmail.trim()) {
      setResetError('メールアドレスを入力してください。');
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('パスワードリセットメールを送信しました。メールをご確認ください。');
    } catch (err: any) {
      console.error('Password reset error:', err.code, err.message);
      switch (err.code) {
        case 'auth/user-not-found':
          // Email Enumeration Protection有効時はこのエラーは発生しない
          setResetError('このメールアドレスのアカウントは見つかりませんでした。');
          break;
        case 'auth/invalid-email':
          setResetError('メールアドレスの形式が正しくありません。');
          break;
        case 'auth/too-many-requests':
          setResetError('リクエストが多すぎます。しばらく時間をおいてから再度お試しください。');
          break;
        case 'auth/network-request-failed':
          setResetError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
          break;
        case 'auth/missing-email':
          setResetError('メールアドレスを入力してください。');
          break;
        default:
          setResetError(`メールの送信に失敗しました（${err.code || '不明なエラー'}）。もう一度お試しください。`);
          break;
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(SAVED_EMAIL_KEY, email);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err.code, err.message);
      console.log('Login error detail:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
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
                autoComplete="email"
                name="email"
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

            <div style={{ marginBottom: '16px' }}>
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  name="password"
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 16px',
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '32px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => { setShowReset(true); setResetEmail(email); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2C3E5F',
                  fontSize: '13px',
                  fontWeight: '300',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                パスワードをお忘れですか？
              </button>
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

      {/* パスワードリセットモーダル */}
      {showReset && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#2C3E5F',
              marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              パスワードリセット
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#4A4A4A',
              fontWeight: '300',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              登録済みのメールアドレスを入力してください。パスワードリセット用のメールをお送りします。
            </p>

            {resetMessage && (
              <div style={{
                padding: '12px',
                background: '#F0FFF0',
                border: '1px solid #C8E6C9',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#2E7D32',
                fontWeight: '300'
              }}>
                {resetMessage}
              </div>
            )}

            {resetError && (
              <div style={{
                padding: '12px',
                background: '#FFF0F0',
                border: '1px solid #FFE0E0',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#D32F2F',
                fontWeight: '300'
              }}>
                {resetError}
              </div>
            )}

            {!resetMessage ? (
              <form onSubmit={handlePasswordReset}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    color: '#4A4A4A',
                    marginBottom: '8px',
                    fontWeight: '300'
                  }}>
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #F0F0F0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '300',
                      color: '#4A4A4A',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setShowReset(false); setResetMessage(''); setResetError(''); }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#FFFFFF',
                      color: '#4A4A4A',
                      border: '1px solid #F0F0F0',
                      borderRadius: '24px',
                      fontSize: '14px',
                      fontWeight: '300',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: resetLoading ? '#999' : '#2C3E5F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '24px',
                      fontSize: '14px',
                      fontWeight: '300',
                      cursor: resetLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {resetLoading ? '送信中...' : '送信する'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => { setShowReset(false); setResetMessage(''); setResetError(''); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2C3E5F',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '300',
                  cursor: 'pointer'
                }}
              >
                閉じる
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}