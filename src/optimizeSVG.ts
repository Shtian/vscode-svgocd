import * as SVGO from 'svgo';
import * as vscode from 'vscode';
import readConfiguration from './configuration';

const readCurrentFileContent = () => {
    const editor = vscode.window.activeTextEditor;
    if (typeof editor === 'undefined') {
        return null;
    }

    const doc = editor.document;
    if (!/\.svg$/i.test(doc.fileName)) {
        return null;
    }

    return doc.getText();
};

const replaceDocument = (data: string) => {
    const editor = vscode.window.activeTextEditor;
    if (typeof editor === 'undefined') {
        return null;
    }

    let documentRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
    let validatedRange = editor.document.validateRange(documentRange);

    editor.edit((editBuilder) => {
        editBuilder.replace(validatedRange, data);
    });
};

const optimizeSVG = async () => {
    //TODO: support text selection
    const text = readCurrentFileContent();

    if (text) {
        const config = readConfiguration();
        const svgo = new SVGO(config);
        const optimizedSVG = await svgo.optimize(text);
        replaceDocument(optimizedSVG.data);
    } else {
        vscode.window.showErrorMessage('No valid SVG file open!');
    }
};

export default optimizeSVG;
