declare module 'constrained-editor-plugin' {
  export const constrainedEditor: any
}

// FIXME: this won't work
declare module 'monaco-editor/esm/vs/editor.api' {
  export namespace editor {
    export interface ITextModel {
      onDidChangeContentInEditableRange(
        fn: (_: unknown, allValues: Record<string, string>) => void
      ): void
    }
  }
}
