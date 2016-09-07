# Node.js RESTful API

A RESTful API built with Node.js, Babel and MongoDB

This is an improvement over the previous [RESTful API](https://github.com/mpayetta/node-es6-rest-api) I had. The main change is the use of NPM tasks instead of Gulp to compile, run, test, lint, etc. I found that babel and gulp together are extremely slow for development, any file changes triggered the gulp build which took around 15 seconds (even when managing dependencies with npm3). Now with the use of `babel-watch` builds are much faster (1 second or 2).

## Installation and running

1. Clone the repository
2. Install dependencies `npm install`
3. Start MongoDB server: the project comes with a script in `scripts/mongostart.sh` that will pull a MongoDB image from
Docker and start it listening in port 27018. It can also be any other MongoDB server running anywhere. Just make sure you
change the connection details in `config/env/local.js`.
4. Run the API server with `NODE_ENV=local npm start`
5. Try the API calling the `http://localhost:3000/api/health-check` endpoint.

### As a Docker Container

1. Clone the repository
2. Run `docker-compose up --build` 
3. Once the containers is built and the images are running you can reach the API on localhost:3000

### For production

1. Run `npm run compile`. This will generate the `dist` directory with all the code transpiled from ES6 to ES5. 
2. Run the transpiled `dist/index.js` with `node` or any other process manager like `pm2`.

## Unit Testing and Code Coverage

All tests are in `server/tests` and can be run with `npm test`.

To run the tests and generate coverage report with `istanbul` run `npm run coverage`.


## API Docs

To generate the API documentation simply run `npm run docs`. This will create the `docs` directory with all the documentation
generated through the [apidoc](http://apidocjs.com/) module.

## Linting

There's an npm task for linting as well, this is useful to check before pushing any code. To run the linting task
execute `npm run lint`. ESLint configuration can be changed in `.eslintrc`.



