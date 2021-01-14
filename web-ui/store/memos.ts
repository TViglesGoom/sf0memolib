import axios from 'axios'
import Vue from 'vue'
import conf from '../../app.config.js'

export const state = () => ({
  loaded: false,
  loading: false,
  collection: [],
  search: {
    term: '',
    // results: [],
    advancedSearch: conf.advancedSearch,
  },
  sort: {
    fieldToSort: '',
    isSortingUp: false,
  },
  activeTaxonomies: [],
  memoEditor: {
    editorLoadedWithDocument: true,
    couchDoc: null,
  },
  confirmModal: {
    isAsking: false,
    message: '',
    confirmMethod: () => {},
    cancelMethod: () => {},
  },
  // notificationLog: [],
})

const URL = `${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}/memo/couch`

export const actions = {
  async reloadLib({ commit }) {
    try {
      const response = await axios.get(`${URL}/list`)
      const result = response.data.memos.map((obj) => obj.doc)
      result.forEach((memo) => {
        memo.created_at = new Date(memo.created_at)
        memo.updated_at = new Date(memo.updated_at)
      })
      commit('setCollection', result)
      commit('sortMemosBy')
    } catch (e) {
      console.error('error', e)
    }
  },
  async searchLib({ commit }, regex) {
    commit('setSearchTerm', regex)
    try {
      const response = await axios.get(`${URL}/search/${regex}`)
      response.data.searchResults.forEach((memo) => {
        memo.created_at = new Date(memo.created_at)
        memo.updated_at = new Date(memo.updated_at)
      })
      // @techdebt: decide if there's benefit to having search results and full list of memos in store as
      // distinct entries and if both would be needed at the same time. Decided in favour of independent variables,
      // if nothing else then to at least display info like "matched X / total_X docs"

      // commit('setSearchResults', response['data']['searchResults'])
      commit('setCollection', response.data.searchResults)
      commit('sortMemosBy')
    } catch (e) {
      console.error('error', e)
    }
  },
  async advancedSearchLib({ commit, state }) {
    try {
      const response = await axios.get(`${URL}/advancedSearch`, {
        params: { regex: state.search.term, filterBy: state.activeTaxonomies },
      })
      response.data.searchResults.forEach((memo) => {
        memo.created_at = new Date(memo.created_at)
        memo.updated_at = new Date(memo.updated_at)
      })
      commit('setCollection', response.data.searchResults)
      commit('sortMemosBy')
    } catch (e) {
      console.error('error', e)
    }
  },
  async openMemoInEditor({ commit }, _id) {
    try {
      const response = await axios.get(`${URL}/${_id}`)
      commit('setMemoInEditor', response.data.memoDoc)
      commit('setEditorLoadedWithDocument', false)
    } catch (error) {
      console.error({ error })
    }
  },
  async openNewInEditor({ commit, dispatch }) {
    try {
      const blankMemoDocument = {
        content: [''],
        title: `memo ${new Date().toLocaleString()}`,
        taxonomy: [],
        source: 'mem0lib web-ui',
      }
      const response = await axios.post(URL, blankMemoDocument)
      commit('setMemoInEditor', response.data.memoDoc)
      commit('setEditorLoadedWithDocument', false)
      await dispatch('reloadLib')
      dispatch(
        'displayNotificationSuccess',
        `created new memo: ${response.data.memoDoc._id}`
      )
    } catch (e) {
      console.error(e)
      dispatch('displayNotificationError', JSON.stringify(e, null, 2))
    }
  },
  updateEditedMemoContent({ commit }, latestValue) {
    commit('setMemoEditorContent', latestValue)
  },
  updateEditedMemoTitle({ commit }, latestValue) {
    commit('setMemoEditorTitle', latestValue)
  },
  updateEditedMemoTaxonomy({ commit }, latestValue) {
    commit('setMemoEditorTaxonomy', latestValue)
  },
  updateEditedMemoImg({ commit }, latestValue) {
    commit('setMemoEditorImg', latestValue)
  },
  async saveMemoInEditor({ commit, dispatch, state }) {
    if (state.memoEditor.couchDoc !== null) {
      const response = await axios.put(
        `${URL}/${state.memoEditor.couchDoc._id}`,
        state.memoEditor.couchDoc
      )
      commit('setMemoInEditor', response.data.memoDoc)
      await dispatch('reloadLib')
      dispatch('displayNotification', `memo ${response.data.memoDoc._id} saved`)
    }
  },
  closeMemoInEditor({ commit, dispatch }) {
    commit('setMemoInEditor', null)
    dispatch('displayNotification', `discarded changes to memo`)
  },
  async deleteMemo({ state, dispatch }) {
    if (state.memoEditor.couchDoc !== null) {
      const response = await axios.delete(
        `${URL}/${state.memoEditor.couchDoc._id}/${state.memoEditor.couchDoc._rev}`
      )
      dispatch('closeMemoInEditor') // close in editor
      await dispatch('reloadLib')
      // await dispatch('repeatSearch'); // @enhance reload search results, too
      dispatch(
        'displayNotificationSuccess',
        `memo ${response.data.memoDoc._id} deleted`
      )
    } else {
      dispatch(
        'displayNotificationError',
        'should never be here - attempting to delete a memo when none open in editor'
      )
    }
  },
  displayNotification({}, message: string) {
    Vue.prototype.$notify(
      { group: 'appNotifications', type: 'info', text: message || 'blah' },
      5 * 1000
    )
  },
  displayNotificationSuccess({}, message: string) {
    Vue.prototype.$notify(
      {
        group: 'appNotifications',
        type: 'success',
        text: message || 'success',
      },
      5 * 1000
    )
  },
  displayNotificationError({}, message: string) {
    Vue.prototype.$notify(
      {
        group: 'appNotifications',
        type: 'error',
        text: message || 'unknown error',
      },
      5 * 1000
    )
  },
  toggleTaxonomy({ commit }, tag: string) {
    commit('toggleActiveTaxonomies', tag)
  },
  advancedSearch({ commit }, value: boolean) {
    commit('setAdvancedSearch', value)
  },
  setAdvancedSearch({ commit }, value: boolean) {
    commit('setAdvancedSearch', value)
  },
  setConfirmModalState({ commit }, newState = {}) {
    commit('setConfirmModalState', newState)
  },
  sortMemosBy({ commit }) {
    commit('sortMemosBy')
  },
  setSort({ commit }, payload: { fieldToSort: string; isSortingUp: boolean }) {
    commit('setSort', payload)
  },
}

export const mutations = {
  setCollection(state, newCollection) {
    state.collection = newCollection
  },
  setSearchTerm(state, searchTerm) {
    state.search.term = searchTerm
  },
  // setSearchResults(state, searchResults) {
  //  state.search.results = searchResults;
  // },
  setMemoInEditor(state, memoObject) {
    state.memoEditor.couchDoc = memoObject
  },
  setMemoEditorContent(state, newContent) {
    if (!state.memoEditor.couchDoc.content) {
      console.error(
        'init memoEditor structures, state.memoEditor[couchDoc]: ',
        state.memoEditor.couchDoc
      )
    } else {
      // const content = state.memoEditor.couchDoc.content
      Vue.set(state.memoEditor.couchDoc, 'content', newContent)
    }
  },
  setMemoEditorTitle(state, newTitle: string) {
    if (!state.memoEditor.couchDoc.content) {
      console.error(
        'init memoEditor structures, state.memoEditor[couchDoc]: ',
        state.memoEditor.couchDoc
      )
    } else {
      state.memoEditor.couchDoc.title = newTitle
    }
  },
  setMemoEditorTaxonomy(state, newTaxonomy: string[]) {
    state.memoEditor.couchDoc.taxonomy = newTaxonomy
  },
  setMemoEditorImg(state, newImg: string) {
    Vue.set(state.memoEditor.couchDoc, 'img', newImg)
  },
  toggleActiveTaxonomies(state, taxonomy) {
    const index = state.activeTaxonomies.indexOf(taxonomy)
    if (index === -1) {
      state.activeTaxonomies.push(taxonomy)
    } else {
      state.activeTaxonomies.splice(index, 1)
    }
  },
  setAdvancedSearch(state, value: boolean) {
    state.search.advancedSearch = value
  },
  setEditorLoadedWithDocument(state, value: boolean) {
    state.memoEditor.editorLoadedWithDocument = value
  },
  setConfirmModalState(state, newState) {
    const defaultState = {
      isAsking: false,
      message: '',
      confirmMethod: () => {},
      cancelMethod: () => {},
    }
    state.confirmModal = {
      ...defaultState,
      ...newState,
    }
  },
  sortMemosBy(state) {
    const { fieldToSort, isSortingUp } = state.sort
    if (!fieldToSort) return
    state.collection = [...state.collection].sort(
      (a, b) => (isSortingUp ? 1 : -1) * (a[fieldToSort] - b[fieldToSort])
    )
  },
  setSort(state, payload: {fieldToSort: string, isSortingUp: boolean}) {
    state.sort = payload
  },
}

export const getters = {
  memosList(state) {
    return state.collection.map((item) => {
      return Object.assign({}, item, {
        content: item.content[0],
        stats: {
          'wc -l': item.content?.length,
          tags: item.taxonomy?.length ? `[${item.taxonomy.join(', ')}]` : '0',
          'tags #': item.taxonomy?.length,
        },
      })
    })
  },
  memosListLength(state) {
    return state.collection.length || 0
  },
  // memosSearchResultsLength() {
  //  return state['search'].results.length || 0;
  // },
  memoDocumentOpenInEditor(state) {
    return state.memoEditor.couchDoc !== null
  },
  // @techdebt:
  // Replace change detection approach to instead record in store change events from AceEditor,
  // and extend `title` and `taxonomy` input widgets to also fire change events.
  editorDocumentChanged(state, getters) {
    if (getters.editorLoadedWithDocument) return false
    const originalDocument = state.collection.filter(
      (memo) =>
        memo._id === state.memoEditor.couchDoc._id &&
        memo._rev === state.memoEditor.couchDoc._rev
    )[0] || { title: null, content: [], taxonomy: [] }
    const originalDocumentSerializedContent = JSON.stringify({
      title: originalDocument.title,
      content: originalDocument.content,
      taxonomy: originalDocument.taxonomy,
      img: originalDocument.img,
    })
    const currentDocumentSerializedContent = JSON.stringify({
      title: state.memoEditor.couchDoc.title,
      content: state.memoEditor.couchDoc.content,
      taxonomy: state.memoEditor.couchDoc.taxonomy,
      img: state.memoEditor.couchDoc.img,
    })
    // Are there changes to content, title or taxonomy?
    return (
      currentDocumentSerializedContent !== originalDocumentSerializedContent
    )
  },
  editorDocumentContent(state) {
    return state.memoEditor.couchDoc.content.join('\n') || ''
  },
  editorDocumentTitle(state) {
    return state.memoEditor.couchDoc.title || ''
  },
  editorDocumentTaxonomy(state) {
    return state.memoEditor.couchDoc.taxonomy || []
  },
  editorDocumentImg(state) {
    return state.memoEditor.couchDoc.img || ''
  },
  taxonomyList(state) {
    const tags = new Set()
    state.collection.forEach((memo) =>
      memo.taxonomy.forEach((tag) => tags.add(tag))
    )
    return Array.from(tags).sort()
  },
  activeTaxonomyList(state) {
    return state.activeTaxonomies
  },
  isAdvancedSearch(state) {
    return state.search.advancedSearch
  },
  editorLoadedWithDocument(state) {
    return state.memoEditor.editorLoadedWithDocument
  },
  confirmModalState(state) {
    return state.confirmModal
  },
}
