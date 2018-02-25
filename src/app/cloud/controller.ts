/**
 * Exports two functions, getFile and uploadFile, that are controllers intended to be used with an Express router.
 */

import * as config from '../../config';
import * as express from 'express';
import * as fs from 'fs';
import { CloudFileInfo } from './model';
import { readdir, stat } from '../asyncFs';

/**
 * List directory contents or display a file based on the request path
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Promise<void>}
 */
export async function getFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let path: string = config.cloudDirectory + decodeURI(req.path.substring(1));

  console.log(path);

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

/**
 * Upload a file to the server
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export function uploadFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let absoluteFilePath: string = req.file.path;
  let destinationPath: string = config.cloudDirectory + decodeURI(req.path) + req.file.originalname;
  fs.rename(absoluteFilePath, destinationPath, () => {
    //
  });
  res.redirect(303, req.originalUrl);
}

/**
 * Lists files in the directory
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Promise<void>}
 */
async function handleDirectory (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.originalUrl.slice(-1) !== '/') {
    res.redirect(307, req.originalUrl + '/');
  } else {
    try {
      let cloudFiles: CloudFileInfo[] = await getFiles(req.baseUrl, decodeURI(req.path));

      res.render('index', {
        path: decodeURI(req.path),
        cloudPath: req.baseUrl + decodeURI(req.path),
        pathName: req.path === '/' ? 'Index' : decodeURI(req.path),
        files: cloudFiles
      });
    } catch (e) {
      res.sendStatus(500);
    }
  }
}

/**
 * Sends a file to the client
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
function handleFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  let file: string = config.cloudDirectory + decodeURI(req.path.substring(1));
  let fileName: string = decodeURI(req.path.substring(1));

  if (req.query.hasOwnProperty('download')) {
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.sendFile(file, {
      dotfiles: 'allow'
    });
  } else {
    res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
    res.sendFile(file, {
      dotfiles: 'allow'
    });
  }
}

/**
 * Get all of the files in a directory
 * @param {string} cloudUrlBase
 * @param {string} pathOffset
 * @returns {Promise<CloudFileInfo[]>}
 */
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
