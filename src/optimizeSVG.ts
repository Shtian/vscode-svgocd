import * as SVGO from 'svgo';
import { window, workspace } from 'vscode';
import { getSVGOConfig } from './configuration';
import { readCurrentFileContent, replaceDocument, readCurrentSelection, replaceSelection, getFileSize, getOptimizedPercentage } from './utils';

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
    const beforeFileSize = getFileSize();
    const svgToOptimize = selection || text;
    let infoMessage = 'SVG Optimized ✨';

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
        await replaceSelection(optimizedSVG.data);
      } else {
        await replaceDocument(optimizedSVG.data);
      }

      const editor = window.activeTextEditor;
      if (typeof editor === 'undefined') {
        return false;
      }
      await editor.document.save();

      const afterFileSize = getFileSize();

      if (afterFileSize && beforeFileSize) {
        const optimizedPercentage = getOptimizedPercentage(beforeFileSize, afterFileSize);
        infoMessage += `${optimizedPercentage}%`;
      }

      window.showInformationMessage(infoMessage);
      return true;
    } catch (error) {
      window.showErrorMessage(`Error during SVG Optimization: ${error}`);
      return false;
    }
  }
}
