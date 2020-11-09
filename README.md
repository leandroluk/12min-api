# 12min challenge - Api

## Introduction

This project was developed to meet the challenge proposed by the company 12min on this [link](https://gist.github.com/chaosdude/6d0e92d11a391be7c7220011b726bceb).

## Dependencies

- [Node.js](https://nodejs.org/en/) ~ as base technology.
- [VS Code](https://code.visualstudio.com/download) ~ as default IDE.
- [Docker](https://docs.docker.com/get-docker/) ~ for build cluster.
- [FFmpeg](https://ffmpeg.org/download.html) ~ for live streaming.
- [MongoDB](https://www.mongodb.com/try/download/community) ~ for persist data.

> **Note**: depending on your OS you will need to look for "how to install and use" the above dependencies.

> **Another Note**: MongoDB is only necessary if you are going to run the local solution. you can also use a mongodb container and export the standard port (27017).

## Get started:

1. Clone this repository using the command "`git clone https://gitlab.com/leandroluk-12min/api.git`".
2. Access the repository through the terminal of your operating system and execute the command "`npm i`"
3. Run the "`npm start`" command to start api.

You can see the API documentation at this URL: http://localhost:3000/apidocs

## Features:

- Build with typescript for improve typing.
- Apidocs with swagger.
- Control of commit's structure based on the [convention](https://www.conventionalcommits.org/en/v1.0.0/).
- Pre-tasks to prevent faulty test's using [husky](https://typicode.github.io/husky/#/) + [lint-staged](https://github.com/okonet/lint-staged).
- All constants are mapped to environment variables, allowing them to be changed using containers. The constants are:
  - `APP_PORT`: application server port (default: '3000')
  - `APP_TEMP_DIR`: path to save uploaded audiobook's (default: '.tmp')
  - `APP_QUERY_LIMIT`: max size of results in queries (default: '50')
  - `APP_QUERY_LIST_SEPARATOR`: separator used for list of params in query (default quote ",")
  - `APP_STREAM_DIR`: directory to persist m3u8 files (default: 'streams')
  - `MONGO_URL`: uri to access mongodb (default: 'mongodb://localhost:27017/12min-challenge')
  - `MONGO_COLLECTIONS_USERS`: name of user's collection (default: 'users')
  - `MONGO_COLLECTIONS_AUDIOBOOKS`: name of audiobook's collection (default: 'audiobooks')
  - `MONGO_COLLECTIONS_AUDIOBOOK_STATUSES`: name of audiobook statuses collection (default: 'audiobookStatuses')
  - `CONVERTERS_FILE_EXTENSION_MATCHERS`: list of available extensions to convert (default: '.mp3,.wav')
  - `CRYPTOGRAPHY_SALT`: salt used for encrypt password (default: '12')
  - `AUTHENTICATION_SECRET`: secret used on jwt token (default: '12min-challenge')
  - `AUTHENTICATION_EXPIRES_IN`: default expires time used on jwt token (default: '21600' or 6 hours)
  - `ROUTES_ADD_USER`: route to add user (default: '/user')
  - `ROUTES_AUTHENTICATE_USER`: route to authenticate user (default: '/auth')
  - `ROUTES_ADD_AUDIOBOOK`: route to add audiobook (default: '/audiobook') 
  - `ROUTES_GET_AUDIOBOOK`: route to get audiobook (default: '/audiobook')
  - `ROUTES_REMOVE_AUDIOBOOK`: route to remove audiobook (default: '/audiobook')
  - `ROUTES_SEARCH_AUDIOBOOKS`: route to search audiobooks (default: '/audiobook')
  - `ROUTES_UPDATE_AUDIOBOOK`: route to update an audiobook (default '/audiobook')
  - `WORKERS_INTERVAL_TIME`: time in seconds to re-run work (default: '3')
- Pre defined postman collection with basic structure for test's. You need build automation in postman if need.

## Testing:

All of the commands below can be run using the suffix "`:verbose`" to make them work by showing the entire content of the tests

- **"`npm run test`"**: for run tests.
- **"`npm run test:watch`"**: to run the tests and wait for changes.
- **"`npm run test:unit`"**: to run only unit tests of the project (unit tests are identified by the extension "`*.spec.ts`"
- **"`npm run test:integration`"**: to run only integration tests of the project (integration tests are identified by the extension "`*.test.ts`"
- **"`npm run test:ci`"**: to run tests and collect code coverage.

## Deploy:

To deploy the project as a local cluster, you can use the command:

```sh
docker-compose up --build
```

To build the project as simple container, you can use the command:

```sh
docker build . -t https://gitlab.com/leandroluk-12min/api:develop
```

> **NOTE**: you can change the container's tag name as you want. 

To add an external server for mongodb, change the **MONGODB_URL** environment variable, like so:

```sh
docker build . \
  -t https://gitlab.com/leandroluk-12min/api:develop \
  -e MONGODB_URL="put the url of your external dong mongo server here"
```

**Considerations:**

- First of all excuse my english, i don't have fluency in the language and this is something i still have to work on `ᕦ(ò_óˇ)ᕤ`.
- The project was not thought of in such a way that it could persist many innumerable files locally. For that, it would be necessary to make changes to save them in a bucket like Amazon S3. (but it wasn't asked so I didn't) `¯\_(ツ)_/¯`.
- All integration tests are defined in sub-levels because when using jest-mongodb for some reason it crashes the tests causing slowness.