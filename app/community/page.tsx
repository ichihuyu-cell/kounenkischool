'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
}

const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    author: 'さくら',
    avatar: '🌸',
    time: '2時間前',
    content: '今日は朝からほてりがひどかったけど、冷たいタオルを首に巻いたら少し楽になりました。小さな工夫の積み重ねが大事ですね。みなさんの対処法も聞きたいです。',
    likes: 12,
    liked: false,
  },
  {
    id: 2,
    author: 'ゆき',
    avatar: '❄️',
    time: '5時間前',
    content: '久しぶりに朝から体が軽くて、近所を散歩できました。こういう日があるから頑張れる。調子が良い日は自分をたくさん褒めてあげようと思います🌙',
    likes: 28,
    liked: false,
  },
  {
    id: 3,
    author: 'はな',
    avatar: '🌷',
    time: '昨日',
    content: '新月の前後はいつも眠りが浅くなる気がします。RUNEERAで記録をつけ始めてから、自分のパターンが見えてきました。「なぜか辛い」が「この時期だから」に変わるだけで少し安心します。',
    likes: 35,
    liked: false,
  },
  {
    id: 4,
    author: 'みき',
    avatar: '🍀',
    time: '2日前',
    content: 'イライラが止まらない日が続いていたけど、ここで皆さんの投稿を読んで「ひとりじゃない」って思えました。ありがとうございます。今日はハーブティーを飲んでゆっくりします。',
    likes: 42,
    liked: false,
  },
  {
    id: 5,
    author: 'りん',
    avatar: '🔔',
    time: '3日前',
    content: '肩こりと頭痛がセットで来るのが辛い…。整体に行ったら少し楽になりました。週1のご褒美タイムとして続けてみようと思います。自分を大切にする時間、大事ですよね。',
    likes: 19,
    liked: false,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [newPost, setNewPost] = useState('');
  const [isLoggedIn] = useState(false);

  const handleLike = (id: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      author: 'あなた',
      avatar: '🕊️',
      time: 'たった今',
      content: newPost.trim(),
      likes: 0,
      liked: false,
    };
    setPosts(p => [post, ...p]);
    setNewPost('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Header />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* タイトル */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '28px',
            color: '#2C3E5F',
            fontWeight: '300',
            marginBottom: '8px',
            letterSpacing: '0.08em',
          }}>
            みんなの揺らぎ広場
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#4A4A4A',
            fontWeight: '300',
            letterSpacing: '0.03em',
          }}>
            仲間とつながる、あなたの居場所
          </p>
        </div>

        {/* 投稿フォーム or ログイン誘導 */}
        {isLoggedIn ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #F0F0F0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFF4CC, #F0F0F0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
                border: '1px solid #E8EAF0',
              }}>
                🕊️
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="今日の気持ちや体調をシェアしませんか？"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px 16px',
                    border: '1px solid #F0F0F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '300',
                    color: '#4A4A4A',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.7',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    style={{
                      padding: '10px 28px',
                      background: newPost.trim() ? '#2C3E5F' : '#CCC',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '300',
                      cursor: newPost.trim() ? 'pointer' : 'not-allowed',
                      letterSpacing: '0.05em',
                      transition: 'background 0.3s',
                    }}
                  >
                    投稿する
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #FFF4CC 0%, #F0F0F0 100%)',
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#2C3E5F',
              fontWeight: '300',
              marginBottom: '16px',
              lineHeight: '1.7',
            }}>
              あなたの声を聞かせてください
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: '#2C3E5F',
                color: '#FFFFFF',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '300',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'opacity 0.3s',
              }}
            >
              ログインして参加する
            </Link>
          </div>
        )}

        {/* タイムライン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #F0F0F0',
              }}
            >
              {/* ヘッダー */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFF4CC, #F0F0F0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  border: '1px solid #E8EAF0',
                  flexShrink: 0,
                }}>
                  {post.avatar}
                </div>
                <div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    color: '#2C3E5F',
                    letterSpacing: '0.03em',
                  }}>
                    {post.author}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    fontWeight: '300',
                    marginTop: '2px',
                  }}>
                    {post.time}
                  </div>
                </div>
              </div>

              {/* 本文 */}
              <p style={{
                fontSize: '14px',
                color: '#4A4A4A',
                lineHeight: '1.85',
                fontWeight: '300',
                marginBottom: '16px',
              }}>
                {post.content}
              </p>

              {/* いいねボタン */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid #F0F0F0',
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: post.liked ? '#FFF0F0' : 'transparent',
                    border: post.liked ? '1px solid #FFD0D0' : '1px solid transparent',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: post.liked ? '#D32F2F' : '#999',
                    cursor: 'pointer',
                    fontWeight: '300',
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{post.liked ? '❤️' : '🤍'}</span>
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
