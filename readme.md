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

- before pushing to git doing something with code like linting or formating
- only pushing high quality code with fully linted or formated code
- git formatter or linter for more safety

> (husky pre-commit) 
- install from docs
- npx husky init