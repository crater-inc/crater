const { chromium } = require('playwright');

const ARTICLE_TITLE = 'なぜ良いものが売れないのか——「認知の壁」という見えない障壁';
const HASHTAGS = ['認知マーケティング', '中小企業', 'ブランディング', 'SNS戦略', 'マーケティング'];
const MAGAZINE_NAME = '認知の教室 by APOLLOS';

const ARTICLE_TEXT = `APOLLOS 認知の教室 vol.01

「品質なのに売れない」は、本当によくある

いいサービスを作った。
丁寧に仕事をしている。
実績もある。
でも、売上が伸びない。

こういった悩みを持つ経営者やマーケターに、私たちは毎日のように出会います。

この記事では、その「なぜ？」に正面から答えます。

結論から言うと、問題は品質ではなく「認知」にあるのです。

人は「知らないもの」を選べない

当たり前のことを言います。

人は、存在を知らないものを選ぶことができない。

どれだけ素晴らしい商品でも、サービスでも、存在を知られていなければ、選択肢にすら入りません。競合他社と比較されることもなく、静かに埋もれていく。

これが「認知の壁」です。

認知には3段階ある

認知を「知っているか知らないか」の二択で考えるのは危険です。実は認知には段階があります。

段階1：存在認知
「あ、そういう会社があるんだ」というレベル。名前だけ知っている状態。

段階2：内容認知
「何をやっている会社か」がわかる状態。業種・強みがぼんやり伝わっている。

段階3：選好認知
「困ったときにあそこに頼もう」と思い出してもらえる状態。

多くの中小企業が詰まっているのは、段階1と2の間です。名刺を渡しても、Webサイトを見てもらっても、「何をやっているのかよくわからない」で終わってしまう。

品質を上げても認知は増えない

ここが多くの経営者が誤解している点です。

「もっといいサービスを作れば口コミが広がる」——これは半分正解で、半分間違いです。

口コミが起きる条件は、まず認知している人がいること。認知ゼロの状態でどれだけ品質を磨いても、情報は誰にも届きません。

品質と認知は別の話です。品質は「選ばれ続けるため」のもの。認知は「選ばれるスタートラインに立つため」のもの。

両方必要ですが、順番があります。まず認知、次に品質で差をつける。

認知が取れていない会社の共通点

長年、多くの企業の認知課題に向き合ってきた経験から、共通するパターンがあります。

① 発信しているが「誰に向けているか」が曖昧
Webサイトもあるし、SNSもやっている。でも「誰に届けたいか」が定まっていない。結果、誰にも刺さらない。

② チャネルを間違えている
ターゲットがInstagramをほぼ見ていないのにInstagramに力を入れている。媒体と目的がずれている。

③ 認知と売上を直結させようとしすぎる
「SNSをやって売上を上げたい」——わかります。でも認知施策の成果はすぐには出ません。認知は種まき、売上は収穫。焦ると間違った判断をします。

④ 継続できていない
やる→辞める→また始める……この繰り返しで認知は積み上がりません。認知は積み重ねです。

では、どこから手をつけるか

認知課題の解決策は「とにかく発信量を増やす」ではありません。

正しい順番はこうです：
1. 誰に認知されたいかを決める（ターゲットの解像度を上げる）
2. そのターゲットがどこにいるかを調べる（チャネル選定）
3. そのチャネルで「何を届けるか」を設計する（コンテンツ戦略）
4. 継続できる仕組みを作ってから始める（運用設計）

この4ステップを飛ばして「とりあえずSNSをやる」から、成果が出ないのです。

まとめ

・「売れない」の原因は品質ではなく、認知にあることが多い
・人は知らないものを選べない——これが認知の壁の本質
・認知には3段階あり、多くの企業は段階1〜2で止まっている
・品質と認知は別物。まず認知の戦略を立てることが先決
・発信量を増やす前に「誰に・どこで・何を」を決める

次回は、「認知チャネルの正しい選び方」を解説します。業種・ターゲット・予算別に、どのSNS・媒体が合うかを具体的に整理します。

APOLLOSは「認知」を軸に、価値が届き・理解され・選ばれる状態をつくる会社です。
認知戦略についての相談は→ apollos.jp`;

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  try {
    // ログイン
    console.log('ログイン中...');
    await page.goto('https://note.com/login', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.fill('#email', 'info@apollos.jp');
    await page.fill('#password', 'apollos1001+');
    await page.click('button:has-text("ログイン")');
    await page.waitForURL('https://note.com/', { timeout: 15000 });
    console.log('ログイン完了');

    // 記事作成ページ
    await page.goto('https://note.com/notes/new', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(4000);

    // AIダイアログを閉じる
    const closeBtn = page.locator('button').filter({ has: page.locator('text="閉じる"') }).first();
    if (await closeBtn.count() > 0) await closeBtn.click();
    const xBtn = page.locator('[aria-label="閉じる"], button svg').first();
    // ×ボタンがある場合
    const dialogClose = page.locator('.p-0').first();
    if (await dialogClose.count() > 0) {
      await dialogClose.click();
      await page.waitForTimeout(500);
    }

    // タイトルエリアを探す（textarea or contenteditable）
    const allEls = await page.evaluate(() => {
      const result = [];
      // textarea
      document.querySelectorAll('textarea').forEach((el, i) => {
        result.push({ type: 'textarea', i, placeholder: el.placeholder, class: el.className.substring(0, 60) });
      });
      // contenteditable
      document.querySelectorAll('[contenteditable]').forEach((el, i) => {
        result.push({ type: 'contenteditable', i, tag: el.tagName, class: el.className.substring(0, 80), 'data-placeholder': el.getAttribute('data-placeholder') });
      });
      return result;
    });
    console.log('全編集可能要素:', JSON.stringify(allEls, null, 2));

    // タイトル入力：「記事タイトル」プレースホルダーを持つ要素
    // note.comのProseMirrorでは最初のノードがタイトル扱い
    const editor = page.locator('.ProseMirror').first();
    await editor.click();
    await page.waitForTimeout(500);

    // タイトルを入力（Enterで本文へ）
    await page.keyboard.type(ARTICLE_TITLE, { delay: 30 });
    await page.waitForTimeout(500);

    // Enterで本文エリアへ移動
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // 本文テキストを貼り付け
    await page.evaluate((text) => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', text);
      document.activeElement.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
      );
    }, ARTICLE_TEXT);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/Users/cratermacbookpro/Projects/claude/tmp_s3_body.png' });
    console.log('本文入力完了');

    // 「公開に進む」ボタン
    const toPublishBtn = page.locator('button:has-text("公開に進む")').first();
    if (await toPublishBtn.count() > 0) {
      await toPublishBtn.click();
      await page.waitForTimeout(3000);
      console.log('公開設定パネルへ');
    }
    await page.screenshot({ path: '/Users/cratermacbookpro/Projects/claude/tmp_s4_settings.png' });

    // ハッシュタグ入力
    for (const tag of HASHTAGS) {
      const tagInput = page.locator('input[placeholder*="タグ"], input[placeholder*="ハッシュ"]').first();
      if (await tagInput.count() > 0) {
        await tagInput.fill(tag);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(400);
        console.log('タグ追加:', tag);
      }
    }

    // マガジン選択
    const magazineArea = page.locator('text=/マガジン/').first();
    if (await magazineArea.count() > 0) {
      await magazineArea.click();
      await page.waitForTimeout(1500);
      const option = page.locator(`text="${MAGAZINE_NAME}"`).first();
      if (await option.count() > 0) {
        await option.click();
        console.log('マガジン選択:', MAGAZINE_NAME);
      } else {
        console.log('マガジンが見つかりません');
      }
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: '/Users/cratermacbookpro/Projects/claude/tmp_s5_before_publish.png' });
    console.log('公開前確認スクリーンショット保存 → tmp_s5_before_publish.png');

    // 公開する
    const publishBtn = page.locator('button:has-text("公開する")').last();
    if (await publishBtn.count() > 0) {
      await publishBtn.click();
      await page.waitForTimeout(5000);
      await page.screenshot({ path: '/Users/cratermacbookpro/Projects/claude/tmp_s6_published.png' });
      console.log('投稿完了！URL:', page.url());
    } else {
      console.log('「公開する」ボタンが見つかりません。tmp_s5 を確認してください');
    }

    await page.waitForTimeout(5000);
  } catch (err) {
    console.error('エラー:', err.message);
    await page.screenshot({ path: '/Users/cratermacbookpro/Projects/claude/tmp_error.png' });
  } finally {
    await browser.close();
  }
})();
