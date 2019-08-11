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
