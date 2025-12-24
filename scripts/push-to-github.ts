import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
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

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  console.log('Connecting to GitHub...');
  const octokit = await getUncachableGitHubClient();
  
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  const repoName = 'foundry-online-pro';
  const repoDescription = 'AI-first online micro-school platform with Stripe Connect, virtual classrooms, and multi-role management';
  
  let repo;
  try {
    const { data: existingRepo } = await octokit.repos.get({
      owner: user.login,
      repo: repoName
    });
    repo = existingRepo;
    console.log(`Repository ${repoName} already exists, will push updates...`);
  } catch (e: any) {
    if (e.status === 404) {
      console.log(`Creating new repository: ${repoName}...`);
      const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription,
        private: false,
        auto_init: false
      });
      repo = newRepo;
      console.log(`Repository created: ${repo.html_url}`);
    } else {
      throw e;
    }
  }
  
  const accessToken = await getAccessToken();
  const remoteUrl = `https://${accessToken}@github.com/${user.login}/${repoName}.git`;
  
  try {
    execSync('git remote remove origin 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {}
  
  execSync(`git remote add origin ${remoteUrl}`, { stdio: 'pipe' });
  
  try {
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "Foundry Online Pro - Complete micro-school platform with fixes" --allow-empty', { stdio: 'inherit' });
  } catch (e) {
    console.log('No changes to commit or already committed');
  }
  
  console.log('Pushing to GitHub...');
  try {
    execSync('git push -u origin main --force', { stdio: 'inherit' });
  } catch (e) {
    try {
      execSync('git branch -M main', { stdio: 'pipe' });
      execSync('git push -u origin main --force', { stdio: 'inherit' });
    } catch (e2) {
      execSync('git push -u origin master --force', { stdio: 'inherit' });
    }
  }
  
  console.log('\n✅ Successfully pushed to GitHub!');
  console.log(`📦 Repository: https://github.com/${user.login}/${repoName}`);
}

main().catch(console.error);
