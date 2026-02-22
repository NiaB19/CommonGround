import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../frontend')));

const dataPath = (file) => join(__dirname, 'data', file);
function readJSON(file) {
  const p = dataPath(file);
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, 'utf8'));
}
function writeJSON(file, data) {
  writeFileSync(dataPath(file), JSON.stringify(data, null, 2));
}

app.get('/api/spaces', (req, res) => {
  let spaces = readJSON('spaces.json');
  if (req.query.free  === '1') spaces = spaces.filter(s => s.is_free);
  if (req.query.ada   === '1') spaces = spaces.filter(s => s.is_ada);
  if (req.query.quiet === '1') spaces = spaces.filter(s => s.is_quiet);
  if (req.query.solo  === '1') spaces = spaces.filter(s => s.solo_friendly);
  res.json({ status: 'success', count: spaces.length, spaces });
});

app.get('/api/events', (req, res) => {
  let events = readJSON('events.json');
  if (req.query.type)     events = events.filter(e => e.type?.toLowerCase() === req.query.type.toLowerCase());
  if (req.query.location) events = events.filter(e => e.location_name?.toLowerCase().includes(req.query.location.toLowerCase()));
  if (req.query.from)     events = events.filter(e => e.date >= req.query.from);
  events.sort((a, b) => a.date?.localeCompare(b.date));
  res.json({ status: 'success', count: events.length, events });
});

app.post('/api/events', (req, res) => {
  const { eventName, startTime, endTime, linkedSpace, host, type, description, frequency, cost, vibe, cta } = req.body;
  if (!eventName || !startTime || !endTime) {
    return res.status(400).json({ status: 'error', message: 'eventName, startTime, and endTime are required.' });
  }
  const events = readJSON('events.json');
  const maxId  = events.reduce((m, e) => Math.max(m, e.event_id || 0), 0);
  const dt     = new Date(startTime);
  const newEvent = {
    event_id: maxId + 1,
    title: eventName, host: host || '',
    location_name: linkedSpace || '',
    date: dt.toISOString().split('T')[0],
    time: dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    end_time: endTime, frequency: frequency || 'one-time',
    type: type || 'Social', is_free: !cost || parseFloat(cost) === 0,
    cost: parseFloat(cost) || 0, vibe: Array.isArray(vibe) ? vibe : [],
    description: description || '', cta: cta || '',
    submittedAt: new Date().toISOString(),
  };
  events.push(newEvent);
  writeJSON('events.json', events);
  res.json({ status: 'success', message: 'Event saved!', event_id: newEvent.event_id });
});

app.post('/api/spaces', (req, res) => {
  const { name, category, location, description, amenities, essentials, vibe, vibeslider, cost, studentPerk, transit, protip } = req.body;
  if (!name) return res.status(400).json({ status: 'error', message: 'Space name is required.' });
  const spaces = readJSON('spaces.json');
  const newSpace = {
    name, category: category || '', location: location || '',
    lat: 0, lng: 0, description: description || '',
    amenities: amenities || '',
    essentials: Array.isArray(essentials) ? essentials : [],
    vibe: Array.isArray(vibe) ? vibe : [],
    vibe_slider: parseInt(vibeslider) || 3,
    is_free: cost === 'free' || !cost, cost_type: cost || 'free',
    student_perk: studentPerk || '', transit: transit || '',
    protip: protip || '',
    is_quiet: Array.isArray(vibe) && vibe.includes('silent'),
    is_ada: Array.isArray(essentials) && essentials.includes('restrooms'),
    solo_friendly: false, submittedAt: new Date().toISOString(), id: Date.now(),
  };
  spaces.push(newSpace);
  writeJSON('spaces.json', spaces);
  res.json({ status: 'success', message: 'Space saved!', id: newSpace.id });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ status: 'error', message: 'No message provided.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ status: 'error', message: 'GEMINI_API_KEY missing in .env' });
  const spaces = readJSON('spaces.json');
  const events = readJSON('events.json');
  const systemPrompt = `You are "Groundie", the friendly AI assistant for CommonGround — an inclusive third-space discovery platform for the New Brunswick / Rutgers, NJ area.
Your mission: help users find welcoming, affordable, and accessible places to connect with their community outside home and work.
PERSONALITY: Warm, encouraging, empathetic. Concise (2-4 sentences). Solo attendance is always celebrated.
SPACES: ${JSON.stringify(spaces)}
EVENTS: ${JSON.stringify(events)}
RULES: Only recommend from the lists above. For solo/nervous users highlight solo_friendly spots. End with an encouraging nudge.`;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(systemPrompt + '\n\nUser: ' + message);
    res.json({ status: 'success', response: result.response.text() });
  } catch (err) {
    console.error('[Gemini Error]', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ CommonGround server running at http://localhost:${PORT}`);
});
