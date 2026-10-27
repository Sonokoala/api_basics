// D:\04_Projects\Lab\gen_ai\api_basics\client.js

// IPv6の解決トラブルを防ぐため 127.0.0.1 を指定（localhost:3000 でも可）
const BASE_URL = 'http://127.0.0.1:3000';
const HEADERS = { 'Content-Type': 'application/json' };

// 共通通信 & エラーハンドラ
async function safeFetch(url, options = {}, id = null, method = 'GET') {
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    if (err.cause?.code === 'ECONNREFUSED' || err.message.includes('fetch failed')) {
      throw new Error('[接続エラー] ポート3000で Citizen API サーバーが起動していません。別プロジェクト側のサーバーを起動してください。');
    }
    throw err;
  }

  const idText = id ? " '" + id + "'" : "";

  // IDが存在しない場合 (404 Not Found)
  if (response.status === 404) {
    throw new Error("[" + method + " Error] The ID" + idText + " does not exist.");
  }

  if (!response.ok) {
    throw new Error("[" + method + " Error] Request failed with status " + response.status);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  // レスポンスボディで存在判定を行う場合
  if (data.exists === false || data.found === false || data.error === 'not_found') {
    throw new Error("[" + method + " Error] The ID" + idText + " does not exist.");
  }

  return data;
}

// ==========================================
// APIメソッド定義
// ==========================================

// 1. GET: Citizen ID で取得
async function getByCitizenId(citizenId) {
  const url = BASE_URL + '/api/citizens/' + encodeURIComponent(citizenId);
  return safeFetch(url, { method: 'GET', headers: HEADERS }, citizenId, 'GET');
}

// 2. GET: First Name で検索
async function getByFirstName({ firstName, lastName = '', country = '' }) {
  const params = new URLSearchParams({ firstName, lastName, country });
  const url = BASE_URL + '/api/citizens?' + params.toString();
  return safeFetch(url, { method: 'GET', headers: HEADERS }, null, 'GET');
}

// 3. POST: 新規登録
async function createCitizen({ citizenId, firstName, lastName, country }) {
  const url = BASE_URL + '/api/citizens';
  return safeFetch(url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ citizenId, firstName, lastName, country }),
  }, citizenId, 'POST');
}

// 4. PUT: 更新（ID指定）
async function updateCitizen(citizenId, updateData) {
  const url = BASE_URL + '/api/citizens/' + encodeURIComponent(citizenId);
  return safeFetch(url, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(updateData),
  }, citizenId, 'PUT');
}

// 5. DELETE: 削除（ID指定）
async function deleteCitizen(citizenId) {
  const url = BASE_URL + '/api/citizens/' + encodeURIComponent(citizenId);
  return safeFetch(url, { method: 'DELETE', headers: HEADERS }, citizenId, 'DELETE');
}

// ==========================================
// 実行テスト
// ==========================================
async function main() {
  const testId = 'SAMPLE_ID_101';
  const nonExistentId = 'NON_EXISTENT_999';

  console.log('Connecting to Citizen API at: ' + BASE_URL + '\n');

  // テスト1: 存在しないIDの取得（エラーメッセージの確認）
  try {
    console.log('--- 1. GET by Citizen ID (存在しないIDのテスト) ---');
    await getByCitizenId(nonExistentId);
  } catch (err) {
    console.error(err.message);
  }

  // テスト2: 新規登録 (POST)
  try {
    console.log('\n--- 2. POST (新規作成) ---');
    const created = await createCitizen({
      citizenId: testId,
      firstName: 'Taro',
      lastName: 'Yamada',
      country: 'Japan',
    });
    console.log('Created:', created);
  } catch (err) {
    console.error(err.message);
  }

  // テスト3: First Name で検索 (GET)
  try {
    console.log('\n--- 3. GET (First Name 検索) ---');
    const result = await getByFirstName({ firstName: 'Taro' });
    console.log('Search Result:', result);
  } catch (err) {
    console.error(err.message);
  }

  // テスト4: 更新 (PUT)
  try {
    console.log('\n--- 4. PUT (更新) ---');
    const updated = await updateCitizen(testId, {
      firstName: 'Jiro',
      lastName: 'Yamada',
      country: 'Japan',
    });
    console.log('Updated:', updated);
  } catch (err) {
    console.error(err.message);
  }

  // テスト5: 削除 (DELETE)
  try {
    console.log('\n--- 5. DELETE (削除) ---');
    const deleted = await deleteCitizen(testId);
    console.log('Deleted:', deleted);
  } catch (err) {
    console.error(err.message);
  }

  // テスト6: 削除後の再取得（存在しないエラーの確認）
  try {
    console.log('\n--- 6. 削除後の存在確認 (存在しないIDテスト) ---');
    await getByCitizenId(testId);
  } catch (err) {
    console.error(err.message);
  }
}

main();