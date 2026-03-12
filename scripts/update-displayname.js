/**
 * Firebase Admin SDK を使った displayName 更新スクリプト
 *
 * 使い方:
 *   node scripts/update-displayname.js <メールアドレス> <新しい表示名>
 *
 * 例:
 *   node scripts/update-displayname.js ichihuyu@gmail.com イチフユ
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error('エラー: serviceAccountKey.json が見つかりません。');
  console.error('Firebase Console > プロジェクト設定 > サービスアカウント > 「新しい秘密鍵の生成」からダウンロードしてください。');
  process.exit(1);
}

async function updateDisplayName(email, displayName) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log(`ユーザー発見: ${user.uid} (${user.email})`);
    console.log(`現在の表示名: ${user.displayName || '(未設定)'}`);

    await admin.auth().updateUser(user.uid, { displayName });
    console.log(`表示名を「${displayName}」に更新しました。`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error(`エラー: ${email} のユーザーが見つかりません。`);
    } else {
      console.error('エラー:', err.message);
    }
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('使い方: node scripts/update-displayname.js <メールアドレス> <新しい表示名>');
  console.log('例:     node scripts/update-displayname.js ichihuyu@gmail.com イチフユ');
  process.exit(1);
}

updateDisplayName(args[0], args[1]);
