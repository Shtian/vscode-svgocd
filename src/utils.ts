import { window, Range } from 'vscode';
import { statSync } from 'fs';

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

  return editor.edit(editBuilder => {
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

  return editor.edit(editBuilder => {
    editBuilder.replace(validatedRange, data);
  });
};

export const getFileSize = (): number | null => {
  const editor = window.activeTextEditor;
  if (typeof editor === 'undefined') {
    return null;
  }

  let stats;
  try {
    stats = statSync(editor.document.fileName);
  } catch (e) {
    throw Error('Error reading file: ' + e.message);
  }
  return stats.size;
}

export const getOptimizedPercentage = (fileSizeBefore: number, fileSizeAfter: number): number => {
  if (fileSizeBefore === fileSizeAfter) return 0;
  return Math.round((fileSizeAfter / fileSizeBefore) * 100);
}
