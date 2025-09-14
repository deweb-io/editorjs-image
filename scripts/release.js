#!/usr/bin/env node

/**
 * Release Script for EditorJS Image Tool
 * 
 * This script automates the release process:
 * 1. Validates git status
 * 2. Bumps version in package.json
 * 3. Updates CHANGELOG.md
 * 4. Builds the project
 * 5. Commits changes
 * 6. Creates and pushes git tag
 * 7. Opens GitHub release page
 * 
 * Usage:
 *   node scripts/release.js [version-type]
 * 
 * Version types: patch, minor, major
 * Default: patch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function execCommand(command, errorMessage) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (err) {
    error(`${errorMessage}: ${err.message}`);
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

function bumpVersion(currentVersion, type = 'patch') {
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

function getChangelogEntry() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n' + colors.cyan + '📝 Enter changelog details:' + colors.reset);
    console.log('Describe what changed in this release (press Enter twice to finish):');
    
    let changelog = '';
    let emptyLineCount = 0;
    
    rl.on('line', (line) => {
      if (line.trim() === '') {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.close();
          resolve(changelog.trim());
          return;
        }
      } else {
        emptyLineCount = 0;
        changelog += (changelog ? '\n' : '') + line;
      }
    });
  });
}

function updateChangelog(version, changelog) {
  const changelogPath = 'CHANGELOG.md';
  const date = new Date().toISOString().split('T')[0];
  
  let content = '';
  if (fs.existsSync(changelogPath)) {
    content = fs.readFileSync(changelogPath, 'utf8');
  } else {
    content = '# Changelog\n\n';
  }

  const newEntry = `## [${version}] - ${date}

${changelog}

`;

  // Insert new entry after the "# Changelog" header
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

function checkGitStatus() {
  info('Checking git status...');
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
  } catch {
    error('Not in a git repository');
  }

  // Check for uncommitted changes (excluding untracked files we'll handle)
  const status = execCommand('git status --porcelain', 'Failed to check git status');
  const modifiedFiles = status.split('\n').filter(line => 
    line && !line.startsWith('??') // Ignore untracked files
  );

  if (modifiedFiles.length > 0) {
    warning('You have uncommitted changes:');
    modifiedFiles.forEach(file => console.log(`  ${file}`));
    error('Please commit or stash your changes before releasing');
  }

  success('Git status is clean');
}

function buildProject() {
  info('Building project...');
  execCommand('npm run build', 'Build failed');
  success('Project built successfully');
}

function commitAndTag(version, changelog) {
  info('Committing changes...');
  
  execCommand('git add .', 'Failed to stage changes');
  
  const commitMessage = `release: v${version}

${changelog}`;
  
  execCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, 'Failed to commit changes');
  success('Changes committed');

  info('Creating git tag...');
  const tagMessage = `Release v${version}

${changelog}`;
  
  execCommand(`git tag -a v${version} -m "${tagMessage.replace(/"/g, '\\"')}"`, 'Failed to create tag');
  success(`Tag v${version} created`);
}

function pushChanges(version) {
  info('Pushing changes to origin...');
  execCommand('git push origin master', 'Failed to push to master');
  execCommand(`git push origin v${version}`, 'Failed to push tag');
  success('Changes and tag pushed to GitHub');
}

function openGitHubRelease() {
  try {
    const remoteUrl = execCommand('git remote get-url origin', 'Failed to get remote URL');
    
    // Convert SSH URL to HTTPS if needed
    let repoUrl = remoteUrl;
    if (repoUrl.startsWith('git@github.com:')) {
      repoUrl = repoUrl.replace('git@github.com:', 'https://github.com/').replace('.git', '');
    } else if (repoUrl.endsWith('.git')) {
      repoUrl = repoUrl.slice(0, -4);
    }
    
    const releaseUrl = `${repoUrl}/releases/new`;
    
    info(`Opening GitHub release page: ${releaseUrl}`);
    
    // Try to open in browser (macOS)
    try {
      execSync(`open "${releaseUrl}"`, { stdio: 'pipe' });
      success('GitHub release page opened in browser');
    } catch {
      log(`\n${colors.cyan}🌐 Please open this URL to create the release:${colors.reset}`);
      log(releaseUrl);
    }
  } catch (err) {
    warning('Could not determine repository URL. Please create the release manually on GitHub.');
  }
}

async function main() {
  const versionType = process.argv[2] || 'patch';
  
  if (!['patch', 'minor', 'major'].includes(versionType)) {
    error('Invalid version type. Use: patch, minor, or major');
  }

  log(`\n${colors.bold}🚀 Starting release process (${versionType})${colors.reset}\n`);

  // Step 1: Check git status
  checkGitStatus();

  // Step 2: Determine new version
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, versionType);
  
  info(`Version: ${currentVersion} → ${newVersion}`);

  // Step 3: Get changelog from user
  const changelog = await getChangelogEntry();
  
  if (!changelog.trim()) {
    error('Changelog entry is required');
  }

  // Step 4: Update files
  info('Updating package.json...');
  updatePackageVersion(newVersion);
  success('package.json updated');

  info('Updating CHANGELOG.md...');
  updateChangelog(newVersion, changelog);
  success('CHANGELOG.md updated');

  // Step 5: Build project
  buildProject();

  // Step 6: Commit and tag
  commitAndTag(newVersion, changelog);

  // Step 7: Push changes
  pushChanges(newVersion);

  // Step 8: Open GitHub release page
  openGitHubRelease();

  log(`\n${colors.green}${colors.bold}🎉 Release v${newVersion} completed successfully!${colors.reset}\n`);
  
  log(`${colors.cyan}Next steps:${colors.reset}`);
  log('1. Review the generated changelog entry');
  log('2. Complete the GitHub release creation');
  log('3. Optionally publish to npm if this is a public package');
}

// Handle errors gracefully
process.on('unhandledRejection', (err) => {
  error(`Unexpected error: ${err.message}`);
});

// Run the script
main().catch(err => {
  error(`Script failed: ${err.message}`);
});
