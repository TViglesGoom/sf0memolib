import express from 'express';
import errorHandler from 'errorhandler';
import cors from 'cors';

// @todo snippet (hors): require() is esm
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

const app = express(); 

app.use(cors());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.json({ limit: '12mb' }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  return next();
});

// @todo global .env via pm2, fallback to local .env
// @todo merge with environment constants in `memo.lib.js`
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const { API_PORT, WEBUI_PORT, API_HOST, API_VERSION,
  COUCHDB_HOST, COUCHDB_PORT, COUCHDB_ADMIN_PREFIX } = process.env;

import conf from "../app.config.js"
const { defaultCollection } = conf

// @techdebt configure express options:
//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
//app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
//app.use(express.static(__dirname + '/public'));
//app.use('/components', express.static(__dirname + '/components'));
//app.use('/js', express.static(__dirname + '/js'));
//app.use('/icons', express.static(__dirname + '/icons'));
//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile); @todo `npm uninstall ejs --save`

// @todo expose static content
//
// Option 1: serve static content from `web-ui`, using nuxt and vue.js
// built-in features to accomplish it
//
// ~~Option 2: using express middleware~~
// Better (for scaling and security) to keep HTML and static stuff separate from data-driven APIs
// @ref: https://expressjs.com/en/starter/static-files.html
//app.use('/static', express.static(path.join(__dirname, 'public'), {
//  // for options see @ref: https://expressjs.com/en/4x/api.html#express.static
//}))
//
// Option 3: use pm2 to serve static files @ref: https://pm2.keymetrics.io/docs/usage/expose/
// `pm2 serve --basic-auth-username <username> --basic-auth-password <password>`

import { MemoLib } from './memo.lib.js';

/**
 * @api {get} http://0.0.0.0:3001 Return API navigation information. Temporary landing page.
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Dict of URLs pointing to relevant UIs and APIs
 */
app.get('/', (req, res) => {
  res.json({
    status: "ok",
    data: {
      "sf0web-api": `${API_HOST}:${API_PORT}/${API_VERSION}`,
      "sf0web-ui": `${API_HOST}:${WEBUI_PORT}`,
      "sf0couch-api": `${COUCHDB_HOST}:${COUCHDB_PORT}/${defaultCollection}/`,
      "sf0couch-web-ui": `${COUCHDB_HOST}:${COUCHDB_PORT}/${COUCHDB_ADMIN_PREFIX}/`,
    }
  });
})

/**
 * @api {get} http://0.0.0.0:3001/v0.0.1 Hosts generated API documentation
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {HTML} Web API autodoc, generated by `npm install --save-dev apidoc @types/apidoc`
 */
app.get(`/${API_VERSION}`, (req, res) => {
  // @enhance http serve `./doc`
  res.json({
    status: "ok",
    data: "API autodoc static can be found under `/web-api/doc` directory (`__dirname/doc/`)"
  });
})

/**
 * @api {get} memo/couch/list List memos in CouchDB collection
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} CouchDB collection listing (no pagination, full contents).
 * Invokes CouchDB `/_all_docs?include_docs=true` HTTP endpoint
 */
app.get(`/${API_VERSION}/memo/couch/list`, async (req, res) => {
  const memos = await MemoLib.listMemoCouchDocs();
  res.json({
    status: "ok",
    memos
  });
});

/**
 * @api {get} memo/couch/search/<regexp> Search memos in CouchDB collection by keyword
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Collection of matched CouchDB documents and info about original search.
 * Invokes CouchDB `/_find` with query:
 * `"selector": { _id: { $gt: null }, $or: [{ content: { $elemMatch: { $regex: regex } } }, { title: { $regex: regex } }]`
 */
app.get(`/${API_VERSION}/memo/couch/search/:regex`, async (req, res) => {
  const searchResults = await MemoLib.searchMemoCouchDocs(req.params.regex);
  res.json({
    status: "ok",
    searchTerm: req.params['regex'],
    searchResults,
  });
});

/**
 * @api {get} memo/couch/search/<regexp> Search memos in CouchDB collection by keyword
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Collection of matched CouchDB documents and info about original search.
 * Invokes CouchDB `/_find` with query:
 * `"selector": { _id: { $gt: null }, $or: [{ content: { $elemMatch: { $regex: regex } } }, { title: { $regex: regex } }]`
 */
app.get(`/${API_VERSION}/memo/couch/advancedSearch`, async (req, res) => {
  const regex = req.query.regex.split('').join('.*')
  const filterBy = req.query.filterBy
  let searchResults = await MemoLib.searchMemoCouchDocs(regex)
  if (filterBy) {
    searchResults = searchResults.filter(memo => filterBy.every(tag => memo.taxonomy.indexOf(tag) !== -1))
  }
  res.json({
    status: "ok",
    searchTerm: req.params['regex'],
    searchResults,
  });
});


/**
 * @api {get} memo/couch/<id> Get memo document by ID
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Couch response object
 */
app.get(`/${API_VERSION}/memo/couch/:id`, async (req, res) => {
  const couchResponse = await MemoLib.readMemoCouchDoc(req.params.id);
  res.json({
    status: "ok",
    memoDoc: couchResponse,
  });
});

/**
 * @api {post} memo/couch Create new CouchDB document
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Couch response object
 */
app.post(`/${API_VERSION}/memo/couch`, async (req, res) => {
  const couchResponse = await MemoLib.createMemoCouchDoc(req.body);
  if (couchResponse['ok'] === true) {
    // fetch and return full document
    const newlyAddedDoc = await MemoLib.readMemoCouchDoc(couchResponse['id']);
    res.json({
      status: "ok",
      memoDoc: newlyAddedDoc,
    });
  } else {
    res.json({
      status: "failure",
      details: couchResponse,
    });
  }
})

/**
 * @api {put} memo/couch/<id> Update existing CouchDB document
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Couch response object
 */
app.put(`/${API_VERSION}/memo/couch/:id`, async (req, res) => {
  const couchResponse = await MemoLib.updateMemoCouchDoc(req.body);
  if (couchResponse['ok'] === true) {
    // fetch and return full document
    const updatedDoc = await MemoLib.readMemoCouchDoc(couchResponse['id']);
    res.json({
      status: "ok",
      memoDoc: updatedDoc,
    });
  } else {
    res.json({
      status: "failure",
      details: couchResponse,
    });
  }
})

/**
 * @api {delete} memo/couch/<id>/<rev> Delete a CouchDB memo document
 * @apiName web-api
 * @apiVersion 0.0.1
 * @apiGroup mem0lib
 *
 * @apiSuccess {JSON} Couch response object
 */
app.delete(`/${API_VERSION}/memo/couch/:id/:rev`, async (req, res) => {
  const couchResponse = await MemoLib.deleteMemoCouchDoc(req.params.id, req.params.rev);
  if (couchResponse['ok'] === true) {
    res.json({
      status: "ok",
      memoDoc: couchResponse,
    });
  } else {
    res.json({
      status: "failure",
      details: couchResponse,
    });
  }
})

app.listen(API_PORT, () => {
  console.log(`sf0web-api listening at ${API_HOST}:${API_PORT}/${API_VERSION}`)
})
