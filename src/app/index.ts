/**
 * Exports the Express application
 */

import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import * as morgan from 'morgan';
import * as cloud from './cloud';

export const app: express.Express = express();

app.engine('hbs', expressHandlebars({ defaultLayout: undefined }));
app.set('view engine', 'hbs');

app.use(morgan('dev'));

app.use(express.static(__dirname + '../../../static'));

app.use('/cloud', cloud.router);
