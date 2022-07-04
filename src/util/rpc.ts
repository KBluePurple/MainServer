import jayson from 'jayson/promise';
import proxy from './proxy';
import { getLogger } from './logger';

const logger = getLogger('RPC');

const server = new jayson.Server();

export default new class RPC {
    public async start() {
        server.method('RegisterProxy', async (args: [string, number], callback: (err: Error | null, res: any) => void) => {
            logger.info(`RegisterProxy: ${args[0]} ${args[1]}`);
            const [path, port] = args;
            proxy.set(path, port);
            callback(null, {});
        });

        server.method('UnregisterProxy', async (args: [string], callback: (err: Error | null, res: any) => void) => {
            logger.info(`UnregisterProxy: ${args[0]}`);
            const [path] = args;
            proxy.remove(path);
            callback(null, {});
        });
    }
}

server.http().listen(3999);
logger.info('listening on port 3999');
