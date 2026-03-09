'use client';

import Link from 'next/link';
import Header from '../components/Header';

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF'
    }}>
      <Header />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #2C3E5F'
          }}>
            <div style={{ fontSize: '60px' }}>🕊️</div>
          </div>
          <h1 style={{
            fontSize: '32px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '16px',
            letterSpacing: '0.1em'
          }}>
            RUNEERA について
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4A4A4A',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            みんなの気持ち、形にしました
          </p>
        </div>

        {/* メインコンテンツ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '48px',
          border: '1px solid #F0F0F0',
          marginBottom: '40px'
        }}>
          {/* はじめに */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#2C3E5F',
              fontWeight: '300',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #F0F0F0',
              letterSpacing: '0.05em'
            }}>
              はじめに
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              こんにちは。RUNEERA（ルネエラ）を運営しているイチフユです。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              私はずっと更年期に悩まされてきました。なんと今、15年目に入りました。44歳の誕生日を迎えたころ身体に違和感を覚えました。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              「あれ?寝て起きたのに疲れてる・・?」間違いなくこの瞬間がスタートでした。あのとき自分に「大丈夫、気のせいだよ」って言わなければよかった。「それ、更年期かもしれないよ?」ってちゃんと言える自分でありたかった。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              今更ですが猛省しています。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              女性ホルモンが激減する更年期は全然大丈夫じゃない。気合や体力じゃカバーしきれない。まずそこから理解すべきだった。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              fontWeight: '300'
            }}>
              それがわかっていたらここまでひどく不定愁訴の数々に悩まされずに済んだと思います。
            </p>
          </div>

          {/* なぜこのサイトを作ったのか */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#2C3E5F',
              fontWeight: '300',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #F0F0F0',
              letterSpacing: '0.05em'
            }}>
              なぜこのサイトを作ったのか
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              このサイトは、治療の場ではありません。目的は「最大限に自分を知ること」。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              閉経前、閉経後、どんな周期でどんな感じに身体の不調が起きて、メンタルが病んで、どんなタイミングでいい日(たまにある体調いい日)があるのか?それがわかったら最高だと思いました。
            </p>
            <div style={{
              background: '#F0F0F0',
              borderRadius: '12px',
              padding: '32px',
              margin: '32px 0'
            }}>
              <p style={{
                fontSize: '17px',
                color: '#2C3E5F',
                lineHeight: '2',
                fontWeight: '300',
                textAlign: 'center',
                letterSpacing: '0.03em'
              }}>
                その時、自分のことを自分に教えてくれる場所があったら、と思いました。<br />
                整え、巡らせ、静かに立て直す。そして、再生する。
              </p>
            </div>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              fontWeight: '300'
            }}>
              このサイトは私のように自分のことが見えなくなって困っている更年期女性のために作りました。
            </p>
          </div>

          {/* 想い */}
          <div>
            <h2 style={{
              fontSize: '24px',
              color: '#2C3E5F',
              fontWeight: '300',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #F0F0F0',
              letterSpacing: '0.05em'
            }}>
              想い
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              marginBottom: '16px',
              fontWeight: '300'
            }}>
              娘たちが困らない世の中へ。娘だけじゃない。今もそして将来もすべての女性が困らない世の中へ。
            </p>
            <p style={{
              fontSize: '15px',
              color: '#4A4A4A',
              lineHeight: '2',
              fontWeight: '300'
            }}>
              こんな場所があったらいいなという、みんなの気持ち、形にしました。
            </p>
          </div>
        </div>

        {/* 締めのメッセージ */}
        <div style={{
          background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)',
          borderRadius: '12px',
          padding: '48px 40px',
          textAlign: 'center',
          marginBottom: '40px',
          border: '1px solid #E8EAF0'
        }}>
          <p style={{
            fontSize: '28px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '20px',
            letterSpacing: '0.05em'
          }}>
            一緒に、軽やかに生きましょう 🌙
          </p>
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E8EAF0'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#4A4A4A',
              marginBottom: '8px',
              fontWeight: '300'
            }}>
              RUNEERA 主宰
            </p>
            <p style={{
              fontSize: '20px',
              color: '#2C3E5F',
              fontWeight: '300',
              letterSpacing: '0.1em'
            }}>
              イチフユ
            </p>
          </div>
        </div>

        {/* ホームに戻るボタン */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/dashboard" style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: '#2C3E5F',
            color: '#FFFFFF',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: '300',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'all 0.3s'
          }}>
            マイページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}