import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { birthDate, bloodType, rokuyoName, chokuName, honmeiSei } = await req.json();

  // 開発中のモック（APIキー不要）
  const message = `${honmeiSei}のあなたへ。今日は${rokuyoName}の日、${bloodType}型らしい直感を大切に。更年期の波も、月の満ち欠けのように自然なリズム。今日のラッキーアクション：深呼吸を3回してから一日をスタートさせて。`;

  return NextResponse.json({ message });
}