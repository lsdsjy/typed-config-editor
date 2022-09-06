import { createWorker } from './util'
import * as monaco from 'monaco-editor'
import { constrainedEditor } from 'constrained-editor-plugin'

type Listener = (content: Record<string, string>) => void

export function createEditor(
  container: HTMLElement,
  template: string,
  workers: { ts: string | Worker; editor: string | Worker }
) {
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    noLib: true,
  })

  self.MonacoEnvironment = {
    async getWorker(_, label) {
      if (label === 'typescript') {
        return createWorker(workers.ts)
      }
      return createWorker(workers.editor)
    },
  }

  const style = document.createElement('style')
  style.innerHTML = `.transparent{
    opacity: 0.5;
}`
  document.head.appendChild(style)

  const lines = template.split('\n').concat(['\n'])
  const editorInstance = monaco.editor.create(container, {
    model: monaco.editor.createModel(
      template + '\n',
      'typescript',
      monaco.Uri.parse('config.ts')
    ),
    minimap: { enabled: false },
  })
  editorInstance.createDecorationsCollection([
    {
      range: new monaco.Range(1, 1, lines.length - 1, 1),
      options: {
        isWholeLine: true,
        inlineClassName: 'transparent',
      },
    },
  ])

  const model = editorInstance.getModel()
  const constrainedInstance = constrainedEditor(monaco)
  constrainedInstance.initializeIn(editorInstance)
  constrainedInstance.addRestrictionsTo(model, [
    {
      range: [lines.length, 1, lines.length, 1],
      allowMultiline: true,
      label: 'config',
    },
  ])

  let listener: Listener = () => {}
  const value = {}

  ;(model as any)?.onDidChangeContentInEditableRange(function (
    _: unknown,
    allValues: Record<string, string>
  ) {
    Object.assign(value, allValues)
    listener(allValues)
  })

  async function validate() {
    if (!model) return
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker()
    const worker = await getWorker(model.uri)
    const [sem, syn] = await Promise.all([
      worker.getSemanticDiagnostics(model.uri.toString()),
      worker.getSyntacticDiagnostics(model.uri.toString()),
    ])
    return sem.concat(syn)
  }

  editorInstance.setPosition({ lineNumber: template.length, column: 1 })
  editorInstance.focus()

  return {
    monacoEditorInstance: editorInstance,
    dispose: () => {
      editorInstance.dispose()
      style.remove()
    },
    onChange: (fn: Listener) => {
      listener = fn
    },
    validate,
    value,
  }
}
