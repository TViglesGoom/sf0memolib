require('dotenv').config({ path: '../../.env'})
const URL = `${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}`

define({
  "name": "mem0lib /web-api documentation",
  "version": process.env.API_VERSION,
  "description": "Documentation for the mem0lib /web-api",
  "title": "Custom apiDoc browser title",
  "url": `${URL}/doc",
  "sampleUrl": URL,
  "template": {
    "withCompare": true,
    "withGenerator": true,
    "aloneDisplay": false
  },
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2020-12-21T00:37:35.048Z",
    "url": "https://apidocjs.com",
    "version": "0.25.0"
  }
});
