/**
 * @akkyey ポートフォリオ＆ハブサイト お問い合わせ受信 Webhook (GAS)
 *
 * 【セットアップ手順】
 * 1. 新規 Google スプレッドシートを作成し、「拡張機能」>「Apps Script」を開く
 * 2. このコードを貼り付け、必要に応じて NOTION_API_KEY / NOTION_DATABASE_ID / NOTIFY_EMAIL を設定
 * 3. 「デプロイ」>「新しいデプロイ」> 種類「ウェブアプリ」
 *    - 次のユーザーとして実行: 自分
 *    - アクセスできるユーザー: 全員
 * 4. 発行されたウェブアプリURLを `site/src/pages/index.astro` の
 *    `<form id="inquiry-form" data-webhook-url="ここにURL">` に設定してデプロイ
 */

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    // 1. スプレッドシートへの記録
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Inquiries') || ss.insertSheet('Inquiries');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '受信日時',
        'ご相談種別',
        'お名前',
        '貴社名・屋号',
        'メールアドレス',
        'ご相談内容',
      ]);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.category || '',
      data.fullName || '',
      data.organization || '',
      data.email || '',
      data.message || '',
    ]);

    // 2. メール通知（任意：ScriptProperties に NOTIFY_EMAIL が設定されている場合）
    var props = PropertiesService.getScriptProperties();
    var notifyEmail = props.getProperty('NOTIFY_EMAIL');
    if (notifyEmail) {
      MailApp.sendEmail({
        to: notifyEmail,
        subject: '【@akkyey サイトお問い合わせ】' + (data.category || '') + ' - ' + (data.fullName || '') + '様',
        body:
          'ポートフォリオサイトから新しいお問い合わせがありました。\n\n' +
          '■ ご相談種別: ' + (data.category || '') + '\n' +
          '■ お名前: ' + (data.fullName || '') + '\n' +
          '■ 貴社名・屋号: ' + (data.organization || '未記入') + '\n' +
          '■ メールアドレス: ' + (data.email || '') + '\n' +
          '■ 受信日時: ' + (data.submittedAt || '') + '\n\n' +
          '■ ご相談内容:\n' + (data.message || ''),
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
