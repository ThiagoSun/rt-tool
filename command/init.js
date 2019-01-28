'use strict';
const exec = require('child_process').exec;
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');


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

const copyFile = async (srcPath, tarPath) => {
  console.log(chalk.white(`复制文件，目标路径：${tarPath}`));
  await fs.writeFileSync(tarPath, fs.readFileSync(srcPath));
};

const copyDir = async (srcPath, tarPath) => {
  console.log(chalk.white(`复制文件夹，目标路径：${tarPath}`));
  try {
    await isExist(tarPath);
  } catch (err) {
    console.log(chalk.white(`创建文件夹：${tarPath}`));
    await fs.mkdirSync(tarPath);
  }
  const files = await fs.readdirSync(srcPath);
  for (let i = 0; i < files.length; i++) {
    const path = files[i];
    const src = `${srcPath}/${path}`;
    const dist = `${tarPath}/${path}`;
    if (fs.statSync(src).isFile()) {
      await copyFile(src, dist);
    } else if (fs.statSync(src).isDirectory()) {
      await copyDir(src, dist);
    }
  }
};

module.exports = () => {
  const main = async () => {
    // Wait for user's response.
    const projectName = await readlineSync.question('项目名称：');
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
    } catch (e) {
      console.log(chalk.red(e));
    }
    console.log(chalk.green('生成成功！'));
  };
  main();
};


