그냥 nginx 쓰는게 좋다는 선생님의 말씀으로 사용하지 않는다
# <s>MainServer</s>

내가 필요해서 만든 `http-proxy`와 `express`, `jayson`을 이용한 메인 서버

다른 포트에서 연 서버에서 RPC를 이용해 Proxy를 등록한 뒤 `express`와 `http-proxy`를 이용하여 경로에 맞게 들어오는 클라이언트를 해당 서버에게 전달한다.

RPC 포트는 `3999`

다음과 같이 사용 가능

```typescript
// util/rpc.ts
import rpc from "jayson";
import { getLogger } from "../util/logger";

const logger = getLogger("RPC");

const client = rpc.Client.http({
    port: 3999,
});

client.once("connection", () => {
    logger.info("Connected to RPC server");
});

client.on("error", (err) => {
    logger.error(err);
});

export default new class RPC {
    public async RegisterProxy(path: string, port: number) {
        return await client.request("RegisterProxy", [path, port], (err: any) => {
            if (err) {
                logger.error(err);
            }
            else {
                logger.info(`Registered proxy for ${path} on port ${port}`);
            }
        });
    }

    public async UnregisterProxy(path: string) {
        return await client.request("UnregisterProxy", [path], (err: any) => {
            if (err) {
                logger.error(err);
            }
            else {
                logger.info(`Unregistered proxy for ${path}`);
            }
        });
    }
}
```

```typescript
import express from "express";
import rpc from "./util/rpc";

const port = 3001;

const app = express();

app.get("/index", (res, req) => {
    req.send("Hello World");
});
app.listen(port, () => {
    console.log(`Server started on port ${3001}`);
    rpc.RegisterProxy("/index", port);
});
```
