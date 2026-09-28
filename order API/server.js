const express = require('express');
const app = express();
app.use(express.json());
const orders = [
  { id: 1, item: 'Keyboard', quantity: 2, status: 'pending', price: 25 },
  { id: 2, item: 'Monitor', quantity: 1, status: 'shipped', price: 150 },
  { id: 3, item: 'Mouse', quantity: 4, status: 'pending', price: 15 },
  { id: 4, item: 'Laptop stand', quantity: 1, status: 'delivered', price: 40 }
];
let nextId = 5;


app.get('/api/orders', (req, res) => {
  res.status(200).json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }
  res.status(200).json(order);
});

app.post('/api/orders', (req, res) => {
  const { item, quantity, price } = req.body;
  if (!item) {
    return res.status(400).json({ error: 'item is required' });
  }
  if (quantity !== undefined && quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be greater than ' });
  }
  const newOrder = {
    id: nextId,
    item: item,
    quantity: quantity || 0,
    status: 'pending',
    price: price || 0,
  };
  nextId = nextId + 1;
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }
  const { status, item } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }
  order.status = status;
  if (item){
    order.item = item;
  }
  res.status(200).json(order);
});

app.delete('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }
  const removed = orders.splice(index, 1)[0];
  res.status(200).json({ message: 'Order deleted', order: removed });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});