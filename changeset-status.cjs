const { execSync } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

console.log('Getting changeset status...');
execSync(`npx changeset status --output changeset-status.json`);

const status = JSON.parse(fs.readFileSync('changeset-status.json'));
const message = [...new Set(status.changesets.map(({ summary }) => summary))].join('; ');
core.setOutput('status', message);
core.setOutput('hasChangesets', String(status.changesets.length > 0));

const changedPackages = [...new Set(status.releases.map(({ name }) => `- ${name}@0.0.0-prepublish-${process.env.TIMESTAMP}`))].join('\n ');
core.setOutput('changedPackages', changedPackages);

console.log('Updating pre-publish version...');
execSync(`npm run cv:pub`);
