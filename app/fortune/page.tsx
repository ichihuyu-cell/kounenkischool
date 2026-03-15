'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Header from '../components/Header';

// ── 誕生花データ（366日分） ──
const BIRTH_FLOWERS: Record<string, { flower: string; meaning: string }> = {
  '01-01': { flower: 'スノードロップ', meaning: '希望・慰め' },
  '01-02': { flower: 'ツバキ（白）', meaning: '完全なる美しさ' },
  '01-03': { flower: 'クロッカス', meaning: '青春の喜び' },
  '01-04': { flower: 'デイジー', meaning: '純潔・希望' },
  '01-05': { flower: 'ミスミソウ', meaning: '自信・信頼' },
  '01-06': { flower: 'カンガルーポー', meaning: '不思議・驚き' },
  '01-07': { flower: 'チューリップ（白）', meaning: '失われた愛' },
  '01-08': { flower: 'スミレ（紫）', meaning: '貞節・誠実' },
  '01-09': { flower: 'パンジー', meaning: '思慮深い' },
  '01-10': { flower: 'フリージア', meaning: 'あどけなさ・純潔' },
  '01-11': { flower: 'カーネーション（ピンク）', meaning: '女性の愛' },
  '01-12': { flower: 'スイートアリッサム', meaning: '優美・美しさ' },
  '01-13': { flower: 'カトレア', meaning: '優美な貴婦人' },
  '01-14': { flower: 'シクラメン', meaning: 'はにかみ・遠慮' },
  '01-15': { flower: 'オンシジューム', meaning: '可憐・一緒に踊って' },
  '01-16': { flower: 'デンドロビウム', meaning: 'わがままな美人' },
  '01-17': { flower: 'コチョウラン', meaning: '幸福が飛んでくる' },
  '01-18': { flower: 'プリムラ', meaning: '青春のはじまり' },
  '01-19': { flower: 'ユキヤナギ', meaning: '愛嬌・殊勝' },
  '01-20': { flower: 'キンセンカ', meaning: '別れの悲しみ' },
  '01-21': { flower: 'ロウバイ', meaning: '慈しみ・先導' },
  '01-22': { flower: 'アンスリウム', meaning: '情熱・煩悩' },
  '01-23': { flower: 'マンリョウ', meaning: '寿ぎ・陰徳' },
  '01-24': { flower: 'オモト', meaning: '長寿・崇高な精神' },
  '01-25': { flower: 'プリムラ・ポリアンサ', meaning: '可憐・運命を開く' },
  '01-26': { flower: 'アマリリス', meaning: 'おしゃべり・誇り' },
  '01-27': { flower: 'プルメリア', meaning: '気品・恵まれた人' },
  '01-28': { flower: 'ネモフィラ', meaning: '可憐・どこでも成功' },
  '01-29': { flower: 'ラナンキュラス', meaning: '魅力的・晴れやか' },
  '01-30': { flower: 'ムスカリ', meaning: '通じ合う心' },
  '01-31': { flower: 'チューリップ（赤）', meaning: '愛の告白' },
  '02-01': { flower: 'ウメ', meaning: '高潔・忠実' },
  '02-02': { flower: 'パンジー', meaning: '思慮深い・私を思って' },
  '02-03': { flower: 'ツバキ（赤）', meaning: '控えめな素晴らしさ' },
  '02-04': { flower: 'ボケ', meaning: '先駆者・妖精の輝き' },
  '02-05': { flower: 'マーガレット', meaning: '恋占い・真実の愛' },
  '02-06': { flower: 'ナノハナ', meaning: '快活・明るさ' },
  '02-07': { flower: 'ワスレナグサ', meaning: '真実の愛・私を忘れないで' },
  '02-08': { flower: 'シャクヤク', meaning: 'はにかみ・慎ましさ' },
  '02-09': { flower: 'ストック', meaning: '愛の絆・豊かな愛' },
  '02-10': { flower: 'ジンチョウゲ', meaning: '栄光・不死' },
  '02-11': { flower: 'ガーベラ', meaning: '希望・常に前進' },
  '02-12': { flower: 'レンギョウ', meaning: '期待・希望' },
  '02-13': { flower: 'エーデルワイス', meaning: '大切な思い出' },
  '02-14': { flower: 'カーネーション（赤）', meaning: '母への愛' },
  '02-15': { flower: 'デイジー', meaning: '純潔・美人' },
  '02-16': { flower: 'ゲッケイジュ', meaning: '栄光・勝利' },
  '02-17': { flower: 'スノーフレーク', meaning: '汚れなき心' },
  '02-18': { flower: 'キンギョソウ', meaning: 'おしゃべり・推測' },
  '02-19': { flower: 'モクレン', meaning: '自然への愛・持続性' },
  '02-20': { flower: 'カルミア', meaning: '大きな希望・野心' },
  '02-21': { flower: 'ネモフィラ', meaning: 'どこでも成功' },
  '02-22': { flower: 'ムクゲ', meaning: '信念・新しい美' },
  '02-23': { flower: 'アンズ', meaning: '乙女のはにかみ' },
  '02-24': { flower: 'アイビー', meaning: '永遠の愛・友情' },
  '02-25': { flower: 'カランコエ', meaning: 'あなたを守る' },
  '02-26': { flower: 'スノードロップ', meaning: '希望・慰め' },
  '02-27': { flower: 'オーニソガラム', meaning: '純粋・才能' },
  '02-28': { flower: 'ゲッケイジュ', meaning: '栄光・勝利' },
  '02-29': { flower: 'ワスレナグサ', meaning: '真実の愛' },
  '03-01': { flower: 'アンズ', meaning: '乙女のはにかみ' },
  '03-02': { flower: 'アルメリア', meaning: '思いやり・同情' },
  '03-03': { flower: 'モモ', meaning: '天下無敵の美' },
  '03-04': { flower: 'アザレア', meaning: '節制・愛の喜び' },
  '03-05': { flower: 'クンシラン', meaning: '高貴・誠実' },
  '03-06': { flower: 'デイジー', meaning: '純潔・美人' },
  '03-07': { flower: 'カンパニュラ', meaning: '感謝・誠実な愛' },
  '03-08': { flower: 'ニゲラ', meaning: '夢の中の恋' },
  '03-09': { flower: 'アセビ', meaning: '献身・犠牲' },
  '03-10': { flower: 'ルピナス', meaning: '想像力・いつも幸せ' },
  '03-11': { flower: 'ユキヤナギ', meaning: '愛嬌・殊勝' },
  '03-12': { flower: 'エニシダ', meaning: '謙遜・きれい好き' },
  '03-13': { flower: 'イカリソウ', meaning: '君を離さない' },
  '03-14': { flower: 'カモミール', meaning: '逆境に耐える' },
  '03-15': { flower: 'クンシラン', meaning: '高貴・誠実' },
  '03-16': { flower: 'ハナズオウ', meaning: '裏切り・不信仰' },
  '03-17': { flower: 'サンシュユ', meaning: '持続・耐久' },
  '03-18': { flower: 'ハナミズキ', meaning: '私の思いを受けて' },
  '03-19': { flower: 'シダレザクラ', meaning: '優美・ごまかし' },
  '03-20': { flower: 'スイートピー', meaning: '門出・優しい思い出' },
  '03-21': { flower: 'マンサク', meaning: '呪文・霊感' },
  '03-22': { flower: 'レンギョウ', meaning: '期待・希望' },
  '03-23': { flower: 'タンポポ', meaning: '愛の神託・真心の愛' },
  '03-24': { flower: 'カタクリ', meaning: '初恋・寂しさに耐える' },
  '03-25': { flower: 'アルストロメリア', meaning: '持続・未来への憧れ' },
  '03-26': { flower: 'ハナニラ', meaning: '悲しい別れ' },
  '03-27': { flower: 'ジギタリス', meaning: '熱愛・隠されぬ恋' },
  '03-28': { flower: 'サクラ', meaning: '精神の美・優美' },
  '03-29': { flower: 'スモモ', meaning: '忠実・困難に耐える' },
  '03-30': { flower: 'エニシダ', meaning: '謙遜・きれい好き' },
  '03-31': { flower: 'イチゴ', meaning: '尊重と愛情・幸福な家庭' },
  '04-01': { flower: 'サクラ', meaning: '精神の美・優美' },
  '04-02': { flower: 'コデマリ', meaning: '優雅・品位' },
  '04-03': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '04-04': { flower: 'カスミソウ', meaning: '清らかな心・無邪気' },
  '04-05': { flower: 'フジ', meaning: '優しさ・歓迎' },
  '04-06': { flower: 'ナスタチウム', meaning: '愛国心・勝利' },
  '04-07': { flower: 'ディモルフォセカ', meaning: '富・豊富' },
  '04-08': { flower: 'シバザクラ', meaning: '合意・一致' },
  '04-09': { flower: 'ミモザ', meaning: '優雅・友情' },
  '04-10': { flower: 'チューリップ', meaning: '愛の告白・思いやり' },
  '04-11': { flower: 'ヒヤシンス', meaning: '悲しみを超えた愛' },
  '04-12': { flower: 'アンズ', meaning: '乙女のはにかみ' },
  '04-13': { flower: 'クマガイソウ', meaning: '見かけ倒し' },
  '04-14': { flower: 'ドウダンツツジ', meaning: '上品・節制' },
  '04-15': { flower: 'キンギョソウ', meaning: 'おしゃべり・推測' },
  '04-16': { flower: 'スノーフレーク', meaning: '汚れなき心' },
  '04-17': { flower: 'アヤメ', meaning: 'よい便り・信頼' },
  '04-18': { flower: 'アルストロメリア', meaning: '持続・未来への憧れ' },
  '04-19': { flower: 'アザミ', meaning: '独立・厳格' },
  '04-20': { flower: 'シバザクラ', meaning: '合意・一致' },
  '04-21': { flower: 'ニゲラ', meaning: '夢の中の恋' },
  '04-22': { flower: 'エゾギク', meaning: '変化・追想' },
  '04-23': { flower: 'カンパニュラ', meaning: '感謝・誠実な愛' },
  '04-24': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '04-25': { flower: 'フロックス', meaning: '合意・温和' },
  '04-26': { flower: 'スカビオサ', meaning: '不幸な愛・私を忘れないで' },
  '04-27': { flower: 'シャガ', meaning: '反抗・友人が多い' },
  '04-28': { flower: 'サクラソウ', meaning: '少年時代の希望・若い時代' },
  '04-29': { flower: 'カキツバタ', meaning: '幸せは必ず来る' },
  '04-30': { flower: 'ナシ', meaning: '愛情・博愛' },
  '05-01': { flower: 'スズラン', meaning: '再び幸せが訪れる' },
  '05-02': { flower: 'フロックス', meaning: '合意・温和' },
  '05-03': { flower: 'ボタン', meaning: '風格・富貴' },
  '05-04': { flower: 'ヤマブキ', meaning: '気品・崇高' },
  '05-05': { flower: 'アヤメ', meaning: 'よい便り・信頼' },
  '05-06': { flower: 'クチナシ', meaning: '喜びを運ぶ・洗練' },
  '05-07': { flower: 'モクレン', meaning: '自然への愛・持続性' },
  '05-08': { flower: 'シャクナゲ', meaning: '威厳・荘厳' },
  '05-09': { flower: 'クレマチス', meaning: '精神の美・旅人の喜び' },
  '05-10': { flower: 'カーネーション', meaning: '無垢で深い愛' },
  '05-11': { flower: 'ナスタチウム', meaning: '愛国心・勝利' },
  '05-12': { flower: 'アスチルベ', meaning: '恋の訪れ・自由' },
  '05-13': { flower: 'サンザシ', meaning: '希望・慎重' },
  '05-14': { flower: 'シャクヤク', meaning: 'はにかみ・慎ましさ' },
  '05-15': { flower: 'ドクダミ', meaning: '白い追憶・野生' },
  '05-16': { flower: 'アリウム', meaning: '正しい主張・不屈の心' },
  '05-17': { flower: 'フクシア', meaning: '好みの良さ・信頼した愛' },
  '05-18': { flower: 'ペチュニア', meaning: 'あなたと一緒なら心が和む' },
  '05-19': { flower: 'サツキ', meaning: '節約・節制' },
  '05-20': { flower: 'カタバミ', meaning: '喜び・母親の優しさ' },
  '05-21': { flower: 'カスミソウ', meaning: '清らかな心・無邪気' },
  '05-22': { flower: 'フクシア', meaning: '好みの良さ' },
  '05-23': { flower: 'ジギタリス', meaning: '熱愛・隠されぬ恋' },
  '05-24': { flower: 'ヘリオトロープ', meaning: '献身的な愛・夢中' },
  '05-25': { flower: 'ラナンキュラス', meaning: '魅力的・晴れやか' },
  '05-26': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '05-27': { flower: 'マトリカリア', meaning: '鎮静・集う喜び' },
  '05-28': { flower: 'アマリリス', meaning: 'おしゃべり・誇り' },
  '05-29': { flower: 'ニゲラ', meaning: '夢の中の恋' },
  '05-30': { flower: 'オリーブ', meaning: '平和・知恵' },
  '05-31': { flower: 'ルピナス', meaning: '想像力・いつも幸せ' },
  '06-01': { flower: 'アジサイ', meaning: '移り気・辛抱強い愛' },
  '06-02': { flower: 'タイム', meaning: '勇気・活動力' },
  '06-03': { flower: 'アジサイ', meaning: '移り気・辛抱強い愛' },
  '06-04': { flower: 'ニッコウキスゲ', meaning: '日々あらたに・心安らぐ' },
  '06-05': { flower: 'ダリア', meaning: '華麗・優雅' },
  '06-06': { flower: 'アヤメ', meaning: 'よい便り・信頼' },
  '06-07': { flower: 'クチナシ', meaning: '喜びを運ぶ・洗練' },
  '06-08': { flower: 'ジャスミン', meaning: '愛想のよい・優美' },
  '06-09': { flower: 'スイートピー', meaning: '門出・優しい思い出' },
  '06-10': { flower: 'ラベンダー', meaning: '沈黙・私に答えてください' },
  '06-11': { flower: 'ベニバナ', meaning: '装い・化粧' },
  '06-12': { flower: 'ライラック', meaning: '思い出・友情' },
  '06-13': { flower: 'トケイソウ', meaning: '聖なる愛・信仰' },
  '06-14': { flower: 'グラジオラス', meaning: '情熱的な恋' },
  '06-15': { flower: 'カーネーション', meaning: '無垢で深い愛' },
  '06-16': { flower: 'チューベローズ', meaning: '危険な楽しみ' },
  '06-17': { flower: 'キバナコスモス', meaning: '野性的な美しさ' },
  '06-18': { flower: 'タイサンボク', meaning: '前途洋洋' },
  '06-19': { flower: 'バラ', meaning: '愛・美' },
  '06-20': { flower: 'ペラルゴニウム', meaning: '尊敬・信頼' },
  '06-21': { flower: 'ツキミソウ', meaning: '無言の愛情・移り気' },
  '06-22': { flower: 'スイカズラ', meaning: '愛の絆・献身的な愛' },
  '06-23': { flower: 'タチアオイ', meaning: '大望・野心' },
  '06-24': { flower: 'バーベナ', meaning: '魔力・魅力' },
  '06-25': { flower: 'ヒルガオ', meaning: '絆・友達のよしみ' },
  '06-26': { flower: 'ザクロ', meaning: '円熟した優雅さ' },
  '06-27': { flower: 'トケイソウ', meaning: '聖なる愛・信仰' },
  '06-28': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '06-29': { flower: 'アガパンサス', meaning: '恋の訪れ・愛の始まり' },
  '06-30': { flower: 'スカビオサ', meaning: '不幸な愛・風情' },
  '07-01': { flower: 'ヒメユリ', meaning: '誇り・可憐な愛情' },
  '07-02': { flower: 'クレマチス', meaning: '精神の美・旅人の喜び' },
  '07-03': { flower: 'ハス', meaning: '清らかな心・神聖' },
  '07-04': { flower: 'ネジバナ', meaning: '思慕' },
  '07-05': { flower: 'ラベンダー', meaning: '沈黙・私に答えてください' },
  '07-06': { flower: 'ヒマワリ', meaning: '憧れ・あなただけを見つめる' },
  '07-07': { flower: 'スイレン', meaning: '清純な心・信頼' },
  '07-08': { flower: 'ホオズキ', meaning: '自然美・心の平安' },
  '07-09': { flower: 'ボダイジュ', meaning: '夫婦愛・結婚' },
  '07-10': { flower: 'グロキシニア', meaning: '華やかな日々・艶麗' },
  '07-11': { flower: 'ハイビスカス', meaning: '繊細な美・新しい恋' },
  '07-12': { flower: 'ノコギリソウ', meaning: '戦い・勇敢' },
  '07-13': { flower: 'グラジオラス', meaning: '情熱的な恋' },
  '07-14': { flower: 'ナデシコ', meaning: '純愛・才能' },
  '07-15': { flower: 'ネムノキ', meaning: '歓喜・胸のときめき' },
  '07-16': { flower: 'ポーチュラカ', meaning: 'いつも元気・無邪気' },
  '07-17': { flower: 'ヒルガオ', meaning: '絆・友達のよしみ' },
  '07-18': { flower: 'マリーゴールド', meaning: '嫉妬・悲嘆' },
  '07-19': { flower: 'トリカブト', meaning: '美しい輝き・騎士道' },
  '07-20': { flower: 'トルコキキョウ', meaning: '優美・希望' },
  '07-21': { flower: 'ルドベキア', meaning: '正義・公平' },
  '07-22': { flower: 'ペチュニア', meaning: 'あなたと一緒なら心が和む' },
  '07-23': { flower: 'アリウム', meaning: '正しい主張・不屈の心' },
  '07-24': { flower: 'エンレイソウ', meaning: '奥ゆかしい心' },
  '07-25': { flower: 'ヘリクリサム', meaning: '永遠の思い出' },
  '07-26': { flower: 'ブーゲンビリア', meaning: '情熱・あなたは魅力に満ちている' },
  '07-27': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '07-28': { flower: 'オシロイバナ', meaning: '臆病・内気' },
  '07-29': { flower: 'サボテン', meaning: '燃える心・偉大' },
  '07-30': { flower: 'ニチニチソウ', meaning: '楽しい思い出・友情' },
  '07-31': { flower: 'ルドベキア', meaning: '正義・公平' },
  '08-01': { flower: 'オシロイバナ', meaning: '臆病・内気' },
  '08-02': { flower: 'ヒマワリ', meaning: '憧れ・あなただけを見つめる' },
  '08-03': { flower: 'マツバボタン', meaning: '無邪気・可憐' },
  '08-04': { flower: 'トリトマ', meaning: '恋するつらさ' },
  '08-05': { flower: 'エリカ', meaning: '孤独・博愛' },
  '08-06': { flower: 'ジニア', meaning: '不在の友を思う' },
  '08-07': { flower: 'ザクロ', meaning: '円熟した優雅さ' },
  '08-08': { flower: 'クレオメ', meaning: '秘密のひととき・あなたの容姿に酔う' },
  '08-09': { flower: 'キョウチクトウ', meaning: '注意・危険' },
  '08-10': { flower: 'ハイビスカス', meaning: '繊細な美・新しい恋' },
  '08-11': { flower: 'ゼラニウム', meaning: '尊敬・信頼' },
  '08-12': { flower: 'キョウチクトウ', meaning: '注意・危険' },
  '08-13': { flower: 'カンナ', meaning: '情熱・快活' },
  '08-14': { flower: 'センニチコウ', meaning: '色あせぬ愛・不朽' },
  '08-15': { flower: 'ヒマワリ', meaning: '憧れ・あなただけを見つめる' },
  '08-16': { flower: 'オミナエシ', meaning: '美人・はかない恋' },
  '08-17': { flower: 'ネムノキ', meaning: '歓喜・胸のときめき' },
  '08-18': { flower: 'クレオメ', meaning: '秘密のひととき' },
  '08-19': { flower: 'カンナ', meaning: '情熱・快活' },
  '08-20': { flower: 'フリージア', meaning: 'あどけなさ・純潔' },
  '08-21': { flower: 'キンミズヒキ', meaning: '感謝の気持ち' },
  '08-22': { flower: 'クルクマ', meaning: '乙女の香り' },
  '08-23': { flower: 'ゲッカビジン', meaning: 'はかない美・はかない恋' },
  '08-24': { flower: 'ケイトウ', meaning: 'おしゃれ・風変わり' },
  '08-25': { flower: 'ルドベキア', meaning: '正義・公平' },
  '08-26': { flower: 'ユウゼンギク', meaning: '老いても元気' },
  '08-27': { flower: 'ホウセンカ', meaning: '私に触れないで・短気' },
  '08-28': { flower: 'エリンジウム', meaning: '秘密の恋・光を求める' },
  '08-29': { flower: 'サルスベリ', meaning: '雄弁・愛嬌' },
  '08-30': { flower: 'ツキミソウ', meaning: '無言の愛情・移り気' },
  '08-31': { flower: 'レンゲソウ', meaning: '心が和らぐ・あなたと一緒なら苦痛が和らぐ' },
  '09-01': { flower: 'オニユリ', meaning: '荘厳・富と誇り' },
  '09-02': { flower: 'チューベローズ', meaning: '危険な楽しみ' },
  '09-03': { flower: 'マーガレット', meaning: '恋占い・真実の愛' },
  '09-04': { flower: 'ダリア', meaning: '華麗・優雅' },
  '09-05': { flower: 'ケイトウ', meaning: 'おしゃれ・風変わり' },
  '09-06': { flower: 'ナスタチウム', meaning: '愛国心・勝利' },
  '09-07': { flower: 'オレンジ', meaning: '花嫁の喜び' },
  '09-08': { flower: 'ゼフィランサス', meaning: '汚れなき愛・期待' },
  '09-09': { flower: 'キク', meaning: '高貴・高潔' },
  '09-10': { flower: 'シュウカイドウ', meaning: '片想い・恋の悩み' },
  '09-11': { flower: 'アロエ', meaning: '苦痛・悲嘆' },
  '09-12': { flower: 'クレマチス', meaning: '精神の美・旅人の喜び' },
  '09-13': { flower: 'ブッドレア', meaning: '恋の予感・あなたを慕う' },
  '09-14': { flower: 'サルビア', meaning: '燃える心・知恵' },
  '09-15': { flower: 'ススキ', meaning: '活力・心が通じる' },
  '09-16': { flower: 'アカネ', meaning: '私を思って・媚び' },
  '09-17': { flower: 'フウセンカズラ', meaning: '一緒に飛びたい' },
  '09-18': { flower: 'アザミ', meaning: '独立・厳格' },
  '09-19': { flower: 'サルビア', meaning: '燃える心・知恵' },
  '09-20': { flower: 'ヒガンバナ', meaning: '悲しき思い出・再会' },
  '09-21': { flower: 'コルチカム', meaning: '私の最良の日々は過ぎ去った' },
  '09-22': { flower: 'コスモス', meaning: '乙女の真心・調和' },
  '09-23': { flower: 'ヒガンバナ', meaning: '悲しき思い出・再会' },
  '09-24': { flower: 'ハギ', meaning: '思案・内気' },
  '09-25': { flower: 'オシロイバナ', meaning: '臆病・内気' },
  '09-26': { flower: 'キクイモ', meaning: '陰徳・美徳' },
  '09-27': { flower: 'コスモス', meaning: '乙女の真心・調和' },
  '09-28': { flower: 'フジバカマ', meaning: 'あの日を思い出す・ためらい' },
  '09-29': { flower: 'リンゴ', meaning: '選ばれた恋・選択' },
  '09-30': { flower: 'モンステラ', meaning: '嬉しい便り・壮大な計画' },
  '10-01': { flower: 'キク（赤）', meaning: 'あなたを愛しています' },
  '10-02': { flower: 'アンズ', meaning: '乙女のはにかみ' },
  '10-03': { flower: 'カエデ', meaning: '大切な思い出・美しい変化' },
  '10-04': { flower: 'サルビア', meaning: '燃える心・知恵' },
  '10-05': { flower: 'コスモス', meaning: '乙女の真心・調和' },
  '10-06': { flower: 'キンモクセイ', meaning: '謙虚・気高い人' },
  '10-07': { flower: 'キンモクセイ', meaning: '謙虚・気高い人' },
  '10-08': { flower: 'ガーベラ', meaning: '希望・常に前進' },
  '10-09': { flower: 'ホトトギス', meaning: '永遠にあなたのもの' },
  '10-10': { flower: 'ブバルディア', meaning: '交流・親交' },
  '10-11': { flower: 'コリウス', meaning: 'かなわぬ恋・善良な家風' },
  '10-12': { flower: 'ガーベラ', meaning: '希望・常に前進' },
  '10-13': { flower: 'ネリネ', meaning: '華やか・また会う日を楽しみに' },
  '10-14': { flower: 'カトレア', meaning: '優美な貴婦人' },
  '10-15': { flower: 'シュウメイギク', meaning: '薄れゆく愛・忍耐' },
  '10-16': { flower: 'シオン', meaning: '追憶・君を忘れない' },
  '10-17': { flower: 'ネリネ', meaning: '華やか・また会う日を楽しみに' },
  '10-18': { flower: 'ベゴニア', meaning: '片想い・愛の告白' },
  '10-19': { flower: 'エンゼルトランペット', meaning: '愛嬌・偽りの魅力' },
  '10-20': { flower: 'リンドウ', meaning: '悲しんでいるあなたを愛する' },
  '10-21': { flower: 'アザミ', meaning: '独立・厳格' },
  '10-22': { flower: 'ススキ', meaning: '活力・心が通じる' },
  '10-23': { flower: 'ダチュラ', meaning: '愛嬌・偽りの魅力' },
  '10-24': { flower: 'ウメモドキ', meaning: '明朗・知恵' },
  '10-25': { flower: 'カエデ', meaning: '大切な思い出・美しい変化' },
  '10-26': { flower: 'スイバ', meaning: '親愛の情・情愛' },
  '10-27': { flower: 'ランタナ', meaning: '心変わり・協力' },
  '10-28': { flower: 'ワレモコウ', meaning: '変化・もの思い' },
  '10-29': { flower: 'ゲッカビジン', meaning: 'はかない美・はかない恋' },
  '10-30': { flower: 'ロベリア', meaning: '悪意・謙遜' },
  '10-31': { flower: 'カラー', meaning: '華麗なる美・乙女のしとやかさ' },
  '11-01': { flower: 'カリン', meaning: '努力・唯一の恋' },
  '11-02': { flower: 'ルピナス', meaning: '想像力・いつも幸せ' },
  '11-03': { flower: 'カモミール', meaning: '逆境に耐える' },
  '11-04': { flower: 'サフラン', meaning: '歓喜・過度をつつしめ' },
  '11-05': { flower: 'ペンタス', meaning: '願い事・希望がかなう' },
  '11-06': { flower: 'フジバカマ', meaning: 'あの日を思い出す・ためらい' },
  '11-07': { flower: 'ユーカリ', meaning: '新生・再生' },
  '11-08': { flower: 'ヒイラギ', meaning: '先見の明・用心' },
  '11-09': { flower: 'ツルウメモドキ', meaning: '大器晩成・真実' },
  '11-10': { flower: 'フヨウ', meaning: '繊細な美・しとやかな恋人' },
  '11-11': { flower: 'ツバキ（白）', meaning: '完全なる美しさ' },
  '11-12': { flower: 'レモン', meaning: '心からの思慕・誠実な愛' },
  '11-13': { flower: 'デンドロビウム', meaning: 'わがままな美人' },
  '11-14': { flower: 'サフラン', meaning: '歓喜・過度をつつしめ' },
  '11-15': { flower: 'ヒイラギ', meaning: '先見の明・用心' },
  '11-16': { flower: 'クリスマスローズ', meaning: '追憶・私を忘れないで' },
  '11-17': { flower: 'スターチス', meaning: '変わらぬ心・途絶えぬ記憶' },
  '11-18': { flower: 'ナナカマド', meaning: '慎重・賢明' },
  '11-19': { flower: 'オトギリソウ', meaning: '迷信・秘密' },
  '11-20': { flower: 'ツワブキ', meaning: '困難に負けない・愛よ甦れ' },
  '11-21': { flower: 'オキザリス', meaning: '輝く心・母親の優しさ' },
  '11-22': { flower: 'アングレカム', meaning: '祈り・いつまでも一緒に' },
  '11-23': { flower: 'ストレリチア', meaning: '万能・寛容' },
  '11-24': { flower: 'ガマズミ', meaning: '結合・私を見て' },
  '11-25': { flower: 'ネリネ', meaning: '華やか・また会う日を楽しみに' },
  '11-26': { flower: 'シャコバサボテン', meaning: '美しい眺め・つむじ曲がり' },
  '11-27': { flower: 'ハボタン', meaning: '祝福・愛を包む' },
  '11-28': { flower: 'アスター', meaning: '変化・追想' },
  '11-29': { flower: 'ベゴニア', meaning: '片想い・愛の告白' },
  '11-30': { flower: 'ツワブキ', meaning: '困難に負けない・愛よ甦れ' },
  '12-01': { flower: 'ドラセナ', meaning: '幸福・幸せな恋' },
  '12-02': { flower: 'シネラリア', meaning: '喜び・常に快活' },
  '12-03': { flower: 'ラベンダー', meaning: '沈黙・私に答えてください' },
  '12-04': { flower: 'サザンカ', meaning: '困難に打ち克つ・ひたむきさ' },
  '12-05': { flower: 'ナンテン', meaning: '私の愛は増すばかり・福をなす' },
  '12-06': { flower: 'ユキノシタ', meaning: '深い愛情・切実な愛情' },
  '12-07': { flower: 'シクラメン', meaning: 'はにかみ・遠慮' },
  '12-08': { flower: 'ナンテン', meaning: '私の愛は増すばかり・福をなす' },
  '12-09': { flower: 'ポインセチア', meaning: '祝福する・聖夜' },
  '12-10': { flower: 'ツバキ（赤）', meaning: '控えめな素晴らしさ' },
  '12-11': { flower: 'カランコエ', meaning: 'あなたを守る' },
  '12-12': { flower: 'デンファレ', meaning: 'お似合いの二人・有能' },
  '12-13': { flower: 'クリスマスローズ', meaning: '追憶・私を忘れないで' },
  '12-14': { flower: 'シンビジウム', meaning: '飾らない心・素朴' },
  '12-15': { flower: 'モンステラ', meaning: '嬉しい便り・壮大な計画' },
  '12-16': { flower: 'エンゼルランプ', meaning: 'あなたを守りたい' },
  '12-17': { flower: 'フリージア', meaning: 'あどけなさ・純潔' },
  '12-18': { flower: 'シンビジウム', meaning: '飾らない心・素朴' },
  '12-19': { flower: 'スノーフレーク', meaning: '汚れなき心' },
  '12-20': { flower: 'カトレア', meaning: '優美な貴婦人' },
  '12-21': { flower: 'プラタナス', meaning: '天才・好奇心' },
  '12-22': { flower: 'セントポーリア', meaning: '小さな愛' },
  '12-23': { flower: 'カトレア', meaning: '優美な貴婦人' },
  '12-24': { flower: 'ヤドリギ', meaning: '困難に打ち克つ・忍耐' },
  '12-25': { flower: 'ポインセチア', meaning: '祝福する・聖夜' },
  '12-26': { flower: 'クリスマスローズ', meaning: '追憶・私を忘れないで' },
  '12-27': { flower: 'パフィオペディルム', meaning: '優雅な装い・思慮深い' },
  '12-28': { flower: 'ザクロ', meaning: '円熟した優雅さ' },
  '12-29': { flower: 'ナンテン', meaning: '私の愛は増すばかり・福をなす' },
  '12-30': { flower: 'ヤブコウジ', meaning: '明日の幸福' },
  '12-31': { flower: 'ユズ', meaning: '健康美・汚れなき人' },
};

// ── 星座判定 ──
function getZodiac(month: number, day: number) {
  const signs = [
    { name: '山羊座', emoji: '♑', start: [12, 22], end: [1, 19] },
    { name: '水瓶座', emoji: '♒', start: [1, 20], end: [2, 18] },
    { name: '魚座', emoji: '♓', start: [2, 19], end: [3, 20] },
    { name: '牡羊座', emoji: '♈', start: [3, 21], end: [4, 19] },
    { name: '牡牛座', emoji: '♉', start: [4, 20], end: [5, 20] },
    { name: '双子座', emoji: '♊', start: [5, 21], end: [6, 21] },
    { name: '蟹座', emoji: '♋', start: [6, 22], end: [7, 22] },
    { name: '獅子座', emoji: '♌', start: [7, 23], end: [8, 22] },
    { name: '乙女座', emoji: '♍', start: [8, 23], end: [9, 22] },
    { name: '天秤座', emoji: '♎', start: [9, 23], end: [10, 23] },
    { name: '蠍座', emoji: '♏', start: [10, 24], end: [11, 22] },
    { name: '射手座', emoji: '♐', start: [11, 23], end: [12, 21] },
  ];
  for (const s of signs) {
    if (s.start[0] === s.end[0]) {
      if (month === s.start[0] && day >= s.start[1] && day <= s.end[1]) return s;
    } else if (s.start[0] > s.end[0]) {
      if ((month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) return s;
    } else {
      if ((month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) return s;
    }
  }
  return signs[0];
}

// ── ラッキーカラー ──
const LUCKY_COLORS = [
  { name: 'ローズピンク', code: '#E8909C' },
  { name: 'ラベンダー', code: '#B0A0D0' },
  { name: '月白', code: '#E8ECF0' },
  { name: 'ゴールド', code: '#D4A843' },
  { name: 'アクアブルー', code: '#7EC8E3' },
  { name: 'コーラル', code: '#F08080' },
  { name: 'ミントグリーン', code: '#98D8C8' },
  { name: '藤色', code: '#B8A9C9' },
  { name: 'シャンパンベージュ', code: '#F5E6CC' },
  { name: '深紅', code: '#C41E3A' },
  { name: 'アイボリー', code: '#FFFFF0' },
  { name: 'ペリウィンクル', code: '#8E82FE' },
];

function getLuckyColor(zodiacIdx: number, bloodIdx: number) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + zodiacIdx * 7 + bloodIdx * 13;
  return LUCKY_COLORS[seed % LUCKY_COLORS.length];
}

// ── 運勢スコア生成 ──
function getFortuneScores(zodiacIdx: number, bloodIdx: number) {
  const today = new Date();
  const base = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const gen = (offset: number) => ((base * 31 + zodiacIdx * 17 + bloodIdx * 11 + offset * 53) % 5) + 1;
  return {
    total: gen(1),
    love: gen(2),
    health: gen(3),
    work: gen(4),
  };
}

// ── 血液型の今日の特徴 ──
function getBloodMessage(blood: string) {
  const today = new Date();
  const idx = (today.getDate() + today.getMonth()) % 4;
  const msgs: Record<string, string[]> = {
    A: [
      '今日は几帳面さが良い方向に。丁寧な仕事が評価されそう。',
      '繊細な感性が冴える日。自分の直感を信じて。',
      '周囲への気配りが運を呼ぶ日。優しい言葉を大切に。',
      '計画通りに進めると吉。コツコツが実を結びます。',
    ],
    B: [
      '自由な発想がチャンスを生む日。枠にとらわれないで。',
      'マイペースが功を奏する日。自分のリズムを大切に。',
      '好奇心のままに動くと素敵な出会いが。',
      'クリエイティブなエネルギーが高まる日。',
    ],
    O: [
      'リーダーシップが光る日。堂々と前に出て。',
      '大らかな心が周囲を癒す日。笑顔を忘れずに。',
      '目標に向かって一直線に進むと吉。',
      '社交的なエネルギーが高まる日。人との交流が鍵。',
    ],
    AB: [
      '分析力と直感の両方が冴える日。バランスを大切に。',
      '独自の視点が評価される日。自信を持って発言を。',
      '二面性をうまく使い分けられる日。柔軟に対応して。',
      '知的好奇心が高まる日。新しい知識を吸収しましょう。',
    ],
  };
  return (msgs[blood] || msgs['A'])[idx];
}

// ── 星評価コンポーネント ──
function Stars({ count }: { count: number }) {
  return (
    <span style={{ letterSpacing: '2px', fontSize: '16px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2 }}>★</span>
      ))}
    </span>
  );
}

// ── カードコンポーネント ──
function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '28px 24px',
      marginBottom: '20px',
      border: '1px solid #E8EAF0',
      boxShadow: '0 2px 12px rgba(44,62,95,0.06)',
    }}>
      <h3 style={{
        fontSize: '17px', fontWeight: '400', color: '#2C3E5F',
        marginBottom: '16px', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════
// メインコンポーネント
// ══════════════════════════════════════════
export default function FortunePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ birthday: string; bloodType: string } | null>(null);
  const [formBirthday, setFormBirthday] = useState('');
  const [formBlood, setFormBlood] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // ── Auth & Profile 読み込み ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        try {
          const profileRef = doc(db, 'users', user.uid);
          console.log('[Fortune] Loading profile from:', profileRef.path);
          const snap = await getDoc(profileRef);
          console.log('[Fortune] Profile doc exists:', snap.exists(), snap.exists() ? snap.data() : '(no data)');
          if (snap.exists()) {
            const d = snap.data();
            if (d.birthday && d.bloodType) {
              setProfile({ birthday: d.birthday, bloodType: d.bloodType });
            }
          }
        } catch (e) { console.error('Profile load error:', e); }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const [saveError, setSaveError] = useState('');

  // ── プロフィール保存 ──
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !formBirthday || !formBlood) return;
    setSaving(true);
    setSaveError('');
    try {
      const profileRef = doc(db, 'users', uid);
      console.log('[Fortune] Saving profile to:', profileRef.path, { birthday: formBirthday, bloodType: formBlood });
      await setDoc(profileRef, { birthday: formBirthday, bloodType: formBlood }, { merge: true });
      console.log('[Fortune] Profile saved successfully');
      setProfile({ birthday: formBirthday, bloodType: formBlood });
    } catch (err: any) {
      console.error('[Fortune] Profile save FAILED:', err);
      console.error('[Fortune] Error code:', err.code);
      console.error('[Fortune] Error message:', err.message);
      setSaveError(`保存に失敗しました（${err.code || '不明なエラー'}）。通信環境を確認してもう一度お試しください。`);
    } finally {
      setSaving(false);
    }
  };

  // ── AI メッセージ取得 ──
  const fetchAiMessage = async (zodiacName: string, blood: string, flowerName: string) => {
    setAiLoading(true);
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
      const prompt = `あなたはRUNEERAの占い師です。更年期世代の女性に寄り添う温かいトーンで、今日（${dateStr}）の運勢メッセージを3〜4文で書いてください。\n星座: ${zodiacName}\n血液型: ${blood}型\n誕生花: ${flowerName}\n\n「無理しなくていい」「自分を大切に」という更年期ウェルネス寄りのメッセージを心がけてください。絵文字は使わず、やさしい日本語で。`;

      const res = await fetch('/api/ai-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiMessage(data.message || '今日も自分のペースで、心地よい一日をお過ごしください。');
      } else {
        throw new Error('API error');
      }
    } catch {
      // APIがまだ無い場合のフォールバック
      const fallbacks = [
        '今日は少し立ち止まって、自分自身の心の声に耳を傾けてみてください。焦らなくても大丈夫。あなたのペースで進んでいけば、必ず道は開けます。今日の小さな幸せを見つけて、自分をたくさん褒めてあげてくださいね。',
        '体の変化に戸惑うこともあるかもしれませんが、それはあなたが新しいステージに進んでいる証です。無理をせず、今の自分を受け入れることから始めましょう。温かい飲み物を片手に、ゆったりとした時間を過ごしてみてください。',
        '今日は心身のバランスを整えるのに良い日です。深呼吸をして、肩の力を抜いてみましょう。完璧でなくていい、今の自分で十分素敵です。夜はぐっすり眠れるよう、リラックスする時間を作ってくださいね。',
      ];
      const idx = new Date().getDate() % fallbacks.length;
      setAiMessage(fallbacks[idx]);
    }
    setAiLoading(false);
  };

  // ── プロフィール設定後にAIメッセージ取得 ──
  useEffect(() => {
    if (!profile) return;
    const bd = new Date(profile.birthday);
    const month = bd.getMonth() + 1;
    const day = bd.getDate();
    const zodiac = getZodiac(month, day);
    const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const flower = BIRTH_FLOWERS[mmdd];
    fetchAiMessage(zodiac.name, profile.bloodType, flower?.flower || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // ── ローディング ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#4A4A4A', fontWeight: '300' }}>読み込み中...</p>
      </div>
    );
  }

  // ── 未ログイン ──
  if (!uid) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <Header />
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔮</div>
          <h1 style={{ fontSize: '24px', color: '#2C3E5F', fontWeight: '300', marginBottom: '16px' }}>占いを利用するにはログインが必要です</h1>
          <a href="/login" style={{
            display: 'inline-block', padding: '14px 40px', background: '#2C3E5F', color: '#FFF',
            borderRadius: '24px', textDecoration: 'none', fontSize: '15px', fontWeight: '300',
          }}>ログイン</a>
        </div>
      </div>
    );
  }

  // ── プロフィール未登録 → フォーム表示 ──
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <Header />
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '100px', height: '100px', margin: '0 auto 24px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px',
              border: '2px solid #FFF4CC',
            }}>🔮</div>
            <h1 style={{ fontSize: '28px', color: '#2C3E5F', fontWeight: '300', marginBottom: '12px', letterSpacing: '0.05em' }}>
              あなただけの占いを始めましょう
            </h1>
            <p style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: '300', lineHeight: '1.8' }}>
              生年月日と血液型を登録すると、<br />毎日パーソナルな占い結果をお届けします。
            </p>
          </div>

          <form onSubmit={handleSaveProfile} style={{
            background: '#FFFFFF', padding: '32px', borderRadius: '16px',
            border: '1px solid #E8EAF0', boxShadow: '0 4px 16px rgba(44,62,95,0.08)',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4A4A4A', marginBottom: '8px', fontWeight: '300' }}>
                生年月日
              </label>
              <input type="date" value={formBirthday} onChange={e => setFormBirthday(e.target.value)} required
                style={{
                  width: '100%', padding: '12px 16px', border: '1px solid #E8EAF0', borderRadius: '8px',
                  fontSize: '14px', color: '#4A4A4A', outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4A4A4A', marginBottom: '8px', fontWeight: '300' }}>
                血液型
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['A', 'B', 'O', 'AB'].map(t => (
                  <button key={t} type="button" onClick={() => setFormBlood(t)} style={{
                    flex: 1, padding: '12px', border: formBlood === t ? '2px solid #2C3E5F' : '1px solid #E8EAF0',
                    borderRadius: '10px', background: formBlood === t ? 'linear-gradient(135deg, #FFF4CC, #ffe9a3)' : '#FAFAFA',
                    color: '#2C3E5F', fontSize: '16px', fontWeight: formBlood === t ? '500' : '300', cursor: 'pointer',
                  }}>
                    {t}型
                  </button>
                ))}
              </div>
            </div>
            {saveError && (
              <div style={{
                padding: '12px', background: '#FFF0F0', border: '1px solid #FFE0E0',
                borderRadius: '8px', marginBottom: '16px', fontSize: '14px', color: '#D32F2F', fontWeight: '300',
              }}>{saveError}</div>
            )}
            <button type="submit" disabled={saving || !formBirthday || !formBlood} style={{
              width: '100%', padding: '14px', background: (saving || !formBirthday || !formBlood) ? '#999' : '#2C3E5F',
              color: '#FFF', border: 'none', borderRadius: '24px', fontSize: '15px', fontWeight: '300',
              cursor: (saving || !formBirthday || !formBlood) ? 'not-allowed' : 'pointer', letterSpacing: '0.05em',
            }}>
              {saving ? '保存中...' : '占いを始める'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── 占い結果表示 ──
  const bd = new Date(profile.birthday);
  const bMonth = bd.getMonth() + 1;
  const bDay = bd.getDate();
  const zodiac = getZodiac(bMonth, bDay);
  const zodiacIdx = [
    '山羊座','水瓶座','魚座','牡羊座','牡牛座','双子座',
    '蟹座','獅子座','乙女座','天秤座','蠍座','射手座',
  ].indexOf(zodiac.name);
  const bloodIdx = ['A', 'B', 'O', 'AB'].indexOf(profile.bloodType);
  const mmdd = `${String(bMonth).padStart(2, '0')}-${String(bDay).padStart(2, '0')}`;
  const flower = BIRTH_FLOWERS[mmdd] || { flower: 'スミレ', meaning: '誠実・小さな幸せ' };
  const luckyColor = getLuckyColor(zodiacIdx, bloodIdx);
  const scores = getFortuneScores(zodiacIdx, bloodIdx);
  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8FA' }}>
      <Header />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '80px', height: '80px', margin: '0 auto 16px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
            border: '2px solid #FFF4CC',
          }}>🔮</div>
          <h1 style={{ fontSize: '22px', color: '#2C3E5F', fontWeight: '300', marginBottom: '6px', letterSpacing: '0.08em' }}>
            今日の占い
          </h1>
          <p style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>{todayStr}</p>
        </div>

        {/* 誕生花 */}
        <Card title="誕生花" icon="🌸">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💐</div>
            <div style={{ fontSize: '20px', color: '#2C3E5F', fontWeight: '400', marginBottom: '8px' }}>{flower.flower}</div>
            <div style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: '300', lineHeight: '1.6' }}>
              花言葉：{flower.meaning}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px', fontWeight: '300' }}>
              {bMonth}月{bDay}日生まれのあなたの花
            </div>
          </div>
        </Card>

        {/* 星座 */}
        <Card title="あなたの星座" icon="⭐">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFF4CC, #ffe9a3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', border: '2px solid #2C3E5F', flexShrink: 0,
            }}>{zodiac.emoji}</div>
            <div>
              <div style={{ fontSize: '22px', color: '#2C3E5F', fontWeight: '400', marginBottom: '4px' }}>{zodiac.name}</div>
              <div style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: '300' }}>
                {bMonth}月{bDay}日生まれ
              </div>
            </div>
          </div>
        </Card>

        {/* 血液型 */}
        <Card title={`${profile.bloodType}型の今日`} icon="🩸">
          <p style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: '300', lineHeight: '1.8' }}>
            {getBloodMessage(profile.bloodType)}
          </p>
        </Card>

        {/* ラッキーカラー */}
        <Card title="今日のラッキーカラー" icon="🎨">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: luckyColor.code, border: '2px solid #2C3E5F', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }} />
            <div>
              <div style={{ fontSize: '18px', color: '#2C3E5F', fontWeight: '400' }}>{luckyColor.name}</div>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '300', marginTop: '4px' }}>{luckyColor.code}</div>
            </div>
          </div>
        </Card>

        {/* 今日の運勢 */}
        <Card title="今日の運勢" icon="🔮">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {([
              { label: '総合運', score: scores.total },
              { label: '恋愛運', score: scores.love },
              { label: '健康運', score: scores.health },
              { label: '仕事運', score: scores.work },
            ] as const).map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#2C3E5F', fontWeight: '300', minWidth: '60px' }}>{item.label}</span>
                <Stars count={item.score} />
              </div>
            ))}
          </div>
        </Card>

        {/* AIメッセージ */}
        <div style={{
          background: 'linear-gradient(135deg, #2C3E5F 0%, #3d5278 100%)',
          borderRadius: '16px', padding: '28px 24px', marginBottom: '20px',
          border: '2px solid #FFF4CC', boxShadow: '0 4px 20px rgba(44,62,95,0.2)',
        }}>
          <h3 style={{
            fontSize: '17px', fontWeight: '400', color: '#FFF4CC',
            marginBottom: '16px', letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '22px' }}>💌</span>今日のメッセージ
          </h3>
          {aiLoading ? (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '300' }}>メッセージを準備中...</p>
          ) : (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '300', lineHeight: '2' }}>
              {aiMessage}
            </p>
          )}
        </div>

        {/* プロフィール変更ボタン */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button onClick={() => setProfile(null)} style={{
            background: 'none', border: '1px solid #E8EAF0', borderRadius: '20px',
            padding: '10px 24px', fontSize: '13px', color: '#4A4A4A', fontWeight: '300',
            cursor: 'pointer',
          }}>
            生年月日・血液型を変更する
          </button>
        </div>
      </div>
    </div>
  );
}
