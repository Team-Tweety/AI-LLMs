// server/server.js
import express from 'express';
import queryOpenAIChat from './openaiController.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cors());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// app.post('/api', (req, res) => {
//   res.status(200).json({res.locals.generatedScript});
// });

app.post('/api', queryOpenAIChat, (req, res) => {
  // Send the response after queryOpenAIChat middleware is done
  res.status(200).json({ generatedScript: res.locals.generatedScript });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.post('/api', queryOpenAIChat, (req, res) => {
//   res.status(200).json({ res.locals.generatedScript });
// });
