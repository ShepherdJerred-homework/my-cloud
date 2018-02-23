import * as express from 'express';

export function getFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Hey');
}

export function uploadFile (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Hey');
}
