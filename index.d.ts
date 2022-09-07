import * as monaco from 'monaco-editor';

export declare function createEditor(container: HTMLElement, template: string, workers: {
	ts: string | Worker;
	editor: string | Worker;
}): {
	monacoEditorInstance: monaco.editor.IStandaloneCodeEditor;
	dispose: () => void;
	onChange: (fn: (value: string) => void) => void;
	validate: () => Promise<monaco.languages.typescript.Diagnostic[] | undefined>;
	setValue: (val: string) => void;
	getValue: () => string;
};
