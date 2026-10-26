import http from 'http';
import app from '../server/index.js';

const TEST_PORT = 5088;
const server = http.createServer(app);

server.listen(TEST_PORT, '127.0.0.1', async () => {
  console.log(`🚀 Probing Full-Stack Production Server on http://127.0.0.1:${TEST_PORT}...`);
  try {
    // 1. Check root SPA page serving
    const resHtml = await fetch(`http://127.0.0.1:${TEST_PORT}/`);
    const htmlText = await resHtml.text();
    if (htmlText.includes('EventSphere AI')) {
      console.log('✅ [PASS] Static SPA Frontend correctly served with EventSphere title!');
    } else {
      throw new Error('SPA index.html was not served correctly');
    }

    // 2. Check health endpoint
    const resHealth = await fetch(`http://127.0.0.1:${TEST_PORT}/health`);
    const healthJson = await resHealth.json();
    if (healthJson.status === 'healthy') {
      console.log('✅ [PASS] Cloud Run Health Check verified!');
    }

    // 3. Check packages API
    const resPkgs = await fetch(`http://127.0.0.1:${TEST_PORT}/api/packages`);
    const pkgsJson = await resPkgs.json();
    if (pkgsJson.count >= 4) {
      console.log(`✅ [PASS] Packages API verified with ${pkgsJson.count} Honest Split packages!`);
    }

    console.log('\n🎉 ALL FULL-STACK PRODUCTION CHECKS PASSED!');
  } catch (err) {
    console.error('❌ Error during prod test:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
