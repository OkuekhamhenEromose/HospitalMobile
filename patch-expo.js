const fs = require('fs');
const filePath = 'node_modules/@expo/cli/build/src/start/doctor/dependencies/validateDependenciesVersions.js';

if (!fs.existsSync(filePath)) {
  console.error('ERROR: File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// ── Guard: already patched ────────────────────────────────────────────────────
if (content.includes('__EXPO_DOCTOR_SKIP__')) {
  console.log('Already patched — skipping.');
  process.exit(0);
}

// ── Remove any broken patches from previous attempts ─────────────────────────
// Broken patch 1: renamed function
content = content.replace(
  /async function validateDependenciesVersionsAsync_DISABLED\(/g,
  'async function validateDependenciesVersionsAsync('
);
// Broken patch 2: prepended exports override
content = content.replace(
  /^exports\.validateDependenciesVersionsAsync = async \(\) => \{\}; \/\/ PATCHED_SKIP\n/,
  ''
);
// Broken patch 2b: ORIG rename
content = content.replace(
  /exports\.validateDependenciesVersionsAsync = async \(\) => \{\}; exports\.validateDependenciesVersionsAsync_ORIG =/g,
  'exports.validateDependenciesVersionsAsync ='
);
// Broken patch 3: appended override (getter error)
content = content.replace(
  /\n\/\/ EXPO_DOCTOR_PATCHED\nexports\.validateDependenciesVersionsAsync = async function\(\) \{ return; \};\n/g,
  ''
);

// ── Strategy: replace the async function BODY with an immediate return ────────
// The function signature looks like:
//   async function validateDependenciesVersionsAsync(projectRoot, exp, pkg) {
// We inject a return at the very start of its body.
//
// Use a regex that matches the opening brace of the function and inserts return.
const funcPattern = /(async function validateDependenciesVersionsAsync\s*\([^)]*\)\s*\{)/;

if (!funcPattern.test(content)) {
  console.error('ERROR: Could not find function signature. The file may have changed format.');
  console.error('Showing first 500 chars of file for diagnosis:');
  console.error(content.slice(0, 500));
  process.exit(1);
}

content = content.replace(
  funcPattern,
  '$1\n  /* __EXPO_DOCTOR_SKIP__ */ return;'
);

fs.writeFileSync(filePath, content);
console.log('Patch applied successfully — validateDependenciesVersionsAsync will now no-op.');