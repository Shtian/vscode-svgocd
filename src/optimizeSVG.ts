import * as SVGO from 'svgo';
import { window } from 'vscode';
import { getSVGOConfig } from './configuration';
import {
  readCurrentFileContent,
  replaceDocument,
  readCurrentSelection,
  replaceSelection,
  getOptimizedPercentage,
} from './utils';

export default class SVGOCD {
  public async optimizeSVG(): Promise<boolean> {
    const svgoConfig = await getSVGOConfig();

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
      const svgo = new SVGO(svgoConfig);
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

      const optimizedPercentage = getOptimizedPercentage(
        svgToOptimize.replace(/\r/g, '').length,
        optimizedSVG.data.replace(/\r/g, '').length
      );

      const infoMessage = this.GenerateInfoMessage(optimizedPercentage);
      window.showInformationMessage(infoMessage);
      return true;
    } catch (error) {
      window.showErrorMessage(`Error during SVG Optimization: ${error}`);
      return false;
    }
  }

  private GenerateInfoMessage(changePercentage: number): string {
    const infoMessage = '✨ SVG Optimized';

    if (changePercentage === 0) {
      return `${infoMessage}, but size is unchanged`;
    } else if (changePercentage > 0) {
      return `${infoMessage} 📈 ${changePercentage.toFixed(2)}% increase`;
    } else {
      return `${infoMessage} 📉 ${changePercentage.toFixed(2)}% decrease`;
    }
  }
}
