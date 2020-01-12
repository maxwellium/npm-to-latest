#!/usr/bin/env node

const { readFile } = require('fs').promises;
const { join } = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);


async function main (cwd) {

  let outdatedJson = '{}';

  try {
    const { stdout } = await exec('npm outdated --json', { cwd });
    outdatedJson = stdout;
  } catch (e) {
    outdatedJson = e.stdout;
  }

  const packageJson = await readFile(join(cwd, 'package.json'), 'utf8')
  const outdated = JSON.parse(outdatedJson);
  const package = JSON.parse(packageJson);

  const dependencyKeys = Object.keys(package.dependencies || {});
  const devDependencyKeys = Object.keys(package.devDependencies || {});

  const update = { dependencies: [], devDependencies: [] };

  for (const key in outdated) {
    if (!outdated[ key ]) { continue; }

    if ([ 'linked', 'git' ].includes(outdated[ key ].latest)) { continue; }

    if (dependencyKeys.includes(key)) {
      update.dependencies.push(key)
    }

    if (devDependencyKeys.includes(key)) {
      update.devDependencies.push(key)
    }
  }

  if (update.dependencies.length) {
    console.log('# dependencies');
    console.log(`npm i -S ${ update.dependencies.map(d => `${ d }@latest`).join(' ') }`);
  }

  if (update.devDependencies.length) {
    console.log('# devDependencies');
    console.log(`npm i -D ${ update.devDependencies.map(d => `${ d }@latest`).join(' ') }`);
  }

}


main(process.cwd());