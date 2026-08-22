import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Simple in-memory storage for batch jobs
const batchJobs = new Map();

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth endpoints (mock)
app.post('/api/auth/login/', (req, res) => {
  const { username } = req.body || {};
  const token = `mock-token-${uuidv4()}`;
  res.json({ token, user: { id: 'user-1', username: username || 'demo', name: 'Demo User' } });
});

app.post('/api/auth/refresh/', (req, res) => {
  res.json({ token: `mock-token-${uuidv4()}` });
});

app.get('/api/auth/verify/', (req, res) => {
  res.json({ id: 'user-1', username: 'demo', name: 'Demo User' });
});

// AI engine endpoints
app.get('/api/ai-engine/models/', (req, res) => {
  const models = [
    { id: 'm-sales-1', name: 'sales-insight-v1', engineType: 'sales', description: 'Sales insight model', version: '1.0', status: 'active', accuracy: 0.92, totalPredictions: 12345, predictions24h: 120, lastUpdated: new Date().toISOString(), inputSchema: {}, outputSchema: {} },
    { id: 'm-service-1', name: 'service-predictor-v1', engineType: 'service', description: 'Service prediction model', version: '1.3', status: 'active', accuracy: 0.89, totalPredictions: 5432, predictions24h: 45, lastUpdated: new Date().toISOString(), inputSchema: {}, outputSchema: {} }
  ];
  res.json({ models });
});

app.get('/api/ai-engine/models/:id/', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: id, engineType: 'service', description: 'Mock model', version: '1.0', status: 'active', accuracy: 0.9, totalPredictions: 1000, predictions24h: 10, lastUpdated: new Date().toISOString(), inputSchema: {}, outputSchema: {} });
});

app.post('/api/ai-engine/predict/:modelName/', (req, res) => {
  const { modelName } = req.params;
  const { input } = req.body || {};
  // Return a trivial mock prediction
  res.json({ prediction: { model: modelName, input, output: 'mocked-output' }, confidence: 0.85, modelVersion: '1.0', timestamp: new Date().toISOString() });
});

app.post('/api/ai-engine/batch-predict/', (req, res) => {
  const jobId = uuidv4();
  const { modelId, data } = req.body || {};
  // Store job and mark as processing, then complete after short timeout
  batchJobs.set(jobId, { jobId, status: 'processing', progress: 0, totalRecords: Array.isArray(data) ? data.length : 0, processedRecords: 0, successfulRecords: 0, failedRecords: 0 });

  setTimeout(() => {
    batchJobs.set(jobId, { jobId, status: 'completed', progress: 100, totalRecords: Array.isArray(data) ? data.length : 0, processedRecords: Array.isArray(data) ? data.length : 0, successfulRecords: Array.isArray(data) ? data.length : 0, failedRecords: 0, results: (data || []).map((d, i) => ({ input: d, output: `mock-output-${i}` })) });
  }, 1500);

  res.json({ jobId, status: 'processing' });
});

app.get('/api/ai-engine/batch-jobs/:jobId/', (req, res) => {
  const job = batchJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Simple AI generation endpoint used by frontend geminiService wrapper
app.post('/api/gemini/generate/', (req, res) => {
  const { context, userQuery } = req.body || {};
  const answer = `Mock AI Response: Based on the context (${context}), here is a short answer to your query: ${userQuery}`;
  res.json({ text: answer, answer });
});

// Analytics endpoints (minimal mocks)
app.get('/api/analytics/revenue/', (req, res) => {
  res.json({ revenue: 12345, start_date: req.query.start_date, end_date: req.query.end_date });
});

app.post('/api/analytics/export/', (req, res) => {
  res.json({ url: '/exports/mock-report.csv' });
});

// Voice endpoints (minimal)
app.get('/api/voice/calls/active/', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => console.log(`Mock backend listening on http://localhost:${PORT}`));
