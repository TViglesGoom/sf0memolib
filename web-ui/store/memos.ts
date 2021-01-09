import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  loaded: false,
  loading: false,
  collection: [],
  search: {
    term: '',
    // results: [],
  },
  memoEditor: {
    couchDoc: null,
  },
  // notificationLog: [],
})

const URL = `${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}/memo/couch`

export const actions = {
  async reloadLib({ commit }) {
    try {
      const response = await axios.get(
        `${URL}/list`
      )
      commit(
        'setCollection',
        response.data.memos.map((obj) => obj.doc)
      )
    } catch (e) {
      console.error('error', e)
    }
  },
  async searchLib({ commit }, regex: string) {
    try {
      const response = await axios.get(
        `${URL}/search/${regex}`
      )
      // @techdebt: decide if there's benefit to having search results and full list of memos in store as
      // distinct entries and if both would be needed at the same time. Decided in favour of independent variables,
      // if nothing else then to at least display info like "matched X / total_X docs"

      // commit('setSearchResults', response['data']['searchResults'])
      commit('setCollection', response.data.searchResults)
    } catch (e) {
      console.error('error', e)
    }
  },
  async openMemoInEditor({ commit }, _id) {
    try {
      const response = await axios.get(
        `${URL}/${_id}`
      )
      commit('setMemoInEditor', response.data.memoDoc)
    } catch (error) {
      console.error({ error })
    }
  },
  async openNewInEditor({ commit, dispatch }) {
    try {
      const blankMemoDocument = {
        content: [],
        title: `memo ${new Date().toLocaleString()}`,
        taxonomy: [],
        source: 'mem0lib web-ui',
      }
      const response = await axios.post(
        URL,
        blankMemoDocument
      )
      commit('setMemoInEditor', response.data.memoDoc)
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
  // @todo: file uploads
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
      state.memoEditor.couchDoc.content = newContent
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
    if (!getters.editorLoadedWithDocument) return false

    const originalDocument = state.collection.filter(
      (memo) =>
        memo._id === state.memoEditor.couchDoc._id &&
        memo._rev === state.memoEditor.couchDoc._rev
    )[0] || { title: null, content: [], taxonomy: [] }
    const originalDocumentSerializedContent = JSON.stringify({
      title: originalDocument.title,
      content: originalDocument.content,
      taxonomy: originalDocument.taxonomy,
    })
    const currentDocumentSerializedContent = JSON.stringify({
      title: state.memoEditor.couchDoc.title,
      content: state.memoEditor.couchDoc.content,
      taxonomy: state.memoEditor.taxonomy,
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
}
