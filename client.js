// client.js
const BASE_URL = 'http://127.0.0.1:3000';
const HEADERS = { 'Content-Type': 'application/json' };

// 共通のエラーハンドラ（構文エラーを防ぐためシンプルな文字列結合で記述）
async function handleResponse(response, id, method) {
  const idStr = id ? " '" + id + "'" : "";

  // 404 Not Found の場合
  if (response.status === 404) {
    throw new Error("[" + method + " Error] The ID" + idStr + " does not exist.");
  }

  if (!response.ok) {
    throw new Error("[" + method + " Error] Request failed with status " + response.status);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  // レスポンスボディで存在判定を行う場合
  if (data.exists === false || data.found === false || data.error === 'not_found') {
    throw new Error("[" + method + " Error] The ID" + idStr + " does not exist.");
  }

  return data;
}

// ==========================================
// 1. GET メソッド
// ==========================================

// Citizen ID で取得
async function getByCitizenId(citizenId) {
  const url = BASE_URL + "/api/citizens/" + encodeURIComponent(citizenId);
  const res = await fetch(url, { method: 'GET', headers: HEADERS });
  return handleResponse(res, citizenId, 'GET');
}

// First Name（氏名・国名）で検索
async function getByFirstName({ firstName, lastName = '', country = '' }) {
  const params = new URLSearchParams({ firstName, lastName, country });
  const url = BASE_URL + "/api/citizens?" + params.toString();
  const res = await fetch(url, { method: 'GET', headers: HEADERS });
  if (!res.ok) {
    throw new Error("[GET Error] Request failed with status " + res.status);
  }
  return res.json();
}

// ==========================================
// 2. POST メソッド（新規登録）
// ==========================================

async function createCitizen({ citizenId, firstName, lastName, country }) {
  const url = BASE_URL + "/api/citizens";
  const res = await fetch(url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ citizenId, firstName, lastName, country }),
  });
  return handleResponse(res, citizenId, 'POST');
}

// ==========================================
// 3. PUT メソッド（更新）
// ==========================================

async function updateByCitizenId(citizenId, updateData) {
  const url = BASE_URL + "/api/citizens/" + encodeURIComponent(citizenId);
  const res = await fetch(url, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(updateData),
  });
  return handleResponse(res, citizenId, 'PUT');
}

// ==========================================
// 4. DELETE メソッド（削除）
// ==========================================

async function deleteByCitizenId(citizenId) {
  const url = BASE_URL + "/api/citizens/" + encodeURIComponent(citizenId);
  const res = await fetch(url, { method: 'DELETE', headers: HEADERS });
  return handleResponse(res, citizenId, 'DELETE');
}

// ==========================================
// 実行テスト
// ==========================================
async function main() {
  const testId = 'SAMPLE_ID_101';
  const nonExistentId = 'NON_EXISTENT_ID';

  console.log("Connecting to: " + BASE_URL + "\n");

  // 1. GET: 存在するID / 存在しないID
  try {
    console.log("--- 1. GET by Citizen ID (存在しないIDのテスト) ---");
    await getByCitizenId(nonExistentId);
  } catch (err) {
    console.error(err.message);
  }

  // 2. POST: 作成
  try {
    console.log("\n--- 2. POST (新規作成) ---");
    const created = await createCitizen({
      citizenId: testId,
      firstName: 'Taro',
      lastName: 'Yamada',
      country: 'JP'
    });
    console.log("Created:", created);
  } catch (err) {
    console.error(err.message);
  }

  // 3. GET: First Name 検索
  try {
    console.log("\n--- 3. GET (First Name 検索) ---");
    const result = await getByFirstName({ firstName: 'Taro', lastName: 'Yamada', country: 'JP' });
    console.log("Search Result:", result);
  } catch (err) {
    console.error(err.message);
  }

  // 4. PUT: 更新
  try {
    console.log("\n--- 4. PUT (更新) ---");
    const updated = await updateByCitizenId(testId, {
      firstName: 'Jiro',
      lastName: 'Yamada',
      country: 'JP'
    });
    console.log("Updated:", updated);
  } catch (err) {
    console.error(err.message);
  }

  // 5. DELETE: 削除
  try {
    console.log("\n--- 5. DELETE (削除) ---");
    const deleted = await deleteByCitizenId(testId);
    console.log("Deleted:", deleted);
  } catch (err) {
    console.error(err.message);
  }
}

main();