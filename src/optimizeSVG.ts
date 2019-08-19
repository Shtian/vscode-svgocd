import * as SVGO from 'svgo';
import { window } from 'vscode';
import { getSVGOConfig } from './configuration';
import { readCurrentFileContent, replaceDocument, readCurrentSelection, replaceSelection } from './utils';

export default class SVGOCD {
  private svgoConfiguration: SVGO.Options;

  constructor() {
    this.svgoConfiguration = { plugins: [] };
    this.readConfiguration();
  }

  public async readConfiguration(): Promise<void> {
    this.svgoConfiguration = await getSVGOConfig();
  }

  public async optimizeSVG(): Promise<boolean> {
    const selection = readCurrentSelection();
    const text = readCurrentFileContent();
    const svgToOptimize = selection || text;

    if (!svgToOptimize) {
      window.showErrorMessage(
        'This extension can only be run with an SVG file open or having an SVG selected in the current document.'
      );
      return false;
    }

    try {
      const svgo = new SVGO(this.svgoConfiguration);
      const optimizedSVG = await svgo.optimize(svgToOptimize);

      if (selection) {
        replaceSelection(optimizedSVG.data);
      } else {
        replaceDocument(optimizedSVG.data);
      }

      window.showInformationMessage('SVG Optimized ✨');
      return true;
    } catch (error) {
      window.showErrorMessage(`Error during SVG Optimization: ${error}`);
      return false;
    }
  }
}
