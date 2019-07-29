'use strict';
// const exec = require('child_process').exec;
// const co = require('co');
// const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const os = require('os');
const downloadGit = require('download-git-repo');

const isExist = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err !== null) {
        reject(`${path} 不存在`);
      } else {
        resolve(true);
      }
    });
  });
};

const pathType = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err === null) {
        if (stats.isDirectory()) {
          resolve("dir");
        } else if (stats.isFile()) {
          resolve("file");
        }
      } else {
        reject(`文件或路径不存在：${path}`);
      }
    });
  });
};

const readFile = (srcPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(srcPath, (err, data) => {
      if (err) {
        reject(`文件读取失败：${srcPath}`);
      } else {
        resolve(data);
      }
    });
  })
};

const writeFile = (tarPath, file) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(tarPath, file, (err, data) => {
      if (err) {
        reject(`文件写入失败：${tarPath}`);
      } else {
        resolve(data);
      }
    });
  })
};

const mkdir = (tarPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(tarPath, (err, data) => {
      if (err) {
        reject(`创建文件夹失败：${tarPath}`);
      } else {
        resolve(data);
      }
    });
  })
};

const readdir = (tarPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(tarPath, (err, data) => {
      if (err) {
        reject(`读取文件夹失败：${tarPath}`);
      } else {
        resolve(data);
      }
    });
  })
};

const downloadGitRepo = (repo, projectName) => {
  return new Promise((resolve, reject) => {
    //projectName 为下载到的本地目录
    downloadGit(repo, projectName, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const copyFile = async (srcPath, tarPath) => {
  console.log(chalk.white(`复制文件，目标路径：${tarPath}`));
  const fileRst = await readFile(srcPath);
  await writeFile(tarPath, fileRst);
};

const copyDir = async (srcPath, tarPath) => {
  console.log(chalk.white(`复制文件夹，目标路径：${tarPath}`));
  try {
    await isExist(tarPath);
  } catch (err) {
    console.log(chalk.white(`创建文件夹：${tarPath}`));
    await mkdir(tarPath);
  }
  const files = await readdir(srcPath);
  for (let i = 0; i < files.length; i++) {
    const path = files[i];
    const src = `${srcPath}/${path}`;
    const dist = `${tarPath}/${path}`;
    const srcType = await pathType(src);
    if (srcType === 'dir') {
      await copyDir(src, dist);
    } else if (srcType === 'file') {
      await copyFile(src, dist);
    }
  }
};

const fileModeFunc = async () => {
  // Wait for user's response.
  const projectName = await readlineSync.question('项目名称：');
  const projectVersion = await readlineSync.question('版本号(0.0.1)：');
  if (!projectName.trim()) {
    console.log(chalk.red('必须输入项目名称'));
  }

  console.log(chalk.white('开始生成...'));
  try {
    const srcPath = path.resolve(__dirname, '../template/');
    const tarPath = path.resolve(projectName);
    if (!srcPath) {
      console.log(chalk.red(`无法读取源路径：${srcPath}`));
      return;
    }
    await isExist(srcPath);
    if (!tarPath) {
      console.log(chalk.red(`无法读取目标路径：${tarPath}`));
      return;
    }
    const type = await pathType(srcPath);
    if (type === "file") {
      await copyFile(srcPath, tarPath);
    } else {
      await copyDir(srcPath, tarPath);
    }
    const packageJson = await readFile(path.join(tarPath, 'package.json'), 'utf8');
    const newPackage = Object.assign({}, JSON.parse(packageJson), {
      name: projectName,
      version: projectVersion || '0.0.1',
      private: true
    });
    await writeFile(
      path.join(tarPath, 'package.json'),
      JSON.stringify(newPackage, null, 2) + os.EOL
    );
    console.log(chalk.green('生成成功！'));
  } catch (e) {
    console.log(chalk.red(e));
  }
};

const gitModeFunc = async () => {
  // Wait for user's response.
  const projectName = await readlineSync.question('项目名称：');
  const projectVersion = await readlineSync.question('版本号(0.0.1)：');
  if (!projectName.trim()) {
    console.log(chalk.red('必须输入项目名称'));
  }

  console.log(chalk.white('开始生成...'));
  try {
    const tarPath = path.resolve(projectName);
    if (!tarPath) {
      console.log(chalk.red(`无法读取目标路径：${tarPath}`));
      return;
    }
    const repo = 'ThiagoSun/react-tmall-sp';
    await downloadGitRepo(repo, projectName);

    const packageJson = await readFile(path.join(tarPath, 'package.json'), 'utf8');
    const newPackage = Object.assign({}, JSON.parse(packageJson), {
      name: projectName,
      version: projectVersion || '0.0.1',
      private: true
    });
    await writeFile(
      path.join(tarPath, 'package.json'),
      JSON.stringify(newPackage, null, 2) + os.EOL
    );
    console.log(chalk.green('生成成功！'));
  } catch (e) {
    console.log(chalk.red(e));
  }
};

module.exports = () => {
  gitModeFunc();
};


