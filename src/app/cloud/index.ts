import * as express from 'express';
import * as controller from './controller';
import * as multer from 'multer';
import * as config from '../../config';

export const router: express.Router = express.Router();

const upload = multer({ dest: config.uploadDirectory });

router.get(['/', '/*'], controller.getFile);

router.post(['/', '/*'], upload.single('uploadFile'), controller.uploadFile);
