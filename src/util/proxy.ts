import proxy from 'http-proxy';
import * as fs from 'fs';
import { getLogger } from './logger';

const logger = getLogger('Proxy');

const proxyServer = proxy.createProxyServer();
const proxyes: any = {};

if (fs.existsSync('proxy.json')) {
    const proxyConfig = JSON.parse(fs.readFileSync('proxy.json', 'utf8'));
    for (const path in proxyConfig) {
        proxyes[path] = proxyConfig[path];
        logger.info(`Load proxy for ${path} => ${proxyConfig[path]}`);
    }
}

export default new class Proxy {
    public set(path: string, port: number) {
        proxyes[path] = port;
        fs.writeFileSync('proxy.json', JSON.stringify(proxyes));
    }

    public web(req: any, res: any, next: any) {
        const path = req.url.split('?')[0];
        let port = 0;
        // is proxyes contains start with path
        for (const p in proxyes) {
            if (path.startsWith(p)) {
                port = proxyes[p];
                break;
            }
        }

        if (port != 0) {
            proxyServer.web(req, res, { target: `http://localhost:${port}` }, (err) => {
                if (err) {
                    res.status(500).send("Internal Server Error");
                    logger.error(`${path} => ${port}, ${err}`);
                }
            });
        } else {
            next();
        }
    }

    public remove(path: string) {
        delete proxyes[path];
        fs.writeFileSync('proxy.json', JSON.stringify(proxyes));
    }
}
