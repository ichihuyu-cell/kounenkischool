import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://taplog-pink.vercel.app',
  'http://localhost:3000',
];

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

interface LogEntry {
  condition: string;
  symptoms?: string[];
  factors?: string[];
  timestamp?: string;
}

interface RequestBody {
  logs: Record<string, LogEntry>;
}

const CONDITIONS: Record<string, string> = {
  good: 'まあまあ良い',
  neutral: 'ふつう',
  bad: 'しんどい',
};

const SYMPTOMS: Record<string, string> = {
  hotflash: 'ほてり・のぼせ',
  headache: '頭痛・頭重',
  fatigue: 'だるさ・疲れ',
  insomnia: '眠れない',
  irritable: 'イライラ・落ち込み',
};

const FACTORS: Record<string, string> = {
  lowpressure: '低気圧・雨天',
  newmoon: '新月',
  fullmoon: '満月',
  stress: 'ストレス多め',
  sleep: '睡眠不足',
  exercise: '運動不足',
};

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  try {
    const body: RequestBody = await req.json();
    const { logs } = body;

    if (!logs || typeof logs !== 'object') {
      return NextResponse.json(
        { error: '記録データが必要です' },
        { status: 400, headers }
      );
    }

    const entries = Object.entries(logs).sort(([a], [b]) => a.localeCompare(b));

    if (entries.length < 2) {
      return NextResponse.json(
        { error: '分析には2日分以上の記録が必要です' },
        { status: 400, headers }
      );
    }

    // ログデータを整形
    const summary = entries.map(([date, log]) => {
      const cond = CONDITIONS[log.condition] || '不明';
      const syms = (log.symptoms || []).map(id => SYMPTOMS[id] || id).join(', ');
      const facs = (log.factors || []).map(id => FACTORS[id] || id).join(', ');
      return `${date}: 体調=${cond}, 症状=[${syms}], 要因=[${facs}]`;
    }).join('\n');

    const prompt = `以下は更年期の体調記録データです。このデータを分析して、以下の形式で日本語で回答してください。

【分析データ】
${summary}

【回答形式】
1. 📊 全体の傾向（不調率、体調の波のパターンなど、具体的な数値を含めて）
2. 🔥 よく出る症状TOP3とその頻度
3. 🌧️ 不調を引き起こしやすい要因（低気圧、月の満ち欠け、ストレスなど相関があれば）
4. 💡 あなたへのアドバイス（具体的なセルフケアの提案）
5. 🌙 次に気をつけたい時期の予測

※医療的な診断ではなく、記録データに基づく傾向分析として回答してください。温かく寄り添うトーンでお願いします。`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('AI Analysis error: ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'APIキーが設定されていません。' },
        { status: 500, headers }
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json(
      { analysis: text, entries_count: entries.length },
      { headers }
    );
  } catch (e: unknown) {
    if (e instanceof Anthropic.APIError) {
      console.error('AI Analysis API error:', e.status, e.message, e.error);
      return NextResponse.json(
        { error: `AI分析でエラーが発生しました（${e.status}）。しばらくしてから再度お試しください。` },
        { status: 500, headers }
      );
    }
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('AI Analysis error:', message);
    return NextResponse.json(
      { error: '分析に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500, headers }
    );
  }
}
