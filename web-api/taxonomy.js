
// 2. map obsidian tags to new taxonomy versions
const obsidianTags2NewTaxonomyMap = {
  '#collectable-tech': 'softw',
  '#collectable-model': 'model',
  '#collectable-datalib': 'data-source',
  '#collectable-lang': 'data-source',
  '#investigate': 'explore',
  '#outsourceland': 'srcland',
  '#infra': 'softw',
  '#datagrab': 'scrape',
  '#dev': 'develop',
  '#discovery': 'explore',
  '#application': 'app',
  '#project': 'project',
  '#labwork': 'labwork',
  '#research': 'research',
  '#security': 'field:security',
  '#devops': 'field:devops',
  '#cultured-gitops': 'project:cultured-gitops',
  '#person-influential': 'person',
  '#telegram': 'imsg:telegram',
};

// 3. load boostnote tags and folders, map to new taxonomy versions

import bn from '../../datahold/boostnote-sync/index.js';
//console.log(bn);

const boostnoteTags2NewTaxonomyMap = {
  'itshnick': 'person:developer',
  'rabbit': 'person:elixir',
  'recruiter': 'person:recruiter',
  'company': 'organization',
  'datasource': 'data-source'
}

// 4. assign tags and labels to existing memos, update in CouchDB (new collection),
//    extend memo schema with `createdAt` and `updatedAt`
// 5. build a data-structure and some access methods encoding current taxonomy in a
//    flat js(ts) module

export const computeMemoTaxonomy = function(memoCouchPayload) {
  const newMemoCouchPayload = Object.assign({}, memoCouchPayload);
  newMemoCouchPayload['taxonomy'] = [];
  // is boostnote memo?
  if (memoCouchPayload.source.includes('./boostnote')) {
    // record example:
    //{
    //  createdAt: '2019-12-16T22:08:20.487Z',
    //  updatedAt: '2019-12-17T23:17:09.066Z',
    //  folder: 'datamarsh',
    //  title: 'Yurii Bodarev',
    //  tags: [Array],
    //  isStarred: false,
    //  isTrashed: false
    //}
    const boostnoteMetadata = bn.boostnoteDB.filter(record => {
      //console.log(record.path, record.title, memoCouchPayload.source, memoCouchPayload.title)
      return record.title
        .replace('__', '').replace('_', '').replace('-', '')
        .replace(' ', '') === memoCouchPayload.title
    });
    if (boostnoteMetadata.length === 1) {
      if (boostnoteMetadata[0].isTrashed) {
        newMemoCouchPayload.taxonomy.push('trashed')
      }
      if (boostnoteMetadata[0].isStarred) {
        newMemoCouchPayload.taxonomy.push('starred')
      }
      newMemoCouchPayload['createdAt'] = boostnoteMetadata[0].createdAt;
      newMemoCouchPayload['updatedAt'] = boostnoteMetadata[0].updatedAt;

      //console.log('found boostnote tags: ', boostnoteMetadata[0].tags);
      newMemoCouchPayload.taxonomy = newMemoCouchPayload.taxonomy.concat(
        boostnoteMetadata[0].tags.map(tag => boostnoteTags2NewTaxonomyMap[tag])
      );
      newMemoCouchPayload.taxonomy.push(`dir:${boostnoteMetadata[0].folder}`);
    } else {
      console.error('no db record found for boostnote: ', memoCouchPayload.title)
      //console.table(bn.boostnoteDB.map(item => item.title));
    }
    if (memoCouchPayload.source.includes('./boostnote/rabbits')) {
      newMemoCouchPayload.taxonomy = newMemoCouchPayload.taxonomy.concat(['srcland', 'person:elixir', 'CRM']);
    }
  }

  // else obsidian vault
  else {
    if (memoCouchPayload.source.includes('infra.c0nf')) {
      newMemoCouchPayload.taxonomy.push('softw')
    }
    const foundTags = Object.keys(obsidianTags2NewTaxonomyMap).filter(tag => {
      return memoCouchPayload.content.join('\n').includes(tag)
    });
    //console.log(`found obsidian tags: ${foundTags}`);
    newMemoCouchPayload.taxonomy = newMemoCouchPayload.taxonomy.concat(foundTags.map(tag => obsidianTags2NewTaxonomyMap[tag]));
    // @techdebt remove tags from content
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  newMemoCouchPayload.taxonomy = newMemoCouchPayload.taxonomy.filter(onlyUnique);
  //console.log(newMemoCouchPayload.taxonomy);
  //if (newMemoCouchPayload.taxonomy.length === 0) {
  //  console.log(`no tags assigned to: ${newMemoCouchPayload.title}`);
  //}
  return newMemoCouchPayload;
}

