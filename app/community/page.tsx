'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Header from '../components/Header';

interface Reply {
  id: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: Timestamp | null;
}

interface Post {
  id: string;
  author: string;
  authorId: string;
  content: string;
  likes: number;
  likedBy: string[];
  tag?: string;
  replies: Reply[];
  createdAt: Timestamp | null;
}

/* CSS三角形で針葉樹を作るヘルパー */
function TreeSilhouette({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  const baseX = isLeft ? -10 : -10;
  const treeColor = '#061208';
  const trunkColor = '#081A0B';

  return (
    <div style={{
      position: 'absolute',
      [side]: 0,
      bottom: 0,
      width: '140px',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden',
    }}>
      {/* 木1（大きい） */}
      <div style={{ position: 'absolute', bottom: 0, [isLeft ? 'left' : 'right']: `${baseX + 15}px` }}>
        {/* 幹 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '14px',
          height: '120px',
          background: trunkColor,
        }} />
        {/* 葉（三角形を3段重ね） */}
        {[
          { bottom: 100, size: 80, height: 70 },
          { bottom: 150, size: 65, height: 60 },
          { bottom: 195, size: 50, height: 50 },
        ].map((layer, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: `${layer.bottom}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `${layer.size / 2}px solid transparent`,
            borderRight: `${layer.size / 2}px solid transparent`,
            borderBottom: `${layer.height}px solid ${treeColor}`,
          }} />
        ))}
      </div>

      {/* 木2（中くらい） */}
      <div style={{ position: 'absolute', bottom: 0, [isLeft ? 'left' : 'right']: `${baseX + 65}px` }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '80px',
          background: trunkColor,
        }} />
        {[
          { bottom: 65, size: 60, height: 55 },
          { bottom: 105, size: 46, height: 45 },
          { bottom: 138, size: 32, height: 35 },
        ].map((layer, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: `${layer.bottom}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `${layer.size / 2}px solid transparent`,
            borderRight: `${layer.size / 2}px solid transparent`,
            borderBottom: `${layer.height}px solid ${treeColor}`,
          }} />
        ))}
      </div>

      {/* 木3（小さい、奥行き感） */}
      <div style={{ position: 'absolute', bottom: 0, [isLeft ? 'left' : 'right']: `${baseX + 110}px` }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '8px',
          height: '60px',
          background: 'rgba(8,26,11,0.7)',
        }} />
        {[
          { bottom: 48, size: 44, height: 40 },
          { bottom: 78, size: 32, height: 32 },
          { bottom: 102, size: 22, height: 25 },
        ].map((layer, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: `${layer.bottom}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `${layer.size / 2}px solid transparent`,
            borderRight: `${layer.size / 2}px solid transparent`,
            borderBottom: `${layer.height}px solid rgba(6,18,8,0.7)`,
          }} />
        ))}
      </div>
    </div>
  );
}

function formatTime(timestamp: Timestamp | null): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp.toMillis();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  const d = timestamp.toDate();
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);
  const [avatarCache, setAvatarCache] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestoreからリアルタイムで投稿を取得
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          author: data.author || 'ゲスト',
          authorId: data.authorId || '',
          content: data.content || '',
          likes: data.likes || 0,
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          tag: data.tag || undefined,
          replies: Array.isArray(data.replies) ? data.replies : [],
          createdAt: data.createdAt || null,
        };
      });
      setPosts(postsData);
      setPostsLoading(false);
    }, (error) => {
      console.error('Firestore onSnapshot error:', error);
      setPostsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 投稿者のアバターを読み込み
  useEffect(() => {
    const replyAuthorIds = posts.flatMap(p => (p.replies || []).map(r => r.authorId)).filter(Boolean);
    const authorIds = [...new Set([...posts.map(p => p.authorId), ...replyAuthorIds].filter(Boolean))];
    const missing = authorIds.filter(id => !(id in avatarCache));
    if (missing.length === 0) return;
    Promise.all(missing.map(async (uid) => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        return [uid, snap.exists() && snap.data().avatarSvg ? snap.data().avatarSvg : ''] as const;
      } catch { return [uid, ''] as const; }
    })).then(results => {
      const newCache: Record<string, string> = {};
      results.forEach(([uid, avatar]) => { newCache[uid] = avatar; });
      setAvatarCache(prev => ({ ...prev, ...newCache }));
    });
  }, [posts, avatarCache]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const postRef = doc(db, 'posts', postId);
    const alreadyLiked = post.likedBy?.includes(user.uid);
    await updateDoc(postRef, {
      likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
      likedBy: alreadyLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        author: user.displayName || 'ゲスト',
        authorId: user.uid,
        content: newPost.trim(),
        likes: 0,
        likedBy: [],
        replies: [],
        createdAt: Timestamp.now(),
      });
      setNewPost('');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyText.trim() || !user) return;
    const postRef = doc(db, 'posts', postId);
    const reply: Reply = {
      id: `${Date.now()}_${user.uid}`,
      author: user.displayName || 'ゲスト',
      authorId: user.uid,
      content: replyText.trim(),
      createdAt: Timestamp.now(),
    };
    await updateDoc(postRef, {
      replies: arrayUnion(reply),
    });
    setReplyText('');
    setReplyingTo(null);
  };

  const isLoggedIn = !authLoading && !!user;
  const serif = '"Noto Serif JP", Georgia, "Times New Roman", serif';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06120A 0%, #0A1F14 15%, #0E2A3A 45%, #132D48 70%, #0F2235 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />

      {/* 森の夜空エリア — ページ全体を覆う */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ===== 星空 ===== */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            radial-gradient(1.2px 1.2px at 8% 12%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 18% 28%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 32% 8%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 20%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1.3px 1.3px at 58% 6%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 72% 16%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 88% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 95% 22%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 12% 42%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 28% 38%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 65% 32%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 82% 36%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 15%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 38% 25%, rgba(255,255,255,0.2) 0%, transparent 100%)
          `,
          pointerEvents: 'none',
        }} />

        {/* ===== 月の光（にじみ効果） ===== */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,230,150,0.08) 0%, rgba(255,230,150,0.03) 30%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* ===== 左の木々 ===== */}
        <TreeSilhouette side="left" />

        {/* ===== 右の木々 ===== */}
        <TreeSilhouette side="right" />

        {/* ===== 地面（草のシルエット） ===== */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(180deg, transparent 0%, #06120A 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* ===== メインコンテンツ ===== */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '640px',
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}>

          {/* ── 満月 ── */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{
              position: 'relative',
              width: '90px',
              height: '90px',
              margin: '0 auto',
            }}>
              {/* 最外層グロウ */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,230,150,0.12) 0%, rgba(255,230,150,0.04) 40%, transparent 70%)',
              }} />
              {/* 中間グロウ */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,224,130,0.2) 0%, rgba(255,224,130,0.06) 50%, transparent 70%)',
              }} />
              {/* 月本体 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 35%, #FFFDE7 0%, #FFF8E1 25%, #FFE082 60%, #FFD54F 100%)',
                boxShadow: '0 0 30px rgba(255,224,130,0.5), 0 0 60px rgba(255,224,130,0.25), 0 0 100px rgba(255,224,130,0.1)',
              }}>
                {/* 月の模様（クレーター） */}
                <div style={{ position: 'absolute', top: '20px', left: '28px', width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(200,170,80,0.2)' }} />
                <div style={{ position: 'absolute', top: '40px', left: '48px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(200,170,80,0.15)' }} />
                <div style={{ position: 'absolute', top: '52px', left: '24px', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(200,170,80,0.18)' }} />
                <div style={{ position: 'absolute', top: '30px', left: '55px', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(200,170,80,0.12)' }} />
              </div>
            </div>
          </div>

          {/* ── タイトル ── */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '28px',
              color: '#F5F0E1',
              fontWeight: '400',
              marginBottom: '12px',
              letterSpacing: '0.15em',
              fontFamily: serif,
              textShadow: '0 0 20px rgba(255,224,130,0.15)',
            }}>
              みんなの揺らぎ広場
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'rgba(245,240,225,0.5)',
              fontWeight: '300',
              letterSpacing: '0.1em',
              fontFamily: serif,
            }}>
              月明かりの下、安心して語り合える場所
            </p>
          </div>

          {/* ── ログイン誘導 / 投稿フォーム ── */}
          {authLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'rgba(245,240,225,0.4)', fontSize: '14px', fontWeight: '300', fontFamily: serif }}>
                読み込み中...
              </p>
            </div>
          ) : isLoggedIn ? (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '40px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {user && avatarCache[user.uid] ? (
                  <img src={avatarCache[user.uid]} alt="" style={{
                    width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                    border: '1px solid rgba(255,224,130,0.15)', objectFit: 'cover',
                  }} />
                ) : (
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,224,130,0.25), rgba(255,255,255,0.06))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0, border: '1px solid rgba(255,224,130,0.15)',
                  }}>🕊️</div>
                )}
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="今日の気持ちや体調をシェアしませんか？"
                    style={{
                      width: '100%',
                      minHeight: '88px',
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '300',
                      color: '#F5F0E1',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: serif,
                      lineHeight: '1.8',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      onClick={handlePost}
                      disabled={!newPost.trim() || posting}
                      style={{
                        padding: '10px 28px',
                        background: newPost.trim()
                          ? 'linear-gradient(135deg, rgba(255,224,130,0.2), rgba(255,193,7,0.15))'
                          : 'rgba(255,255,255,0.04)',
                        color: newPost.trim() ? '#FFE082' : 'rgba(245,240,225,0.25)',
                        border: newPost.trim() ? '1px solid rgba(255,224,130,0.25)' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '400',
                        cursor: newPost.trim() ? 'pointer' : 'not-allowed',
                        letterSpacing: '0.08em',
                        fontFamily: serif,
                        transition: 'all 0.3s',
                      }}
                    >
                      {posting ? '投稿中...' : '投稿する'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '40px 28px',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🕊️</div>
              <p style={{
                fontSize: '16px',
                color: '#F5F0E1',
                fontWeight: '300',
                marginBottom: '8px',
                lineHeight: '1.8',
                fontFamily: serif,
                letterSpacing: '0.08em',
              }}>
                あなたの声を聞かせてください
              </p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(245,240,225,0.4)',
                fontWeight: '300',
                marginBottom: '28px',
                fontFamily: serif,
              }}>
                ログインすると投稿やいいねができます
              </p>
              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  padding: '14px 44px',
                  background: 'linear-gradient(135deg, rgba(255,224,130,0.18), rgba(255,193,7,0.12))',
                  color: '#FFE082',
                  border: '1px solid rgba(255,224,130,0.25)',
                  borderRadius: '28px',
                  fontSize: '15px',
                  fontWeight: '400',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  fontFamily: serif,
                  transition: 'all 0.3s',
                  textShadow: '0 0 12px rgba(255,224,130,0.3)',
                }}
              >
                ログインして広場へ入る
              </Link>
            </div>
          )}

          {/* ── 投稿一覧 ── */}
          {postsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'rgba(245,240,225,0.4)', fontSize: '14px', fontWeight: '300', fontFamily: serif }}>
                投稿を読み込み中...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'rgba(245,240,225,0.4)', fontSize: '14px', fontWeight: '300', fontFamily: serif }}>
                まだ投稿がありません。最初の一歩を踏み出してみませんか？
              </p>
            </div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map(post => (
              <div
                key={post.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.3s, border-color 0.3s',
                }}
              >
                {/* ヘッダー */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  {avatarCache[post.authorId] ? (
                    <img src={avatarCache[post.authorId]} alt="" style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover',
                    }} />
                  ) : (
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255,224,130,0.18), rgba(255,255,255,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0,
                    }}>🕊️</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '#F5F0E1',
                      letterSpacing: '0.06em',
                      fontFamily: serif,
                    }}>
                      {post.author}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(245,240,225,0.35)',
                      fontWeight: '300',
                      marginTop: '3px',
                    }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                  {post.tag && (
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(255,224,130,0.08)',
                      border: '1px solid rgba(255,224,130,0.12)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: 'rgba(255,224,130,0.65)',
                      fontWeight: '300',
                      letterSpacing: '0.03em',
                      fontFamily: serif,
                      whiteSpace: 'nowrap',
                    }}>
                      {post.tag}
                    </span>
                  )}
                </div>

                {/* 本文 */}
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(245,240,225,0.82)',
                  lineHeight: '1.95',
                  fontWeight: '300',
                  marginBottom: '16px',
                  fontFamily: serif,
                  letterSpacing: '0.03em',
                }}>
                  {post.content}
                </p>

                {/* アクションボタン */}
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {(() => {
                    const liked = user ? post.likedBy?.includes(user.uid) : false;
                    return (
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={!user}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: liked ? 'rgba(255,182,193,0.1)' : 'transparent',
                          border: liked ? '1px solid rgba(255,182,193,0.18)' : '1px solid transparent',
                          borderRadius: '20px',
                          fontSize: '13px',
                          color: liked ? '#FFB6C1' : 'rgba(245,240,225,0.35)',
                          cursor: user ? 'pointer' : 'default',
                          fontWeight: '300',
                          transition: 'all 0.3s',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{liked ? '❤️' : '🤍'}</span>
                        <span>{post.likes}</span>
                      </button>
                    );
                  })()}
                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        setReplyingTo(replyingTo === post.id ? null : post.id);
                        setReplyText('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: replyingTo === post.id ? 'rgba(255,224,130,0.08)' : 'transparent',
                        border: replyingTo === post.id ? '1px solid rgba(255,224,130,0.15)' : '1px solid transparent',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: replyingTo === post.id ? 'rgba(255,224,130,0.7)' : 'rgba(245,240,225,0.35)',
                        cursor: 'pointer',
                        fontWeight: '300',
                        transition: 'all 0.3s',
                        fontFamily: serif,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>返信{post.replies.length > 0 ? ` ${post.replies.length}` : ''}</span>
                    </button>
                  )}
                </div>

                {/* 返信入力フォーム */}
                {replyingTo === post.id && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {user && avatarCache[user.uid] ? (
                        <img src={avatarCache[user.uid]} alt="" style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          border: '1px solid rgba(255,224,130,0.1)', objectFit: 'cover',
                        }} />
                      ) : (
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(255,224,130,0.2), rgba(255,255,255,0.04))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', flexShrink: 0, border: '1px solid rgba(255,224,130,0.1)',
                        }}>🕊️</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`${post.author}さんに返信...`}
                          autoFocus
                          style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '300',
                            color: '#F5F0E1',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: serif,
                            lineHeight: '1.7',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            style={{
                              padding: '7px 18px',
                              background: 'transparent',
                              color: 'rgba(245,240,225,0.4)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: '300',
                              cursor: 'pointer',
                              fontFamily: serif,
                              transition: 'all 0.3s',
                            }}
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!replyText.trim()}
                            style={{
                              padding: '7px 20px',
                              background: replyText.trim()
                                ? 'linear-gradient(135deg, rgba(255,224,130,0.18), rgba(255,193,7,0.12))'
                                : 'rgba(255,255,255,0.03)',
                              color: replyText.trim() ? '#FFE082' : 'rgba(245,240,225,0.2)',
                              border: replyText.trim() ? '1px solid rgba(255,224,130,0.2)' : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: '400',
                              cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                              fontFamily: serif,
                              letterSpacing: '0.06em',
                              transition: 'all 0.3s',
                            }}
                          >
                            返信する
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 返信一覧 */}
                {post.replies.length > 0 && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    {post.replies.map(reply => (
                      <div
                        key={reply.id}
                        style={{
                          marginLeft: '20px',
                          paddingLeft: '16px',
                          borderLeft: '2px solid rgba(255,224,130,0.12)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          {avatarCache[reply.authorId] ? (
                            <img src={avatarCache[reply.authorId]} alt="" style={{
                              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                              border: '1px solid rgba(255,255,255,0.06)', objectFit: 'cover',
                            }} />
                          ) : (
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(255,224,130,0.12), rgba(255,255,255,0.03))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '13px', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
                            }}>🕊️</div>
                          )}
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '400',
                            color: 'rgba(245,240,225,0.7)',
                            fontFamily: serif,
                            letterSpacing: '0.04em',
                          }}>
                            {reply.author}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            color: 'rgba(245,240,225,0.3)',
                            fontWeight: '300',
                          }}>
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: 'rgba(245,240,225,0.7)',
                          lineHeight: '1.8',
                          fontWeight: '300',
                          fontFamily: serif,
                          letterSpacing: '0.02em',
                          margin: 0,
                        }}>
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── フッターメッセージ ── */}
          <div style={{
            textAlign: 'center',
            marginTop: '52px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{
              fontSize: '12px',
              color: 'rgba(245,240,225,0.25)',
              fontWeight: '300',
              fontFamily: serif,
              letterSpacing: '0.06em',
              lineHeight: '1.8',
            }}>
              この広場はみんなが安心できる場所です。温かい言葉を大切に。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
