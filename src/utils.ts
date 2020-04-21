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

export const replaceDocument = (data: string): Thenable<boolean> => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return Promise.reject();
  }

  const documentRange = new Range(0, 0, editor.document.lineCount, 0);
  const validatedRange = editor.document.validateRange(documentRange);

  return editor.edit((editBuilder) => {
    editBuilder.replace(validatedRange, data);
  });
};

export const replaceSelection = (data: string): Thenable<boolean> => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return Promise.reject();
  }

  const { start, end } = editor.selection;
  const selectionRange = new Range(start, end);
  const validatedRange = editor.document.validateRange(selectionRange);

  return editor.edit((editBuilder) => {
    editBuilder.replace(validatedRange, data);
  });
};

export const getOptimizedPercentage = (fileSizeBefore: number, fileSizeAfter: number): number => {
  if (fileSizeBefore === fileSizeAfter) return 0;
  return ((fileSizeAfter - fileSizeBefore) / fileSizeBefore) * 100;
};
