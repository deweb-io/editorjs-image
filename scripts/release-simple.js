const fs = require('fs');
const { execSync } = require('child_process');

// Simple release script for EditorJS Image Tool
// Usage: node scripts/release.js [patch|minor|major]

const versionType = process.argv[2] || 'patch';

function execCommand(command) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  return packageJson.version;
}

function updatePackageVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function updateChangelog(version) {
  const changelogPath = 'CHANGELOG.md';
  const date = new Date().toISOString()
    .split('T')[0];

  let content = '';

  if (fs.existsSync(changelogPath)) {
    content = fs.readFileSync(changelogPath, 'utf8');
  } else {
    content = '# Changelog\n\n';
  }

  const newEntry = `## [${version}] - ${date}

### Added
- 

### Changed
- 

### Fixed
- 

`;

  const lines = content.split('\n');
  const headerIndex = lines.findIndex(line => line.startsWith('# Changelog'));

  if (headerIndex !== -1) {
    lines.splice(headerIndex + 2, 0, newEntry);
    content = lines.join('\n');
  } else {
    content = `# Changelog\n\n${newEntry}${content}`;
  }

  fs.writeFileSync(changelogPath, content);
}

console.log('🚀 Starting release process...\n');

// Check git status
console.log('📋 Checking git status...');
const status = execCommand('git status --porcelain');
const modifiedFiles = status.split('\n').filter(line => line && !line.startsWith('??'));

if (modifiedFiles.length > 0) {
  console.error('❌ You have uncommitted changes. Please commit them first.');
  process.exit(1);
}

// Get current version and calculate new version
const currentVersion = getCurrentVersion();
const newVersion = bumpVersion(currentVersion, versionType);

console.log(`📦 Version: ${currentVersion} → ${newVersion}`);

// Update package.json
console.log('📝 Updating package.json...');
updatePackageVersion(newVersion);

// Update changelog with template
console.log('📄 Updating CHANGELOG.md...');
updateChangelog(newVersion);

// Build project
console.log('🔨 Building project...');
execCommand('npm run build');

// Commit changes
console.log('💾 Committing changes...');
execCommand('git add .');
execCommand(`git commit -m "release: v${newVersion}"`);

// Create and push tag
console.log('🏷️  Creating and pushing tag...');
execCommand(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
execCommand('git push origin master');
execCommand(`git push origin v${newVersion}`);

// Get repository URL for GitHub release
try {
  const remoteUrl = execCommand('git remote get-url origin');
  let repoUrl = remoteUrl;

  if (repoUrl.startsWith('git@github.com:')) {
    repoUrl = repoUrl.replace('git@github.com:', 'https://github.com/').replace('.git', '');
  } else if (repoUrl.endsWith('.git')) {
    repoUrl = repoUrl.slice(0, -4);
  }

  const releaseUrl = `${repoUrl}/releases/new`;

  console.log(`\n🌐 GitHub Release URL: ${releaseUrl}`);

  // Try to open in browser (macOS)
  try {
    execSync(`open "${releaseUrl}"`);
    console.log('✅ Opened GitHub release page in browser');
  } catch {
    console.log('📋 Please open the URL above to create the release');
  }
} catch {
  console.log('⚠️  Could not get repository URL. Please create release manually on GitHub.');
}

console.log(`\n🎉 Release v${newVersion} completed!`);
console.log('\n📝 Next steps:');
console.log('1. Edit CHANGELOG.md to add details about this release');
console.log('2. Complete the GitHub release creation');
console.log('3. Optionally publish to npm if this is a public package');
