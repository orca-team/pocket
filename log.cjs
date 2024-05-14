const fs = require('fs/promises');
const { prerelease } = require('semver');
const core = require('@actions/core');
const glob = require('glob');

/**
 * The following code snippet is based on a portion of the open-source project "changelog-reader-action"
 * Original code source: https://github.com/mindsers/changelog-reader-action
 * Copyright (c) 2024 mindsers
 */
const versionSeparator = '\n## ';
const semverLinkRegex =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/;
const unreleasedLinkRegex = /^\[unreleased\]/i;
const avoidNonVersionData = version =>
  semverLinkRegex.test(version) || unreleasedLinkRegex.test(version);

const getEntries = rawData => {
  const content = String(rawData);

  core.debug(`CHANGELOG content: ${content}`);

  return content.split(versionSeparator).filter(avoidNonVersionData);
};


const parseEntry = entry => {
  const [title, ...other] = entry.trim().split('\n');

  const [versionPart, datePart] = title.split(' - ');
  const [versionNumber] = versionPart.match(/[a-zA-Z0-9.\-+]+/);
  const [versionDate] = (datePart != null && datePart.match(/[0-9-]+/)) || [];

  return {
    id: versionNumber,
    date: versionDate,
    status: computeStatus(versionNumber, title),
    text: other.filter(item => !/\[.*\]: http/.test(item)).join('\n'),
  };
};

function computeStatus(version, title) {
  if (prerelease(version)) {
    return 'prereleased';
  }

  if (title.match(/\[yanked\]/i)) {
    return 'yanked';
  }

  if (title.match(/\[unreleased\]/i)) {
    return 'unreleased';
  }

  return 'released';
}

async function getChangelogByVersion(pkgName, version) {

}

async function main() {

  const existsPackage = await glob.glob('./packages/*/package.json');
  const existsChangelog = new Set(await glob.glob('./packages/*/CHANGELOG.md'));

  // generate mapping: packageName -> changelog
  const pkgMapping = existsPackage.reduce((acc, pkgPath) => {
    const pkg = require(`./${pkgPath}`);
    const changelogPath = pkgPath.replace(/package\.json$/, 'CHANGELOG.md');
    if (existsChangelog.has(changelogPath)) {
      return {
        ...acc,
        [pkg.name]: changelogPath,
      };
    }
    return acc;
  }, {});


  // get changedPackages
  const changedPackages = JSON.parse(process.env.CHANGESET_PUBLISHED_PACKAGES || '[]');
  const published = JSON.parse(process.env.CHANGESET_PUBLISHED || 'false');
  const hasChangesets = JSON.parse(process.env.CHANGESET_HAS_CHANGESETS || 'false');
  const prNumber = JSON.parse(process.env.CHANGESET_PULL_REQUEST_NUMBER || '-1');
  core.debug('changedPackages', changedPackages);

  if (published) {
    // 已发布
    // 获取发布的日志信息
    const result = await Promise.all(
      changedPackages.map(async ({ name, version }) => {
        const changelogPath = pkgMapping[name];
        const rawData = await fs.readFile(changelogPath);
        const versions = getEntries(rawData).map(parseEntry);
        const logContent = versions.find(({ id }) => id === version);

        return {
          ...logContent,
          name,
          version,
        };
      }),
    );

    const resultTitle = result.length > 0 ? 'orca-fe 发布通知' : 'orca-fe 发布失败';
    const resultContent = result.length > 0 ? `# Pocket 组件库\\n\\n流水线结束，以下模块已发布：\n\n${
      result.map(({ name, version, text }) => `## ${name}@${version}\n${text}`).join('\n\n')
    }` : '# Pocket 组件库\\n\\n流水线结束，模块发布失败，请检查。';

    core.setOutput('title', resultTitle);
    core.setOutput('content', resultContent);
  }else if(hasChangesets){
    // 仅产生变化
    core.setOutput('title', 'orca-fe 发布通知');
    core.setOutput('content', `# Pocket 组件库 发布前检查

检测到您提交的改动，请访问以下链接查看修改的内容，确认合并后将发布新版本。

[https://github.com/orca-team/pocket/pull/${prNumber}](https://github.com/orca-team/pocket/pull/${prNumber})
    
    `);

  } else {
    core.setOutput('title', 'orca-fe 发布通知');
    core.setOutput('content', `# Pocket 组件库\n\n流水线结束，未检测到新模块。`);
  }
}

main();
