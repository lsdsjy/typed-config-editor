import { createEditor } from './editor'
import editorWorkerFactory from 'https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorkerFactory from 'https://esm.sh/monaco-editor@0.34.1/esm/vs/language/typescript/ts.worker?worker'

const typeDef= 
    ['type Config = Array<{',
    '  ok?: boolean',
    '  name: string',
    '}>',
    'const config: Config = ',
    ].join('\n');

const editor = createEditor(document.getElementById('container')!, typeDef,{
  ts: tsWorkerFactory(),
  editor: editorWorkerFactory()
});

editor.onChange(async (content) => {
  console.log(content)
  document.getElementById('validity')!.innerHTML = (await editor.validate())?.length ? 'Error' : 'OK'
})

editor.setValue('123')
