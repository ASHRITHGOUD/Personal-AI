import 'dotenv/config';
import { createClient } from 'redis';
import { MongoClient } from 'mongodb';

const STM_TTL_SECONDS = 60 * 30; // 30 minutes expiry for STM
const STM_MAX_MESSAGES = 20;     // Keep last 20 messages

// ================= Redis (Short-Term Memory) =================

const redis = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// ✅ Keep only one error handler
redis.on('error', (err) => console.error('Redis error:', err));

function stmKey(userId) {
  return `chat:${userId}`;
}


// ================= MongoDB (Long-Term Memory) =================
// ================= MongoDB (Long-Term Memory) =================
let mongoClient;
let ltmCollection;

async function init() {
  // Connect to Redis
  if (!redis.isOpen) {
    await redis.connect();
    console.log('[STM] Connected to Redis');
  }

  // Connect to MongoDB
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGODB_URI); // ✅ FIXED
    await mongoClient.connect();
    const db = mongoClient.db(process.env.MONGO_DB);
    ltmCollection = db.collection(process.env.MONGO_COLLECTION);
    await ltmCollection.createIndex({ user_id: 1, timestamp: -1 });
    console.log('[LTM] Connected to MongoDB Atlas');
  }
}


// ================= STM Functions =================
async function appendToSTM(userId, role, content) {
  await init();
  const entry = JSON.stringify({ role, content, ts: Date.now() });
  const key = stmKey(userId);
  await redis.rPush(key, entry);
  await redis.lTrim(key, -STM_MAX_MESSAGES, -1); // Keep last N
  await redis.expire(key, STM_TTL_SECONDS);      // Expire after TTL
}

async function getSTM(userId, limit = STM_MAX_MESSAGES) {
  await init();
  const len = await redis.lLen(stmKey(userId));
  const start = Math.max(0, len - limit);
  const list = await redis.lRange(stmKey(userId), start, -1);
  return list.map(s => {
    try { return JSON.parse(s); }
    catch { return { role: 'unknown', content: s }; }
  });
}

async function clearSTM(userId) {
  await init();
  await redis.del(stmKey(userId));
}

// ================= LTM Functions =================
async function saveToLTM(userId, role, content, tags = []) {
  await init();
  const doc = {
    user_id: userId,
    role,
    content,
    tags,
    timestamp: new Date()
  };
  await ltmCollection.insertOne(doc);
  return doc;
}

async function getLTM(userId, limit = 50) {
  await init();
  return ltmCollection
    .find({ user_id: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

// ================= Utility =================
function composeContext(stmMessages, ltmDocs, { maxChars = 4000 } = {}) {
  const stmStr = stmMessages.map(m => `${m.role}: ${m.content}`).join('\n');
  const ltmStr = ltmDocs.map(d => `${d.role || 'note'}: ${d.content}`).join('\n');
  let ctx = `Short-Term Context:\n${stmStr}\n\nLong-Term Memory:\n${ltmStr}`;
  if (ctx.length > maxChars) ctx = ctx.slice(-maxChars);
  return ctx;
}

async function saveBoth(userId, prompt, response) {
  await appendToSTM(userId, 'user', prompt);
  await appendToSTM(userId, 'assistant', response);
  await saveToLTM(userId, 'user', prompt);
  await saveToLTM(userId, 'assistant', response);
}

// ================= Export =================
export default {
  init,
  appendToSTM,
  getSTM,
  clearSTM,
  saveToLTM,
  getLTM,
  composeContext,
  saveBoth
};
