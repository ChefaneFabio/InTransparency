const express = require('express');
const cors = require('cors');

console.log('Starting debug server...');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', message: 'Debug server is running!' });
});

app.get('/api/auth/me', (req, res) => {
  console.log('Auth me requested');
  res.status(401).json({ error: 'Not authenticated' });
});

console.log('About to start listening...');

app.listen(PORT, () => {
  console.log(`🚀 Debug server running on http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

console.log('Setup complete');