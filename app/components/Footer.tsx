'use client';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #F0F0F0',
      padding: '32px 20px',
      background: '#FAFAFA',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: '12px',
          color: '#999',
          lineHeight: '1.9',
          fontWeight: '300',
          textAlign: 'center',
        }}>
          本サービスは更年期における心身の変化を記録し、ご自身の生活リズムを把握することを目的としたセルフケア支援ツールです。医学的な診断・治療・投薬の指示を行うものではありません。体調に不安がある場合は必ず専門医を受診してください。
        </p>
        <p style={{
          fontSize: '11px',
          color: '#BBB',
          textAlign: 'center',
          marginTop: '16px',
          fontWeight: '300',
          letterSpacing: '0.05em',
        }}>
          &copy; RUNEERA
        </p>
      </div>
    </footer>
  );
}
