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