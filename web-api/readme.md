# sf0web-api

See [../readme.md](../readme.md) for general project details.

```bash
# to run standalone - from THIS dir do:
npm install
npm run dev

# to build API autodoc - from THIS dir do:
npm run doc:build

# to run as part of multi-process operation using pm2 - from PARENT dir do:
npm install
npx pm2 start pm2.sf0port.yml
```

## API

- [x] I. GOTO: `sf0/design/taxonomy.md` - start with designing new taxonomy
  - [ ] representation of taxonomy in code (using YAML model via @nuxt/content module)
  - [x] mapping old tagsets of Obsidian and Boostnote to the newly derived one
- [x] extract metadata from `obsidian` and `boostnote`:
  - [x] memos graph, tags, dates
  - [x] Boostnote: `cd ~/dev/jcousteau/datahold/boostnote-sync && node index.js`
- [ ] use couchDB map-reduce for feature extraction:
  - [ ] URLs,
  - [ ] md `code snippets` and code blocks,
  - [ ] metasyntax markers,
  - [ ] lists and todo boxes
- [ ] derive schema for new memos (Front Matter, created/updated, taxonomy, etc)

- [ ] out of scope @enhancement: attempt to run content through Markdown linter, build out a Markdown lint automation that can be applied programmatically (i.e. pre-save hook)
  - [ ] in sync with `cultured-gitops`
