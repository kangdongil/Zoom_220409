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