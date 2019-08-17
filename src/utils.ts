import { window, Range } from 'vscode';

export const readCurrentFileContent = () => {
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

export const readCurrentSelection = () => {
    const editor = window.activeTextEditor;
    if (typeof editor === 'undefined') {
        return null;
    }

    return editor.document.getText(editor.selection);
};

export const replaceDocument = (data: string) => {
    const editor = window.activeTextEditor;
    if (typeof editor === 'undefined') {
        return null;
    }

    let documentRange = new Range(0, 0, editor.document.lineCount, 0);
    let validatedRange = editor.document.validateRange(documentRange);

    editor.edit((editBuilder) => {
        editBuilder.replace(validatedRange, data);
    });
};

export const replaceSelection = (data: string) => {
    const editor = window.activeTextEditor;
    if (typeof editor === 'undefined') {
        return null;
    }

    const {start, end} = editor.selection;
    let selectionRange = new Range(start, end);
    let validatedRange = editor.document.validateRange(selectionRange);

    editor.edit((editBuilder) => {
        editBuilder.replace(validatedRange, data);
    });
};
