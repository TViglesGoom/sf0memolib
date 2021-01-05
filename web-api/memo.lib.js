const MEMOS_ROOT = '../memos/obsidian-vault'; // @todo named export, re-use in migration script and elsewhere
const IGNORE_GLOBS = ['.obsidian', 'attachments', '*.css'];
const COUCHDB_HOST = '0.0.0.0';
const COUCHDB_PORT = '5984';
const COUCHDB_USER = 'admin';
const COUCHDB_PWD = 'password';
const COUCHDB_MEMOS_COLLECTION = 'ported-memos';
const COUCHDB_DATABASE_URL = `http://${COUCHDB_USER}:${COUCHDB_PWD}@${COUCHDB_HOST}:${COUCHDB_PORT}/${COUCHDB_MEMOS_COLLECTION}`

import util from 'util';
import { exec } from 'child_process';
const async_exec = util.promisify(exec);

import { basename } from 'path';
import { default as axios } from 'axios';
import { readFileSync } from 'fs';
import { EOL } from 'os';

export const MemoLib = {
  // @techdebt: error handling
  listMemoFiles: async () => {
    const shListRecursive = `cd ${MEMOS_ROOT} && lsd -A --classic --long -R --total-size ` +
      `--color never --icon never --blocks name ${IGNORE_GLOBS.map(glob => ' -I "' + glob + '"').join('')}`;
    const result = await async_exec(shListRecursive);
    let dir = '.';
    return result['stdout'].split("\n").filter(item => item.length).reduce((aggregated, current) => {
      if (current.slice(-1) === ':') {
        dir = current.slice(0, current.length-1);
      } else {
        aggregated.push(dir + '/' + current);
      }
      return aggregated;
    }, []).join("\n");
  },
  // @techdebt: error handling
  fetchMemoFileAsJSON: async (path) => {
    const fileContent = readFileSync(`${MEMOS_ROOT}/${path}`).toString().split(EOL);
    return {
      title: basename(path).replace('__', '').replace('_', '').replace('.md', '').replace('-', ' '),
      source: path,
      content: fileContent.map((line) => {
        return line.replace('"', '\"')
      }),
      taxonomy: []
    };
  },
  // @techdebt: this includes entire docs collection contents,
  // which is fine for smaller collections but won't scale for shit,
  // so use design docs map() view function. @ref: https://guide.couchdb.org/editions/1/de/cookbook.html
  listMemoCouchDocs: async () => {
    try {
      const response = await axios.get(`${COUCHDB_DATABASE_URL}/_all_docs?include_docs=true`)
      return response['data']['rows'].length ? response['data']['rows'] : [];
    } catch (error) {
      console.error({error})
    }
  },
  searchMemoCouchDocs: async (regex) => {
    try {
      const response = await axios.post(`${COUCHDB_DATABASE_URL}/_find`, {
        "selector": {
          _id: { $gt: null },
          $or: [
            { content: { $elemMatch: { $regex: regex } } },
            { title: { $regex: regex } }
          ]
        }
      });
      return response['data']['docs'].length ? response['data']['docs'] : [];
    } catch (error) {
      console.error({error})
    }
  },
  createMemoCouchDoc: async (memoJSON) => {
    try {
      const response = await axios.post(COUCHDB_DATABASE_URL, memoJSON, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response['data'] ? response['data'] : {};
    } catch (error) {
      console.error({error});
    }
  },
  readMemoCouchDoc: async(doc_id) => {
    try {
      const response = await axios.get(`${COUCHDB_DATABASE_URL}/${doc_id}`);
      return response['data'] ? response['data'] : {};
    } catch (error) {
      console.error({error});
    }
  },
  updateMemoCouchDoc: async(memoJSON) => {
    try {
      // @techdebt assert memoJSON._rev exists
      const response = await axios.put(`${COUCHDB_DATABASE_URL}/${memoJSON['_id']}`, memoJSON, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response['data'] ? response['data'] : {};
    } catch (error) {
      console.error({error});
    }
  },
  deleteMemoCouchDoc: async(id, rev) => {
    try {
      const response = await axios.delete(`${COUCHDB_DATABASE_URL}/${id}?rev=${rev}`);
      return response['data'] ? response['data'] : {};
    } catch (error) {
      console.error({error});
    }
  },
};
