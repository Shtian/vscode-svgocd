import { window, Range } from 'vscode';

export const readCurrentFileContent = (): string | null => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return null;
  }

  const doc = editor.document;
  if (!doc.fileName.endsWith('.svg')) {
    return null;
  }

  return doc.getText();
};

export const readCurrentSelection = (): string | null => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return null;
  }

  return editor.document.getText(editor.selection);
};

export const replaceDocument = (data: string): void => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return;
  }

  const documentRange = new Range(0, 0, editor.document.lineCount, 0);
  const validatedRange = editor.document.validateRange(documentRange);

  editor.edit(editBuilder => {
    editBuilder.replace(validatedRange, data);
  });
};

export const replaceSelection = (data: string): void => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return;
  }

  const { start, end } = editor.selection;
  const selectionRange = new Range(start, end);
  const validatedRange = editor.document.validateRange(selectionRange);

  editor.edit(editBuilder => {
    editBuilder.replace(validatedRange, data);
  });
};
