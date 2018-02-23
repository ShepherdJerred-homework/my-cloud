import * as config from '../../config';
import * as express from 'express';
import * as fs from 'fs';

export async function fixUrl (req: express.Request, res: express.Response, next: express.NextFunction) {
  let stats: fs.Stats = await stat(config.cloudDirectory);

  if (stats.isDirectory() && req.path.substring(req.path.length - 1) !== '/') {
    res.redirect(307, req.baseUrl + req.url + '/');
  } else {
    next();
  }
}

export async function getFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let files: CloudFileInfo[] = await getFiles(req.path, req.baseUrl);
  console.log(req.path);
  res.render('index', {
    path: req.path,
    pathName: req.path === '/' ? 'Index' : req.path,
    files: files
  });
}

export function uploadFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Hey there');
}

class CloudFileInfo {
  name: string;
  directory: boolean;
  absolutePath: string;
  cloudPath: string;
  cloudUrl: string;

  constructor (name: string, directory: boolean, absolutePath: string, cloudPath: string, cloudUrl: string) {
    this.name = name;
    this.directory = directory;
    this.absolutePath = absolutePath;
    this.cloudPath = cloudPath;
    this.cloudUrl = cloudUrl;
  }
}

async function getFiles (path: string, cloudUrl: string): Promise<CloudFileInfo[]> {
  let files: CloudFileInfo[] = [];
  let absolutePath: string = config.cloudDirectory + path;
  let filesInPath: string[] = await readdir(absolutePath);

  for (let fileName of filesInPath) {
    let absolutePathToFile: string = absolutePath + fileName;
    let fileStat: fs.Stats = await stat(absolutePathToFile);
    let cloudFileInfo: CloudFileInfo = new CloudFileInfo(fileName, fileStat.isDirectory(), absolutePath + fileName, fileName,cloudUrl + path + fileName);
    files.push(cloudFileInfo);
  }

  return files;
}

function readdir (path: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function stat (path: string): Promise<fs.Stats> {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(path, function (err, stats) {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}
