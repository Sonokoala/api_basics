const express = require('express');
const app = express();

app.get("/api/greet/:name", (req, res) => {
  res.json({
    message: `Hello, ${req.params.name}`
  });
});

const startedAt = Date.now();

app.get("/about", (req, res) => {
  res.send("<h1>About Us</h1>");
});

app.get("/api/user", (req, res) => {
  res.json({
    name: "Madoka",
    role: "Analyst"
  });
});

app.get("/api/orders/:id", (req, res) => {
  res.json({
    orderId: req.params.id,
    status: "pending"
  });
});

// Homework: greet API
app.get("/api/greet/:name", (req, res) => {
  res.json({
    message: `Hello, ${req.params.name}`
  });
});

// Homework: contact page
app.get("/contact", (req, res) => {
  res.send(`
    <h1>Madoka Thomson</h1>
    <p>Background: Medical imaging, customer support and IT.</p>
    <p>Currently learning: JavaScript, Node.js, Express and APIs.</p>
  `);
});

// Homework: service status
app.get("/api/status", (req, res) => {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);

  res.json({
    status: "ok",
    uptime: `${seconds} seconds`
  });
});

// Extra: skills
app.get("/api/skills", (req, res) => {
  res.json([
    "Customer Support",
    "IT Support",
    "JavaScript",
    "Python",
    "SQL",
    "Japanese"
  ]);
});

// Extra: query parameter
app.get("/api/search", (req, res) => {
  res.json({
    query: req.query.q
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));