import { app } from './';
import * as config from '../config';

app.listen(config.serverPort, function () {
  console.log('Express server listening on port ' + config.serverPort);
});
