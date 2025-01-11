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

### posgresql docker image

- install from postgres docker image docs
- via terminal command or via docker-compose

```bash
# build postgres docker image
docker pull postgres
# create a persistent volume
docker volume create mernpgdata
docker volume ls
# via terminal
docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=auth -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
docker ps
```

### postgres in Azure Data Studio

- first create docker postgres image via terminal or via docker-compose
- POSTGRES_USER=root
- POSTGRES_PASSWORD=root
- port=5432
- server=localhost

> to craete database in azure data studio - in new query section CREATE DATABASE <dbname>, DROP DATABASE <dbname> 

```bash
# login in postgres via terminal
docker exec -it <postgrescontainerName> psql -U <username>
```

> database connection info

```bash
# total active connections
SELECT pid, usename, datname, state 
FROM pg_stat_activity 
WHERE datname = '<dbname>';

# terminate all active connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '<dbname>' AND pid <> pg_backend_pid();

# drop database
DROP DATABASE "<dbname>" ;
DROP DATABASE "<dbname>" WITH (FORCE);
```

### database connnection with typeorm

- one query for all different databases interaction(mongodb,postgres)
- to check whether data exists or not after user registration
- install from typeorm docs
- enable typescript decorators
- for current project:- npx typeorm init --database postgres
    > after typeorm init - it may override few files

### ❗️✨💥 typescript version conflict with jest & supertest

- two versions of typescript were installed
- solve by

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm install typescript@">=4.8.4 <5.8.0" --save-dev
```

### secure data protection
- password hashing - bcrypt
- email validation - express-validator

### inbuilt crypto in nodejs

- openssl for mac & linux devices
- generate keys public & private

### mock-jwks to validate public jwt tokens 

- npm i -D mock-jwks@1.0.10 

### implement jwt validation

- npm i jwks-rsa
- npm i express-jwt
- npm i cookie-parser

### JWT Verification Signature
- private & public keys are in PEM format, convert to JWT signature
- npm i rsa-pem-to-jwk

## Jest Debugging in typescript express

### Debug in typescript

1. typescript function debugging - working
- install typescript & ts-node & nodemon
- npx tsc --init  - for tsconfig.json

2. express route debugging 
- attach to running server  - choose /.bin/ts-node app.ts
- launch new server 
3. express typescript debugging
- attach to running server  - choose /.bin/ts-node app.ts
- launch new server 


```bash
{
 "version": "0.2.0",
 "configurations": [
 
 # server launch mode
  {
   "type": "node",
   "request": "launch",
   "name": "Launch Program",
   "skipFiles": [
    "<node_internals>/**"
   ],
   "program": "${workspaceFolder}/app.ts",
   "outFiles": [
    "${workspaceFolder}/**/*.js"
   ]
  },

# for attach mode
  {
   "type": "node",
   "request": "attach",
   "name": "Attach to Program",
   "port": 3000,
   "processId": "${command:PickProcess}",
   "skipFiles": ["<node_internals>/**"],
   "outFiles": [
    "${workspaceFolder}/**/*.js"
   ]
 }
 ]
}
```

4. jest express typescript debugging

- add jest.config.ts file - automatically discovered
- npm install ts-jset & it's types add to jest config file
- npx ts-jest config:init
- npm test or npx jest

```bash
{

 "version": "0.2.0",
 "configurations": [
 
 # new jest server
 {
    "name": "Jest file",
    "type": "node",
    "request": "launch",
    "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/jest",
    "args": [
        "${fileBasenameNoExtension}",
        "--runInBand",
        "--watch",
        "--coverage=false",
        "--no-cache"
    ],
    "cwd": "${workspaceRoot}",
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "sourceMaps": true,
    "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest.js"
    }
},

# running jest
  {
   "type": "node",
   "request": "attach",
   "name": "Attach to Program",
   "port": 3000,
   "processId": "${command:PickProcess}",
   "skipFiles": ["<node_internals>/**"],
   "outFiles": [
    "${workspaceFolder}/**/*.js"
   ]
 }
 ]
 ```

### install extension - `Jest In Run` in vs code

 > ✨💥 if there is typescript detected error or bug, then debugger won't work in jest it will automatically disconnected...

## Database Migration

- typeorm migration docs
- synchronize in production turned off
- inside cli - select Generate a migration from existing table schema

### Generate Migration alraedy existing database schema

- typeorm-ts-node-commonjs migration:generate src/migration/migration.ts -d src/config/data-source.ts

### Create Migration script already existing database

- manually create new clean database
- generate new migration file which contains - database queries generate by typeorm

```bash
npm run migration:generate -- src/migration/fileName -d src/config/data-source.ts
```

### Run migrations

- typeorm migration:run -- -d src/config/data-source.ts
- inside database - all tables will craete & additionally migration table also creates

### Revert back migrations

- typeorm migration:revert -- -d src/config/data-source.ts

### Show all migrations

- typeorm migration:show  -- -d src/config/data-source.ts

### Create a new migration script

- typeorm migration:create src/migration/migration

### Migration for rename tables

- refresh & again create connection to resolve caching issues in Azure Data Studio
- seen inside Explorar > `dbname` > Schemas > public > Sequences Pane in azure Data studio