# デザイン仕上げの引き継ぎ

家族旅行（2026/9/13-15・名古屋と鈴鹿）のしおり。**内容は確定済みで、これから直すのはデザインだけ**。

公開先: https://watercats-ai.github.io/nagoya-suzuka-shiori/

## 触るファイル

| ファイル | 扱い |
| --- | --- |
| `栞.html` | **ここだけ編集する。** `<style>` ブロックが本丸 |
| `index.html` | **編集しない。** `build.mjs` の出力で、次のビルドで上書きされる |
| `build.mjs` | `栞.html` → `index.html` を生成。触る必要はない |

## 読む人と読む場面

スマホの縦持ち。旅行中、駅のホームや改札の前で片手で開いて、次に何時に何をするかを数秒で確認する。家族4人（大人2・6歳・3歳）でリンクを共有する。**紙に印刷はしない。**

いま一番効いている構造は、時刻を左カラムに等幅で揃えた縦タイムライン。時刻の桁が揃っていることが読みやすさの中心なので、ここを崩す変更は慎重に。

## 壊してはいけないもの

1. **`栞.html` に `<!doctype>` `<html>` `<head>` `<body>` を足さない。**
   このファイルは Claude の Artifact に貼る断片としても使っていて、公開時に `build.mjs` が正しい HTML 文書に包む。先頭は `<title>` から始まる現在の形を保つこと。

2. **`tel:` リンクと Google Maps リンク。**
   `.btn.tel` と `.inline-links` の中にある。スマホでタップして発信・地図が開くのが、このページの実用価値の半分を占める。見た目は変えていいが、リンクは残す。

3. **チェックボックスの `id` と末尾の `<script>`。**
   持ちものと「やること」のチェック状態を `localStorage`（キー `nagoya-suzuka-2026`）に保存している。`id` を振り直すと、すでに付けたチェックが消える。項目を増やすときは既存 `id` を維持したまま新しい `id` を足す。

4. **ダークモードの3状態対応。**
   ビューアのテーマは「light 明示」「dark 明示」「OS任せ（属性なし）」の3つある。いまは次の構造で全部を満たしている:
   - 素の `:root` にライトの全トークンを定義
   - `@media (prefers-color-scheme: dark)` 内を `:root:not([data-theme="light"])` でガード
   - `:root[data-theme="dark"]` でもう一度上書き

   **色をメディアクエリや `[data-theme]` の中だけで定義しない。** 属性が付かない状態で色が当たらず、片方のテーマの文字がもう片方の地の上に乗る事故になる。`body` の `background` もトークンから必ず明示すること。

5. **フォントの読み込み元。**
   Artifact 側の CSP で、外部スタイルシートは Google Fonts しか通らない。フォントを変えるなら Google Fonts から選ぶか、`@font-face` の data URI で埋め込む。他のホストからは黙って読み込みに失敗する。

6. **本文の文言・時刻・金額・固有名詞。**
   駅探・Yahoo!路線情報・三重交通・各施設の公式サイトで2026年9月12日に確認した実データ。**変更しない。** 誤字を見つけた場合だけ直す。

## 現在のトークン

`:root` に定義済み。差し替えれば全体の色が変わる。

```
--ground        ページの地
--surface       カード面
--surface-2     一段沈んだ面（ボタンなど）
--line          罫線
--line-strong   強い罫線・丸の輪郭
--ink           本文
--ink-2         副次テキスト
--ink-3         補足テキスト
--accent        アクセント（重要な時刻・警告枠）
--accent-ink    アクセント上の文字
--accent-soft   アクセントの淡い地
--blue          移動チップ・リンク
--blue-soft     移動チップの地
--focus         フォーカスリング
```

書体は見出し・本文が Zen Kaku Gothic New、時刻と数字が IBM Plex Mono。数字は `font-variant-numeric: tabular-nums` で桁を揃えている。

## 主なクラス

- `.masthead` — 表紙（`.eyebrow` / `h1` / `.dates` / `.party`）
- `.fact` `.leg` — 飛行機の便カード
- `.stay` — 宿カード
- `.tl` — 日ごとのタイムライン。`li.key` が赤丸の重要項目、`.time` `.what` `.memo` `.chip`（`.move` `.play`）
- `.deadline` — 各日の警告枠。落とすと予定が崩れる1点だけを置いている
- `.check` `.why` — チェックリスト
- `.money` `.fine` `.tablewrap` — 料金表
- `.foot` — 出典

## 仕上げたあと

```
node build.mjs
git add -A && git commit -m "デザイン調整" && git push
```

push すると GitHub Pages が数分で更新される。`index.html` を直接編集していないことを、コミット前に確認すること。
