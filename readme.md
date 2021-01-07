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

- Vue.js (@todo: add URLs to homepage and sources)
- Nuxt.js  (@todo: add URLs to homepage and sources)
- nuxt/content module (@todo: add URLs to homepage and sources)
- Ace Editor  (@todo: add URLs to homepage and sources)
- CouchDB  (@todo: add URLs to homepage and sources)
- PouchDB (pending)

## getting started

### dependencies

- node.js 14+
- docker `20.10.1`, build `831ebea` (@todo **discontinue**)
- `tmux` (optional convenience for development and server-administration tasks)

> developed and tested on Linux (deb)

### starting for the first time

See `./mem0lib --help` for app init, start, stop.

### self-hosting

@todo @document

### auto-generated Web API documentation

Is available under: @document, for details see `./web-api/apidoc.json`

## dev scope:

App configuration
- [ ] add `mem0lib-config.default.conf.js` example configuration (with comments)
  - [ ] general application configuration settings
  - [ ] feature-flags
  - [ ] feature-specific configuration

ENV VARS
- [ ] consolidate environment variables from API, UI and CouchDB sub-directories into
  a single `.env.example` at repo root
  - [ ] document each env variable in `./readme.md`

README
- [ ] consolidate all useful info from `web-api/readme.md` and `web-ui/readme.md` into
  a single file (`./readme.md`) at project base dir (this file)

Project-specific scripts using `tmux`
- [ ] add development and production convenience commands using `tmux`, derive tmux configuration files accordingly

Taxonomy
- [ ] implement `taxonomy.lib.js` and Web API endpoints (merging core tags listed in `@nuxt/content` with dynamic ones served CouchDB view)
- [ ] extend `vue-tag-input` input in Memo Editor UI with additional settings and styling
- [ ] implement dynamic taxonomy via CouchDB design views

UI Appearance
- [ ] re-work UI prototypes into permanent stylesheets
- [ ] fix appearance and screen position of UI notifications
- [ ] re-work UX and appearance of list view items

Functional
- [ ] CouchDB (and inherently Web API memo lists to return memos stripped of `content` itself)
- [ ] address techdebt implementation of memo editor change detection in Web UI
- [ ] separate storage of memo list and search results in vuex state 

Memo Editor Buttons
- [ ] prevent accidental loss of unsaved changes in editor when discarding

Memo Editor
- [ ] explore and expose additional Ace Editor capabilities
  - [ ] configuration
  - [ ] themes
  - [ ] plugins, syntax highlighter and file format options

Memo List
- [ ] implement sorting memos in list by metadata: `createdAt`, `updatedAt`, memo size (lines, content-length), has attachment, etc

### further development

- [ ] implement keyboard shortcuts in Web UI (for search and memo editor actions)
- [ ] develop search box into a hybrid command/search box (akin `Ctrl+P` in Codium)
- [ ] advanced search options
- [ ] memo list: *group by* and *filter by* taxonomy tags
- [ ] to be continued...
