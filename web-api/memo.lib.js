const MEMOS_ROOT = '../memos/obsidian-vault'; // @todo named export, re-use in migration script and elsewhere
const IGNORE_GLOBS = ['.obsidian', 'attachments', '*.css'];

import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import conf from '../app.config.js'
const { defaultCollection } = conf
const { COUCHDB_HOST, COUCHDB_PORT } = process.env
const COUCHDB_DATABASE_URL = `${COUCHDB_HOST}:${COUCHDB_PORT}/${defaultCollection}`

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
        selector: {
          _id: { $gt: null },
          $or: [
            { content: { $elemMatch: { $regex: regex } } },
            { title: { $regex: regex } }
          ]
        },
        fields: ['_id', 'title', 'taxonomy', 'created_at', 'updated_at'],
      });
      return response['data']['docs'].length ? response['data']['docs'] : [];
    } catch (error) {
      console.error({error})
    }
  },
  createMemoCouchDoc: async (memoObject) => {
    try {
      const date = new Date().toISOString()
      const response = await axios.post(COUCHDB_DATABASE_URL,
          {
            ...memoObject,
            created_at: date,
            updated_at: date,
          },
          {
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
  updateMemoCouchDoc: async(memoObject) => {
    try {
      // @techdebt assert memoJSON._rev exists
      const response = await axios.put(`${COUCHDB_DATABASE_URL}/${memoObject['_id']}`,
          {
            ...memoObject,
            updated_at: new Date().toISOString(),
          },
          {
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
