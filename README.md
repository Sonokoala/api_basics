# api_basics

Postman を使ってバックエンド API（Node.js + Express）の基礎を学んだときの練習用リポジトリです。
データはすべてメモリ上の配列なので、サーバーを再起動すると元に戻ります。

## 必要なもの

- Node.js 18 以上（`client.js` / `task.js` が組み込みの `fetch` を使うため）
- Postman

## セットアップ

各フォルダに `package.json` があるので、使うフォルダで一度だけ依存関係を入れます。

```bash
npm install                     # ルート
cd "order API" && npm install   # Orders API
cd "task 26 Sep" && npm install # 9/26 の課題
```

どのサーバーもポート 3000 を使うので、同時に起動できるのは 1 つだけです。

## 中身

| ファイル / フォルダ | 内容 | 起動方法 |
| --- | --- | --- |
| `next.js` | GET の練習（色・国とスポーツ・挨拶・ステータス・スキル・検索など） | `node next.js` |
| `test.js` | 最初の課題メモ | ― |
| `citizen_server.js` | Citizens API（CRUD、404/400 の扱い） | `node citizen_server.js` |
| `client.js` / `task.js` | Citizens API を `fetch` で呼ぶクライアント | サーバー起動後に `node client.js` |
| `order API/server.js` | Orders API（CRUD、価格・数量のバリデーション付き） | `cd "order API" && npm start` |
| `task 26 Sep/task.js` | Orders API の解説付き版 | `cd "task 26 Sep" && node task.js` |
| `lesson material/` | 教材（Backend Basics Guide と日本語要約） | ― |
| `public-apis/` | 参考用に取り込んだ外部リポジトリ | ― |

## Postman での確認例（Citizens API）

| メソッド | URL | Body (JSON) |
| --- | --- | --- |
| GET | `http://localhost:3000/api/citizens?firstName=Taro` | ― |
| GET | `http://localhost:3000/api/citizens/C101` | ― |
| POST | `http://localhost:3000/api/citizens` | `{"citizenId":"C103","firstName":"Ken"}` |
| PUT | `http://localhost:3000/api/citizens/C103` | `{"country":"Japan"}` |
| DELETE | `http://localhost:3000/api/citizens/C103` | ― |

Orders API も同じ形で `/api/orders` と `/api/orders/:id` を使います。

上の全リクエスト（27件、ステータスコードのテスト付き）は `postman/api_basics.postman_collection.json` に入っています。
Postman で Import → このファイルを選ぶと、Citizens API / Orders API / GET の練習 の3フォルダが追加されます。
サーバーを起動してから、フォルダの「Run」でまとめて実行することもできます。
