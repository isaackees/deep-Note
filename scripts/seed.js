require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Note = require('../models/note.js');

const techNotes = [
  {
    title: "Understanding JavaScript Closures",
    content: "A closure is a function that remembers variables from its outer scope even after the outer function has returned. Example: function outer() { let count = 0; return function inner() { count++; return count; }; } const counter = outer(); counter(); // 1, counter(); // 2. Closures are used for data privacy, function factories, and event handlers.",
    priority: "high",
    tags: ["javascript", "fundamentals", "functions"]
  },
  {
    title: "React useEffect Cleanup Function",
    content: "The cleanup function in useEffect runs before the component unmounts or before the effect runs again. It prevents memory leaks from subscriptions, timers, or event listeners. Example: useEffect(() => { const timer = setInterval(() => {}, 1000); return () => clearInterval(timer); }, []). Always clean up subscriptions in useEffect to avoid memory leaks.",
    priority: "high",
    tags: ["react", "hooks", "performance"]
  },
  {
    title: "Git Rebase vs Merge",
    content: "Merge creates a new commit that combines two branches, preserving history. Rebase moves commits from one branch onto another, creating a linear history. Use merge for public branches, rebase for cleaning up local commits before pushing. Never rebase commits that have been pushed to a shared branch — it rewrites history and causes conflicts for collaborators.",
    priority: "medium",
    tags: ["git", "version-control", "workflow"]
  },
  {
    title: "REST API Status Codes Cheat Sheet",
    content: "200 OK - success. 201 Created - resource created. 204 No Content - success, no body. 400 Bad Request - invalid input. 401 Unauthorized - not logged in. 403 Forbidden - logged in but no permission. 404 Not Found - resource missing. 500 Internal Server Error - server crash. Always use the right code so clients can react correctly without parsing response bodies.",
    priority: "high",
    tags: ["api", "rest", "http"]
  },
  {
    title: "MongoDB Indexing Basics",
    content: "Indexes speed up queries by creating a lookup structure. Without an index, MongoDB scans every document (collection scan). Create an index with db.collection.createIndex({ field: 1 }). Use indexes on fields you query or sort by frequently. Trade-off: indexes speed reads but slow writes (each write must update the index). Always check query performance with .explain('executionStats').",
    priority: "high",
    tags: ["mongodb", "database", "performance"]
  },
  {
    title: "CSS Flexbox vs Grid",
    content: "Flexbox is one-dimensional (row OR column), perfect for navigation bars, card rows, and centering. Grid is two-dimensional (rows AND columns), perfect for full page layouts, image galleries, and dashboards. Rule of thumb: use Flexbox for components, Grid for page layout. They work great together — Grid for the overall page, Flexbox inside each Grid cell.",
    priority: "medium",
    tags: ["css", "layout", "frontend"]
  },
  {
    title: "JavaScript Promises vs Async/Await",
    content: "Promises use .then() and .catch() chains. Async/await is syntactic sugar over promises, making asynchronous code read like synchronous code. Both are non-blocking. Use async/await for readability. Handle errors with try/catch in async functions. Remember: await only works inside async functions. Run multiple promises in parallel with Promise.all() for better performance.",
    priority: "high",
    tags: ["javascript", "async", "promises"]
  },
  {
    title: "Docker Basics for Developers",
    content: "Docker packages apps into containers with all dependencies. A Dockerfile defines the image. Run: docker build -t myapp . then docker run -p 3000:3000 myapp. Containers share the host OS kernel — lightweight compared to VMs. Use Docker Compose for multi-container apps (e.g., Node + MongoDB). Great for consistent dev environments across teams.",
    priority: "medium",
    tags: ["docker", "devops", "containers"]
  },
  {
    title: "Environment Variables Best Practices",
    content: "Never commit secrets to git. Store in .env file, add .env to .gitignore. Use process.env.VARIABLE in Node.js. Load with require('dotenv').config() at the top of the entry file. Different environments need different values (dev, staging, prod). On production, set env vars via the hosting platform's dashboard, not in a file. Rotate secrets regularly.",
    priority: "high",
    tags: ["security", "nodejs", "configuration"]
  },
  {
    title: "SQL JOIN Types Explained",
    content: "INNER JOIN: rows matching in both tables. LEFT JOIN: all rows from left + matches from right (nulls if no match). RIGHT JOIN: opposite of LEFT. FULL OUTER JOIN: all rows from both tables. CROSS JOIN: Cartesian product. Most common in practice: INNER and LEFT joins. Example: SELECT * FROM orders LEFT JOIN customers ON orders.customer_id = customers.id;",
    priority: "high",
    tags: ["sql", "database", "joins"]
  },
  {
    title: "Understanding the Event Loop in Node.js",
    content: "Node.js is single-threaded but non-blocking. The event loop processes callbacks in phases: timers, pending callbacks, poll, check, close. Long synchronous operations block the entire server. Use async operations for I/O. Offload CPU-heavy work to worker threads or child processes. Understanding the event loop explains why synchronous fs.readFileSync kills performance.",
    priority: "high",
    tags: ["nodejs", "performance", "event-loop"]
  },
  {
    title: "JWT Authentication Flow",
    content: "1. User sends credentials to /login. 2. Server verifies, creates JWT with payload + secret signature. 3. Server returns JWT. 4. Client stores JWT (localStorage or httpOnly cookie). 5. Client sends JWT in Authorization: Bearer <token> header. 6. Server verifies signature on each request. JWTs are stateless — no server session storage needed. Never store sensitive data in the payload (it's base64-encoded, not encrypted).",
    priority: "high",
    tags: ["auth", "jwt", "security"]
  },
  {
    title: "Array Methods Every JS Developer Should Know",
    content: "map() - transform each item. filter() - keep items matching condition. reduce() - accumulate into single value. find() - first matching item. findIndex() - index of first matching item. some() - does any item match? every() - do all items match? includes() - does array contain value? sort() - sort in place (mutates!). slice() - extract portion (doesn't mutate). splice() - modify in place (mutates!).",
    priority: "high",
    tags: ["javascript", "arrays", "methods"]
  },
  {
    title: "Redis Caching Strategy",
    content: "Redis is an in-memory key-value store used for caching. Common pattern: check cache → if miss, query DB → store in cache with TTL → return. Use TTL (time to live) to auto-expire stale data. Cache-aside pattern is most common. Invalidate cache on writes. Don't cache everything — focus on hot, read-heavy data. Redis also supports pub/sub, queues, and rate limiting.",
    priority: "medium",
    tags: ["redis", "caching", "performance"]
  },
  {
    title: "TypeScript Generics in 5 Minutes",
    content: "Generics let you write reusable code that works with multiple types. Example: function identity<T>(arg: T): T { return arg; }. Call with identity<string>('hello') or let TS infer. Use generics for functions, classes, and interfaces. Constraints: <T extends { id: string }> ensures T has an id. Common in utility types like Array<T>, Promise<T>, and Record<K, V>.",
    priority: "medium",
    tags: ["typescript", "generics", "types"]
  },
  {
    title: "HTTP Caching Headers",
    content: "Cache-Control: max-age=3600 — cache for 1 hour. no-cache — revalidate before using cache. no-store — never cache. ETag — unique identifier for a resource version. If-None-Match — client sends ETag, server returns 304 if unchanged. Last-Modified / If-Modified-Since — similar with timestamps. These headers dramatically reduce bandwidth and improve load times for repeat visitors.",
    priority: "medium",
    tags: ["http", "caching", "performance"]
  },
  {
    title: "Clean Code: Naming Matters",
    content: "Variables: nouns describing content (userList, activeOrders). Functions: verbs describing action (fetchUser, calculateTotal). Booleans: prefixes like is, has, can (isActive, hasPermission). Avoid abbreviations (usr, tmp). Avoid generic names (data, info, thing). Longer names are fine if clearer. Bad: const d = 5; Good: const RETRY_ATTEMPTS = 5. Code is read 10x more than written.",
    priority: "medium",
    tags: ["clean-code", "best-practices", "readability"]
  },
  {
    title: "WebSockets vs HTTP Polling",
    content: "HTTP polling: client repeatedly asks server for updates (wasteful, delayed). Long polling: server holds request open until update (better but complex). WebSockets: persistent two-way connection (real-time, efficient). Use WebSockets for chat, live scores, collaborative editing, notifications. Use regular HTTP for CRUD operations. Socket.io simplifies WebSockets with fallbacks for older browsers.",
    priority: "medium",
    tags: ["websockets", "realtime", "networking"]
  },
  {
    title: "Debugging Node.js Like a Pro",
    content: "Use console.log strategically, but for real debugging use the built-in inspector: node --inspect app.js, then open chrome://inspect. Set breakpoints, inspect variables, step through code. Use debugger; statement to pause execution. For async issues, log with timestamps. Check the stack trace. Use node --trace-warnings to see where warnings come from. Tools: VS Code debugger, ndb, node-inspector.",
    priority: "medium",
    tags: ["debugging", "nodejs", "tools"]
  },
  {
    title: "Mongoose populate() Deep Dive",
    content: "populate() replaces referenced ObjectIds with actual documents. Basic: Note.find().populate('user'). Select fields: .populate('user', 'name email'). Nested: .populate({ path: 'user', populate: { path: 'profile' } }). Multiple: .populate('user').populate('comments'). Under the hood: extra query per populate. For high performance, consider embedding instead. Always question: do you need the full document or just a field?",
    priority: "high",
    tags: ["mongoose", "mongodb", "relationships"]
  }
];

const tradingNotes = [
  {
    title: "Risk Management: The 1% Rule",
    content: "Never risk more than 1-2% of your trading capital on a single trade. If you have $10,000, max loss per trade = $100-$200. This keeps you in the game through losing streaks. Even 10 losses in a row only costs 10-20% of capital. Position size = (Account × Risk%) / (Entry - Stop Loss). Combine with a minimum 1:2 risk-to-reward ratio for profitability.",
    priority: "high",
    tags: ["risk-management", "position-sizing", "fundamentals"]
  },
  {
    title: "Support and Resistance Levels",
    content: "Support = price floor where buyers step in. Resistance = price ceiling where sellers dominate. Draw them on higher timeframes (daily, weekly) for reliability. The more times a level holds, the stronger it is. When broken, roles reverse: old resistance becomes new support. Combine with volume — high volume breakouts are more reliable. Don't force levels — only mark obvious ones.",
    priority: "high",
    tags: ["technical-analysis", "price-action", "levels"]
  },
  {
    title: "Moving Averages: SMA vs EMA",
    content: "SMA (Simple Moving Average) = equal weight to all periods, smoother. EMA (Exponential Moving Average) = more weight to recent prices, reacts faster. Common periods: 20, 50, 200. Price above 200 MA = uptrend. Golden Cross: 50 MA crosses above 200 MA (bullish). Death Cross: 50 MA crosses below 200 MA (bearish). Use MAs for trend confirmation, not entry signals alone.",
    priority: "medium",
    tags: ["technical-analysis", "indicators", "trends"]
  },
  {
    title: "Candlestick Patterns: The Big 5",
    content: "Doji: indecision, small body, long wicks. Hammer: bullish reversal after downtrend. Shooting Star: bearish reversal after uptrend. Engulfing: current candle completely covers previous — strong reversal signal. Morning/Evening Star: 3-candle reversal pattern. Context is everything — the same pattern means nothing without trend context. Wait for confirmation on the next candle.",
    priority: "medium",
    tags: ["candlesticks", "patterns", "price-action"]
  },
  {
    title: "Trading Psychology: The Real Edge",
    content: "Markets expose your psychology. Fear makes you exit early. Greed makes you hold too long. Revenge trading after losses destroys accounts. Keep a trading journal — log every trade with emotion. Follow your plan even when it feels wrong. Take breaks after 3 losing trades in a row. Success is 80% psychology, 20% strategy. Meditate, exercise, sleep — trading is a mental game.",
    priority: "high",
    tags: ["psychology", "discipline", "mindset"]
  },
  {
    title: "RSI: Relative Strength Index",
    content: "RSI measures momentum on a 0-100 scale. Above 70 = overbought. Below 30 = oversold. Divergence is the real signal: price makes higher high but RSI makes lower high = bearish divergence. Standard period is 14. Don't use RSI alone — it can stay overbought/oversold for long periods in strong trends. Best used with support/resistance and trend context.",
    priority: "medium",
    tags: ["indicators", "momentum", "rsi"]
  },
  {
    title: "Volume: The Fuel of Price",
    content: "Price tells you what, volume tells you how strong. Rising price + rising volume = healthy trend. Rising price + falling volume = weakening trend. Breakouts on high volume are more reliable. Volume climax often marks trend exhaustion. Volume precedes price — watch it for early warnings. Compare current volume to average (e.g., 20-day average).",
    priority: "high",
    tags: ["volume", "confirmation", "trends"]
  },
  {
    title: "Stop Loss Placement Strategies",
    content: "Never trade without a stop loss. Place stops at technical levels, not arbitrary percentages. Just below support (for longs) or above resistance (for shorts). Add a buffer for volatility (e.g., 1 ATR below support). Avoid placing stops at obvious round numbers where everyone else puts them. Use trailing stops to lock in profits. If stop is too far, reduce position size instead.",
    priority: "high",
    tags: ["risk-management", "stop-loss", "execution"]
  },
  {
    title: "The 3 Types of Market Trends",
    content: "Uptrend: higher highs and higher lows. Downtrend: lower highs and lower lows. Range/Sideways: price oscillates between support and resistance. Trade with the trend — 'the trend is your friend.' Counter-trend trading is harder and lower probability. Identify trend using higher timeframe, then look for entries on lower timeframes. Ranges often precede big moves — wait for breakout with volume.",
    priority: "high",
    tags: ["trends", "market-structure", "fundamentals"]
  },
  {
    title: "Backtesting: Validate Before You Trade",
    content: "Backtesting = testing your strategy on historical data. Rules: use enough data (at least 100 trades), include realistic fees/slippage, avoid curve-fitting. Track: win rate, average win, average loss, profit factor, max drawdown. A 50% win rate with 2:1 reward-to-risk is profitable. Forward test on a demo account before going live. Most strategies that look good in backtest fail live — stay humble.",
    priority: "high",
    tags: ["backtesting", "strategy", "validation"]
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    await Note.deleteMany({});
    console.log('🗑️  Cleared existing notes');

    const allNotes = [...techNotes, ...tradingNotes];
    const inserted = await Note.insertMany(allNotes);

    console.log(`✅ Inserted ${inserted.length} notes`);
    console.log(`   📝 Tech notes: ${techNotes.length}`);
    console.log(`   📈 Trading notes: ${tradingNotes.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();