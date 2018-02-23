// import * as config from '../config';
import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import * as morgan from 'morgan';
import * as cloud from './cloud';

export const app: express.Express = express();

app.engine('hbs', expressHandlebars({ defaultLayout: undefined }));
app.set('view engine', 'hbs');

app.use(morgan('dev'));

app.use('/cloud', cloud.router);