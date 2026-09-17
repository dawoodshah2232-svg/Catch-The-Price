import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const port = process.env.VIEWPORT_PORT || '3110';
const origin = `http://127.0.0.1:${port}`;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotDir = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
];

const testRoutes = [
  { path: '/ae', label: 'home' },
  { path: '/ae/search', label: 'search' },
  { path: '/ae/account', label: 'account-overview' },
  { path: '/ae/account/saved', label: 'account-saved' },
  { path: '/ae/account/alerts', label: 'account-alerts' },
  { path: '/ae/login', label: 'login' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 45000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${origin}/ae`, { redirect: 'manual' });
      if (res.status >= 200 && res.status < 500) return;
    } catch {}
    await sleep(600);
  }
  throw new Error(`Server at ${origin} did not become ready in ${timeoutMs}ms`);
}

async function main() {
  console.log(`Starting Next.js production server on port ${port}...`);
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-p', port, '-H', '127.0.0.1'],
    {
      stdio: 'ignore',
      env: { ...process.env, NODE_ENV: 'production' },
    }
  );

  try {
    await waitForServer();
    console.log('Server is ready. Running browser viewport tests with Chrome headless...\n');

    let passedTests = 0;
    let totalTests = 0;

    for (const vp of viewports) {
      console.log(`\nTesting Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);

      for (const route of testRoutes) {
        totalTests += 1;
        const outName = `${vp.name}-${route.label}.png`;
        const outPath = path.join(screenshotDir, outName);

        const url = `${origin}${route.path}`;
        const args = [
          '--headless=new',
          '--disable-gpu',
          '--no-sandbox',
          `--window-size=${vp.width},${vp.height}`,
          `--screenshot=${outPath}`,
          '--hide-scrollbars',
          url,
        ];

        try {
          await execFileAsync(chromePath, args, { timeout: 15000 });

          if (fs.existsSync(outPath)) {
            const stats = fs.statSync(outPath);
            if (stats.size > 5000) {
              console.log(`  PASS: ${route.path.padEnd(22)} -> ${outName} (${(stats.size / 1024).toFixed(1)} KB)`);
              passedTests += 1;
            } else {
              console.error(`  FAIL: ${route.path} -> screenshot too small (${stats.size} bytes)`);
            }
          } else {
            console.error(`  FAIL: ${route.path} -> screenshot file was not created`);
          }
        } catch (err) {
          console.error(`  ERROR testing ${route.path} at ${vp.name}:`, err.message);
        }
      }
    }

    console.log(`\nBrowser Viewport Results: ${passedTests}/${totalTests} tests passed cleanly.`);
    if (passedTests !== totalTests) {
      process.exit(1);
    }
  } finally {
    console.log('Stopping test server...');
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error('Fatal error in browser viewport testing:', err);
  process.exit(1);
});
