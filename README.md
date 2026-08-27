# ハノイ／千葉 一日旅行プラン

行き先・年齢・趣味・ライフスタイルを入力すると、JSON の候補から Gemini 3.5 Flash-Lite が一日の旅行プランを組み立てます。件数は 3〜8 件で、入力に合わせて変わります。

## 必要なもの

- Node.js 20 以上
- npm
- Google Cloud プロジェクト `shuta-travel-chiba`
  - **Vertex AI API** を有効にする
  - サービスアカウント JSON（例: `shuta-travel-chiba-b3ade307c85d.json`）をプロジェクト直下に置く

## 環境変数

`.env.example` をコピーして `.env` を作ります。

```bash
cp .env.example .env
```

```
GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION＝
```

`gemini-3.5-flash-lite` は `us-central1` などの単一リージョンでは使えません。`global`（またはマルチリージョンの `us` / `eu`）を指定してください。

サービスアカウントと `.env` は Git に含めません。`VITE_` で始まる変数には鍵を書かないでください。

## 起動方法

```bash
npm install
npm run dev
```

フロントとバックが同時に起動します。ブラウザで表示された URL（例: `http://localhost:5173`）を開きます。環境変数を変えたあとは開発サーバーを再起動してください。

片方だけ動かすときは次を使います。

```bash
npm run dev:backend
npm run dev:frontend
```

## 使い方

1. **行き先**でハノイか千葉を選ぶ
2. 性別・年齢・趣味・ライフスタイルを入力する
3. 「プランを考える」を押す（AI が候補から場所を選ぶ）
4. 朝〜夜の予定が表示される（件数は人によって変わる）
5. 「別のプランを考える」で、同じ入力のまま別の組み合わせを見る
6. 「やり直す」で入力画面に戻る

## データの編集

スポットの追加・修正は次の JSON を編集します。

- `backend/data/hanoi.json`
- `backend/data/chiba.json`

直したあとに `npm run seed -w backend` を走らせます。

`places` 配列にオブジェクトを足すだけで、AI の候補に入ります。

## その他のコマンド

```bash
npm run lint    # ESLint
npm run build   # 本番用ビルド
```
