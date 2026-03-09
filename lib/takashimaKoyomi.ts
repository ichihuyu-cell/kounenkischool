// 高島暦データベース

export const rokuyo = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'];

export const juniChoku = {
  '建': { name: '建', fortune: '◎', good: ['開店', '移転', '旅行', '新規事業'], bad: ['土木工事'] },
  '除': { name: '除', fortune: '○', good: ['厄除け', '治療', '掃除'], bad: ['婚礼', '移転'] },
  '満': { name: '満', fortune: '◎', good: ['新規事業', '移転', '婚礼'], bad: ['土木工事'] },
  '平': { name: '平', fortune: '○', good: ['旅行', '婚礼'], bad: ['建築'] },
  '定': { name: '定', fortune: '◎', good: ['開店', '契約', '移転', '種まき'], bad: ['訴訟', '旅行'] },
  '執': { name: '執', fortune: '○', good: ['婚礼', '種まき', '造作'], bad: ['金銭取引'] },
  '破': { name: '破', fortune: '×', good: [], bad: ['婚礼', '祝い事', '契約'] },
  '危': { name: '危', fortune: '△', good: [], bad: ['登山', '高所作業', '旅行'] },
  '成': { name: '成', fortune: '◎', good: ['開店', '婚礼', '移転', '新規事業'], bad: ['訴訟', '談判'] },
  '納': { name: '納', fortune: '○', good: ['収穫', '商品購入', '納品'], bad: ['婚礼', '見合い'] },
  '開': { name: '開', fortune: '◎', good: ['開店', '婚礼', '建築', '移転'], bad: ['葬式'] },
  '閉': { name: '閉', fortune: '×', good: ['金銭収納', '墓作り'], bad: ['開店', '婚礼', '旅行'] }
};

export function getTodayRokuyo(): string {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const index = (month + day) % 6;
  return rokuyo[index];
}

export function getRokuyoInfo(rokuyoName: string) {
  const info: Record<string, any> = {
    '大安': {
      fortune: '◎◎◎',
      description: '大いに安し。万事に吉。一日中何をするにも良い日。',
      good: ['婚礼', '開店', '移転', '旅行', '契約', '財布購入', '建築', '新規事業'],
      bad: [],
      color: '#2C3E5F',
      advice: '何事を始めるにも最良の日です。大切な決断や新しいスタートに最適。'
    },
    '友引': {
      fortune: '◎◎',
      description: '友を引く。慶事には吉。午前・夕方・夜が吉。',
      good: ['婚礼', '祝い事', '契約'],
      bad: ['葬式'],
      color: '#4A4A4A',
      advice: '良いことも悪いことも友を引く日。慶事には最適ですが、葬儀は避けましょう。'
    },
    '先勝': {
      fortune: '◎',
      description: '先んずれば勝つ。午前中が吉、午後は凶。',
      good: ['午前中の行事', '急ぎの用事'],
      bad: ['午後の重要事項'],
      color: '#666',
      advice: '午前中に大切なことを済ませましょう。午後は控えめに。'
    },
    '先負': {
      fortune: '○',
      description: '先んずれば負ける。午前中は凶、午後は吉。',
      good: ['午後の行事', '控えめな行動'],
      bad: ['午前中の重要事項', '急ぎの用事'],
      color: '#888',
      advice: '午前中は静かに過ごし、午後から活動しましょう。'
    },
    '仏滅': {
      fortune: '×',
      description: '仏も滅する大凶日。万事に凶。',
      good: ['終わらせること', '掃除', '整理整頓'],
      bad: ['婚礼', '開店', '移転', '新規事業', '契約'],
      color: '#999',
      advice: '新しいことは避け、今あることを整理する日に。静かに過ごしましょう。'
    },
    '赤口': {
      fortune: '△',
      description: '赤は火と血を連想。正午のみ吉、朝夕は凶。',
      good: ['正午の行事'],
      bad: ['火の取り扱い', '刃物の使用', '訴訟'],
      color: '#C33',
      advice: '午前11時〜午後1時のみ吉。それ以外は注意が必要です。'
    }
  };
  return info[rokuyoName] || info['大安'];
}

export function getTodayJuniChoku() {
  const today = new Date();
  const day = today.getDate();
  const chokuList = Object.keys(juniChoku);
  const index = day % chokuList.length;
  return chokuList[index];
}

export function checkPurpose(rokuyoName: string, chokuName: string, purpose: string): { result: string; advice: string } {
  const rokuyoInfo = getRokuyoInfo(rokuyoName);
  const chokuInfo = juniChoku[chokuName as keyof typeof juniChoku];

  const isRokuyoGood = rokuyoInfo.good.some((item: string) => item.includes(purpose));
  const isRokuyoBad = rokuyoInfo.bad.some((item: string) => item.includes(purpose));
  const isChokuGood = chokuInfo.good.some(item => item.includes(purpose));
  const isChokuBad = chokuInfo.bad.some(item => item.includes(purpose));

  if (isRokuyoGood && isChokuGood) {
    return { result: '◎ 大吉', advice: `${purpose}には最適な日です。自信を持って進めましょう。` };
  } else if (isRokuyoGood || isChokuGood) {
    return { result: '○ 吉', advice: `${purpose}に良い日です。前向きに取り組めます。` };
  } else if (isRokuyoBad || isChokuBad) {
    return { result: '× 凶', advice: `${purpose}は避けた方が良い日です。別の日を検討しましょう。` };
  } else {
    return { result: '△ 普通', advice: `${purpose}には可もなく不可もない日です。` };
  }
}

export function getOverallFortune(rokuyoName: string, chokuName: string): { level: string; color: string } {
  const rokuyoInfo = getRokuyoInfo(rokuyoName);
  const chokuInfo = juniChoku[chokuName as keyof typeof juniChoku];

  const rokuyoScore = rokuyoInfo.fortune === '◎◎◎' ? 3 : rokuyoInfo.fortune === '◎◎' ? 2 : rokuyoInfo.fortune === '◎' ? 1 : rokuyoInfo.fortune === '○' ? 0 : rokuyoInfo.fortune === '△' ? -1 : -2;
  const chokuScore = chokuInfo.fortune === '◎' ? 1 : chokuInfo.fortune === '○' ? 0 : chokuInfo.fortune === '△' ? -1 : -2;

  const total = rokuyoScore + chokuScore;

  if (total >= 3) return { level: '大吉', color: '#2C3E5F' };
  if (total >= 1) return { level: '吉', color: '#4A4A4A' };
  if (total >= 0) return { level: '中吉', color: '#666' };
  if (total >= -1) return { level: '小吉', color: '#888' };
  return { level: '凶', color: '#999' };
}

export const kyuseiData = {
  '一白水星': { element: '水', direction: '北', color: '白', lucky: ['1日', '11日', '21日'], trait: '柔軟で適応力がある' },
  '二黒土星': { element: '土', direction: '南西', color: '黒', lucky: ['2日', '12日', '22日'], trait: '堅実で面倒見が良い' },
  '三碧木星': { element: '木', direction: '東', color: '青', lucky: ['3日', '13日', '23日'], trait: '活発で行動力がある' },
  '四緑木星': { element: '木', direction: '東南', color: '緑', lucky: ['4日', '14日', '24日'], trait: '穏やかで社交的' },
  '五黄土星': { element: '土', direction: '中央', color: '黄', lucky: ['5日', '15日', '25日'], trait: '強い意志と統率力' },
  '六白金星': { element: '金', direction: '北西', color: '白', lucky: ['6日', '16日', '26日'], trait: '気品があり責任感が強い' },
  '七赤金星': { element: '金', direction: '西', color: '赤', lucky: ['7日', '17日', '27日'], trait: '社交的で明るい' },
  '八白土星': { element: '土', direction: '北東', color: '白', lucky: ['8日', '18日', '28日'], trait: '真面目で粘り強い' },
  '九紫火星': { element: '火', direction: '南', color: '紫', lucky: ['9日', '19日', '29日'], trait: '情熱的で華やか' }
};

export function getHonmeiSei(birthYear: number): string {
  const yearTable: Record<number, string> = {
    1960: '三碧木星', 1961: '二黒土星', 1962: '一白水星', 1963: '九紫火星', 1964: '八白土星',
    1965: '七赤金星', 1966: '六白金星', 1967: '六白金星', 1968: '五黄土星', 1969: '四緑木星',
    1970: '三碧木星', 1971: '二黒土星', 1972: '一白水星', 1973: '九紫火星', 1974: '八白土星',
    1975: '七赤金星', 1976: '六白金星', 1977: '五黄土星', 1978: '四緑木星', 1979: '三碧木星',
    1980: '二黒土星', 1981: '一白水星', 1982: '九紫火星', 1983: '八白土星', 1984: '七赤金星',
    1985: '六白金星', 1986: '五黄土星', 1987: '四緑木星', 1988: '三碧木星', 1989: '二黒土星',
    1990: '一白水星', 1991: '九紫火星', 1992: '八白土星', 1993: '七赤金星', 1994: '六白金星',
    1995: '五黄土星', 1996: '四緑木星', 1997: '三碧木星', 1998: '二黒土星', 1999: '一白水星',
    2000: '九紫火星', 2001: '八白土星', 2002: '七赤金星', 2003: '六白金星', 2004: '五黄土星',
    2005: '四緑木星', 2006: '三碧木星', 2007: '二黒土星', 2008: '一白水星', 2009: '九紫火星',
    2010: '八白土星', 2015: '三碧木星', 2020: '七赤金星', 2025: '二黒土星'
  };

  if (yearTable[birthYear]) {
    return yearTable[birthYear];
  }

  const baseYear = 1962;
  const diff = birthYear - baseYear;
  const stars = ['一白水星', '九紫火星', '八白土星', '七赤金星', '六白金星', '五黄土星', '四緑木星', '三碧木星', '二黒土星'];
  const index = (9 - (diff % 9)) % 9;
  return stars[index];
}

export function getPersonalFortune(birthDate: string, rokuyoName: string, chokuName: string): { level: string; message: string; color: string } {
  const birth = new Date(birthDate);
  const birthYear = birth.getFullYear();
  const birthMonth = birth.getMonth() + 1;
  const birthDay = birth.getDate();

  const honmeiSei = getHonmeiSei(birthYear);
  const kyuseiInfo = kyuseiData[honmeiSei as keyof typeof kyuseiData];

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  // ===== 基礎スコア（高島暦） =====
  const basicFortune = getOverallFortune(rokuyoName, chokuName);
  let score = basicFortune.level === '大吉' ? 5 : basicFortune.level === '吉' ? 3 : basicFortune.level === '中吉' ? 2 : basicFortune.level === '小吉' ? 1 : 0;

  // ===== 生年月日固有の運勢（大きく差をつける） =====
  const uniqueHash = (birthYear * 31 + birthMonth * 37 + birthDay * 41) % 13;
  const inherentLuck = uniqueHash - 6; // -6〜+6の範囲
  score += inherentLuck;

  // ===== 今日との相性 =====
  const dayDiff = Math.min(Math.abs(todayDay - birthDay), 30 - Math.abs(todayDay - birthDay));
  if (dayDiff <= 2) score += 4;
  else if (dayDiff <= 5) score += 2;

  if (todayMonth === birthMonth) score += 3;
  else if (Math.abs(todayMonth - birthMonth) === 6) score -= 1;

  const isLuckyDay = kyuseiInfo.lucky.some(day => parseInt(day) === todayDay);
  if (isLuckyDay) score += 3;

  const age = todayYear - birthYear;
  if (age % 9 === 0) score += 2;
  if (age % 12 === 0) score += 2;

  const birthDigitSum = (birthYear + birthMonth + birthDay) % 9 || 9;
  const todayDigitSum = (todayYear + todayMonth + todayDay) % 9 || 9;
  if (birthDigitSum === todayDigitSum) score += 3;
  else if ((birthDigitSum + todayDigitSum) % 9 === 0) score += 1;

  const biorhythm = Math.sin((todayDay - birthDay) * Math.PI / 23);
  if (biorhythm > 0.7) score += 2;
  else if (biorhythm < -0.7) score -= 2;

  let level = '';
  let message = '';
  let color = '';

  if (score >= 12) {
    level = '◎◎◎ あなたにとって最高の日';
    message = `今日は${honmeiSei}のあなたにとって奇跡的な日！生まれ持った星と今日の暦が完璧に呼応しています。大きな決断、新しいスタート、大切な人への言葉——すべてが輝きます。`;
    color = '#2C3E5F';
  } else if (score >= 8) {
    level = '◎◎ あなたにとって大吉の日';
    message = `今日は${honmeiSei}のあなたにとって素晴らしい運気の日。高島暦も後押しして、何をしても良い方向へ進みやすい日です。積極的に行動しましょう。`;
    color = '#4A6FA5';
  } else if (score >= 5) {
    level = '◎ あなたにとって吉の日';
    message = `今日は${honmeiSei}のあなたにとって良い日。穏やかな追い風が吹いています。自分らしく丁寧に過ごすことで、良い流れが生まれます。`;
    color = '#5a7fb5';
  } else if (score >= 2) {
    level = '○ あなたにとって普通の日';
    message = `今日は${honmeiSei}のあなたにとって平穏な日。特別なことはないけれど、日常の中に小さな喜びが見つかります。マイペースで過ごして。`;
    color = '#888';
  } else if (score >= -1) {
    level = '△ あなたにとって慎重な日';
    message = `今日は${honmeiSei}のあなたにとって少し慎重に過ごす日。無理に動かず、休息や内省に充てると◎。明日への準備期間と思いましょう。`;
    color = '#999';
  } else {
    level = '▽ あなたにとって静養の日';
    message = `今日は${honmeiSei}のあなたにとって静かに過ごす日。大きな決断や新規事業は別の日に。自分を労わり、ゆっくり休むことが最善です。`;
    color = '#aaa';
  }

  return { level, message, color };
}