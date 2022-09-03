import { createEditor } from './editor'
const tsWorkerUrl =
  'https://gist.githubusercontent.com/lsdsjy/93be41d6d2dd0927a745895c375eb6f8/raw/f0c5e22b622726f6b14d80dd1f0f326b7a908e28/ts.worker.js'
const editorWorkerUrl =
  'https://gist.githubusercontent.com/lsdsjy/c8c49fb748b1532b1462487b55b4a244/raw/44c75a1d009e1a6f5d0473be111a832cb078a4bb/editor.worker.js'

const typeDef= 
    ['type Config = Array<{',
    '  ok?: boolean',
    '  name: string',
    '}>',
    'const config: Config = ',
    ].join('\n');

const editor = createEditor(document.getElementById('container')!, typeDef,{
  ts: tsWorkerUrl,
  editor:editorWorkerUrl
});

editor.onChange(console.log)
