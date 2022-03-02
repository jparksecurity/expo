import path from 'path';
import fs from 'fs-extra';
import { Command } from '@expo/commander';
import spawnAsync from '@expo/spawn-async';
import { runExpoCliAsync } from '../ExpoCLI';

async function action(appName: string, packageNames: string[], options: any) {
  // todo:
  // if packageNames.length === 0

  const { clean, outDir = 'bare-apps' } = options;

  const projectsDir = path.resolve(process.cwd(), outDir);
  const projectDir = path.resolve(process.cwd(), projectsDir, appName);

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir);
  }

  if (clean) {
    if (fs.existsSync(projectDir)) {
      fs.rmdirSync(projectDir, { recursive: true });
    }
  }

  // autolinking picks these up and modifies AppDelegate - need to include them for now
  const defaultPackages = [
    'expo-updates',
    'expo-dev-client',
    'expo-dev-launcher',
    'expo-dev-menu',
    'expo-dev-menu-interface',
  ];

  await runExpoCliAsync('init', [appName, '--no-install', '--template', 'blank'], {
    cwd: projectsDir,
  });

  const pkg = require(path.resolve(projectDir, 'package.json'));

  pkg['scripts']['postinstall'] = 'expo-yarn-workspaces postinstall';
  pkg['main'] = '__generated__/AppEntry.js';

  pkg['expo-yarn-workspaces'] = {};
  pkg['expo-yarn-workspaces']['symlinks'] = [];

  packageNames.forEach((packageName) => {
    pkg.dependencies[packageName] = '*';
    pkg['expo-yarn-workspaces']['symlinks'].push(packageName);
  });

  defaultPackages.forEach((packageName) => {
    pkg.dependencies[packageName] = '*';
    pkg['expo-yarn-workspaces']['symlinks'].push(packageName);
  });

  fs.writeJsonSync(path.resolve(projectDir, 'package.json'), pkg);

  console.log('Yarning');
  await spawnAsync('yarn', [], { cwd: projectDir });

  await runExpoCliAsync('prebuild', [], { cwd: projectDir });

  const ncl = path.resolve(__dirname, '../../../apps/native-component-list');

  fs.copyFileSync(
    path.resolve(ncl, 'metro.config.js'),
    path.resolve(projectDir, 'metro.config.js')
  );

  fs.copyFileSync(
    path.resolve(ncl, 'metro.transformer.js'),
    path.resolve(projectDir, 'metro.transformer.js')
  );
}

export default (program: Command) => {
  program
    .command('generate-bare-app [appName] [packageNames...]')
    .option('-c, --clean', 'Rebuild [appName] from scratch')
    .option('-o, --outDir <string>', 'Specifies the director to build the project in')
    .description(`Generates an app for the specified packages`)
    .asyncAction(action);
};
