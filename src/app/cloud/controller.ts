import * as config from '../../config';
import * as express from 'express';
import * as fs from 'fs';
import { CloudFileInfo } from './model';

export async function getFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let path: string = config.cloudDirectory + req.path.substring(1);

  try {
    let stats: fs.Stats = await stat(path);
    if (stats.isDirectory()) {
      await handleDirectory(req, res, next);
    } else {
      handleFile(req, res, next);
    }
  } catch (e) {
    res.sendStatus(404);
  }
}

export function uploadFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Hey there');
}

/**
 * Redirects a request with a trailing slash if one is not already present
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
function fixPath (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.originalUrl.slice(-1) !== '/') {
    res.redirect(307, req.originalUrl + '/');
  }
}

/**
 * Lists files in the directory
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Promise<void>}
 */
async function handleDirectory (req: express.Request, res: express.Response, next: express.NextFunction) {
  fixPath(req, res, next);

  let cloudFiles: CloudFileInfo[] = await getFiles(req.baseUrl, req.path);
  res.render('index', {
    path: req.path,
    pathName: req.path === '/' ? 'Index' : req.path,
    files: cloudFiles
  });
}

/**
 * Sends a file to the client
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
function handleFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let file: string = config.cloudDirectory + req.path.substring(1);
  let fileName: string = req.path.substring(1);
  console.log(file);
  if (req.query.hasOwnProperty('download')) {
    res.download(file);
  } else {
    res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
    res.sendFile(file);
  }
}

async function getFiles (cloudUrlBase: string, pathOffset: string): Promise<CloudFileInfo[]> {
  let files: CloudFileInfo[] = [];
  let absolutePath: string = config.cloudDirectory + pathOffset;
  let fileNamesInPath: string[] = await readdir(absolutePath);

  for (let fileName of fileNamesInPath) {
    let absolutePathToFile: string = absolutePath + fileName;
    let fileStat: fs.Stats = await stat(absolutePathToFile);
    let cloudUrlPath: string = cloudUrlBase + pathOffset + fileName;
    let cloudFileInfo: CloudFileInfo = new CloudFileInfo(fileName, fileStat.isDirectory(), absolutePath + fileName, fileName, cloudUrlPath);
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
