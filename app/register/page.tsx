'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { generateAvatar } from '../lib/generateAvatar';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // アバター自動生成・Firestoreに保存
      const avatarSvg = generateAvatar();
      const userData: Record<string, string> = { avatarSvg };
      if (birthYear) userData.birthYear = birthYear;
      await setDoc(doc(db, 'users', userCredential.user.uid), userData, { merge: true });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Register error:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています。');
      } else if (err.code === 'auth/weak-password') {
        setError('パスワードは6文字以上である必要があります。');
      } else {
        setError('登録に失敗しました。もう一度お試しください。');
      }
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
              新規登録
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#4A4A4A',
              fontWeight: '300'
            }}>
              ようこそ、RUNEERAへ
            </p>
          </div>

          <form onSubmit={handleRegister} style={{
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#4A4A4A',
                marginBottom: '8px',
                fontWeight: '300',
                letterSpacing: '0.03em'
              }}>
                お名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div style={{ marginBottom: '20px' }}>
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
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#4A4A4A',
                marginBottom: '8px',
                fontWeight: '300',
                letterSpacing: '0.03em'
              }}>
                パスワード（6文字以上）
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 16px',
                    border: '1px solid #F0F0F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '300',
                    color: '#4A4A4A',
                    outline: 'none'
                  }}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#4A4A4A',
                marginBottom: '8px',
                fontWeight: '300',
                letterSpacing: '0.03em'
              }}>
                生まれ年（任意）
              </label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="例: 1975"
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

            <div style={{
              marginBottom: '32px',
              padding: '16px',
              background: '#FAFAFA',
              borderRadius: '8px',
              border: '1px solid #F0F0F0'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300',
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{
                    marginTop: '4px',
                    accentColor: '#2C3E5F',
                    flexShrink: 0,
                  }}
                />
                <span>
                  当アプリは医療機関の診断に代わるものではありません。AIのアドバイスは一般的なライフハックの提案です。自分を知るためのツールとして活用することに同意します。
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreed}
              style={{
                width: '100%',
                padding: '14px',
                background: (loading || !agreed) ? '#999' : '#2C3E5F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: '300',
                cursor: (loading || !agreed) ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#4A4A4A',
              fontWeight: '300'
            }}>
              既にアカウントをお持ちの方は{' '}
              <Link href="/login" style={{
                color: '#2C3E5F',
                textDecoration: 'none',
                fontWeight: '400'
              }}>
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}