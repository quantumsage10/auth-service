> npx means to run code

### typescript in Command Line

- npm install -D typescript
- npx tsc --init
- tsc
- npm install ts-node
- npm i -D @types/node

### prettier formatter

- install from docs
- run node commands or create manually .prettier files
- npx prettier . --write , --check, --fix

### typescript eslint static code scanner

- install from docs
- npx eslint .
- eslint.config.mjs - Linting with type info

### git hooks

- before commiting to git doing something with code like linting or formating
- only pushing high quality code with fully linted or formated code
- git formatter or linter for more safety

> husky pre-commit

- install from docs
- npx husky init

1. pre-commit file - npm test might create problem in git pushing code

> lint-staged npm

- install from docs
- manually add command in the end of package.json
- lint-staged fix the error automatically utilizing eslint.config.mjs file

### app config

- centralized location storage
- env - secret credentials
- dotenv package npm

### expressjs to make server

- serve files on web
- makes easy web serving by providing middlewares
- install from docs

> nodemon internally use ts-node to run file & track changes

### winston logger

- install from docs
- additional info
- more control to console.log statements
- toggle log through env variable - automate
- transports means sending/dispalying logs

### error middlewares for http errors

- npm i http-errors -D @types/http-errors

### automated tests

> Jest - using babel,typescript, nodejs, react

- install from docs for typescript & configuration
- file convention app.spec.ts or app.test.ts
- sometimes just restart eslint server from command pallete
- describe = test suites
- it = tests

> Supertest - testing HTTP API endpoints

- install from docs
- run own server


### docker

- to have same config, version or binaries in both development & deployment
- Dockerfile - instructions to build docker image

```bash
docker build -t auth-service:dev -f docker/dev/Dockerfile .
docker image ls
docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev
docker ps
docker stop <conatinerId>
docker run <Image-name>
```

- to run docker daemon desktop, host system must have atleast 8 gb of ram