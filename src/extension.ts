import { commands, ExtensionContext } from 'vscode';
import SVGOCD from './optimizeSVG';

export function activate(context: ExtensionContext): void {
  const svgocd = new SVGOCD();

  // Register Run command
  const disposable = commands.registerCommand('svgocd.run', () => {
    svgocd.optimizeSVG();
  });

  context.subscriptions.push(disposable);
}
