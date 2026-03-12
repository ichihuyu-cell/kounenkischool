'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';

export default function DashboardPage() {
  const [userName] = useState('イチフユ');
  
  // 今日の運勢データ（サンプル）
  const todayLucky = {
    color: '月白',
    colorCode: '#F0F0F0',
    isMoneyDay: true, // 金運が良い日
    isLuckyDay: false, // スーパーラッキーデー
    message: '今日は金運に恵まれる日。大切なものを見つめ直すと良いでしょう。'
  };
  
  const recentSymptoms = [
    { date: '2月26日', symptoms: ['疲労感', 'ほてり', '肩こり'], count: 3 },
    { date: '2月25日', symptoms: ['頭痛', '不眠'], count: 2 },
    { date: '2月24日', symptoms: ['疲労感', 'イライラ'], count: 2 },
    { date: '2月23日', symptoms: ['ほてり'], count: 1 },
    { date: '2月22日', symptoms: ['肩こり', '疲労感', '頭痛'], count: 3 }
  ];

  const topSymptoms = [
    { name: '疲労感', count: 15, percentage: 75 },
    { name: 'ほてり', count: 12, percentage: 60 },
    { name: '肩こり', count: 10, percentage: 50 },
    { name: '頭痛', count: 8, percentage: 40 },
    { name: '不眠', count: 6, percentage: 30 }
  ];

  const stats = {
    totalDays: 45,
    recordedDays: 38,
    totalSymptoms: 156,
    communityPosts: 3
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF'
    }}>
      <Header />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px 60px'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>
            おかえりなさい、{userName}さん
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#4A4A4A',
            fontWeight: '300'
          }}>
            今日の調子はいかがですか？
          </p>
        </div>

        {/* ラッキー通知 - スーパーラッキーデー */}
        {todayLucky.isLuckyDay && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF4CC 0%, #FFE5A0 50%, #FFF4CC 100%)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '3px solid #2C3E5F',
            boxShadow: '0 8px 24px rgba(255, 244, 204, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '80px',
              opacity: 0.2
            }}>🌟</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div style={{
                fontSize: '64px',
                animation: 'pulse 1.5s infinite'
              }}>
                ✨🌙✨
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '28px',
                  color: '#2C3E5F',
                  fontWeight: '400',
                  marginBottom: '12px',
                  letterSpacing: '0.1em'
                }}>
                  🎉 スペシャルラッキーデー！
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#2C3E5F',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}>
                  {todayLucky.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* このサイトについて */}
        {todayLucky.isMoneyDay && !todayLucky.isLuckyDay && (
          <Link href="/about" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            background: 'linear-gradient(135deg, #FFF4CC 0%, #ffe9a3 100%)',
            borderRadius: '12px',
            padding: '28px 32px',
            marginBottom: '32px',
            border: '1px solid #FFF4CC',
            textDecoration: 'none',
            color: '#2C3E5F',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '48px' }}>🕊️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '8px',
                letterSpacing: '0.05em'
              }}>
                このサイトについて
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#2C3E5F',
                fontWeight: '300',
                lineHeight: '1.6'
              }}>
                想いを知る
              </p>
            </div>
          </Link>
        )}

        {/* ラッキー通知 - 通常 */}
        {!todayLucky.isMoneyDay && !todayLucky.isLuckyDay && (
          <div style={{
            background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
            borderRadius: '12px',
            padding: '24px 32px',
            marginBottom: '32px',
            border: '1px solid #E8EAF0',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              fontSize: '40px'
            }}>
              🌙
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '16px',
                color: '#2C3E5F',
                fontWeight: '400',
                marginBottom: '8px',
                letterSpacing: '0.05em'
              }}>
                今日のラッキーカラー
              </h3>
              <p style={{
                fontSize: '20px',
                color: '#2C3E5F',
                fontWeight: '300',
                letterSpacing: '0.05em'
              }}>
                {todayLucky.color}
              </p>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: todayLucky.colorCode,
              border: '2px solid #2C3E5F'
            }} />
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <a href="https://taplog-pink.vercel.app" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
            borderRadius: '12px',
            padding: '40px 32px',
            textDecoration: 'none',
            color: '#FFFFFF',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #2C3E5F'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📝</div>
            <div style={{ fontSize: '18px', fontWeight: '300', letterSpacing: '0.05em' }}>Threeタップログ</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px', fontWeight: '300' }}>揺らぎを記録する</div>
          </a>

          <Link href="/community" style={{
            background: '#F0F0F0',
            borderRadius: '12px',
            padding: '40px 32px',
            textDecoration: 'none',
            color: '#2C3E5F',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #E8EAF0'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontSize: '18px', fontWeight: '300', letterSpacing: '0.05em' }}>コミュニティ</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px', fontWeight: '300' }}>仲間とつながる</div>
          </Link>

          <Link href="/fortune" style={{
            background: 'linear-gradient(135deg, #FFF4CC 0%, #ffe9a3 100%)',
            borderRadius: '12px',
            padding: '40px 32px',
            textDecoration: 'none',
            color: '#2C3E5F',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '2px solid #2C3E5F',
            boxShadow: '0 4px 16px rgba(255, 244, 204, 0.4)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
            <div style={{ fontSize: '18px', fontWeight: '300', letterSpacing: '0.05em' }}>今日は金運の良い日です</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px', fontWeight: '300' }}>詳しく見る</div>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #F0F0F0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '300', color: '#2C3E5F', marginBottom: '8px' }}>
              {stats.totalDays}
            </div>
            <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>利用日数</div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #F0F0F0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '300', color: '#2C3E5F', marginBottom: '8px' }}>
              {stats.recordedDays}
            </div>
            <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>記録日数</div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #F0F0F0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '300', color: '#2C3E5F', marginBottom: '8px' }}>
              {stats.totalSymptoms}
            </div>
            <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>記録した症状</div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #F0F0F0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '300', color: '#2C3E5F', marginBottom: '8px' }}>
              {stats.communityPosts}
            </div>
            <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>投稿数</div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #F0F0F0'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#2C3E5F',
              marginBottom: '24px',
              letterSpacing: '0.05em'
            }}>
              最近の記録 📅
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {recentSymptoms.map((record, index) => (
                <div key={index} style={{
                  padding: '16px',
                  background: '#F0F0F0',
                  borderRadius: '8px',
                  borderLeft: '3px solid #2C3E5F'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#2C3E5F',
                    marginBottom: '8px'
                  }}>
                    {record.date}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {record.symptoms.map((symptom, idx) => (
                      <span key={idx} style={{
                        padding: '4px 12px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#4A4A4A',
                        border: '1px solid #E8EAF0'
                      }}>
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #F0F0F0'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#2C3E5F',
              marginBottom: '24px',
              letterSpacing: '0.05em'
            }}>
              よく出る症状 📊
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {topSymptoms.map((symptom, index) => (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '300', color: '#2C3E5F' }}>
                      {symptom.name}
                    </span>
                    <span style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>
                      {symptom.count}回
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#F0F0F0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${symptom.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #2C3E5F, #FFF4CC)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '48px',
          background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid #E8EAF0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '300',
            color: '#2C3E5F',
            marginBottom: '12px',
            letterSpacing: '0.05em'
          }}>
            一歩ずつ、自分を知る旅
          </h3>
          <p style={{
            fontSize: '15px',
            color: '#4A4A4A',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            記録を続けることで、自分のパターンが見えてきます。<br />
            無理せず、あなたのペースで進めていきましょう。
          </p>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
      </div>
    </div>
  );
}