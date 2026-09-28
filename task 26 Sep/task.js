// ============================================================
//  ORDERS API
//  Everything lives in this one file so it is easy to follow:
//  the data, the five endpoints, and the server itself.
//
//  To run it:
//      npm init -y
//      npm install express
//      node server.js
//
//  The server then listens on http://localhost:3000
// ============================================================

const express = require('express');

const app = express();
app.use(express.json()); // lets the server read JSON sent in a request body


// ------------------------------------------------------------
//  THE DATA
//  In a real project this would come from a database. Here it is
//  just an array of objects kept in memory, so it resets every
//  time the server restarts.
// ------------------------------------------------------------

const orders = [
  { id: 1, item: 'Keyboard',     quantity: 2, status: 'pending'   },
  { id: 2, item: 'Monitor',      quantity: 1, status: 'shipped'   },
  { id: 3, item: 'Mouse',        quantity: 4, status: 'pending'   },
  { id: 4, item: 'Laptop stand', quantity: 1, status: 'delivered' }
];

let nextId = 5; // the id that the next created order will get


// ------------------------------------------------------------
//  1. GET /api/orders
//  Returns the whole list. Nothing can really go wrong here,
//  so it always answers with 200.
// ------------------------------------------------------------

app.get('/api/orders', (req, res) => {
  res.status(200).json(orders);
});


// ------------------------------------------------------------
//  2. GET /api/orders/:id
//  Returns one order. This is the important one for status codes:
//  if the id does not exist we answer 404 instead of pretending
//  the request worked.
// ------------------------------------------------------------

app.get('/api/orders/:id', (req, res) => {
  // The id arrives from the URL as text, so convert it to a number first.
  const id = Number(req.params.id);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }

  res.status(200).json(order);
});


// ------------------------------------------------------------
//  3. POST /api/orders
//  Creates a new order from the request body.
//  201 means "created", which is more precise than plain 200.
//  400 means the request itself was incomplete.
// ------------------------------------------------------------

app.post('/api/orders', (req, res) => {
  const { item, quantity } = req.body;

  if (!item) {
    return res.status(400).json({ error: 'item is required' });
  }

  const newOrder = {
    id: nextId,
    item: item,
    quantity: quantity || 1,
    status: 'pending'
  };

  nextId = nextId + 1;
  orders.push(newOrder);

  res.status(201).json(newOrder);
});


// ------------------------------------------------------------
//  4. PUT /api/orders/:id
//  Updates the status of an existing order.
// ------------------------------------------------------------

app.put('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }

  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  order.status = status;

  res.status(200).json(order);
});


// ------------------------------------------------------------
//  5. DELETE /api/orders/:id
//  Removes an order from the array.
//  findIndex gives us the position, splice removes it.
// ------------------------------------------------------------

app.delete('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order ' + id + ' was not found' });
  }

  const removed = orders.splice(index, 1)[0];

  res.status(200).json({ message: 'Order deleted', order: removed });
});


// ------------------------------------------------------------
//  START THE SERVER
// ------------------------------------------------------------

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Orders API running on http://localhost:' + PORT);
});