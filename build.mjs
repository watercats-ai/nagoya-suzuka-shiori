// 栞.html（Artifact 用の断片）から、静的ホスティング用の index.html を作る。
// 本文の編集は 栞.html 側だけで行い、公開前に `node build.mjs` を走らせる。
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = '栞.html';
const OUT = 'index.html';

const fragment = readFileSync(SRC, 'utf8');

// 断片の先頭にある <title> を取り出して、<head> 側へ移す
const titleMatch = fragment.match(/<title>([\s\S]*?)<\/title>/);
const title = titleMatch ? titleMatch[1].trim() : '名古屋・鈴鹿の栞';

// 本文が始まる位置で切り、それより前（フォント読み込みと <style>）は <head> に入れる
const SPLIT = '<div class="wrap">';
const splitAt = fragment.indexOf(SPLIT);
if (splitAt === -1) {
  throw new Error(`${SRC} に ${SPLIT} が見つかりません。切り分け位置を確認してください。`);
}
const head = fragment
  .slice(0, splitAt)
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .trim();
const body = fragment.slice(splitAt).trim();

const description =
  '2026年9月13〜15日、大人2人と6歳・3歳で行く名古屋・鈴鹿の3日間。';

// タブのアイコン（絵文字を SVG に埋めた data URI）
const favicon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<text y=".9em" font-size="90">🏁</text></svg>'
  );

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#EEF0F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F141B" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<link rel="icon" href="${favicon}">
<title>${title}</title>
<style>
  :root{color-scheme:light dark}
  html{-webkit-text-size-adjust:100%}
  body{margin:0}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;

writeFileSync(OUT, html, 'utf8');
console.log(`${OUT} を書き出しました（${title} / ${html.length.toLocaleString()} bytes）`);
