# 0.1 요구사항
  - JS
    - `document.querySelector/getElementByID`
    - `callback function`
    - `document.createElement`
    - `.innerText`
    - `.classList.add()`
  - NodeJS
    - `package.json`
    - `babel`
    - `nodemon`
    - `ExpressJS`
    - `app.get()`
    - `Pug`
    - `(req,res)=>`

# 0.2 ExpressJS로 서버 구축하기
   - Console
     - `npm init -y`
       - `package.json`
       - `scripts`에 `dev`: `nodemon`
     - `touch README.md`
     - `npm i nodemon -D`
     - `touch babel.config.json`
       - `presets`: [`@babel/preset-env`]
     - `touch nodemon.json`
       - `exec`: `[메인js파일]`
     - `mkdir src`
     - `touch src/server.js`
     - `git init .`
     - `npm i @babel/core @babel/cli @babel/node @babel/preset-env -D`
     - `touch .gitignore`
       - `/node_modules`
     - `npm i express`
     - `npm i pug`

# 0.3 NodeJS FrontEnd 환경 구축하기
  - public 폴더 만들기
    - `mkdir public/js`
    - `touch public/js/app.js`
    - `app.use("/public", express.static(__dirname + "/public"));`
  - pug 사용환경 만들기
    - `app.set("view engine", "pug");`
    - `app.set("views", __dirname + "/views");`
  - Root 웹페이지 Render하기
    - `app.get("/", (req, res) => res.render("home");`
    - `touch src/views/home.pug`
  - `home.pug` 만들기
    - `link(rel="stylesheet', href="https://unpkg.com/mvp.css")`
    - `script(src="/public/js/app.js")`

# 1.1 HTTP vs. WebSockets
    - 프로토콜(protocol)
      - 두 컴퓨터간 데이터를 소통하는 방식
      - 사용자-서버, 서버-서버 모두 가능하다
    - HTTP
      - 사용자가 request하면 서버가 response하는 방식
      - stateless: backend가 사용자를 기억하지 못함
      - 사용자의 request 없이는 서버가 임의로 데이터를 보낼 수 없음.
    - WebSocket
      - 사용자의 request를 서버가 accept하면 connection이 성립됨
      - connection이 성립하면 실시간(real-time) 양방향(bi-directional) 소통이 가능해짐.
      - 또한 이를 기반으로 이벤트 발생 시 이를 이용한 기능을 구현가능함.(event-based communication)

# 1.2 Express 서버에 WebSockets 사용하기
  - ws 설치하기
    - `npm i ws`
  - 서버 구축을 위해 http와 ws import하기
    - `import http`
    - `import WebSocket from "ws"`
  - Express App을 임의로 http서버 구축하기 
    - `http.createServer(app);`
  - HTTP서버 위에 ws서버 구축하기
    = `new WebSocket.Server({ server });`
  - app.listen하기

# 1.3 ws 연결하여 FrontEnd와 BackEnd 소통하기
  - 브라우저에서 ws서버 연결하기(`app.js`)
    - new WebSocket(`ws://${window.location.host}`
  - 브라우저 Event 다루기
    - ws서버와의 연결이 시작되었을 때,
      - `socket.addEventListener("open", ~)`
    - ws서버에서 메세지를 받았을 때,
      - `socket.addEventListener("message", (message) ...)`
      - 메시지 내용만 필요할 때는, `message.data`
    - ws서버와 연결이 끊어졌을 때,
      - `socket.addEventListener("close", ~)`
  - 브라우저가 ws서버에 연결되어 있을 때,
    - `[ws서버].on("connection", ~)`
    - 브라우저가 연결되었을 때, 연결된 브라우저에 대한 정보가 `socket`에 저장된다
    - 서버 전체에 대한 event는 서버에, 서버에 연결된 각 브라우저에 대한 event는 socket에 한다.
    - 브라우저와의 서버연결이 끊겼을 때
      - `socket.on("close", ~)`
    - 브라우저에 메세지 보내기
      - `socket.send("[메세지]")`
    - 브라우저에서 보낸 메세지에 대해 처리하기
      - `socket.on("message", (message) ~)`

# 1.6 socket들을 연결해 실시간 대화 구현하기
  - sockets 배열에 socket 추가하기
    - `const sockets = [];`
    - `sockets.push(socket)`
  - 각 socket마다 message 보내기
    - `sockets.forEach(aSocket => aSocket.send(message.toString()));`
  - 채팅방 기능 간략하게 구현하기
    - HTML
      - `ul`로 채팅내용을 `li`로 받기
      - `form/input/button`
    - JavaScript
      - `document.querySelector`로 form 가져오기
      - `.addEventListener` `submit` 이벤트시 `function(event)` 실행하기
      - submit default 행동 초기화하기(`event.preventDefault();`)
      - `input`값을 받아 `socket.send`하기

# 1.9 nickname 설정하기(json형식으로 데이터 주고받기)
  - socket이 message의 종류를 구분할 수 있도록 json형식으로 message를 보낸다
  - 다만 ws는 websockets의 javascript implementation이므로 json object로 보내기보다 string으로 바꾸어 보내는 것이 바람직하다
  - json message 만들기(`app.js`)
    - `function makeMessage(type, payload) {~}`
    - `const msg = { type, payload };`
    - `return JSON.stringify(msg);`
    - `socket.send(makeMessage("[message_종류]", input.value));`
  - stringify된 message를 받았을 때,(`server.js`)
    - `socket.on("message",(aMessage) => ~)`
    - `message = JSON.parse(aMessage)`
    - `switch문`으로 message의 type별로 처리하기
      - `switch(message.type) {~}` 
      - `case [TYPE명]:`
      - case 마지막에 `break`하기
    - `new_message`의 경우, nickname과 함께 메시지 보내기
      - `닉네임`: `socket.nickname.toString()`
      - `메시지내용`: `message.payload.toString()`
    - `nickname`은 socket에 넣고 사용하기
      - 미리 `socket["nickname"] = "Anonymous";`로 정하기
      - `socket["nickname"] = message.payload;`

# 2.0 SocketIO 알아보기
  - SocketIO: websocket을 비롯해 양방향 통신을 지원하는 프레임워크
  - SocketIO의 장점
    - webSockets가 가능하지 않을 때 자동적으로 대안을 실행함.
    - `http long-polling`
    - 재연결 자동 시도

# 2.1 SocketIO 설치하기
  - `npm i socket.io`
  - server.js에 `socket.io` import하기
  - http서버에 `socket.io` 덮씌우기
  - `ioServer.on("connection", (socket) => ~)`
  - template에 `script(src="/socket.io/socket.io.js")`해서 브라우저에 `socket.io` 가져오기
  - `const socket = io();`