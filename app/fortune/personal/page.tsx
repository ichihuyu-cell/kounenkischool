'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import { flowerMoonTypes, getTypeFromBirthData, FlowerMoonType } from '../../../lib/flowerMoonTypes';

export default function PersonalReportPage() {
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [userType, setUserType] = useState<FlowerMoonType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const type = getTypeFromBirthData(birthDate, bloodType);
    setUserType(type);
    setShowReport(true);
  };

  const typeData = userType ? flowerMoonTypes[userType] : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF'
    }}>
      <Header />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px 60px'
      }}>
        {/* タイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <Link href="/fortune" style={{
            display: 'inline-block',
            fontSize: '13px',
            color: '#4A4A4A',
            textDecoration: 'none',
            marginBottom: '16px',
            fontWeight: '300'
          }}>
            ← 占いトップへ戻る
          </Link>
          <h1 style={{
            fontSize: '32px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '12px',
            letterSpacing: '0.05em'
          }}>
            今日の占い 📊
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#4A4A4A',
            fontWeight: '300'
          }}>
            あなただけの花を見つける
          </p>
        </div>

        {!showReport ? (
          /* 入力フォーム */
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px',
            border: '1px solid #F0F0F0'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E6D8F0 0%, #D8C8E0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                border: '2px solid #2C3E5F'
              }}>
                🌙
              </div>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '300',
                marginBottom: '12px',
                letterSpacing: '0.05em'
              }}>
                あなたについて教えてください
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#4A4A4A',
                fontWeight: '300',
                lineHeight: '1.6'
              }}>
                生年月日と血液型から、<br />
                あなただけの「花と月の名前」を見つけます
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#4A4A4A',
                  marginBottom: '8px',
                  fontWeight: '300',
                  letterSpacing: '0.03em'
                }}>
                  生年月日 *
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#4A4A4A',
                  marginBottom: '12px',
                  fontWeight: '300',
                  letterSpacing: '0.03em'
                }}>
                  血液型 *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px'
                }}>
                  {['A', 'B', 'O', 'AB'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBloodType(type)}
                      style={{
                        padding: '12px',
                        background: bloodType === type ? '#2C3E5F' : '#FFFFFF',
                        color: bloodType === type ? '#FFFFFF' : '#4A4A4A',
                        border: `1px solid ${bloodType === type ? '#2C3E5F' : '#F0F0F0'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '300',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {type}型
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#2C3E5F',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: '300',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s'
                }}
              >
                あなたの花を見つける
              </button>
            </form>
          </div>
        ) : typeData ? (
          /* レポート表示 */
          <div>
            {/* ヘッダー */}
            <div style={{
              background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '32px',
              color: '#FFFFFF'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>
                {<Image src={typeData.icon} alt={typeData.name} width={80} height={80} style={{marginBottom: '12px'}}/>}
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '300',
                marginBottom: '8px',
                letterSpacing: '0.05em'
              }}>
                {typeData.name}
              </h2>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                fontWeight: '300',
                marginBottom: '4px'
              }}>
                {typeData.keyword}
              </p>
              <p style={{
                fontSize: '13px',
                opacity: 0.8,
                fontWeight: '300'
              }}>
                {typeData.moonPhase} × {typeData.bloodType}
              </p>
            </div>

            {/* 花のメッセージ */}
            {typeData.flowerInfo && (
              <div style={{
                background: 'linear-gradient(135deg, #faf6f0 0%, #f5ede3 100%)',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e8ddd0',
                marginBottom: '24px',
              }}>
                <h3 style={{
                  fontSize: '20px',
                  color: '#2C3E5F',
                  fontWeight: '400',
                  marginBottom: '20px',
                  letterSpacing: '0.05em'
                }}>
                  {typeData.flower}からのメッセージ
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#4A4A4A',
                  lineHeight: '2.0',
                  fontWeight: '300',
                  marginBottom: '24px',
                  fontStyle: 'italic',
                }}>
                  {typeData.flowerInfo.advice}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <span style={{ fontSize: '14px', color: '#2C3E5F', fontWeight: '400', letterSpacing: '0.03em' }}>
                    花言葉
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#7a6853',
                    fontWeight: '300',
                  }}>
                    ── {typeData.flowerInfo.hanakotoba}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '8px',
                    border: '1px solid #e8ddd0',
                  }}>
                    <div style={{ fontSize: '11px', color: '#9a8a78', fontWeight: '300', marginBottom: '4px', letterSpacing: '0.05em' }}>季節</div>
                    <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>{typeData.flowerInfo.season}</div>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '8px',
                    border: '1px solid #e8ddd0',
                  }}>
                    <div style={{ fontSize: '11px', color: '#9a8a78', fontWeight: '300', marginBottom: '4px', letterSpacing: '0.05em' }}>色</div>
                    <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>{typeData.flowerInfo.color}</div>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '8px',
                    border: '1px solid #e8ddd0',
                  }}>
                    <div style={{ fontSize: '11px', color: '#9a8a78', fontWeight: '300', marginBottom: '4px', letterSpacing: '0.05em' }}>香り</div>
                    <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>{typeData.flowerInfo.scent}</div>
                  </div>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: '#7a6853',
                  lineHeight: '1.8',
                  fontWeight: '300',
                  marginTop: '16px',
                }}>
                  {typeData.flowerInfo.traits}
                </p>
              </div>
            )}

            {/* あなたの本質 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #F0F0F0',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                🌙 あなたの本質
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.core}
              </p>
            </div>

            {/* 恋愛傾向 */}
            <div style={{
              background: '#FFF4CC',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #FFF4CC',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                💕 恋愛傾向
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.love}
              </p>
            </div>

            {/* 仕事・才能 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #F0F0F0',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                💼 仕事・才能
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.work}
              </p>
            </div>

            {/* 健康運 */}
            <div style={{
              background: '#F0F0F0',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                🌿 健康運
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.health}
              </p>
            </div>

            {/* 人間関係 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #F0F0F0',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                👥 人間関係
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.relationship}
              </p>
            </div>

            {/* 開運のヒント */}
            <div style={{
              background: 'linear-gradient(135deg, #E6D8F0 0%, #D8C8E0 100%)',
              borderRadius: '12px',
              padding: '32px',
              border: '2px solid #2C3E5F',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                ✨ 開運のヒント
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#2C3E5F',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                {typeData.personality.luckyTip}
              </p>
            </div>

            {/* 相性の良いタイプ */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #F0F0F0',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                💫 相性の良いタイプ
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {typeData.personality.compatibility.map((type, idx) => (
                  <div key={idx} style={{
                    padding: '12px 20px',
                    background: '#F0F0F0',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: '#2C3E5F',
                    fontWeight: '300',
                    textAlign: 'center'
                  }}>
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowReport(false)}
                style={{
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#2C3E5F',
                  border: '1px solid #2C3E5F',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '300',
                  cursor: 'pointer',
                  letterSpacing: '0.05em'
                }}
              >
                もう一度見る
              </button>
              <Link
                href="/fortune"
                style={{
                  padding: '12px 32px',
                  background: '#2C3E5F',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '300',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  display: 'inline-block'
                }}
              >
                占いトップへ
              </Link>
            </div>
          </div>
        ) : null}

        {/* メッセージ */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          padding: '32px',
          background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
          borderRadius: '12px',
          border: '1px solid #E8EAF0'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#4A4A4A',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            あなたは唯一無二の存在です。<br />
            月明かりのように、自分らしく輝いてください 🌙
          </p>
        </div>
      </div>
    </div>
  );
}