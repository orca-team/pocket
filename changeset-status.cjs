const { execSync } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

execSync(`npx changeset status --output changeset-status.json`);
const status = JSON.parse(fs.readFileSync('changeset-status.json'));
const message = [...new Set(status.changesets.map(({ summary }) => summary))].join('; ');
core.setOutput('status', message);
