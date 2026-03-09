'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { getTodayRokuyo, getRokuyoInfo, getTodayJuniChoku, juniChoku, getHonmeiSei, kyuseiData } from '../../../lib/takashimaKoyomi';
import { getTypeFromBirthData, flowerMoonTypes, FlowerMoonType } from '../../../lib/flowerMoonTypes';

export default function DailyFortunePage() {
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [showFortune, setShowFortune] = useState(false);
  const [userType, setUserType] = useState<FlowerMoonType | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getMoonPhase = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const age = ((year - 2000) * 12.3685 + (month - 1) * 1 + day * 0.0295) % 29.53;

    if (age < 1.84566) return { phase: '新月', icon: '🌑', message: '新しい始まりの時' };
    if (age < 5.53699) return { phase: '三日月', icon: '🌒', message: '静かに力を蓄える時' };
    if (age < 9.22831) return { phase: '上弦の月', icon: '🌓', message: '前進する力が満ちる時' };
    if (age < 12.91963) return { phase: '十三夜月', icon: '🌔', message: '実りを感じる時' };
    if (age < 16.61096) return { phase: '満月', icon: '🌕', message: '全てが満たされる時' };
    if (age < 20.30228) return { phase: '寝待月', icon: '🌖', message: 'ゆっくり休む時' };
    if (age < 23.99361) return { phase: '下弦の月', icon: '🌗', message: '手放す勇気を持つ時' };
    if (age < 27.68493) return { phase: '有明月', icon: '🌘', message: '静けさの中で整える時' };
    return { phase: '新月前夜', icon: '🌑', message: '再生の準備をする時' };
  };

  const moonPhase = getMoonPhase();
  const todayRokuyo = getTodayRokuyo();
  const todayChoku = getTodayJuniChoku();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = getTypeFromBirthData(birthDate, bloodType);
    setUserType(type);
    setIsLoading(true);
    setShowFortune(true);

    const honmeiSei = getHonmeiSei(new Date(birthDate).getFullYear());

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          bloodType,
          rokuyoName: todayRokuyo,
          chokuName: todayChoku,
          honmeiSei
        })
      });
      const data = await response.json();
      setAiMessage(data.message);
    } catch (error) {
      setAiMessage('今日の運勢を読み取り中に問題が発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const typeData = userType ? flowerMoonTypes[userType] : null;
  const honmeiSei = birthDate ? getHonmeiSei(new Date(birthDate).getFullYear()) : null;
  const kyuseiInfo = honmeiSei ? kyuseiData[honmeiSei as keyof typeof kyuseiData] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/fortune" style={{ display: 'inline-block', fontSize: '13px', color: '#4A4A4A', textDecoration: 'none', marginBottom: '16px', fontWeight: '300' }}>← 占いトップへ戻る</Link>
          <h1 style={{ fontSize: '32px', color: '#2C3E5F', fontWeight: '300', marginBottom: '12px', letterSpacing: '0.05em' }}>今日の運勢 ✨</h1>
          <p style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: '300' }}>月と星があなたに伝える、今日の導き</p>
        </div>

        {/* 月の表示 */}
        <div style={{ background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)', borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>{moonPhase.icon}</div>
          <h2 style={{ fontSize: '24px', color: '#FFFFFF', fontWeight: '300', marginBottom: '8px', letterSpacing: '0.05em' }}>今日の月：{moonPhase.phase}</h2>
          <p style={{ fontSize: '14px', color: '#FFF4CC', fontWeight: '300' }}>{moonPhase.message}</p>
        </div>

        {!showFortune ? (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '40px', border: '1px solid #F0F0F0' }}>
            <h3 style={{ fontSize: '20px', color: '#2C3E5F', fontWeight: '300', marginBottom: '24px', textAlign: 'center', letterSpacing: '0.05em' }}>あなたのことを教えてください</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#4A4A4A', marginBottom: '8px', fontWeight: '300', letterSpacing: '0.03em' }}>生年月日</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #F0F0F0', borderRadius: '8px', fontSize: '14px', fontWeight: '300', color: '#4A4A4A', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#4A4A4A', marginBottom: '8px', fontWeight: '300', letterSpacing: '0.03em' }}>血液型</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {['A', 'B', 'O', 'AB'].map(type => (
                    <button key={type} type="button" onClick={() => setBloodType(type)} style={{ padding: '12px', background: bloodType === type ? '#2C3E5F' : '#FFFFFF', color: bloodType === type ? '#FFFFFF' : '#4A4A4A', border: `1px solid ${bloodType === type ? '#2C3E5F' : '#F0F0F0'}`, borderRadius: '8px', fontSize: '14px', fontWeight: '300', cursor: 'pointer', transition: 'all 0.3s' }}>{type}型</button>
                  ))}
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#2C3E5F', color: '#FFFFFF', border: 'none', borderRadius: '24px', fontSize: '15px', fontWeight: '300', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.3s' }}>今日の運勢を見る</button>
            </form>
          </div>
        ) : (
          <div>
            {/* タイプ表示 */}
            {typeData && (
              <div style={{ background: 'linear-gradient(135deg, #FFF4CC 0%, #ffe9a3 100%)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '32px', border: '2px solid #2C3E5F' }}>
                <Image src={typeData.icon} alt={typeData.name} width={80} height={80} style={{marginBottom: '12px'}}/>
                <p style={{ fontSize: '18px', color: '#2C3E5F', fontWeight: '300', letterSpacing: '0.05em' }}>あなたは「{typeData.name}」</p>
              </div>
            )}

            {/* AI占い結果 */}
            <div style={{ background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)', borderRadius: '12px', padding: '32px', marginBottom: '24px', color: '#FFFFFF' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '300', marginBottom: '20px', letterSpacing: '0.05em', textAlign: 'center' }}>✨ あなただけの今日の運勢</h3>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔮</div>
                  <p style={{ fontSize: '15px', color: '#FFF4CC', fontWeight: '300', letterSpacing: '0.05em' }}>星と月があなたの運勢を読み取っています...</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '15px', lineHeight: '2', fontWeight: '300', whiteSpace: 'pre-wrap', color: '#FFFFFF' }}>{aiMessage}</p>
                </div>
              )}
            </div>

            {/* 九星気学 */}
            {honmeiSei && kyuseiInfo && (
              <div style={{ background: '#F8F8F8', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #F0F0F0' }}>
                <h4 style={{ fontSize: '16px', color: '#2C3E5F', fontWeight: '400', marginBottom: '12px' }}>🌟 あなたの本命星：{honmeiSei}</h4>
                <div style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: '300', lineHeight: '1.8' }}>
                  <div>方位：{kyuseiInfo.direction} / 色：{kyuseiInfo.color}</div>
                  <div>{kyuseiInfo.trait}</div>
                </div>
              </div>
            )}

            {/* ボタン */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              <button onClick={() => { setShowFortune(false); setAiMessage(''); }} style={{ padding: '12px 32px', background: '#FFFFFF', color: '#2C3E5F', border: '1px solid #2C3E5F', borderRadius: '24px', fontSize: '14px', fontWeight: '300', cursor: 'pointer', letterSpacing: '0.05em' }}>もう一度見る</button>
              <Link href="/fortune" style={{ padding: '12px 32px', background: '#2C3E5F', color: '#FFFFFF', border: 'none', borderRadius: '24px', fontSize: '14px', fontWeight: '300', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-block' }}>占いトップへ</Link>
            </div>
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)', borderRadius: '12px', border: '1px solid #E8EAF0' }}>
          <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: '1.8', fontWeight: '300' }}>月明かりのように、<br />あなたの日々を静かに照らします 🌙</p>
        </div>
      </div>
    </div>
  );
}
