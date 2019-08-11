import * as SVGO from 'svgo';
import { window, Range, workspace } from 'vscode';
import readConfiguration from './configuration';

export default class OptimizeSVGO {
    private svgoConfiguration: SVGO.Options;

    constructor() {
        this.svgoConfiguration = readConfiguration();
    }

    public async optimizeSVG() {
        //TODO: support text selection
        const text = this.readCurrentFileContent();

        if (text) {
            const svgo = new SVGO(this.svgoConfiguration);
            const optimizedSVG = await svgo.optimize(text);
            this.replaceDocument(optimizedSVG.data);
        } else {
            window.showErrorMessage('This extension can only be run with an SVG file open.');
        }
    }

    public readConfiguration() {
        const svgocdConfig = workspace.getConfiguration('svgocd');
        const pluginsConf = svgocdConfig.get<any>('plugins');

        if (typeof pluginsConf === 'undefined') {
            return { plugins: [] };
        }

        const plugins: any[] = [];

        Object.keys(pluginsConf).map((c) => {
            plugins.push({ [c]: pluginsConf[c] });
        });

        return { plugins };
    }

    private readCurrentFileContent() {
        const editor = window.activeTextEditor;
        if (typeof editor === 'undefined') {
            return null;
        }

        const doc = editor.document;
        if (!/\.svg$/i.test(doc.fileName)) {
            return null;
        }

        return doc.getText();
    }

    private replaceDocument(data: string) {
        const editor = window.activeTextEditor;
        if (typeof editor === 'undefined') {
            return null;
        }

        let documentRange = new Range(0, 0, editor.document.lineCount, 0);
        let validatedRange = editor.document.validateRange(documentRange);

        editor.edit((editBuilder) => {
            editBuilder.replace(validatedRange, data);
        });
    }
}
