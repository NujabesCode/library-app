const http = require('http');
const fs = require('fs');
const path = require('path');
const books = require('./src/books');
const auth = require('./src/auth');

const PORT = process.env.PORT || 3000;

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(JSON.parse(body || '{}')));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/books') {
    return send(res, 200, books.searchBooks(url.searchParams.get('q') || ''));
  }

  if (req.method === 'POST' && url.pathname === '/api/signup') {
    const { username, password } = await readBody(req);
    return send(res, 201, auth.signup(username, password));
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const { username, password } = await readBody(req);
    const token = auth.login(username, password);
    if (!token) return send(res, 401, { error: '로그인 실패' });
    return send(res, 200, { token });
  }

  const match = url.pathname.match(/^\/api\/books\/(\d+)\/(borrow|return)$/);
  if (req.method === 'POST' && match) {
    const user = auth.verify(req.headers.authorization);
    if (!user) return send(res, 401, { error: '로그인이 필요합니다' });
    const id = Number(match[1]);
    try {
      if (match[2] === 'borrow') return send(res, 200, books.borrowBook(id, user));
      return send(res, 200, books.returnBook(id, user));
    } catch (err) {
      return send(res, 400, { error: err.message });
    }
  }

  const file = req.url === '/' ? 'index.html' : req.url;
  try {
    const content = fs.readFileSync(path.join(__dirname, 'public', file));
    res.writeHead(200);
    return res.end(content);
  } catch {
    return send(res, 404, { error: '없는 페이지입니다' });
  }
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
