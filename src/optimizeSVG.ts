import * as SVGO from 'svgo';
import { window } from 'vscode';
import { getSVGOConfig } from './configuration';
import { readCurrentFileContent, replaceDocument } from './utils';

export default class OptimizeSVGO {
    private svgoConfiguration: SVGO.Options;

    constructor() {
        this.svgoConfiguration = { plugins: [] };
        this.readConfiguration();
    }

    public async readConfiguration() {
        this.svgoConfiguration = await getSVGOConfig();
    }

    public async optimizeSVG() {
        //TODO: support text selection
        const text = readCurrentFileContent();

        if (text) {
            try {
                const svgo = new SVGO(this.svgoConfiguration);
                const optimizedSVG = await svgo.optimize(text);
                replaceDocument(optimizedSVG.data);
                window.showInformationMessage('SVG Optimized ✨');
            } catch (error) {
                window.showErrorMessage(`Error during SVG Optimization: ${error}`);
            }
        } else {
            window.showErrorMessage('This extension can only be run with an SVG file open.');
        }
    }
}
