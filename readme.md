
```ts
const greeting: string = "Hello World!"
```

> ✔️  npx means to execute code

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
  
 ✖️ ~~npm run~~
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
docker run --rm --name mernpg-container -e POSTGRES_USERNAME=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=auth_service -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
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

- typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
- inside database - all tables will craete & additionally migration table also creates

### Revert back migrations

- typeorm-ts-node-commonjs migration:revert -- -d src/config/data-source.ts

### Show all migrations

- typeorm-ts-node-commonjs migration:show  -- -d src/config/data-source.ts

### Create a new migration script

- typeorm migration:create src/migration/migration

### Migration for rename tables

- refresh & again create connection to resolve caching issues in Azure Data Studio
- seen inside Explorar > `dbname` > Schemas > public > Sequences Pane in azure Data studio

## Multi-Tenacy

- Multi-tenancy is an architecture where a single instance of software serves multiple customers (called tenants). Each tenant's data and configuration is isolated from others, even though they're sharing the same application and infrastructure resources.

Common examples include:

Cloud Hosting SaaS applications like Salesforce, where each company has its own isolated environment
Email services where users share the same application but have private inboxes

### Analogy of multi-tenacy

Think of it like an apartment building:

- The building itself is the software application
- Each apartment represents a tenant's dedicated space
- Tenants share common infrastructure (plumbing, electricity) but have    private living spaces
- Each tenant can customize their space within certain limits

## Typescript Build

- add script build in package.json - "build"
- add .env.dev file & certs keys file in dist

```bash
- npm run build
- cd dist
- NODE_ENV=dev node src/server.js
```

# Production Mode Code

## Docker 

- craete a Dockerfile

```bash
# Use the official Node.js 18 Alpine image as the base for the builder stage
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies using npm in a clean environment
RUN npm ci

# Copy the entire application source code to the working directory
COPY . .

# Build the application (assumes there's a build script in package.json)
RUN npm run build

# Use the official Node.js 18 Alpine image as the base for the production stage
FROM node:22-alpine AS production

# Set the Node.js environment to production
ENV NODE_ENV=production

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install production dependencies only, ignoring optional and dev dependencies
RUN npm ci --ignore-scripts --omit=dev

# Copy the built application from the builder stage to the production stage
COPY --from=builder /app/dist ./

# Expose port 5500 to allow external access to the application
EXPOSE 5500

# Specify the command to start the application
CMD ["node", "src/server.js"]
```

- craete a docker image in terminal

```bash
docker build -t auth_service_prod_image -f docker/prod/Dockerfile . 
```

- run a docker container

```bash
docker run <imageName>
```

## Supabase

- backend-as-a-service (BaaS)
- for postgres db server setup readymade

## Sonar Cloud

- cloud-based code quality and security service 
- usecase - to detect errors via CI/CD pipelines and version control systems
- generate security key in sonar , Accounts > security > generate key

## Docker Hub Setup

- After Branch Merging
- Store App Image (in js production ready code)
- generate access token in accounts settings

### GIT BRANCH

```bash
git pull

# create new branch & switch
git checkout -b cors

# to check current branch
git branch
```

### CORS

- npm i cors
- to talk to another server
- allow request from another server

### GITHUB ACTIONS

- FAILED IN SUPABASE SETUP IN GITHUB SECRETS

### SONAR PROJECT PROPERTIES

- Click on specific project & then Information Icon at the botttom
- turn off Automatic Sonar ananalysis from Sonar Cloud
- if Quality gate failed

### Github Branch Protection

- Click the specific repository - then Branches

### Github Pull request

- create second branch
- create pull request from that branch

### Github Branch Syncing Local & Remote

```bash
git checkout -b feature1
git branch --set-upstream-to=origin/feature1 feature1
git push --set-upstream origin feature1
git branch -r
git pull origin feature1
```

# CI PIPELINE 

- docs
> .github/workflows/ci.yml file prototcol/instructions

### Pull Request PR in github

- craete other git branch locally
- code changes push to github
- craete pull request to merge with main in github

```bash
# for syncing local & cloud
git checkout main
git pull
```

### SUPABASE IP CONNECTION ERROR

- Supabase migrates  IPv4 to IPV6 but others don't
- use supabase alternative config - session pooler etc.

### SONAR CLOUD ERROR CHECKING

- must have above 80% code coverage tests
- no errors in code

### DOCKER-HUB IMAGE PUSH ERROR 

```bash
# to confirm whteher image pushed to docker hub & run docker
docker run --env-file $(pwd)/.env.dev -e PRIVATE_KEY="..." -p 5501:5501 runipanda/auth-service:build-93 

# to run container
docker run  --env-file $(pwd)/.env.dev -e PRIVATE_KEY="..." --rm --name authservice-container -v authservicedata:/var/lib/postgresql/data -p 5501:5501 -d runipanda/auth-service:build-93 
```

- replace bcrypt with bcryptjs

```bash
npm uninstall bcrypt -D @types/bcrypt
npm install bcryptjs -D @types/bcryptjs
```

> Command Pallate - Restart ESLint 

- provide proper docker hub username & password 
- or username & access token & password

### Docker Container Running Error of Defective Image

- the image pushed to docker hub lacks few dependencies like express
- express was placed in dev dependencies
- in docker prod file - instructed ci to ignore dev dependencies
- that's why docker hub image lacks express & other dev dependencies
- now again installing express in dependencies only

### ERROR READING DURING PRIVATE KEY

- in the end everything converted to dist folder (js) but dist doesn't contain certs & public folder
- manually providing dist in local
- while docker container manually provide PRIVATE_KEY="" cuz it needs RS256 algorithm to read but in .env it becomes multiline which is hard to read by RS256 
- access token is certified
- refresh token doesn't need certification or optional

### AGGREGATE ERROR

- no directory or file found

- jwks error
```BASH
DB_HOST=localhost
DB_HOST=host.docker.internal

JWKS_URI="http://localhost:5501/.well-known/jwks.json"
# JWKS_URI="host.docker.internal:5501/.well-known/jwks.json"
```
> bit update jwks works with http get request - it depends 

### local server

- copy public folder into dist foledr

```bash
# in apckage json
"build": "tsc && cp -r public dist",
```

### Docker Container

```bash
# package.json
"build": "tsc",

# inside DockerFile
# Ensure the public/.well-known directory is included in dist
RUN mkdir -p dist/public/.well-known && cp -r public/.well-known dist/public/
```

### APP WORKS AFTER FEW FIXES 

<details>
  <summary style="font-weight: bold; color: grey;">Docker Code</summary>
  <p>Here you can find the code to run docker conatainer with env variables <br> after downloading image from docker hub</p>

```bash
# terminal

docker run --env-file $(pwd)/.env.dev -e PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEArnA9vWhqebrhqbhbhrebhheabe5LHoF76RUtguD+PtWcBof3
FdeaNUDe25fxwhSOLaCK4CInDhgGbVJOvIFfQMUYo6IImNHoodlSETLeCNYLailR
pzfGPvxut6GrUASTp7J5T69MAEo9IdFfZiVJ/GlghokaPFfdAXg+7LPbtlOG9O61
VxRwydx/odgnR4DGNfzaI9POhqxm1stcgzF48yJo9s0c0+FYLFz/GPB4HeZy/KUh
PlmpRc/iFIA0A9VMLVcsWS/TVYIAh9kGOAllJyT9YHtHBRAmJIzMuatwuWmK7Dfd
R39tq/sPJZR+++2y0rQNOFJrmXd6oaqlsqzEFwIDAQABAoIBAETJJ99wAYHEhYD9
u3Pi8DT182EiuPZ/ktAXtMmeVUOL0inVJb7sNPf466hmI0Qn/OTLINg/P21UVfx3
72pwDZKp5gxokcFJTNW9r5numBWd6gRj5LnuyXL+8d3hl39HPr5rJ2Efu/WFUNPs
DxVlcOZi21hR6hGPiCvTMeT/C426fIQGdtjTBTSo6PoycwJmrC/cFq85ArR4Slp/
k3tbKtRHP+zn8F5p3wOnvr0X5+gYJXWtGWaLgwbezVbx57Xp4BE3uZVC4HRzprkC
g9mDy8C9TgrN6HhlDuZrItSldqZ4DLjJYB/Xsk6QvwXQrAo4WVU2hvmDTTryDODo
9hDSiqECgYEA7QHld8DSCe3JMu2dhtJgfmTsVjw8oaznmp0rEkMS9mzcOqU2rw4R
stD/QV3UoOLuRjLdKpFw8nIvvyPw/Gnp4Eaj1IdeskJZUEOF5t40Wy65kx1WIWRJ
lDgBAWD//mExH+KgQdUnjd6WvJn628mFrLbDYvT2gewzFmu1fD3wMNECgYEAvGrF
Dx18srkG5BsWoF6urEwsVfKg+RFAi33eetwXl/n3FvLv+d6NyWtYzdbwKlJWS8ad
lcdb3YuZ1Y6HDFVxmRnoFZu0uMB2fQHBFINzX5KOUORa+SrCtrM9WzuVNvgJUDa2
g8Tr1A0d0NnNB/Yk/BQnx7GAM28p8bpVLkW/IGcCgYEAsf7Bmh1a4RAPEct4id+H
joU3JVCZ7IYRboHo7g8nt6BsCTM5DWFQk234tdvFK4sijd/3T9fo7nwpNbDFdJwK
hGAo/B0qVlAUCX6cmpV41p4RytW2cN+Djug8gQ+bUi0mGp814hs2WIq5xC0URGpl
lR+xP6lfVJXSjF0Z8JQHxnECgYBfk1l6nV6P2kOgmg0UNHMue0VSI818CkBPgf3F
HLfrI6UvQvRwL3CE56sYXxtcnH+h2JI/U+1JqHLUXYQrwXvqSbXsoBtATIDOUIF8
wmFX7aO7bNqo4gP7YViSWtsKEy/GPLrAhLeLzUt+kbzrePSx2heDuIprjMweDoL/
Aeo9qQKBgQDII9ePUSxShnpjs5L6HypA1L7q87UHQg3k4zWp6LKR5TlF8N4nqj2w
qxBg9nh1o4OrT81EOsi9vpTAzeaAL84OVEyCp6rgOStceRHWCUEkXOzftzk/cFk+
D3zD5RzL1bLeoacQYX9sTgQJSNIpzh9XEHnsVgg4NS9EA99/CT5fWQ==
-----END RSA PRIVATE KEY-----" -e JWKS_URI="http://localhost:5501/.well-known/jwks.json" -p 5501:5501 -v $(pwd)/certs:/src/certs runipanda/auth-service:build-95
```
</details>


- image build no. changes while making changes in source code

###  SQL Relation Joins

> using typeorm queryBuilder
- ManyToOne Relationship between users table & tenants table 
- which simply means many tenants to One user

# SUPABASE - POSTGRES CLOUD DB

- gives a postgres-sever in-built deploy on aws
- supabase creates postgres server & make queries 

- supabase makes sure postgres server up & running
- aws makes sure supabase server up & running
  
```py
# docker login -u runipanda
"DOCKER_HUB_USERNAME=runipanda"
"DOCKER_HUB_PASSWORD=runiDev@13"

# supabase login
SUPABASE_EMAIL=
SUPABASE_PASSWORD=

# will paste in github actions
"SUPABASE_PASSWORD=n9XE2YRaMPII37by"
```

- add project name & place - cheapest aws - north
- head to bottom - Project Setting - Configuration - database - Connect - get connection string URI (copy & paste it)

```py
# get the connection string
"postgresql://postgres:[YOUR-PASSWORD]@db.eahyxshhggptpjjspcdz.supabase.co:5432/postgres"

# supabase password
"postgresql://postgres:n9XE2YRaMPII37by@db.eahyxshhggptpjjspcdz.supabase.co:5432/postgres"
```

# FEW TIPS

> most imp check `git branch` always, before making any chnages to code!

- if in main branch first run git pull for syncing with cloud
- take care of git merge
- all credentials/config must be correct like supabase, sonarcloud, docker hub, github , ssh keys, tokens
- keep docker hub turned on when pushing image for the first time
- send few env variables via treminal - for instance :- jwks & private_key
- check all dependencies & dev dependencies correct versioning
- check dockerfile
- add non-ts file into dist folder

### AUTHENTICATION PROBLEM

- jwks requires key id(kid) inside keys array
- n & e means public key 


<details>
  <summary style="font-weight: bold; color: grey;">JWT Secret Key</summary>
  <p>Here you can find the code</p>

```json
{
  "kty": "RSA",
  "use": "sig",
  "kid": "12345",
  "n": "AN0PTX1P03HVcPk4fFe3BGLcj_O5-KsVktLTAHlenUOanFseLwBysSZlJ3HJmdhzOAhp_ceXjr6MheYyJczXX2f-5tyObUseA0wHBSEJKBVHJKWBGHSBHFJBWHJRGUHJREHRJEHJhjebrhwbrhwgKERNTJKHTNJHjewbgjwhrjHERJHN-yCERtJIKMrH197oMVFXWZb1Xq154miUi7acHKQmvQcQvh5WV6WAD-ld94X3TbvBiv8FOr0CGP78d-B3k-koQ1NRZCDPdrKrmJQjIQA8G9nl745TflnFEXjf-aNdmVBdkjZOyDF5jbkMJOEqAZGy6N9ScIs",
  "e": "AQAB"
}

```
</details>


### MIGRATIONS (SCHEMA CHANGE OF TYPEORM)

- to change column (add or remove)
- entity - refresh_token to refreshTokens
- entity - user to users 
- entity - in users craete column tenenatid


### DOCKER 

- make sure to run postgres database in docker
- image db_port & postgres db_port must be same
- this below code works 

<details>
  <summary style="font-weight: bold; color: grey;">Docker Code</summary>
  <p>Here you can find advanced config options</p>

```bash
docker run --env-file $(pwd)/.env.dev -e PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIJHhdqhvqjbqjAQEA3Q9NfU/TcdVw+Th8V7cEYtxSgm/...
BCbY0VNnMChKhHXdqLayS+bdwrnO9hh85cGmtGzG3f2GTXGQgYU=
-----END RSA PRIVATE KEY-----
" -e REFRESH_TOKEN_SECRET="secretkeyforrefreshtoken" -e JWKS_URI="http://localhost:5501/.well-known/jwks.json" -p 5501:5501 -v volume-auth:/src/postgresql/data runipanda/auth-service:build-103
{"level":"info","message":"First Database Connection successfully","serviceName":"auth-service","timestamp":"2025-02-04T15:19:32.782Z"}
{"level":"warn","message":"warning","serviceName":"auth-service","timestamp":"2025-02-04T15:19:32.788Z"}
{"level":"error","message":"error","serviceName":"auth-service","timestamp":"2025-02-04T15:19:32.788Z"}
{"level":"info","message":"Second - http://localhost:5501","serviceName":"auth-service","timestamp":"2025-02-04T15:19:32.791Z"}
```

</details>


### Cookies

- add main domain in cookies

---


# ERRORS

### 🔍 Problem: SQL Queries Appear in VS Code but Not in Docker Logs

🔹 SQL queries are logging in VS Code Console terminal l but not appearing in Docker logs
- Docker captures only console logs (console.log, console.error)
- Docker captures only stdout and stderr
- Set Winston level to "debug" in logger.ts

✔️ Check if logs are going to a file inside
the container (/var/log/) 
- not going to var/log

✔️ Restart the container after changes 

### React Query Key - latest data fetched in console but not in UI

- queryKey is not set properly during refetching (invalidate) data
- react-query mutation doesn't return Promise that's why can't be awaited
💠 to fix code add await in next line or add promise based delay time 


### Global Error Handling

- must be the last middleware to catch errors
- if inside production mode, do not send `server Error  original message` to client - modify error message then send
- do not send everything (req or res object) to client cuz of `security issues`

```sh
npm install uuid
npm i @types/uuid
```

- We use uuidv4 to generate unique identifiers for objects, records, or entities in our applications. UUID (Universally Unique Identifier) version 4 (v4) is randomly generated
- Uniqueness – Prevents ID conflicts across different systems or databases
- give id to every error


### Express Router Error

```ts
const expressRouterFunc = (req: string, res: string, next: string, error: string) => Promise<void>
``` 
- express router methods expects void in return means no return statements
- typecast explicitely to return something like promise based data

### Github Blocked Push from Git Changes - Need for rebase/edit commits

- but why cuz git contains docker PAT(secret access token)
- prior to that i have made 3 commits after that
- so need to rebase to first defect commit & change all of these subsequent 3 commits - basically it means going back to time & fix everything

✅ to fix this - `Edit Previous commits using Rebase`

```sh
#   ~/Desktop/auth-service   main ⇡4 ───────────────────────────────────  7s
❯ git rebase -i HEAD~4   

# it will open a file & will ask u to pick which commit to edit 

pick 308ccb9 supabase setup - commit amended
pick 6f9b71e simulate supabase tour
pick 576cc96 removed dockerhub credentials
pick adabb1e rebasing head back to faulting commit
edit d7a6bfb editing commits - git rebase usage steps # i pick this commit to edit edit & save & close the file

❯ git commit --amend 

❯ git rebase --continue

❯ git add readme.md

# succesful message will look like this

❯ git push origin main
```


🏕️ all of my rebasing steps in macpro

```sh
# <!--   ~/Desktop/auth-service   main ⇡1 *1 ───────────────────────────────────── -->
❯ git rebase -i HEAD~5  
# <!-- Stopped at d7a6bfb...  editing commits - git rebase usage steps
# You can amend the commit now, with

#   git commit --amend 

# Once you are satisfied with your changes, run

#   git rebase --continue -->

# <!--   ~/Desktop/auth-service  @d7a6bfbb *1 rebase-i 5/5 ──────────────────  17s -->
❯ git rebase --continue
# <!-- You must edit all merge conflicts and then
# mark them as resolved using git add -->

# <!--   ~/Desktop/auth-service  @d7a6bfbb *1 rebase-i 5/5 !1 ───────────────────── -->
❯ git add readme.md

# <!--   ~/Desktop/auth-service  @d7a6bfbb *1 rebase-i 5/5 +1 ───────────────────── -->
❯ git rebase --continue
# <!-- [detached HEAD b6ff7cf] editing commits - git rebase usage steps
#  Date: Wed Mar 12 07:25:39 2025 +0530
#  1 file changed, 22 insertions(+), 64 deletions(-)
# Successfully rebased and updated refs/heads/main. -->
---

❯ git push origin main
```

#  

*Playful stuff*

<details>
  <summary style="font-weight: bold; color: grey;">Click to expand!</summary>
  <p>Hidden content here.</p>
  <p>
  Simply Math Equations : With extensions like KaTeX or MathJax, can include LaTeX math equations
  </p>

- Inline math: <br>
$E = mc^2$

- Block math: <br>
$$
\begin{pmatrix}
a & b \\
c & d 
\end{pmatrix}
$$

</details>

---





