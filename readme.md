# sf0memolib

Web application for both structured and unstructured text content, originally aimed at (but not limited to) Markdown notes.

Core features:


- [x] server-side text search (CouchDB)
- [x] integrated `@nuxt/content` allows for low-friction web-authorship of both text (Markdown) and structured (JSON / YAML)
- [ ] upload of file attachments (using CouchDB)
- [ ] client-side text search (PouchDB)
- [ ] rudimentary tag-based taxonomy (@todo)
- [ ] any data queries or operations supported by CouchDB design views

App is made possible by the collective genius of contributors from numerous FLOSS projects, to name a few:

- [Vue.js](https://vuejs.org/)
- [Nuxt.js](https://nuxtjs.org/)
- [nuxt/content module](https://content.nuxtjs.org/)
- [Ace Editor](https://ace.c9.io/)
- [CouchDB](https://couchdb.apache.org/)
- PouchDB (pending)

## getting started

### dependencies

- node.js 14+
- docker `20.10.1`, build `831ebea` (@todo **discontinue**)
- `tmux` (optional convenience for development and server-administration tasks)

> developed and tested on Linux (deb)

### starting for the first time

#### web-ui only

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

#### web-api only

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```

#### run coach-db docker container

```bash
# build a container for the first time
$ ./mem0lib db:init

# up docker container
$ ./mem0lib db:up

# create table for the first time
# put your configuration into <>
$ curl -X PUT <HOST>:<PORT>/<TABLE_NAME>
```

#### run everything in one tmux session

```bash
# initialize container and create table as in the above example
$ ./mem0lib db:init
$ ./mem0lib db:up
$ curl -X PUT <HOST>:<PORT>/<TABLE_NAME>

# use the script to run tmux session

# for development purposes
$ ./mem0lib dev

# for production
$ ./mem0lib prod
```

See `./mem0lib --help` for app init, start, stop.

### env variables

As an example of your .env file, you can use [.env.example](.env.example) file.

#### Environment variables description
- `API_HOST` server address. Should match the pattern "<CONNECTION_METHOD>://<SERVER_IP_ADDRESS>"
- `API_PORT` indicates the port that the server is listening for the requests 
- `API_VERSION` version of server api
- `COUCHDB_HOST` ip address of server which runs couchdb
- `COUCHDB_PORT` port for the couchdb requests to the `COUCHDB_HOST`
- `COUCHDB_MEMOS_COLLECTION` table name to access in couchdb
- `COUCHDB_ADMIN_PREFIX` path to couchdb admin (ui) page
- `COUCHDB_USER` couchdb user for authorization
- `COUCHDB_PWD` couchdb password for `COUCHDB_USER`
- `WEBUI_PORT` port which is used to access ui of the application (currently on localhost)


### self-hosting

@todo @document

### auto-generated Web API documentation

Is available under: @document, for details see `./web-api/apidoc.json`
