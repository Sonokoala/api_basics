// D:\04_Projects\Lab\gen_ai\api_basics\citizen_server.js
const express = require('express');

const app = express();
app.use(express.json());

// メモリ上のデータ
const citizens = [
  { citizenId: 'C101', firstName: 'Taro', lastName: 'Yamada', country: 'Japan' },
  { citizenId: 'C102', firstName: 'Jane', lastName: 'Doe', country: 'Australia' }
];

// 1. GET: First Name 検索
app.get('/api/citizens', (req, res) => {
  const { firstName } = req.query;
  const result = firstName 
    ? citizens.filter(c => c.firstName.toLowerCase() === firstName.toLowerCase()) 
    : citizens;
  res.status(200).json(result);
});

// 2. GET: Citizen ID 検索（存在しない場合は 404）
app.get('/api/citizens/:id', (req, res) => {
  const citizen = citizens.find(c => c.citizenId === req.params.id);
  if (!citizen) {
    return res.status(404).json({ error: "The ID '" + req.params.id + "' does not exist." });
  }
  res.status(200).json(citizen);
});

// 3. POST: 新規登録
app.post('/api/citizens', (req, res) => {
  const { citizenId, firstName, lastName, country } = req.body;
  if (!citizenId || !firstName) {
    return res.status(400).json({ error: 'citizenId and firstName are required' });
  }
  const newCitizen = { citizenId, firstName, lastName: lastName || '', country: country || '' };
  citizens.push(newCitizen);
  res.status(201).json(newCitizen);
});

// 4. PUT: 更新（存在しない場合は 404）
app.put('/api/citizens/:id', (req, res) => {
  const citizen = citizens.find(c => c.citizenId === req.params.id);
  if (!citizen) {
    return res.status(404).json({ error: "The ID '" + req.params.id + "' does not exist." });
  }
  const { firstName, lastName, country } = req.body;
  if (firstName) citizen.firstName = firstName;
  if (lastName) citizen.lastName = lastName;
  if (country) citizen.country = country;
  res.status(200).json({ message: 'Updated', citizen: citizen });
});

// 5. DELETE: 削除（存在しない場合は 404）
app.delete('/api/citizens/:id', (req, res) => {
  const index = citizens.findIndex(c => c.citizenId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "The ID '" + req.params.id + "' does not exist." });
  }
  const removed = citizens.splice(index, 1)[0];
  res.status(200).json({ message: 'Deleted', citizen: removed });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Citizens API running on http://localhost:' + PORT);
});