import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.use(['/', '/*'], controller.fixUrl);

router.get(['/', '/*'], controller.getFile);

router.post(['/', '/*'], controller.uploadFile);
