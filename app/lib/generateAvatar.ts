/**
 * キレイ系・上品なお姉さん風のSVGアバターを自動生成
 * Base64エンコードされたdata URIを返す
 */
export function generateAvatar(): string {
  const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

  const hc = pick(['#1A1A2E','#2C1810','#3D2B1F','#4A3728','#654321','#8B6B4E']);
  const st = pick(['#FDEBD0','#F5CBA7','#FAD7A0','#F0D5BE','#FFE4C4','#FDDCB5']);
  const lc = pick(['#E8A0BF','#D4828F','#C97B84','#CD6090','#E6B0AA']);
  const ec = pick(['#2C3E5F','#4A6FA5','#5D4E37','#2E4053','#6B4226']);
  const bg = pick(['#F0EDE6','#E8E4DC','#FFF8F0','#F5F0E8','#EDE8E0']);
  const hairType = Math.floor(Math.random() * 5);
  const hasEarring = Math.random() > 0.5;
  const hasFlower = Math.random() > 0.7;

  let hairFront = '';
  switch (hairType) {
    case 0: // straight bangs
      hairFront = `<rect x="24" y="20" width="52" height="14" rx="3" fill="${hc}"/>
        <rect x="14" y="30" width="16" height="50" rx="4" fill="${hc}"/>
        <rect x="70" y="30" width="16" height="50" rx="4" fill="${hc}"/>`;
      break;
    case 1: // side swept
      hairFront = `<path d="M22,22 Q35,18 50,24 Q60,20 76,24 L78,32 Q65,26 50,28 Q35,24 22,32Z" fill="${hc}"/>
        <rect x="14" y="30" width="14" height="45" rx="4" fill="${hc}"/>
        <rect x="72" y="30" width="14" height="45" rx="4" fill="${hc}"/>`;
      break;
    case 2: // wavy
      hairFront = `<path d="M24,26 Q30,18 40,22 Q50,16 60,22 Q70,18 76,26 L76,30 Q68,24 60,28 Q50,22 40,28 Q30,24 24,30Z" fill="${hc}"/>
        <path d="M12,34 Q14,50 18,65 Q20,72 16,80" stroke="${hc}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M88,34 Q86,50 82,65 Q80,72 84,80" stroke="${hc}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
      break;
    case 3: // bob
      hairFront = `<rect x="24" y="20" width="52" height="12" rx="3" fill="${hc}"/>
        <path d="M16,30 Q14,55 24,62 L24,30Z" fill="${hc}"/>
        <path d="M84,30 Q86,55 76,62 L76,30Z" fill="${hc}"/>`;
      break;
    case 4: // updo
      hairFront = `<path d="M26,24 Q38,14 50,16 Q62,14 74,24 L74,28 Q62,20 50,22 Q38,20 26,28Z" fill="${hc}"/>
        <circle cx="50" cy="12" r="12" fill="${hc}"/>`;
      break;
  }

  let accessory = '';
  if (hasEarring) {
    accessory += `<circle cx="22" cy="60" r="2" fill="#FFD700" stroke="#DAA520" stroke-width="0.5"/>
      <circle cx="78" cy="60" r="2" fill="#FFD700" stroke="#DAA520" stroke-width="0.5"/>`;
  }
  if (hasFlower) {
    accessory += `<g transform="translate(72,20)">
      <circle cx="0" cy="-4" r="3" fill="#FFB6C1" opacity="0.8"/>
      <circle cx="4" cy="0" r="3" fill="#FFB6C1" opacity="0.8"/>
      <circle cx="0" cy="4" r="3" fill="#FFB6C1" opacity="0.8"/>
      <circle cx="-4" cy="0" r="3" fill="#FFB6C1" opacity="0.8"/>
      <circle cx="0" cy="0" r="2" fill="#FFD700"/>
    </g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
<defs><clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath></defs>
<g clip-path="url(#c)">
<rect width="100" height="100" fill="${bg}"/>
<ellipse cx="50" cy="40" rx="38" ry="40" fill="${hc}"/>
<rect x="40" y="68" width="20" height="24" fill="${st}" rx="6"/>
<ellipse cx="50" cy="50" rx="26" ry="30" fill="${st}"/>
${hairFront}
<ellipse cx="40" cy="47" rx="3" ry="2.5" fill="${ec}"/>
<ellipse cx="60" cy="47" rx="3" ry="2.5" fill="${ec}"/>
<circle cx="41" cy="46.5" r="1" fill="white" opacity="0.5"/>
<circle cx="61" cy="46.5" r="1" fill="white" opacity="0.5"/>
<path d="M36,42 Q40,40 44,42" stroke="${hc}" stroke-width="0.8" fill="none" opacity="0.6"/>
<path d="M56,42 Q60,40 64,42" stroke="${hc}" stroke-width="0.8" fill="none" opacity="0.6"/>
<path d="M49,50 Q48,54 50,55" stroke="${st}" stroke-width="0.8" fill="none" opacity="0.3"/>
<path d="M45,58 Q47,60 50,60.5 Q53,60 55,58" fill="${lc}" stroke="${lc}" stroke-width="0.3"/>
<circle cx="34" cy="52" r="5" fill="${lc}" opacity="0.12"/>
<circle cx="66" cy="52" r="5" fill="${lc}" opacity="0.12"/>
${accessory}
</g></svg>`;

  if (typeof btoa !== 'undefined') {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}
