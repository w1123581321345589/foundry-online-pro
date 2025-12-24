import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) throw new Error('X_REPLIT_TOKEN not found');

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) throw new Error('GitHub not connected');
  return accessToken;
}

async function getGitHubClient() {
  return new Octokit({ auth: await getAccessToken() });
}

const IGNORE_PATTERNS = [
  'node_modules', '.git', 'dist', '.next', '.turbo', '.cache',
  '.prisma', '*.log', '.env', '.env.*', 'package-lock.json', 
  'pnpm-lock.yaml', '.replit', 'replit.nix', '.upm', '.config',
  'attached_assets', 'snippets', '.breakpoints', '.local'
];

function shouldIgnore(filePath: string): boolean {
  const parts = filePath.split('/');
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.startsWith('*.')) {
      if (filePath.endsWith(pattern.slice(1))) return true;
    } else {
      if (parts.includes(pattern)) return true;
    }
  }
  return false;
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      if (shouldIgnore(relativePath)) continue;
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else if (entry.isFile()) {
        const stats = fs.statSync(fullPath);
        if (stats.size < 500 * 1024) files.push(relativePath);
      }
    }
  } catch (e) {}
  return files;
}

async function main() {
  console.log('Connecting to GitHub...');
  const octokit = await getGitHubClient();
  
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  const owner = user.login;
  const repo = 'foundry-online-pro';
  const baseDir = '/home/runner/workspace';
  
  console.log('Initializing repository with README...');
  const readmeContent = fs.readFileSync(path.join(baseDir, 'README.md'), 'utf-8');
  
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: 'Initial commit - Foundry Online Pro',
      content: Buffer.from(readmeContent).toString('base64'),
      branch: 'main'
    });
    console.log('README.md created, repository initialized!');
  } catch (e: any) {
    if (e.status === 422 && e.message.includes('sha')) {
      console.log('README already exists, continuing...');
    } else {
      throw e;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Collecting files...');
  const files = getAllFiles(baseDir).filter(f => f !== 'README.md');
  console.log(`Found ${files.length} files to upload`);
  
  const blobs: Array<{ path: string; sha: string }> = [];
  
  console.log('Creating blobs...');
  let count = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(baseDir, file));
      const base64Content = content.toString('base64');
      
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: base64Content,
        encoding: 'base64'
      });
      
      blobs.push({ path: file, sha: blob.sha });
      count++;
      if (count % 20 === 0) console.log(`  Created ${count}/${files.length} blobs...`);
    } catch (e: any) {
      console.log(`  Skipping ${file}: ${e.message?.slice(0, 40)}`);
    }
  }
  
  console.log(`\nCreated ${blobs.length} blobs successfully`);
  
  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
  const { data: latestCommit } = await octokit.git.getCommit({ owner, repo, commit_sha: ref.object.sha });
  
  const readmeBlob = await octokit.git.createBlob({
    owner,
    repo,
    content: Buffer.from(readmeContent).toString('base64'),
    encoding: 'base64'
  });
  blobs.push({ path: 'README.md', sha: readmeBlob.data.sha });
  
  console.log('Creating tree...');
  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: latestCommit.tree.sha,
    tree: blobs.map(b => ({
      path: b.path,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: b.sha
    }))
  });
  
  console.log('Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message: 'Add complete Foundry Online Pro codebase\n\n- NestJS API with Stripe Connect\n- Next.js frontend with Clerk auth\n- Virtual classrooms via Daily.co\n- PostgreSQL with Prisma ORM\n- Multi-role system',
    tree: tree.sha,
    parents: [ref.object.sha]
  });
  
  console.log('Updating main branch...');
  await octokit.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: commit.sha
  });
  
  console.log('\n✅ Successfully uploaded to GitHub!');
  console.log(`📦 Repository: https://github.com/${owner}/${repo}`);
}

main().catch(console.error);
