'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { getTodayRokuyo, getRokuyoInfo, getTodayJuniChoku, juniChoku, checkPurpose, getOverallFortune } from '../../../lib/takashimaKoyomi';

export default function TakashimaPage() {
  const [selectedPurpose, setSelectedPurpose] = useState('');
  
  const todayRokuyo = getTodayRokuyo();
  const rokuyoInfo = getRokuyoInfo(todayRokuyo);
  const todayChoku = getTodayJuniChoku();
  const chokuInfo = juniChoku[todayChoku as keyof typeof juniChoku];
  const overallFortune = getOverallFortune(todayRokuyo, todayChoku);

  const purposes = [
    { name: '財布購入', icon: '💰', description: '新しい財布を買う' },
    { name: '契約', icon: '📝', description: '契約書にサインする' },
    { name: '旅行', icon: '✈️', description: '旅行に出発する' },
    { name: '移転', icon: '🏠', description: '引っ越し・移転する' },
    { name: '開店', icon: '🎊', description: 'お店を開く' },
    { name: '婚礼', icon: '💒', description: '結婚式を挙げる' },
    { name: '建築', icon: '🏗️', description: '家を建てる' },
    { name: '手術', icon: '🏥', description: '手術を受ける' },
    { name: '投資', icon: '📈', description: '株・投資を始める' },
    { name: '面接', icon: '👔', description: '面接・試験を受ける' }
  ];

  const generateMonthCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const rokuyoIndex = (month + 1 + day) % 6;
      const rokuyoName = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'][rokuyoIndex];
      const isToday = day === today.getDate();
      const isLucky = rokuyoName === '大安' || rokuyoName === '友引';
      
      calendar.push({
        day,
        dayOfWeek: date.getDay(),
        rokuyo: rokuyoName,
        isToday,
        isLucky
      });
    }
    return calendar;
  };

  const calendar = generateMonthCalendar();
  const today = new Date();
  const monthName = `${today.getFullYear()}年${today.getMonth() + 1}月`;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 60px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/fortune" style={{ display: 'inline-block', fontSize: '13px', color: '#4A4A4A', textDecoration: 'none', marginBottom: '16px', fontWeight: '300' }}>← 占いトップへ戻る</Link>
          <h1 style={{ fontSize: '36px', color: '#2C3E5F', fontWeight: '300', marginBottom: '12px', letterSpacing: '0.1em' }}>高島暦 📖</h1>
          <p style={{ fontSize: '15px', color: '#4A4A4A', fontWeight: '300' }}>古からの知恵が示す、吉日と凶日</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)', borderRadius: '16px', padding: '40px', marginBottom: '40px', color: '#FFFFFF' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '32px', textAlign: 'center', letterSpacing: '0.1em' }}>今日の暦</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255, 244, 204, 0.15)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', marginBottom: '16px', opacity: 0.9, fontWeight: '300' }}>六曜</div>
              <div style={{ fontSize: '48px', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.05em' }}>{todayRokuyo}</div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{rokuyoInfo.fortune}</div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '300', lineHeight: '1.6' }}>{rokuyoInfo.description}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', marginBottom: '16px', opacity: 0.9, fontWeight: '300' }}>十二直</div>
              <div style={{ fontSize: '48px', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.05em' }}>{todayChoku}</div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{chokuInfo.fortune}</div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '300' }}>吉：{chokuInfo.good.join('、')}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', marginBottom: '12px', opacity: 0.9, fontWeight: '300' }}>総合運</div>
            <div style={{ fontSize: '56px', fontWeight: '400', letterSpacing: '0.1em' }}>{overallFortune.level}</div>
          </div>
        </div>

        <div style={{ background: '#FFF4CC', borderRadius: '12px', padding: '32px', marginBottom: '40px', border: '2px solid #2C3E5F' }}>
          <h3 style={{ fontSize: '20px', color: '#2C3E5F', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>💡 今日のアドバイス</h3>
          <p style={{ fontSize: '16px', color: '#2C3E5F', lineHeight: '1.8', fontWeight: '300' }}>{rokuyoInfo.advice}</p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', color: '#2C3E5F', fontWeight: '300', marginBottom: '24px', textAlign: 'center', letterSpacing: '0.05em' }}>🎯 目的別に調べる</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {purposes.map(purpose => (
              <button key={purpose.name} onClick={() => setSelectedPurpose(purpose.name)} style={{ padding: '20px 12px', background: selectedPurpose === purpose.name ? '#2C3E5F' : '#F0F0F0', color: selectedPurpose === purpose.name ? '#FFFFFF' : '#4A4A4A', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '300', cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{purpose.icon}</div>
                <div>{purpose.name}</div>
              </button>
            ))}
          </div>

          {selectedPurpose && (
            <div style={{ background: '#F0F0F0', borderRadius: '12px', padding: '32px' }}>
              {(() => {
                const result = checkPurpose(todayRokuyo, todayChoku, selectedPurpose);
                return (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{purposes.find(p => p.name === selectedPurpose)?.icon}</div>
                      <h3 style={{ fontSize: '24px', color: '#2C3E5F', fontWeight: '400', marginBottom: '8px' }}>{selectedPurpose}</h3>
                      <div style={{ fontSize: '36px', fontWeight: '400', marginBottom: '16px', color: result.result.includes('◎') ? '#2E7D32' : result.result.includes('×') ? '#C62828' : '#4A4A4A' }}>{result.result}</div>
                    </div>
                    <p style={{ fontSize: '16px', color: '#4A4A4A', lineHeight: '1.8', fontWeight: '300', textAlign: 'center' }}>{result.advice}</p>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: '24px', color: '#2C3E5F', fontWeight: '300', marginBottom: '32px', textAlign: 'center', letterSpacing: '0.05em' }}>📅 {monthName}の吉日カレンダー</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '14px', color: '#4A4A4A', fontWeight: '400', padding: '8px' }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array(calendar[0].dayOfWeek).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {calendar.map(day => (
              <div key={day.day} style={{ background: day.isToday ? '#2C3E5F' : day.isLucky ? '#E8F5E9' : '#FFFFFF', border: `1px solid ${day.isToday ? '#2C3E5F' : day.isLucky ? '#81C784' : '#F0F0F0'}`, borderRadius: '8px', padding: '12px', textAlign: 'center', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '400', marginBottom: '4px', color: day.isToday ? '#FFFFFF' : '#2C3E5F' }}>{day.day}</div>
                <div style={{ fontSize: '11px', color: day.isToday ? '#FFF4CC' : day.isLucky ? '#2E7D32' : '#666', fontWeight: '300' }}>{day.rokuyo}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '20px', background: '#F0F0F0', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: '#E8F5E9', border: '1px solid #81C784', borderRadius: '4px' }} />
                吉日
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: '#2C3E5F', borderRadius: '4px' }} />
                今日
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)', borderRadius: '12px', border: '1px solid #E8EAF0' }}>
          <p style={{ fontSize: '15px', color: '#4A4A4A', lineHeight: '1.8', fontWeight: '300' }}>暦は長い年月をかけて積み重ねられた智慧です。<br />あなたの大切な決断に、静かに寄り添います 🌙</p>
        </div>
      </div>
    </div>
  );
}