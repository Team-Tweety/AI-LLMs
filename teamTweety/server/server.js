// server/server.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse incoming JSON requests

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
