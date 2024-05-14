const { execSync } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

console.log('Getting changeset status...');
execSync(`npx changeset status --output changeset-status.json`);

const status = JSON.parse(fs.readFileSync('changeset-status.json'));
const message = [...new Set(status.changesets.map(({ summary }) => summary))].join('; ');
core.setOutput('status', message);
core.setOutput('hasChangesets', String(status.releases.length > 0));

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

process.env.TIMESTAMP = timestamp;

async function main() {
  const changedPackages = [...new Set(status.releases.map(({ name }) =>
    `- [${name}@0.0.0-prepublish-${timestamp}](https://www.npmjs.com/package/${name}/v/0.0.0-prepublish-${timestamp})`))].join('\n ');
  core.setOutput('changedPackages', changedPackages);

  console.log('Updating pre-publish version...');
  execSync(`npm run cv:pre`);
}

main();
