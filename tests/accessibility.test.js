import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("🧪 Running Accessibility (WCAG 2.1 AA) Compliance Audit Tests...");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

const indexHtmlPath = path.resolve('index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Test 1: HTML Document Language Tag
runTest("index.html specifies valid document language <html lang='en'>", () => {
  assert.ok(indexHtml.includes('lang="en"'), "HTML must declare lang='en' for screen readers");
});

// Test 2: Viewport and Mobile Scaling
runTest("index.html includes accessible viewport meta tag without disabled zooming", () => {
  assert.ok(indexHtml.includes('name="viewport"'), "Viewport meta must exist");
  assert.ok(!indexHtml.includes('user-scalable=no'), "Must not disable user zoom for visually impaired users");
});

// Test 3: Title and Meta Description
runTest("index.html contains descriptive title and search meta tags", () => {
  assert.ok(indexHtml.includes('<title>'), "Document must have a title");
  assert.ok(indexHtml.includes('name="description"'), "Document must have descriptive meta");
});

// Test 4: Semantic Landmarks & Skip Link in React Root App
runTest("App.jsx implements WCAG Skip to Main Content anchor", () => {
  const appJsx = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
  assert.ok(appJsx.includes('href="#main-content"'), "App must include #main-content skip link");
  assert.ok(appJsx.includes('id="main-content"'), "Main landmark must have matching id");
  assert.ok(appJsx.includes('role="tabpanel"'), "Tab content must declare role='tabpanel'");
});

// Test 5: Accessible Navigation semantics
runTest("Navbar.jsx implements WAI-ARIA tablist and tab semantics", () => {
  const navJsx = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf8');
  assert.ok(navJsx.includes('role="tablist"'), "Navbar must declare role='tablist'");
  assert.ok(navJsx.includes('role="tab"'), "Nav items must declare role='tab'");
  assert.ok(navJsx.includes('aria-selected='), "Nav items must toggle aria-selected");
  assert.ok(navJsx.includes('aria-controls='), "Nav items must indicate aria-controls");
});

console.log(`\n📊 Accessibility Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
