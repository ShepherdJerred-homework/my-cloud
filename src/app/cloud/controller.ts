import * as express from 'express';

export function handler (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Hey');
}
