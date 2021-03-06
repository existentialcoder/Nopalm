const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');

const stat = util.promisify(fs.stat);

const constants = require('../constants');

// Bash command helpers
const executeCommand = async (cmd) => {
  console.log(`!!!! Executing command - ${cmd} !!!!`);

  const execPromisified = util.promisify(exec);
  try {
    const result = await execPromisified(cmd);
    console.log(`!!!! Successfully executed command - ${cmd} !!!!`);

    return result.toString('utf8');
  } catch (er) {
    console.error(`!!!! Exception in executing command - ${cmd} !!!!`);
    throw er;
  }
};

const checkPackageManager = async (manager) => {
  try {
    const result = await executeCommand(`which ${manager}`);
    const version = await executeCommand(`${manager} -v`);

    return Boolean(result && version);
  } catch (er) {
    return false;
  }
};

// File helpers
const getPackageJson = async (dir) => {
  const pJsonPath = `${dir}/${constants.files.PACKAGE_JSON}`;
  try {
    const stats = await stat(pJsonPath);
    if (stats.isFile()) {
      // eslint-disable-next-line
      return require(pJsonPath);
    }
    throw new Error(`Not a valid file - ${constants.files.PACKAGE_JSON}`);
  } catch (er) {
    return null;
  }
};

const packageOperation = async (pkg, packageManager, operation) => {
  let op;
  if (operation === 'install') {
    op = packageManager === 'npm' ? 'i' : 'add';
  } else {
    op = packageManager === 'npm' ? 'uninstall' : 'remove';
  }

  try {
    const command = `${packageManager} ${op} ${pkg.name}${pkg.version ? `@${pkg.version}` : ''} ${pkg.isDev ? '-D' : ''}`;
    const result = await executeCommand(command);

    return Boolean(result);
  } catch (er) {
    return false;
  }
};

const getPackageManagers = async (dir) => Promise.all(
  constants.packageManagers.map(async (pkgManager) => {
    try {
      const stats = await stat(`${dir}/${constants.files[pkgManager.file]}`);
      return { isValid: stats.isFile(), pkgManagerName: pkgManager.name };
    } catch (ex) {
      return { isValid: false, pkgManagerName: pkgManager.name };
    }
  }),
).then((result) => result
  .filter(({ isValid }) => isValid)
  .map(({ pkgManagerName }) => pkgManagerName));

const bashHelpers = {
  executeCommand,
  checkPackageManager,
  packageOperation,
};

const fileHelpers = {
  getPackageJson,
  getPackageManagers,
};

const Utils = {
  ...bashHelpers,
  ...fileHelpers,
};

module.exports = Utils;
