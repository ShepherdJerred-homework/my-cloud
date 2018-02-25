/**
 * Exports two functions that are promise wrappers for the node fs library
 */

import * as fs from 'fs';

export function readdir (path: string): Promise<string[]> {
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

export function stat (path: string): Promise<fs.Stats> {
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
