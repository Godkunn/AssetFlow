const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 10000;

// Start NestJS Backend on 4000
console.log('Starting NestJS Backend on port 4000...');
const backend = spawn('node', ['apps/api/dist/main.js'], {
  env: { ...process.env, PORT: '4000' },
  stdio: 'inherit',
  shell: true
});

// Start Next.js Frontend on 3000
console.log('Starting Next.js Frontend on port 3000...');
const frontend = spawn('npx', ['next', 'start', 'apps/web', '-p', '3000'], {
  env: { ...process.env, PORT: '3000' },
  stdio: 'inherit',
  shell: true
});

// Native Reverse Proxy
const server = http.createServer((req, res) => {
  // Forward /api (except /api/auth) to NestJS (4000). All others go to Next.js (3000)
  const isApi = req.url.startsWith('/api') && !req.url.startsWith('/api/auth');
  const targetPort = isApi ? 4000 : 3000;

  const connector = http.request({
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  connector.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(connector, { end: true });
});

server.listen(PORT, () => {
  console.log(`AssetFlow Gateway running on port ${PORT}`);
});
