'use client';

import { useState } from 'react';
import Header from '../components/Header';

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const posts = [
    {
      id: 1,
      author: 'さくら',
      avatar: '🌸',
      time: '2時間前',
      category: '症状について',
      title: 'ホットフラッシュとの付き合い方',
      content: '最近、急に暑くなることが増えて困っていました。でも、通気性の良い服を着るようにしたら少し楽になりました。みなさんはどう対処していますか？',
      likes: 12,
      comments: 5
    },
    {
      id: 2,
      author: 'ゆき',
      avatar: '❄️',
      time: '5時間前',
      category: '気持ちの共有',
      title: '今日は調子がいい日です',
      content: '久しぶりに朝から体が軽くて、散歩に行けました。こういう日があるから頑張れます。🌙',
      likes: 28,
      comments: 8
    }
  ];

  const categories = ['すべて', '症状について', '気持ちの共有', '生活の工夫', '励まし合い'];

  const filteredPosts = selectedCategory === 'すべて' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          color: '#2C3E5F', 
          fontWeight: '300', 
          marginBottom: '8px',
          letterSpacing: '0.05em'
        }}>
          コミュニティ 💬
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: '#4A4A4A', 
          marginBottom: '40px',
          fontWeight: '300'
        }}>
          同じ経験をしている仲間と、想いを共有しましょう
        </p>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '10px 24px',
                background: selectedCategory === category ? '#2C3E5F' : '#FFFFFF',
                color: selectedCategory === category ? '#FFFFFF' : '#4A4A4A',
                border: `1px solid ${selectedCategory === category ? '#2C3E5F' : '#F0F0F0'}`,
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '300',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.03em'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredPosts.map(post => (
            <div key={post.id} style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #F0F0F0',
              transition: 'box-shadow 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFF4CC, #F0F0F0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: '1px solid #E8EAF0'
                }}>
                  {post.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '300', color: '#2C3E5F' }}>
                    {post.author}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '300' }}>
                    {post.time}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  padding: '6px 16px',
                  background: '#F0F0F0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#4A4A4A',
                  fontWeight: '300'
                }}>
                  {post.category}
                </div>
              </div>
              
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '400', 
                color: '#2C3E5F', 
                marginBottom: '12px',
                letterSpacing: '0.03em'
              }}>
                {post.title}
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#4A4A4A', 
                lineHeight: '1.8', 
                marginBottom: '20px',
                fontWeight: '300'
              }}>
                {post.content}
              </p>
              
              <div style={{
                display: 'flex',
                gap: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #F0F0F0'
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#4A4A4A',
                  cursor: 'pointer',
                  fontWeight: '300',
                  transition: 'background 0.3s'
                }}>
                  <span style={{ fontSize: '16px' }}>❤️</span>
                  <span>{post.likes}</span>
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#4A4A4A',
                  cursor: 'pointer',
                  fontWeight: '300',
                  transition: 'background 0.3s'
                }}>
                  <span style={{ fontSize: '16px' }}>💬</span>
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}