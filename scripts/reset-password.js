/**
 * Firebase Admin SDK を使ったパスワードリセットスクリプト
 *
 * 使い方:
 *   1. Firebase Console > プロジェクト設定 > サービスアカウント > 秘密鍵を生成
 *   2. ダウンロードしたJSONファイルをプロジェクトルートに serviceAccountKey.json として配置
 *   3. 実行:
 *      node scripts/reset-password.js <メールアドレス> <新しいパスワード>
 *
 * 例:
 *   node scripts/reset-password.js ichihuyu@gmail.com NewPassword123!
 */

const admin = require('firebase-admin');
const path = require('path');

// サービスアカウントキーの読み込み
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error('エラー: serviceAccountKey.json が見つかりません。');
  console.error('Firebase Console > プロジェクト設定 > サービスアカウント > 「新しい秘密鍵の生成」からダウンロードしてください。');
  console.error(`配置先: ${serviceAccountPath}`);
  process.exit(1);
}

async function resetPassword(email, newPassword) {
  try {
    // メールアドレスからユーザーを検索
    const user = await admin.auth().getUserByEmail(email);
    console.log(`ユーザー発見: ${user.uid} (${user.email})`);

    // パスワードを更新
    await admin.auth().updateUser(user.uid, { password: newPassword });
    console.log(`パスワードを変更しました: ${email}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error(`エラー: ${email} のユーザーが見つかりません。`);
    } else if (err.code === 'auth/invalid-password') {
      console.error('エラー: パスワードは6文字以上にしてください。');
    } else {
      console.error('エラー:', err.message);
    }
    process.exit(1);
  }
}

// 引数チェック
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('使い方: node scripts/reset-password.js <メールアドレス> <新しいパスワード>');
  console.log('例:     node scripts/reset-password.js ichihuyu@gmail.com NewPassword123!');
  process.exit(1);
}

resetPassword(args[0], args[1]);
