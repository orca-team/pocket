import { globby } from 'globby';
import { promises as fs } from 'fs';
import { coerce } from 'semver';
import chalk from 'chalk';
import inquirer from 'inquirer';

async function main(packageRoot: string = './packages') {
  // 识别 packages/*/package.json 文件
  const packageJsons = await globby(`${packageRoot}/*/package.json`);

  // 取出 package.json 中的 name 和 version，并记录他们的版本号
  const pkgPathMap = new Map<string, string>();
  const pkgJsonMap = new Map<string, any>();
  await Promise.all(
    packageJsons.map(async (packageJsonPath) => {
      const content = await fs.readFile(packageJsonPath);
      const json = JSON.parse(content.toString());
      if (json.name) {
        pkgPathMap.set(json.name, packageJsonPath);
        pkgJsonMap.set(json.name, json);
      }
    }),
  );

  const errorList: {
    name: string;
    version: string;
    depName: string;
    depVersion: string;
  }[] = [];

  // 检查依赖项，看是否最新
  for (const [name, json] of pkgJsonMap) {
    const { dependencies } = json;
    const deps = dependencies;
    for (const depName in deps) {
      let depVersion = deps[depName];
      const depPkg = pkgJsonMap.get(depName);
      if (depPkg) {
        const { version } = depPkg;
        // 通过 semver 提取纯净的 version
        depVersion = coerce(depVersion)?.version;
        if (version && version !== depVersion) {
          errorList.push({
            name,
            version,
            depName,
            depVersion,
          });
        }
      }
    }
  }

  if (errorList.length > 0) {
    console.warn('以下依赖项不是最新版本：');
    errorList.forEach(({ name, version, depName, depVersion }) => {
      console.warn(`${name} -> ${depName}@${chalk.red(depVersion)}(${chalk.green(version)})`);
    });

    // 询问是否修改依赖版本号
    const { answer } = await inquirer.prompt({
      type: 'confirm',
      name: 'answer',
      message: '是否自动修改依赖版本号？',
      default: true,
    });

    if (answer) {
      // 修改依赖版本号
      for (const { name, depName, version } of errorList) {
        const json = pkgJsonMap.get(name);
        const packageJsonPath = pkgPathMap.get(name);
        if (packageJsonPath && json) {
          const { dependencies } = json;
          dependencies[depName] = version;
          pkgJsonMap.set(name, json);
        }
      }
      [...new Set(errorList.map(({ name }) => name))].forEach((name) => {
        const json = pkgJsonMap.get(name);
        const packageJsonPath = pkgPathMap.get(name);
        if (packageJsonPath && json) {
          fs.writeFile(packageJsonPath, JSON.stringify(json, null, 2));
        }
      });
    }
  } else {
    console.warn('Done. Everything ok.');
  }
}

main();
