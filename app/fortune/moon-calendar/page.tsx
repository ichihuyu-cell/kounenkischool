'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function MoonCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getMoonAge = (date: Date) => {
    // 2026年2月17日の新月を基準にした正確な月齢計算
    const knownNewMoon = new Date(2026, 1, 17, 0, 0, 0);
    const diffMs = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const synodicMonth = 29.530588853;
    
    let moonAge = diffDays % synodicMonth;
    if (moonAge < 0) moonAge += synodicMonth;
    
    return Math.round(moonAge * 10) / 10;
  };

  const getMoonIcon = (age: number) => {
    if (age < 1.84) return '🌑';
    if (age < 5.53) return '🌒';
    if (age < 9.23) return '🌓';
    if (age < 12.91) return '🌔';
    if (age < 16.61) return '🌕';
    if (age < 20.30) return '🌖';
    if (age < 23.99) return '🌗';
    if (age < 27.68) return '🌘';
    return '🌑';
  };

  const getMoonMessage = (age: number) => {
    if (age < 7.38) {
      return {
        phase: '新月期',
        feminine: '月経期',
        message: '体がリセットされる時期。新しいサイクルの始まりです。ゆっくり休んで、自分を労わりましょう。無理をせず、温かいものを摂り、体を冷やさないことが大切です。',
        color: '#2C3E5F'
      };
    } else if (age < 14.76) {
      return {
        phase: '上弦期',
        feminine: '卵胞期',
        message: 'エネルギーが高まる時期。新しいことに挑戦したり、活動的に過ごすのに最適です。体が軽く感じられ、前向きな気持ちになります。この時期を活かして行動しましょう。',
        color: '#4a6fa5'
      };
    } else if (age < 22.14) {
      return {
        phase: '満月期',
        feminine: '排卵期',
        message: '最も豊かな時期。感情が豊かになり、直感が冴えます。創造性が高まり、人との繋がりも深まります。ただし、感情の起伏が大きくなることもあるので、深呼吸を忘れずに。',
        color: '#FFF4CC'
      };
    } else {
      return {
        phase: '下弦期',
        feminine: '黄体期',
        message: '内側に意識が向かう時期。整理整頓やデトックスに最適です。PMS（月経前症候群）が出やすい時期でもあるので、無理せず穏やかに過ごしましょう。自分を優先して大丈夫です。',
        color: '#c8bca0'
      };
    }
  };

  const generateMonthCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const moonAge = getMoonAge(date);
      const moonIcon = getMoonIcon(moonAge);
      const isToday = day === today.getDate();
      const isNewMoon = moonAge < 1.84;
      const isFullMoon = moonAge >= 14.76 && moonAge < 16.61;
      
      calendar.push({
        day,
        date,
        dayOfWeek: date.getDay(),
        moonAge,
        moonIcon,
        isToday,
        isSpecial: isNewMoon || isFullMoon
      });
    }
    return calendar;
  };

  const calendar = generateMonthCalendar();
  const today = new Date();
  const monthName = `${today.getFullYear()}年${today.getMonth() + 1}月`;
  const selectedDayInfo = selectedDate ? calendar.find(d => d.day === selectedDate) : null;
  const selectedMessage = selectedDayInfo ? getMoonMessage(selectedDayInfo.moonAge) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 60px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/fortune" style={{ display: 'inline-block', fontSize: '13px', color: '#4A4A4A', textDecoration: 'none', marginBottom: '16px', fontWeight: '300' }}>← 占いトップへ戻る</Link>
          <h1 style={{ fontSize: '36px', color: '#2C3E5F', fontWeight: '300', marginBottom: '12px', letterSpacing: '0.1em' }}>月のカレンダー 🌙</h1>
          <p style={{ fontSize: '15px', color: '#4A4A4A', fontWeight: '300' }}>月の満ち欠けと女性の周期</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)', borderRadius: '16px', padding: '40px', marginBottom: '40px', color: '#FFFFFF', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '300', marginBottom: '16px', letterSpacing: '0.1em' }}>{monthName}</h2>
          <p style={{ fontSize: '14px', opacity: 0.9, fontWeight: '300', lineHeight: '1.8' }}>
            月は約29.5日で満ち欠けを繰り返します。<br />
            女性の月経周期（平均28日）とほぼ同じリズムです。<br />
            月齢を知ることで、あなたの体と心をより理解できます。
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '14px', color: '#4A4A4A', fontWeight: '400', padding: '8px' }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array(calendar[0].dayOfWeek).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {calendar.map(dayInfo => (
              <button
                key={dayInfo.day}
                onClick={() => setSelectedDate(dayInfo.day)}
                style={{
                  background: dayInfo.isToday ? '#2C3E5F' : dayInfo.isSpecial ? '#FFF4CC' : '#FFFFFF',
                  border: `2px solid ${dayInfo.isToday ? '#2C3E5F' : dayInfo.isSpecial ? '#FFF4CC' : '#F0F0F0'}`,
                  borderRadius: '12px',
                  padding: '16px 8px',
                  textAlign: 'center',
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 62, 95, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {dayInfo.isSpecial && <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '10px' }}>⭐</div>}
                <div style={{ fontSize: '18px', fontWeight: '400', marginBottom: '8px', color: dayInfo.isToday ? '#FFFFFF' : '#2C3E5F' }}>{dayInfo.day}</div>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{dayInfo.moonIcon}</div>
                <div style={{ fontSize: '11px', color: dayInfo.isToday ? '#FFF4CC' : '#666', fontWeight: '300' }}>月齢 {dayInfo.moonAge}</div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '32px', padding: '20px', background: '#F0F0F0', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>
              日付をクリックすると、その日の月齢と体のリズムが表示されます
            </p>
          </div>
        </div>

        {selectedDayInfo && selectedMessage && (
          <div style={{ background: `linear-gradient(135deg, ${selectedMessage.color} 0%, ${selectedMessage.color}dd 100%)`, borderRadius: '16px', padding: '40px', border: '2px solid #2C3E5F', marginBottom: '40px', color: selectedMessage.color === '#FFF4CC' ? '#2C3E5F' : '#FFFFFF' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '24px', textAlign: 'center', letterSpacing: '0.05em' }}>{selectedDayInfo.day}日</h3>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>{selectedDayInfo.moonIcon}</div>
              <div style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px' }}>月齢 {selectedDayInfo.moonAge}</div>
              <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>{selectedMessage.phase}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>（女性の周期：{selectedMessage.feminine}）</div>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.8', fontWeight: '300', textAlign: 'center', maxWidth: '600px', margin: '0 auto', opacity: 0.95 }}>{selectedMessage.message}</p>
          </div>
        )}

        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: '20px', color: '#2C3E5F', fontWeight: '400', marginBottom: '24px', letterSpacing: '0.05em' }}>🌙 月齢と女性の体</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#F0F0F0', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#2C3E5F', fontWeight: '400', marginBottom: '12px' }}>🌑 新月期（月齢0〜7）</h4>
              <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: '1.6', fontWeight: '300' }}>月経期に対応。体がリセットされる時期。ゆっくり休んで、自分を労わりましょう。</p>
            </div>
            <div style={{ background: '#E8F4F8', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#2C3E5F', fontWeight: '400', marginBottom: '12px' }}>🌓 上弦期（月齢7〜14）</h4>
              <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: '1.6', fontWeight: '300' }}>卵胞期に対応。エネルギーが高まる時期。新しいことに挑戦する最適な時です。</p>
            </div>
            <div style={{ background: '#FFF4CC', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#2C3E5F', fontWeight: '400', marginBottom: '12px' }}>🌕 満月期（月齢14〜22）</h4>
              <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: '1.6', fontWeight: '300' }}>排卵期に対応。最も豊かな時期。感情が豊かになり、直感が冴えます。</p>
            </div>
            <div style={{ background: '#E8EAF0', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#2C3E5F', fontWeight: '400', marginBottom: '12px' }}>🌗 下弦期（月齢22〜29）</h4>
              <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: '1.6', fontWeight: '300' }}>黄体期に対応。内側に意識が向かう時期。整理整頓やデトックスに最適です。</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)', borderRadius: '12px', border: '1px solid #E8EAF0' }}>
          <p style={{ fontSize: '15px', color: '#4A4A4A', lineHeight: '1.8', fontWeight: '300' }}>
            月のリズムと体のリズムは深く結びついています。<br />
            月齢を意識することで、更年期の変化もより穏やかに受け入れられます。<br />
            あなたの体は、宇宙のリズムと共に呼吸しています 🌙
          </p>
        </div>
      </div>
    </div>
  );
}