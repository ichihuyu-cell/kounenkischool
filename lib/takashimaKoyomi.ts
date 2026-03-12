// 高島暦データベース

// 六曜: (旧暦月 + 旧暦日) % 6 のインデックス順
export const rokuyo = ['先勝', '友引', '先負', '仏滅', '大安', '赤口'];

// 旧暦の朔日（新月=旧暦1日）テーブル（2025年1月〜2027年12月）
// 各エントリは [西暦年, 西暦月, 西暦日, 旧暦月] を表す
const lunarNewMoons: [number, number, number, number][] = [
  // 2025年
  [2025, 1, 29, 1],  [2025, 2, 28, 2],  [2025, 3, 29, 3],  [2025, 4, 27, 4],
  [2025, 5, 27, 5],  [2025, 6, 25, 6],  [2025, 7, 25, 6.5], // 閏6月
  [2025, 8, 23, 7],  [2025, 9, 22, 8],  [2025, 10, 21, 9], [2025, 11, 20, 10],
  [2025, 12, 20, 11],
  // 2026年
  [2026, 1, 18, 12], [2026, 2, 17, 1],  [2026, 3, 19, 2],  [2026, 4, 17, 3],
  [2026, 5, 17, 4],  [2026, 6, 15, 5],  [2026, 7, 14, 6],  [2026, 8, 13, 7],
  [2026, 9, 11, 8],  [2026, 10, 10, 9], [2026, 11, 9, 10], [2026, 12, 9, 11],
  // 2027年
  [2027, 1, 7, 12],  [2027, 2, 6, 1],   [2027, 3, 8, 2],   [2027, 4, 6, 3],
  [2027, 5, 6, 4],   [2027, 6, 4, 5],   [2027, 7, 4, 6],   [2027, 8, 2, 7],
  [2027, 9, 1, 8],   [2027, 10, 1, 9],  [2027, 10, 30, 10], [2027, 11, 29, 11],
  [2027, 12, 29, 12],
];

// 新暦→旧暦変換
function solarToLunar(year: number, month: number, day: number): { lunarMonth: number; lunarDay: number } {
  const targetDate = new Date(year, month - 1, day);
  const targetTime = targetDate.getTime();

  // 対象日以前で最も近い朔日を見つける
  let bestIndex = 0;
  for (let i = 0; i < lunarNewMoons.length; i++) {
    const [sy, sm, sd] = lunarNewMoons[i];
    const nmDate = new Date(sy, sm - 1, sd);
    if (nmDate.getTime() <= targetTime) {
      bestIndex = i;
    } else {
      break;
    }
  }

  const [sy, sm, sd, lm] = lunarNewMoons[bestIndex];
  const nmDate = new Date(sy, sm - 1, sd);
  const diffDays = Math.round((targetTime - nmDate.getTime()) / (1000 * 60 * 60 * 24));
  const lunarDay = diffDays + 1;
  const lunarMonth = Math.floor(lm); // 閏月(6.5等)は整数部を使う

  return { lunarMonth, lunarDay };
}

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

export function getRokuyoByDate(year: number, month: number, day: number): string {
  const { lunarMonth, lunarDay } = solarToLunar(year, month, day);
  const index = (lunarMonth + lunarDay) % 6;
  return rokuyo[index];
}

export function getTodayRokuyo(): string {
  const today = new Date();
  return getRokuyoByDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
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

// ユリウス日（JDN）計算
function getJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 十二直の計算（節月と日の組み合わせで決まる）
// 基準日: 2026年1月1日 = JDN 2461408、この日の十二直を「建」(index=0)と仮定し調整
const JUNI_CHOKU_BASE_JDN = 2461408; // 2026-01-01
const JUNI_CHOKU_BASE_INDEX = 4; // 2026-01-01 の十二直インデックス（定）

const juniChokuList = ['建', '除', '満', '平', '定', '執', '破', '危', '成', '納', '開', '閉'];

export function getJuniChokuByDate(year: number, month: number, day: number): string {
  const jdn = getJDN(year, month, day);
  const diff = jdn - JUNI_CHOKU_BASE_JDN;
  const index = ((diff % 12) + JUNI_CHOKU_BASE_INDEX) % 12;
  const normalizedIndex = ((index % 12) + 12) % 12;
  return juniChokuList[normalizedIndex];
}

export function getTodayJuniChoku() {
  const today = new Date();
  return getJuniChokuByDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

// 二十八宿データ
export const nijuhassuku: Record<string, { name: string; fortune: string; meaning: string; good: string[]; bad: string[] }> = {
  '角': { name: '角', fortune: '吉', meaning: '万事に吉。衣類の裁断、柱立て、結婚に良い', good: ['結婚', '建築', '衣類裁断', '旅行'], bad: ['葬儀'] },
  '亢': { name: '亢', fortune: '凶', meaning: '物事が強くなりすぎる日。控えめに', good: ['種まき', '収穫'], bad: ['婚礼', '建築', '旅行'] },
  '氐': { name: '氐', fortune: '吉', meaning: '万事に吉。特に結婚、開店、種まきに良い', good: ['結婚', '開店', '種まき', '酒造り'], bad: ['水に関すること'] },
  '房': { name: '房', fortune: '大吉', meaning: '何事にも大吉。特に結婚、旅行、移転に良い', good: ['結婚', '旅行', '移転', '開店', '建築'], bad: [] },
  '心': { name: '心', fortune: '凶', meaning: '盗難に注意。神仏の祭祀のみ吉', good: ['祭祀', '神事'], bad: ['旅行', '建築', '結婚'] },
  '尾': { name: '尾', fortune: '吉', meaning: '結婚、建築、開店に吉。事始めに良い', good: ['結婚', '建築', '開店', '移転'], bad: ['衣類裁断'] },
  '箕': { name: '箕', fortune: '吉', meaning: '動土、池堀り、仕入れに吉。学問始めに良い', good: ['仕入れ', '動土', '学問始め', '酒造り'], bad: ['結婚', '葬儀'] },
  '斗': { name: '斗', fortune: '吉', meaning: '土掘り、建築、開店に吉', good: ['建築', '開店', '動土', '造作'], bad: ['衣類裁断'] },
  '牛': { name: '牛', fortune: '凶', meaning: '万事に慎むべき日。午前中のみ吉', good: ['午前中の行事'], bad: ['結婚', '旅行', '移転'] },
  '女': { name: '女', fortune: '凶', meaning: '何事にも凶。葬儀、訴訟のみ可', good: ['葬儀'], bad: ['結婚', '建築', '旅行', '契約'] },
  '虚': { name: '虚', fortune: '凶', meaning: '入学、習い事始めに吉。他は凶', good: ['入学', '習い事'], bad: ['結婚', '建築', '契約'] },
  '危': { name: '危', fortune: '凶', meaning: '何事にも危険な日。壁塗り、酒造りのみ吉', good: ['壁塗り', '酒造り'], bad: ['結婚', '旅行', '建築', '高所作業'] },
  '室': { name: '室', fortune: '吉', meaning: '結婚、旅行、建築、祈願に大吉', good: ['結婚', '旅行', '建築', '祈願', '祭祀'], bad: [] },
  '壁': { name: '壁', fortune: '大吉', meaning: '開店、旅行、結婚、建築など万事に大吉', good: ['開店', '旅行', '結婚', '建築', '衣類裁断'], bad: [] },
  '奎': { name: '奎', fortune: '大吉', meaning: '開店、建築、移転など万事に大吉', good: ['開店', '建築', '移転', '結婚', '旅行'], bad: [] },
  '婁': { name: '婁', fortune: '吉', meaning: '動土、建築、種まきに吉', good: ['建築', '種まき', '動土', '結婚'], bad: [] },
  '胃': { name: '胃', fortune: '吉', meaning: '開店、移転に吉。就職にも良い', good: ['開店', '移転', '就職', '求人'], bad: ['葬儀'] },
  '昴': { name: '昴', fortune: '吉', meaning: '神仏への祈願、結婚に吉', good: ['祈願', '結婚', '開店'], bad: ['建築', '動土'] },
  '畢': { name: '畢', fortune: '吉', meaning: '建築、農事に吉。契約にも良い', good: ['建築', '農事', '契約', '婚礼'], bad: ['旅行'] },
  '觜': { name: '觜', fortune: '凶', meaning: '入学、習い事に吉。他は凶', good: ['入学', '習い事', '稽古始め'], bad: ['結婚', '建築', '旅行'] },
  '参': { name: '参', fortune: '吉', meaning: '旅行、仕入れ、縁談に吉', good: ['旅行', '仕入れ', '結婚', '養子縁組'], bad: ['葬儀'] },
  '井': { name: '井', fortune: '吉', meaning: '神仏の祈願、種まき、動土に吉', good: ['祈願', '種まき', '動土', '建築'], bad: ['衣類裁断'] },
  '鬼': { name: '鬼', fortune: '大吉', meaning: '二十八宿中最大の吉日。万事大吉', good: ['結婚', '開店', '建築', '旅行', '契約', '移転'], bad: [''] },
  '柳': { name: '柳', fortune: '凶', meaning: '万事に凶。特に結婚、種まきは大凶', good: ['葬儀'], bad: ['結婚', '建築', '種まき', '契約'] },
  '星': { name: '星', fortune: '凶', meaning: '治療始め、便所改造のみ吉。他は凶', good: ['治療始め'], bad: ['結婚', '建築', '旅行', '葬儀'] },
  '張': { name: '張', fortune: '大吉', meaning: '結婚、就職、神仏祈願、種まきに大吉', good: ['結婚', '就職', '祈願', '種まき', '養蚕'], bad: [] },
  '翼': { name: '翼', fortune: '凶', meaning: '種まき、動土に吉。旅行、結婚は凶', good: ['種まき', '動土', '建築'], bad: ['結婚', '旅行', '葬儀'] },
  '軫': { name: '軫', fortune: '吉', meaning: '建築、神仏祈願に吉。衣類裁断にも良い', good: ['建築', '祈願', '衣類裁断', '地鎮祭'], bad: ['結婚'] }
};

const nijuhassukuList = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '牛', '女', '虚', '危', '室', '壁', '奎', '婁', '胃', '昴', '畢', '觜', '参', '井', '鬼', '柳', '星', '張', '翼', '軫'];

// 二十八宿の計算（JDNベースの28日周期）
// 基準日: 2026年1月1日のJDN、この日の二十八宿インデックスを設定
const NIJUHASSUKU_BASE_JDN = 2461408; // 2026-01-01
const NIJUHASSUKU_BASE_INDEX = 15; // 2026-01-01 の二十八宿インデックス（婁）

export function getNijuhassukuByDate(year: number, month: number, day: number): string {
  const jdn = getJDN(year, month, day);
  const diff = jdn - NIJUHASSUKU_BASE_JDN;
  const index = ((diff % 28) + NIJUHASSUKU_BASE_INDEX) % 28;
  const normalizedIndex = ((index % 28) + 28) % 28;
  return nijuhassukuList[normalizedIndex];
}

export function getTodayNijuhassuku(): string {
  const today = new Date();
  return getNijuhassukuByDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
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