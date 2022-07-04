# MainServer

`http-proxy`와 `express`, `jayson`을 이용한 메인 서버

다른 포트에서 연 서버에서 RPC를 이용해 Proxy를 등록한 뒤 `express`와 `http-proxy`를 이용하여 경로에 맞게 들어오는 클라이언트를 해당 서버에게 전달한다.
