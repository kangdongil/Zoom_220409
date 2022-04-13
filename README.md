## 서버 켜고 링크 들어가기
- `https://zoom-clone--susze.run.goorm.io/`

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

# 2.2 SocketIO로 FrontEnd와 BackEnd 데이터 주고받기
  - `ioServer`가 `connection` 이벤트를 받았을 때, `socket` argument를 받을 수 있다.
  - `server.js`
    - `socket.on`은 특정 이벤트가 발생할 때 함수를 실행할 수 있다.
      - `socket.on("[이벤트명]", ([socket.emit으로_받은_데이터]) => ~;)`
    - `webSockets`과 다른 점은 `message` 이벤트가 아닌 임의로 이벤트 이름을 줄 수 있다는 것이다.
  - `app.js`
    - `socket.emit`는 이벤트를 발생시키는 것으로 다음과 같은 매개변수를 가진다.
      - `socket.emit("[이벤트명]", [백엔드에_보낼_데이터]들, ...)`
    - 문자열(String)에 한정되지 않고 다양한 데이터 타입을 보낼 수 있다.
    - 다만, 마지막 매개변수는 프론트엔드에 발생하는 것으로 통상적으로 `이벤트처리 마지막으로 실행하는 함수`가 들어간다.
      - 이때 인수를 설정하면 백엔드에서 프론트엔드로 데이터를 보내는것도 가능하다
  
# 2.4.1 SocketIO 문서 살펴보기: socket
  - `socket.id`: socket의 고유id
  - `socket.rooms`: socket이 접속하고 있는 rooms의 목록
    - socket마다 혼자있는 room이 있으며 그 room 이름은 id와 같다.
	- `socket.rooms.forEach`를 사용하면 socket이 접속한 모든 rooms에 이벤트를 발생시킬 수 있다.
  - `socket.onAny((event) => ~ )`
    - socket에서 발생하는 모든 event에 대해 다룰 수 있음.

# 2.4.2 SocketIO 문서 살펴보기: room
  - room: socket들이 공유하는 공간
  - socket이 특정 room에 join하게 하기
    - `socket.join([room명])`
  - `socket.to("[Rooms]").emit([이벤트명]);`
    - 해당 Rooms에 접속한 Socket들에게 일괄 이벤트를 발생시킨다.
    - [Rooms]는 한 room, rooms, room Array 모두 가능하다.
  - `socket.on("disconnecting", () => ~)`
    - socket의 접속이 끊어질 때 이벤트
	
# 2.4.3 SocketIO 문서 살펴보기: server
  - `io.sockets.emit(~)`
    - 모두에게 event나 message 보내기(=broadcast)
  - `io.socketsJoin("~");`
    - 모든 socket들을 특정 room으로 이동시키기
  - `io.in("[기존_ROOM명]").socketsJoin([이동_ROOM명])`
    - 특정 room에 접속한 socket들을 다른 room으로 이동시키기
  
# 2.8.0 Adapter란,
  - socket들을 직접 관리하는 개체. 서비스 규모가 커짐에 따라 adapter의 수도 늘어난다
  - 기본적으로 socketIO는 메모리를 adapter로 사용한다
  - 접속하는 socket이 늘어날수록 유지해야하는 connection의 수도 증가하므로 DB를 활용한 adapter로 대체해줘야 한다.
  - adapter의 수는 여러개일 수 있으며, 이 경우 DB를 이용해 서버간 통신을 한다
  - Adapter을 이용해 할 수 있는 것들
    - 어떤 socket이 연결되었는지, 지금 몇 개의 room이 있는지 정보를 재공함

# 2.8.1 공개채팅방 목록 만들기
  - Template
    - 방 접속하기 div에 ul 만들기
  - `server.js`
    - 방에 들어가는 이벤트 발생 시, 모든 socket들에게 room_change 이벤트를 emit한다
	- 방을 나가는 이벤트에도 마찬가지로 room_change 이벤트를 발생시킨다
	  - `socket.on("disconnect", ~)`
	- room_change 이벤트를 emit할 때, 채팅방 개수를 return하는 함수를 보낸다
  - 채팅방개수 세는 함수 만들기
    - `ioServer.sockets.adapter`에서 `sids`와 `rooms` 가져오기
	- `sids`와 `rooms`는 map Object다
	- socketID에서는 기본적으로 나만의 채팅방을 제공한다. 따라서, sids(socketids)와 rooms를 비교해 공개 채팅방들만 추려낼 수 있다
	- 각 rooms key를(forEach) sids의 key와 비교해 다른 것(undefined)들을 array에 넣어 return한다.
  - `app.js`
    - room_change 이벤트 발생할 시
	- ul 초기화해주기
	- 공개 채팅방을 각각(forEach) ul에 li로 추가해주기
  
  * Map Object: `key-value 쌍` 데이터를 담은 그룹
    - Map 개체 선언하기: `new Map();`
	- Map item 추가하기: `[MAP].set();`
	- item의 key로 value 불러오기: `[MAP].get([KEY])`
	
# 2.10 채팅방 참여자 수 구하기
  - `server.js`
    - "room_enter"와 "disconnecting" 이벤트가 발생하면,
	- 해당 room에 채팅방 참여자 수를 emit한다
	- 다만, "disconnecting"의 경우 1을 뺀다
  - 채팅방 참여자 수 세는 함수 구하기
    - rooms는 Set을 return한다
	- `ioServer.sockets.adapter.rooms.get(roomName)?.size`;
  - `app.js`
    - `welcome`과 `bye`이벤트 발생하면 값을 return한다
  
  * Set Object: 중복 값을 제거한 집합(Array)
    - Set 개체 선언하기: `new Set();`
	- Set item 추가하기: `[SET].add([ITEM]);`
	- Set이 특정 item을 가지는지 확인하기: `[SET].has([ITEM]);`
	- Set item 지우기: `[SET].delete([ITEM]);`
	- Set의 item 개수 구하기: `[SET].size`
  * Optional Chaining(ES2020)
    - 특정 개체의 존재여부를 간단히 표현하는 법
	- [문서_살펴보기](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
	
# 2.11 SocketIO 어드민 패널 만들기
  - `npm i @socket.io/admin-ui`
  - Configuration
    - [Link](src/server.js)
  - `https://admin.socket.io/`
  - `https://zoom-clone--susze.run.goorm.io/admin`