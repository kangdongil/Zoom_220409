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
      - connection이 성립하면 양방향(bi-directional) 소통이 가능해짐.

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