'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

const SIGNS = [
  { name: '牡羊座', symbol: '♈', period: '3/21〜4/19', element: '火' },
  { name: '牡牛座', symbol: '♉', period: '4/20〜5/20', element: '地' },
  { name: '双子座', symbol: '♊', period: '5/21〜6/21', element: '風' },
  { name: '蟹座', symbol: '♋', period: '6/22〜7/22', element: '水' },
  { name: '獅子座', symbol: '♌', period: '7/23〜8/22', element: '火' },
  { name: '乙女座', symbol: '♍', period: '8/23〜9/22', element: '地' },
  { name: '天秤座', symbol: '♎', period: '9/23〜10/23', element: '風' },
  { name: '蠍座', symbol: '♏', period: '10/24〜11/22', element: '水' },
  { name: '射手座', symbol: '♐', period: '11/23〜12/21', element: '火' },
  { name: '山羊座', symbol: '♑', period: '12/22〜1/19', element: '地' },
  { name: '水瓶座', symbol: '♒', period: '1/20〜2/18', element: '風' },
  { name: '魚座', symbol: '♓', period: '2/19〜3/20', element: '水' },
];

const ELEMENT_COLORS: Record<string, string> = {
  '火': '#C45B6E',
  '地': '#5A9E6F',
  '風': '#4A6FA5',
  '水': '#6B8EAD',
};

// 日付とサインのインデックスからシード値を生成
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32767;
  };
}

function generateFortune(signIndex: number) {
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = seededRandom(dateSeed * 13 + signIndex * 7 + 31);

  const starCount = (category: string) => {
    const base = rand();
    // カテゴリごとに微調整
    const offset = category === 'overall' ? 0.05 : 0;
    const val = Math.min(base + offset, 1);
    if (val > 0.85) return 5;
    if (val > 0.6) return 4;
    if (val > 0.35) return 3;
    if (val > 0.15) return 2;
    return 1;
  };

  const overall = starCount('overall');
  const love = starCount('love');
  const work = starCount('work');
  const health = starCount('health');

  const luckyColors = ['月白', '桜色', '藤紫', '薄紅', '若草', '水色', '金木犀', '珊瑚', '紺碧', '胡桃', '菫色', '柑子'];
  const luckyItems = ['温かい飲み物', 'ハーブティー', 'お花', '手書きのメモ', 'アロマオイル', '絹のスカーフ', 'パール', 'お香', '小さなお菓子', '読みかけの本', 'ハンドクリーム', 'キャンドル'];

  const luckyColor = luckyColors[Math.floor(rand() * luckyColors.length)];
  const luckyItem = luckyItems[Math.floor(rand() * luckyItems.length)];

  const overallMessages = [
    ['静かな時間を大切に。無理をせず、自分のペースで一日を過ごしましょう。', '今日は少し立ち止まって、自分自身と向き合う日。焦らなくて大丈夫。'],
    ['小さな変化の兆しが。いつもと違う道を歩いてみると、新しい発見があるかも。', '穏やかに過ごせる一日。心のゆとりが良い方向に導いてくれます。'],
    ['バランスの取れた一日になりそう。直感を信じて行動すると◎。', '安定した運気。コツコツと積み重ねてきたことが実を結び始めるとき。'],
    ['良い流れが来ています。周囲の人との繋がりを大切にすると、さらに運気アップ。', '心が軽くなるような出来事がありそう。素直な気持ちを大切に。'],
    ['素晴らしい一日！あなたの魅力が最大限に輝くとき。思い切った行動が吉。', '最高の運気。ずっと温めていた計画を実行に移す絶好のタイミングです。'],
  ];

  const loveMessages = [
    ['自分を大切にする時間を。セルフケアが恋愛運アップの鍵。'],
    ['さりげない優しさが心に染みる日。温かい言葉を伝えてみて。'],
    ['穏やかなコミュニケーションが吉。相手の話にそっと耳を傾けて。'],
    ['心の距離が縮まる予感。素直な気持ちを言葉にしてみましょう。'],
    ['特別な出会いや進展の暗示。あなたの笑顔が幸運を引き寄せます。'],
  ];

  const workMessages = [
    ['焦らず丁寧に。小さなミスに気をつけて、一つずつ着実に。'],
    ['新しいアイデアが浮かびそう。メモを手元に置いておくと◎。'],
    ['チームワークが鍵。周囲との連携がスムーズにいく日。'],
    ['積極的に動くと良い成果が。あなたの提案が注目されるかも。'],
    ['絶好調！リーダーシップを発揮できるとき。大きなプロジェクトにも自信を持って。'],
  ];

  const healthMessages = [
    ['無理は禁物。早めの休息と十分な水分補給を心がけて。'],
    ['軽いストレッチや散歩が◎。体を少し動かすと気分もスッキリ。'],
    ['バランスの良い食事を意識して。旬の食材があなたの体を整えます。'],
    ['心身ともに好調。この調子を維持するためにも規則正しい生活を。'],
    ['エネルギーに満ちた一日。新しい運動を始めるのにも良いタイミング。'],
  ];

  const pickMsg = (arr: string[][]) => {
    const msgs = arr[Math.min(arr.length - 1, Math.max(0, Math.round(rand() * (arr.length - 1))))];
    return msgs[Math.floor(rand() * msgs.length)];
  };

  return {
    overall, love, work, health,
    luckyColor, luckyItem,
    overallMsg: pickMsg(overallMessages),
    loveMsg: pickMsg(loveMessages),
    workMsg: pickMsg(workMessages),
    healthMsg: pickMsg(healthMessages),
  };
}

const serif = "'Noto Serif JP', 'Hiragino Mincho ProN', Georgia, serif";

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);

  const fortune = useMemo(() => {
    if (selectedSign === null) return null;
    return generateFortune(selectedSign);
  }, [selectedSign]);

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{
        color: i < count ? '#D4A843' : '#E0DCD4',
        fontSize: '18px',
      }}>★</span>
    ));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&display=swap');
      `}</style>
      <Header />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '100px', height: '100px', margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C3E5F 0%, #4a6fa5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px', border: '2px solid #FFF4CC',
          }}>⭐</div>
          <h1 style={{
            fontSize: '32px', color: '#2C3E5F', fontWeight: '300',
            marginBottom: '12px', letterSpacing: '0.1em', fontFamily: serif,
          }}>星座占い</h1>
          <p style={{
            fontSize: '14px', color: '#4A4A4A', fontWeight: '300', fontFamily: serif,
          }}>{dateStr}の運勢</p>
        </div>

        {/* 星座選択グリッド */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px', marginBottom: '40px',
        }}>
          {SIGNS.map((sign, i) => (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(i)}
              style={{
                background: selectedSign === i
                  ? 'linear-gradient(135deg, #2C3E5F, #4a6fa5)'
                  : '#FFFFFF',
                color: selectedSign === i ? '#FFFFFF' : '#2C3E5F',
                border: selectedSign === i ? '2px solid #2C3E5F' : '1px solid #E8EAF0',
                borderRadius: '12px',
                padding: '14px 8px',
                cursor: 'pointer',
                fontFamily: serif,
                transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{sign.symbol}</span>
              <span style={{ fontSize: '13px', fontWeight: '400', letterSpacing: '0.03em' }}>{sign.name}</span>
              <span style={{
                fontSize: '10px', fontWeight: '300',
                color: selectedSign === i ? 'rgba(255,255,255,0.7)' : '#999',
              }}>{sign.period}</span>
            </button>
          ))}
        </div>

        {/* 占い結果 */}
        {selectedSign !== null && fortune && (
          <div style={{
            background: '#FFFFFF', borderRadius: '16px',
            border: '1px solid #E8EAF0', overflow: 'hidden',
            animation: 'fadeIn 0.4s ease',
          }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }`}</style>

            {/* 星座ヘッダー */}
            <div style={{
              background: 'linear-gradient(135deg, #2C3E5F 0%, #4a6fa5 100%)',
              padding: '32px', textAlign: 'center', color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>{SIGNS[selectedSign].symbol}</div>
              <h2 style={{
                fontSize: '24px', fontWeight: '400', letterSpacing: '0.1em',
                marginBottom: '8px', fontFamily: serif,
              }}>{SIGNS[selectedSign].name}</h2>
              <div style={{
                display: 'inline-block', padding: '4px 16px',
                background: `${ELEMENT_COLORS[SIGNS[selectedSign].element]}88`,
                borderRadius: '12px', fontSize: '12px', fontWeight: '300',
                letterSpacing: '0.05em',
              }}>{SIGNS[selectedSign].element}のエレメント</div>
            </div>

            <div style={{ padding: '32px' }}>
              {/* 総合運 */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '500', color: '#2C3E5F',
                    fontFamily: serif, letterSpacing: '0.05em',
                  }}>✨ 総合運</h3>
                  <div>{renderStars(fortune.overall)}</div>
                </div>
                <p style={{
                  fontSize: '14px', color: '#4A4A4A', lineHeight: '2',
                  fontWeight: '300', fontFamily: serif,
                }}>{fortune.overallMsg}</p>
              </div>

              {/* 恋愛運 */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '500', color: '#2C3E5F',
                    fontFamily: serif, letterSpacing: '0.05em',
                  }}>💕 恋愛運</h3>
                  <div>{renderStars(fortune.love)}</div>
                </div>
                <p style={{
                  fontSize: '14px', color: '#4A4A4A', lineHeight: '2',
                  fontWeight: '300', fontFamily: serif,
                }}>{fortune.loveMsg}</p>
              </div>

              {/* 仕事運 */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '500', color: '#2C3E5F',
                    fontFamily: serif, letterSpacing: '0.05em',
                  }}>💼 仕事運</h3>
                  <div>{renderStars(fortune.work)}</div>
                </div>
                <p style={{
                  fontSize: '14px', color: '#4A4A4A', lineHeight: '2',
                  fontWeight: '300', fontFamily: serif,
                }}>{fortune.workMsg}</p>
              </div>

              {/* 健康運 */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '500', color: '#2C3E5F',
                    fontFamily: serif, letterSpacing: '0.05em',
                  }}>🌿 健康運</h3>
                  <div>{renderStars(fortune.health)}</div>
                </div>
                <p style={{
                  fontSize: '14px', color: '#4A4A4A', lineHeight: '2',
                  fontWeight: '300', fontFamily: serif,
                }}>{fortune.healthMsg}</p>
              </div>

              {/* ラッキーアイテム */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)',
                borderRadius: '12px', padding: '20px', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '12px', color: '#D4A843', fontWeight: '500',
                  letterSpacing: '0.1em', marginBottom: '12px', fontFamily: serif,
                }}>TODAY&apos;S LUCKY</div>
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '32px',
                }}>
                  <div>
                    <div style={{
                      fontSize: '11px', color: '#999', marginBottom: '4px',
                      fontFamily: serif, fontWeight: '300',
                    }}>ラッキーカラー</div>
                    <div style={{
                      fontSize: '15px', color: '#2C3E5F', fontWeight: '500',
                      fontFamily: serif,
                    }}>{fortune.luckyColor}</div>
                  </div>
                  <div style={{ width: '1px', background: '#E8E0D0' }} />
                  <div>
                    <div style={{
                      fontSize: '11px', color: '#999', marginBottom: '4px',
                      fontFamily: serif, fontWeight: '300',
                    }}>ラッキーアイテム</div>
                    <div style={{
                      fontSize: '15px', color: '#2C3E5F', fontWeight: '500',
                      fontFamily: serif,
                    }}>{fortune.luckyItem}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 未選択時のガイド */}
        {selectedSign === null && (
          <div style={{
            background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
            borderRadius: '12px', padding: '48px 40px',
            border: '1px solid #E8EAF0', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
            <h3 style={{
              fontSize: '20px', fontWeight: '300', color: '#2C3E5F',
              marginBottom: '16px', letterSpacing: '0.05em', fontFamily: serif,
            }}>あなたの星座を選んでください</h3>
            <p style={{
              fontSize: '14px', color: '#4A4A4A', lineHeight: '1.8',
              fontWeight: '300', fontFamily: serif,
            }}>
              12の星座が、今日のあなたにそっと寄り添うメッセージをお届けします。
            </p>
          </div>
        )}

        {/* 戻るリンク */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/fortune" style={{
            display: 'inline-block', padding: '12px 32px',
            background: '#FFFFFF', color: '#2C3E5F',
            borderRadius: '24px', fontSize: '14px', fontWeight: '300',
            textDecoration: 'none', letterSpacing: '0.05em',
            border: '1px solid #E8EAF0', fontFamily: serif,
          }}>← 占いトップへ戻る</Link>
        </div>
      </div>
    </div>
  );
}
