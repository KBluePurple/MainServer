import express from 'express';
import proxy from './util/proxy';
import { getLogger } from './util/logger';
import rpc from './util/rpc';
import 'dotenv/config'

const logger = getLogger('Main');
const app = express();
rpc.start();

app.use(proxy.web);

app.use('/public', express.static('public'));

app.use('/', (req, res) => {
    logger.debug(`${req.method} ${req.url}`);
    res.status(404).send('404 Not Found');
});

app.listen(process.env.PORT, () => {
    logger.info('listening on port ${process.env.PORT}');
});
